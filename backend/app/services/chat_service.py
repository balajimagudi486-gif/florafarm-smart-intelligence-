# FloraFarm — Chat Service (High-Speed Multi-Provider Architecture)
import asyncio
import json
import logging
import os
import re
from pathlib import Path
from typing import List, Optional

from dotenv import load_dotenv

from app.schemas.chat import ChatContext, ChatHistoryEntry, ChatResponse

load_dotenv()

logger = logging.getLogger("florafarm.chat")

# ---------------------------------------------------------------------------
# System prompt — FloraFarm Agri-Advisor persona
# ---------------------------------------------------------------------------
_SYSTEM_PROMPT_EN = """You are FloraFarm Agri-Advisor, an expert agronomist and agricultural consultant embedded inside the FloraFarm AI platform.

Your role is to provide **actionable, safe, and science-backed farming advice** to farmers, gardeners, and agri-enthusiasts. You have deep expertise in:
- Crop disease identification, symptoms, and management (chemical & organic treatments)
- Fertilizer selection, NPK ratios, dosage instructions, and application timing
- Soil health, pH management, irrigation scheduling, and drainage
- Integrated Pest Management (IPM) and organic farming practices
- Seasonal crop planning and harvest timing

**Communication style:**
- Be warm, practical, and farmer-friendly — avoid overly academic jargon.
- Use **bold headings**, bullet points, and numbered steps for clarity.
- Always specify dosage units (e.g., "2 kg/acre", "500 mL per 100 L water").
- Include a brief safety note when recommending chemical inputs.

Keep responses concise and direct (2–4 short paragraphs/bullet blocks).
"""

_SYSTEM_PROMPT_TA = """நீங்கள் FloraFarm Agri-Advisor — விவசாயிகளுக்கான AI வேளாண் ஆலோசகர்.

உங்கள் பணி விவசாயிகளுக்கு தெளிவான, நடைமுறைக்குரிய மற்றும் பாதுகாப்பான விவசாய ஆலோசனைகளை வழங்குவதாகும்.
- பயிர் நோய் மேலாண்மை (இயற்கை மற்றும் வேதியியல் முறைகள்)
- உரம் தேர்வு, NPK விகிதங்கள், அளவு மற்றும் இடும் நேரம்
- மண் ஆரோக்கியம், pH மேலாண்மை, சொட்டு நீர் பாசனம்
- ஒருங்கிணைந்த பூச்சி மேலாண்மை (IPM) மற்றும் இயற்கை முறை விவசாயம்

**விதிகள்:**
- **முழு பதிலும் தமிழிலேயே (தமிழ்) இருக்க வேண்டும்.**
- எளிய, விவசாயிகளுக்குப் புரியும் நடையைப் பயன்படுத்தவும்.
- முக்கியமான குறிப்புகளுக்கு **தடிமனான தலைப்புகள்** மற்றும் புள்ளிகளைப் பயன்படுத்தவும்.
- தெளிக்கும் அளவுகளை தெளிவாகக் குறிப்பிடவும் (எ.கா: "ஏக்கருக்கு 2 கிலோ", "1 லிட்டர் தண்ணீருக்கு 5 மி.லி").
"""


def _build_context_block(context: Optional[ChatContext], language: str = "en") -> str:
    """Convert optional UI context into a structured prompt injection."""
    if context is None:
        return ""

    parts: List[str] = []

    if context.disease_result:
        dr = context.disease_result
        crop = dr.get("crop", "Unknown")
        disease = dr.get("disease", "Unknown")
        severity = dr.get("severity", "Unknown")
        conf = dr.get("confidence", 0)
        
        if language == "ta":
            parts.append(
                f"[தற்போதைய ஸ்கேன் — நோய் பகுப்பாய்வு]\n"
                f"பயிர்: {crop}\n"
                f"கண்டறியப்பட்ட நிலை: {disease}\n"
                f"தீவிரம்: {severity}\n"
                f"நம்பகத்தன்மை: {conf:.1f}%\n"
                f"பயனர் இந்த நோய் கணிப்பை பார்த்துக்கொண்டிருக்கிறார். இதற்கு பொருத்தமான ஆலோசனையை வழங்கவும்."
            )
        else:
            parts.append(
                f"[CURRENT SCAN — Disease Analysis]\n"
                f"Crop: {crop}\n"
                f"Detected Condition: {disease}\n"
                f"Severity: {severity}\n"
                f"Confidence: {conf:.1f}%\n"
                f"The user is currently viewing this disease prediction. "
                f"Tailor your advice to this specific condition if relevant."
            )

    if context.fertilizer_result:
        fr = context.fertilizer_result
        fert = fr.get("fertilizer", "Unknown")
        ftype = fr.get("type", "Unknown")
        conf = fr.get("confidence", 0)
        
        if language == "ta":
            parts.append(
                f"[தற்போதைய ஸ்கேன் — உர பரிந்துரை]\n"
                f"பரிந்துரைக்கப்பட்ட உரம்: {fert}\n"
                f"வகை: {ftype}\n"
                f"நம்பகத்தன்மை: {conf:.1f}%\n"
                f"பயனர் இந்த உர பரிந்துரையை பார்த்துக்கொண்டிருக்கிறார்."
            )
        else:
            parts.append(
                f"[CURRENT SCAN — Fertilizer Recommendation]\n"
                f"Recommended Fertilizer: {fert}\n"
                f"Type: {ftype}\n"
                f"Confidence: {conf:.1f}%\n"
                f"The user is currently viewing this fertilizer recommendation. "
                f"Tailor your advice to this specific recommendation if relevant."
            )

    if context.soil_data:
        sd = context.soil_data
        soil_summary = ", ".join(f"{k}: {v}" for k, v in sd.items() if v is not None)
        if soil_summary:
            label = "[மண் / பயிர் தரவு]" if language == "ta" else "[SOIL / CROP DATA]"
            parts.append(f"{label}\n{soil_summary}")

    if not parts:
        return ""

    header = "\n\n---\n**FloraFarm Session Context:**\n" if language == "en" else "\n\n---\n**FloraFarm அமர்வு சூழல்:**\n"
    return header + "\n\n".join(parts) + "\n---\n\n"


# ---------------------------------------------------------------------------
# High-Speed Agronomic Expert Knowledge Engine (< 5ms response time)
# ---------------------------------------------------------------------------
def _get_expert_knowledge_reply(
    message: str,
    context: Optional[ChatContext] = None,
    language: str = "en",
) -> Optional[str]:
    """Pattern match specific farming domains for ultra-fast, rich instant responses."""
    msg = message.lower().strip()
    is_ta = language == "ta"

    # Context query (User asking about current scan)
    if context and (context.disease_result or context.fertilizer_result):
        if any(w in msg for w in ["this", "scan", "my crop", "result", "cure", "help", "இந்த", "ஸ்கேன்", "மருந்து", "பயிர்"]):
            if context.disease_result:
                crop = context.disease_result.get("crop", "Crop")
                disease = context.disease_result.get("disease", "Condition")
                severity = context.disease_result.get("severity", "Moderate")
                
                if is_ta:
                    return (
                        f"### 🌾 **{crop} - {disease} உடனடி தீர்வு வழிகாட்டி**\n\n"
                        f"உங்கள் ஸ்கேன் முடிவில் **{disease}** ({severity} தீவிரம்) கண்டறியப்பட்டுள்ளது.\n\n"
                        f"#### 🛠️ **பரிந்துரைக்கப்படும் சிகிச்சை முறை:**\n"
                        f"1. **பாதிக்கப்பட்ட இலைகளை அகற்றுதல்:** நோய் தாக்கிய பாகங்களை உடனே வெட்டி அகற்றி பாதுகாப்பாக அப்புறப்படுத்தவும்.\n"
                        f"2. **இயற்கை முறை:** 1 லிட்டர் தண்ணீரில் 5 மி.லி வேப்ப எண்ணெய் + 2 மி.லி சோப் கரைசல் கலந்து 7 நாட்கள் இடைவெளியில் தெளிக்கவும்.\n"
                        f"3. **பூஞ்சைக்கொல்லி:** நோய் தீவிரம் அதிகமாக இருப்பின், **காப்பர் ஆக்ஸிகுளோரைடு** 2.5 கிராம் / லிட்டர் நீரில் கலந்து தெளிக்கவும்.\n"
                        f"4. **நீர்ப்பாசனம்:** இலைகளில் நீர் தேங்காமல் வேர்ப்பகுதியில் மட்டும் சொட்டு நீர் பாசனம் செய்யவும்.\n\n"
                        f"> 💡 *பாதுகாப்பு குறிப்பு: மருந்து தெளிக்கும் போது கையுறை மற்றும் முகக்கவசம் அணியவும்.*"
                    )
                else:
                    return (
                        f"### 🌾 **Action Plan for {crop} — {disease}**\n\n"
                        f"Based on your current scan, **{disease}** (Severity: **{severity}**) was detected.\n\n"
                        f"#### 🛠️ **Recommended Steps:**\n"
                        f"1. **Sanitation:** Immediately prune and dispose of infected foliage outside the field. Do not compost.\n"
                        f"2. **Organic Bio-spray:** Apply **Neem Oil (3,000 ppm)** @ 5 mL/L water with liquid soap as sticker every 7 days.\n"
                        f"3. **Chemical Treatment:** For fast control, spray **Copper Oxychloride 50% WP** @ 2.5–3 g/L or **Mancozeb** @ 2 g/L.\n"
                        f"4. **Irrigation:** Use drip irrigation to keep the leaf canopy dry and prevent spore spread.\n\n"
                        f"> ⚠️ *Safety: Wear PPE (gloves & mask) during chemical application.*"
                    )

    # 1. Blight / Leaf Blight
    if any(k in msg for k in ["blight", "early blight", "late blight", "leaf blight", "இலை கருகல்", "கருகல்"]):
        if is_ta:
            return (
                "### 🍂 **இலை கருகல் நோய் (Leaf Blight) மேலாண்மை**\n\n"
                "இலை கருகல் நோய் பூஞ்சை அல்லது பாக்டீரியா தொற்றால் ஏற்படுகிறது.\n\n"
                "#### 💊 **கட்டுப்படுத்தும் முறைகள்:**\n"
                "1. **இயற்கை முறை:** சூடோமோனாஸ் புளோரசன்ஸ் (*Pseudomonas fluorescens*) 10 கிராம் / லிட்டர் நீரில் கலந்து மாலை வேளையில் தெளிக்கவும்.\n"
                "2. **பூஞ்சைக்கொல்லி:** **மான்கோசெப் (Mancozeb 75 WP)** 2 கிராம் / லிட்டர் அல்லது **காப்பர் ஹைட்ராக்சைடு** 2 கிராம் / லிட்டர் நீரில் கலந்து தெளிக்கவும்.\n"
                "3. **முன்னெச்சரிக்கை:** தழைச்சத்து (Urea) அதிகமாக இடுவதை தவிர்க்கவும்; பயிர்களுக்கு இடையே காற்றோட்டம் இருக்கும்படி இடைவெளி விடவும்."
            )
        return (
            "### 🍂 **How to Manage Leaf Blight**\n\n"
            "Leaf blight is caused by fungal pathogens (*Alternaria*, *Phytophthora*) or bacterial infections.\n\n"
            "#### 💊 **Actionable Treatment:**\n"
            "- **Biological / Organic:** Spray *Pseudomonas fluorescens* or *Trichoderma harzianum* @ 10 g/L as a preventive bio-shield.\n"
            "- **Chemical Control:** Apply **Mancozeb 75 WP** @ 2 g/L or **Azoxystrobin + Difenoconazole** @ 1 mL/L.\n"
            "- **Cultural Hygiene:** Ensure adequate plant spacing for air circulation and avoid excess urea application."
        )

    # 2. NPK / Fertilizer / Wheat
    if any(k in msg for k in ["npk", "fertilizer", "ratio", "wheat", "உரம்", "கோதுமை", "விகிதம்"]):
        if is_ta:
            return (
                "### 🧪 **முக்கிய பயிர்களுக்கான NPK உர பரிந்துரை**\n\n"
                "- **கோதுமை (Wheat):** **120:60:40 கிலோ N:P:K / ஹெக்டேர்** (பாஸ்பரஸ், பொட்டாஷ் அடியுரமாக; தழைச்சத்து 2-3 தவணையாக).\n"
                "- **நெல் (Paddy):** **120:40:40 கிலோ N:P:K / ஹெக்டேர்**.\n"
                "- **தக்காளி (Tomato):** **100:60:60 கிலோ N:P:K / ஹெக்டேர்** + நுண்ணூட்டச்சத்துக்கள்.\n"
                "- **மக்காச்சோளம் (Maize):** **120:60:40 கிலோ N:P:K / ஹெக்டேர்**.\n\n"
                "> 💡 *குறிப்பு: துல்லியமான உர பரிந்துரைக்கு FloraFarm Fertilizer AI கருவியில் மண் பரிசோதனை அளவுகளை உள்ளிடவும்.*"
            )
        return (
            "### 🧪 **Optimal NPK Fertilizer Guidelines**\n\n"
            "Standard recommended NPK ratios for major crops:\n\n"
            "- **Wheat:** **120:60:40 kg NPK/ha** (Full P & K + 1/3 N as basal at sowing; remaining N top-dressed at CRI & tillering).\n"
            "- **Rice / Paddy:** **120:40:40 kg NPK/ha** in 3 split applications.\n"
            "- **Tomato / Vegetables:** **100:60:60 kg NPK/ha** with foliar Calcium & Boron sprays.\n"
            "- **Maize (Corn):** **120:60:40 kg NPK/ha**.\n\n"
            "> 💡 *Tip: Use FloraFarm's Fertilizer AI calculator for tailored dosages based on your specific soil N-P-K tests.*"
        )

    # 3. Organic Pest Control
    if any(k in msg for k in ["pest", "organic", "insect", "aphid", "whitefly", "பூச்சி", "இயற்கை", "அசுவினி"]):
        if is_ta:
            return (
                "### 🌿 **இயற்கை பூச்சி மேலாண்மை (Organic Pest Control)**\n\n"
                "1. **வேப்ப எண்ணெய் கரைசல்:** 5 மி.லி வேப்ப எண்ணெய் (10,000 ppm) + 2 மி.லி திரவ சோப் / லிட்டர் தண்ணீர் கலந்து மாலை நேரத்தில் தெளிக்கவும்.\n"
                "2. **மஞ்சள் & நீல ஒட்டும் பொறிகள்:** ஏக்கருக்கு 6-8 ஒட்டும் பொறிகள் அமைத்து அசுவினி, வெள்ளை ஈக்களை கட்டுப்படுத்தலாம்.\n"
                "3. **இஞ்சி-பூண்டு-பச்சை மிளகாய் கரைசல்:** புழுக்கள் மற்றும் தண்டு துளைப்பான்களுக்கு சிறந்த இயற்கை பூச்சி விரட்டி.\n"
                "4. **பஞ்சகவ்யா / ஜீவாமிர்தம்:** 3% பஞ்சகவ்யா கரைசல் தெளிப்பது பயிரின் நோய் எதிர்ப்பு திறனை கணிசமாக உயர்த்தும்."
            )
        return (
            "### 🌿 **Top Organic Pest Control Protocols**\n\n"
            "1. **Neem Oil Spray (10,000 ppm):** Mix 5 mL cold-pressed neem oil + 2 mL liquid soap per liter of warm water. Spray every 7–10 days.\n"
            "2. **Yellow & Blue Sticky Traps:** Place 6–8 traps per acre at crop canopy level for aphids, whiteflies, and thrips.\n"
            "3. **Ginger-Garlic-Chili Extract:** Highly effective herbal repellent for caterpillars and borers.\n"
            "4. **Beneficial Microbials:** Apply *Bacillus thuringiensis* (Bt) @ 2 g/L or *Beauveria bassiana* @ 5 g/L for safe biological control."
        )

    # 4. Watering Schedule / Irrigation / Tomato
    if any(k in msg for k in ["water", "irrigation", "watering", "tomato", "பாசனம்", "தண்ணீர்", "தக்காளி"]):
        if is_ta:
            return (
                "### 💧 **தக்காளி மற்றும் காய்கறி பயிர்களுக்கான நீர்ப்பாசன வழிகாட்டி**\n\n"
                "1. **சொட்டு நீர் பாசனம்:** தினசரி அல்லது ஒரு நாள் விட்டு ஒரு நாள் 2-3 மணி நேரம் வேர்ப்பகுதியில் நீர் பாய்ச்சவும்.\n"
                "2. **முக்கிய வளர்ச்சி பருவங்கள்:** பூக்கும் மற்றும் காய் பிடிக்கும் பருவத்தில் மண்ணில் சீரான ஈரப்பதம் அவசியம். அதிக ஈரப்பதமோ வறட்சியோ பூக்கள் உதிர காரணமாகும்.\n"
                "3. **இலைகளை நனைக்காதீர்:** இலைகளின் மீது தண்ணீர் தெளிப்பதைத் தவிர்ப்பது பூஞ்சை நோய்களை 80% தடுக்கும்.\n"
                "4. **மூடாக்கு (Mulching):** வைக்கோல் அல்லது பிளாஸ்டிக் மூடாக்கு இடுவதன் மூலம் மண் ஈரப்பதம் பாதுகாக்கப்படும்."
            )
        return (
            "### 💧 **Watering Schedule & Irrigation Best Practices**\n\n"
            "1. **Deep, Base Watering:** Water deeply 2–3 times a week (1–1.5 inches equivalent) rather than light daily sprinkling.\n"
            "2. **Critical Periods:** Maintain consistent soil moisture during flowering and fruit set to prevent blossom end rot and fruit splitting.\n"
            "3. **Keep Leaves Dry:** Use drip irrigation or soaker hoses directly at the root zone to inhibit fungal foliar diseases.\n"
            "4. **Mulching:** Add a 2–3 inch layer of organic mulch to conserve moisture and regulate root temperature."
        )

    # 5. Nitrogen Deficiency
    if any(k in msg for k in ["nitrogen", "yellow", "chlorosis", "deficiency", "தழைச்சத்து", "மஞ்சள்", "குறைபாடு"]):
        if is_ta:
            return (
                "### 🟡 **தழைச்சத்து (Nitrogen) குறைபாடு — அறிகுறிகள் & தீர்வுகள்**\n\n"
                "#### 🔍 **அறிகுறிகள்:**\n"
                "- பயிரின் கீழ் உள்ள பழைய இலைகள் முதலில் வெளிர் மஞ்சள் நிறமாக மாறும்.\n"
                "- பயிர் வளர்ச்சி குன்றி தண்டு மெலிந்து காணப்படும்.\n\n"
                "#### ⚡ **உடனடி தீர்வுகள்:**\n"
                "1. **இலைவழி தெளிப்பு:** 1.5–2% யூரியா (Urea) கரைசல் (15-20 கிராம் / லிட்டர் தண்ணீர்) தெளிக்கவும்.\n"
                "2. **மண் உரமிடுதல்:** நீர்ப்பாசனத்திற்கு முன் யூரியா அல்லது CAN உரத்தை தேவையான அளவில் இடவும்.\n"
                "3. **இயற்கை உரம்:** மண்புழு உரம் அல்லது நன்கு மக்கிய தொழு உரம் இட்டு மண் வளத்தை உயர்த்தவும்."
            )
        return (
            "### 🟡 **Nitrogen (N) Deficiency — Identification & Fixes**\n\n"
            "#### 🔍 **Key Symptoms:**\n"
            "- Uniform chlorosis (yellowing) starting on older, lower leaves while top leaves remain pale.\n"
            "- Stunted growth, thin stalks, and reduced tillering.\n\n"
            "#### ⚡ **Correction Measures:**\n"
            "1. **Foliar Rescue Spray:** Spray 1.5–2% **Urea solution** (15–20 g/L) for rapid nitrogen absorption within 48–72 hours.\n"
            "2. **Soil Top-dressing:** Apply Urea or Calcium Ammonium Nitrate (CAN) before scheduled irrigation.\n"
            "3. **Organic Enrichment:** Side-dress with well-aerated vermicompost or apply fermented fish amino acids."
        )

    # 6. Soil pH / Soil Health
    if any(k in msg for k in ["ph", "soil", "acid", "alkaline", "lime", "மண்", "அமில", "கார", "சுண்ணாம்பு"]):
        if is_ta:
            return (
                "### 🧪 **மண் pH அளவை சீரமைக்கும் முறைகள்**\n\n"
                "- **அமில மண் (pH < 6.0):** விவசாய சுண்ணாம்பு (Agricultural Lime - CaCO3) ஏக்கருக்கு 200-400 கிலோ இட்டு உழவு செய்யவும்.\n"
                "- **கார / உவர் மண் (pH > 7.8):** ஜிப்சம் (Gypsum) அல்லது கந்தகம் (Elemental Sulfur) இட்டு தண்ணீர் பாய்ச்சவும்.\n"
                "- **உகந்த வரம்பு:** பெரும்பாலான காய்கறிகள் மற்றும் பயிர்களுக்கு **6.2 முதல் 7.2 pH** உகந்தது.\n"
                "- **மண் வளம்:** மண்புழு உரம் மற்றும் பசுந்தாள் உரங்கள் மண்ணின் pH அளவை தானாக சமன் செய்ய உதவும்."
            )
        return (
            "### 🧪 **Managing & Optimizing Soil pH**\n\n"
            "- **Acidic Soils (pH < 6.0):** Apply **Agricultural Limestone** (Calcium Carbonate) or Dolomite to raise pH. Mix well into topsoil 4–6 weeks before planting.\n"
            "- **Alkaline Soils (pH > 7.8):** Apply **Elemental Sulfur** or **Agricultural Gypsum** to lower pH and leach out excess sodium salts.\n"
            "- **Ideal Target:** Most crops thrive best between **pH 6.2 and 7.2**.\n"
            "- **Organic Buffering:** Adding organic matter (compost, green manure) buffers soil against extreme pH fluctuations."
        )

    # 7. Greetings / Intro
    if any(w in msg for w in ["hi", "hello", "hey", "vanakkam", "வணக்கம்", "யார்"]):
        if is_ta:
            return (
                "### 🌾 **வணக்கம்! நான் உங்கள் FloraFarm AI வேளாண் ஆலோசகர்**\n\n"
                "நான் உங்களுக்கு கீழ்க்கண்டவற்றில் உதவ முடியும்:\n"
                "- **பயிர் நோய் கண்டறிதல் மற்றும் மருந்துகள்**\n"
                "- **துல்லியமான உர பரிந்துரைகள் (NPK அளவுகள்)**\n"
                "- **இயற்கை பூச்சி விரட்டி மற்றும் மேலாண்மை**\n"
                "- **மண் ஆரோக்கியம் மற்றும் நீர்ப்பாசன அட்டவணை**\n\n"
                "உங்கள் கேள்வியை கேளுங்கள் அல்லது விரைவு கேள்விகளை தேர்வு செய்யுங்கள்!"
            )
        return (
            "### 🌾 **Hello! I'm your FloraFarm Agri-Advisor AI**\n\n"
            "I'm here to provide science-backed, practical advice for your farm:\n"
            "- **Crop Disease Diagnosis & Treatment Plans** (chemical & organic)\n"
            "- **Customized Fertilizer & NPK Dosages**\n"
            "- **Integrated Pest Management (IPM)**\n"
            "- **Soil pH Correction & Irrigation Schedules**\n\n"
            "Feel free to ask a question or tap any of the quick suggestions below!"
        )

    return None


class ChatService:
    """
    FloraFarm Agri-Advisor Chat Service.
    Ultra-responsive cascading engine:
    1. Instant Knowledge Base Pattern Engine (< 5ms)
    2. Google Gemini API (with 4s timeout)
    3. Local HuggingFace Transformer Model (if loaded)
    4. Comprehensive fallback knowledge synthesis
    """

    def __init__(self):
        self.active_backend: str = "none"
        self._hf_tokenizer = None
        self._hf_model = None
        self._hf_device = "cpu"
        self._gemini_client = None
        self._gemini_model_name = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
        
        workspace_root = Path(__file__).resolve().parents[3]
        default_hmodel_path = workspace_root / "hmodel"
        self.model_path = os.getenv("LOCAL_MODEL_PATH", str(default_hmodel_path))

    def load_model(self):
        """Initialise backends on startup."""
        if self._try_load_gemini():
            return
        self._try_load_local_hf()

    def _try_load_gemini(self) -> bool:
        """Attempt to load Google Gemini API client."""
        api_key = os.getenv("GEMINI_API_KEY", "").strip()
        if not api_key:
            return False
        try:
            import google.generativeai as genai

            genai.configure(api_key=api_key)
            self._gemini_client = genai
            self.active_backend = "gemini"
            logger.info("✅ Gemini chat client ready (model: %s).", self._gemini_model_name)
            return True
        except Exception as exc:
            logger.error("Failed to initialise Gemini client: %s", exc)
            return False

    def _try_load_local_hf(self) -> bool:
        """Attempt to load local HuggingFace model."""
        if not os.path.exists(self.model_path):
            return False

        config_file = os.path.join(self.model_path, "config.json")
        if not os.path.exists(config_file):
            return False

        try:
            import torch
            from transformers import AutoModelForCausalLM, AutoTokenizer

            logger.info("🤗 Loading local HuggingFace model from '%s'...", self.model_path)
            self._hf_tokenizer = AutoTokenizer.from_pretrained(self.model_path, trust_remote_code=True)
            
            if torch.cuda.is_available():
                self._hf_device = "cuda"
                dtype = torch.float16
            else:
                self._hf_device = "cpu"
                dtype = torch.float32

            self._hf_model = AutoModelForCausalLM.from_pretrained(
                self.model_path,
                torch_dtype=dtype,
                device_map=self._hf_device,
                trust_remote_code=True,
            )
            self._hf_model.eval()
            self.active_backend = "local_hf"
            logger.info("✅ Local HuggingFace model loaded.")
            return True
        except Exception as exc:
            logger.warning("Local HuggingFace model unavailable: %s", exc)
            return False

    @property
    def is_ready(self) -> bool:
        return True

    async def chat(
        self,
        message: str,
        history: List[ChatHistoryEntry],
        context: Optional[ChatContext] = None,
        language: str = "en",
    ) -> ChatResponse:
        """Send a user message and return high-speed assistant reply."""
        # 1. Check instant knowledge base first (< 5ms)
        instant_reply = _get_expert_knowledge_reply(message, context, language)
        if instant_reply:
            return ChatResponse(reply=instant_reply, error=False)

        # 2. Try Gemini API with fast timeout
        if self.active_backend == "none":
            self.load_model()

        if self.active_backend == "gemini":
            try:
                return await asyncio.wait_for(
                    self._chat_gemini(message, history, context, language),
                    timeout=5.0
                )
            except Exception as exc:
                logger.warning("Gemini chat timed out or failed: %s", exc)

        # 3. Try Local HuggingFace if available
        if self.active_backend == "local_hf":
            try:
                return await asyncio.wait_for(
                    self._chat_local_hf(message, history, context, language),
                    timeout=8.0
                )
            except Exception as exc:
                logger.warning("Local HF timed out or failed: %s", exc)

        # 4. Fallback smart synthesis
        fallback_reply = (
            "### 🌾 **FloraFarm AI வேளாண் ஆலோசனை**\n\n"
            "உங்கள் கேள்விக்குரிய சிறந்த வேளாண் வழிகாட்டுதலை பெற:\n"
            "- **பயிர் இலை படம் பதிவேற்றம்:** பயிர் AI பக்கத்தில் தெளிவான படத்தை பதிவேற்றவும்.\n"
            "- **உர பரிந்துரை:** மண் NPK அளவுகளை உள்ளிட்டு உர AI கருவியை பயன்படுத்தவும்.\n"
            "- மேலும் குறிப்பிட்ட நோய் அல்லது பயிரின் பெயரை குறிப்பிட்டு கேட்கவும்."
            if language == "ta" else
            "### 🌾 **FloraFarm Agronomic Advice**\n\n"
            "To get the most accurate insight for your crops:\n"
            "- **Scan Disease:** Upload a clear leaf image on the **Crop AI** page for instant visual diagnosis.\n"
            "- **Nutrient Plan:** Enter your soil N-P-K readings in the **Fertilizer AI** tool for exact fertilizer ratios.\n"
            "- Feel free to ask specific questions about any crop symptom, dosage, or pest management!"
        )
        return ChatResponse(reply=fallback_reply, error=False)

    async def _chat_gemini(
        self,
        message: str,
        history: List[ChatHistoryEntry],
        context: Optional[ChatContext] = None,
        language: str = "en",
    ) -> ChatResponse:
        """Generate response using Google Gemini API."""
        try:
            base_prompt = _SYSTEM_PROMPT_TA if language == "ta" else _SYSTEM_PROMPT_EN
            context_block = _build_context_block(context, language)
            system_instruction = base_prompt + context_block

            contents = []
            for turn in history[-6:]:  # Keep last 6 turns for speed
                role = "user" if turn.role == "user" else "model"
                contents.append({"role": role, "parts": [{"text": turn.content}]})

            contents.append({"role": "user", "parts": [{"text": message}]})

            model = self._gemini_client.GenerativeModel(
                model_name=self._gemini_model_name,
                system_instruction=system_instruction,
            )
            response = model.generate_content(contents)
            return ChatResponse(reply=response.text.strip(), error=False)
        except Exception as exc:
            logger.error("Gemini call error: %s", exc)
            raise

    async def _chat_local_hf(
        self,
        message: str,
        history: List[ChatHistoryEntry],
        context: Optional[ChatContext] = None,
        language: str = "en",
    ) -> ChatResponse:
        """Generate response using local HuggingFace model in an executor."""
        loop = asyncio.get_running_loop()
        reply_text = await loop.run_in_executor(
            None, self._sync_generate_local_hf, message, history, context, language
        )
        return ChatResponse(reply=reply_text, error=False)

    def _sync_generate_local_hf(
        self,
        message: str,
        history: List[ChatHistoryEntry],
        context: Optional[ChatContext] = None,
        language: str = "en",
    ) -> str:
        import torch

        base_prompt = _SYSTEM_PROMPT_TA if language == "ta" else _SYSTEM_PROMPT_EN
        context_block = _build_context_block(context, language)
        system_content = base_prompt + context_block

        messages = [{"role": "system", "content": system_content}]
        for turn in history[-4:]:
            role = "user" if turn.role == "user" else "assistant"
            messages.append({"role": role, "content": turn.content})
        messages.append({"role": "user", "content": message})

        if hasattr(self._hf_tokenizer, "apply_chat_template"):
            try:
                prompt = self._hf_tokenizer.apply_chat_template(
                    messages, tokenize=False, add_generation_prompt=True
                )
            except Exception:
                prompt = f"<|im_start|>system\n{system_content}<|im_end|>\n<|im_start|>user\n{message}<|im_end|>\n<|im_start|>assistant\n"
        else:
            prompt = f"<|im_start|>system\n{system_content}<|im_end|>\n<|im_start|>user\n{message}<|im_end|>\n<|im_start|>assistant\n"

        inputs = self._hf_tokenizer(prompt, return_tensors="pt").to(self._hf_device)

        if self._hf_device == "cpu":
            try:
                torch.set_num_threads(max(1, (os.cpu_count() or 4) - 1))
            except Exception:
                pass

        with torch.no_grad():
            outputs = self._hf_model.generate(
                **inputs,
                max_new_tokens=150,  # Fast concise generation
                temperature=0.6,
                top_p=0.9,
                repetition_penalty=1.1,
                do_sample=True,
                pad_token_id=self._hf_tokenizer.eos_token_id,
            )

        input_length = inputs.input_ids.shape[1]
        generated_tokens = outputs[0][input_length:]
        response_text = self._hf_tokenizer.decode(generated_tokens, skip_special_tokens=True).strip()

        if "<think>" in response_text and "</think>" in response_text:
            response_text = response_text.split("</think>")[-1].strip()
        elif "<think>" in response_text:
            response_text = response_text.split("<think>")[0].strip()

        return response_text


# Singleton instance
chat_service = ChatService()

// FloraFarm — Disease info lookup table
export interface DiseaseInfo {
  symptoms: string[];
  management: string[];
  riskLevel: string;
  affectedCrop: string;
}

export const diseaseInfoMap: Record<string, DiseaseInfo> = {
  'Apple Scab': {
    affectedCrop: 'Apple',
    riskLevel: 'Moderate',
    symptoms: ['Olive-green or brown spots on leaves', 'Velvety lesions on leaf surface', 'Premature leaf drop', 'Scabby marks on fruit'],
    management: ['Remove infected plant debris', 'Ensure good air circulation around trees', 'Apply appropriate fungicidal treatments per local guidance', 'Choose resistant varieties when replanting'],
  },
  'Black Rot': {
    affectedCrop: 'Apple / Grape',
    riskLevel: 'High',
    symptoms: ['Brown circular leaf spots with purple margins', 'Rotting fruit with black shriveling', 'Cankers on twigs and branches'],
    management: ['Remove mummified fruits and infected wood', 'Prune to improve air circulation', 'Consult local agricultural guidelines for management'],
  },
  'Cedar Apple Rust': {
    affectedCrop: 'Apple',
    riskLevel: 'Moderate',
    symptoms: ['Bright orange-yellow spots on upper leaf surface', 'Tube-like growths on leaf undersides', 'Early fruit drop'],
    management: ['Remove nearby juniper or cedar hosts if possible', 'Use resistant apple varieties', 'Follow local fungicide guidance during bloom'],
  },
  'Powdery Mildew': {
    affectedCrop: 'Cherry / Squash',
    riskLevel: 'Moderate',
    symptoms: ['White powdery coating on leaves', 'Yellowing and curling of affected leaves', 'Stunted growth'],
    management: ['Improve air circulation', 'Avoid overhead irrigation', 'Follow appropriate fungal management guidelines'],
  },
  'Cercospora Leaf Spot Gray Leaf Spot': {
    affectedCrop: 'Corn (Maize)',
    riskLevel: 'Moderate',
    symptoms: ['Long, narrow gray to tan lesions on leaves', 'Lesions run parallel to leaf veins', 'Severe cases cause extensive blighting'],
    management: ['Rotate crops', 'Till infected residue', 'Use tolerant varieties per local recommendations'],
  },
  'Common Rust': {
    affectedCrop: 'Corn (Maize)',
    riskLevel: 'Low',
    symptoms: ['Circular to elongated powdery brown pustules on leaf surfaces', 'Pustules can be found on both leaf sides'],
    management: ['Scout fields regularly', 'Consult local guidelines for fungicide timing', 'Use resistant hybrids'],
  },
  'Northern Leaf Blight': {
    affectedCrop: 'Corn (Maize)',
    riskLevel: 'Moderate',
    symptoms: ['Large, cigar-shaped gray-green lesions on leaves', 'Lesions turn tan to brown as they mature'],
    management: ['Use resistant hybrids', 'Rotate crops', 'Manage crop residue per local recommendations'],
  },
  'Esca (Black Measles)': {
    affectedCrop: 'Grape',
    riskLevel: 'High',
    symptoms: ['Tiger-stripe pattern on leaves', 'Dark spots on berry skin', 'Sudden vine collapse in severe cases'],
    management: ['Protect pruning wounds', 'Remove affected wood', 'Consult a viticulture specialist'],
  },
  'Leaf Blight (Isariopsis Leaf Spot)': {
    affectedCrop: 'Grape',
    riskLevel: 'Moderate',
    symptoms: ['Irregular brown-red spots on leaves', 'Spots with yellow halos', 'Premature defoliation'],
    management: ['Remove infected leaves', 'Ensure proper vine training for air movement', 'Follow local spray programs'],
  },
  'Haunglongbing (Citrus greening)': {
    affectedCrop: 'Orange',
    riskLevel: 'High',
    symptoms: ['Yellow mottling or blotchy mottle on leaves', 'Small, lopsided, bitter fruits', 'Twig dieback'],
    management: ['Remove infected trees promptly', 'Control psyllid vector', 'Consult plant health authorities — no cure currently available'],
  },
  'Bacterial Spot': {
    affectedCrop: 'Peach / Pepper / Tomato',
    riskLevel: 'Moderate',
    symptoms: ['Small, water-soaked spots on leaves and fruit', 'Spots turn dark brown with yellow halos', 'Fruit lesions and cracking'],
    management: ['Use pathogen-free seed or transplants', 'Avoid overhead irrigation', 'Follow local copper-based treatment guidance'],
  },
  'Early Blight': {
    affectedCrop: 'Potato / Tomato',
    riskLevel: 'Moderate',
    symptoms: ['Dark brown concentric ring spots on older leaves', 'Yellow halo around lesions', 'Defoliation starting from lower leaves'],
    management: ['Remove and dispose of infected plant material', 'Avoid wetting foliage when irrigating', 'Follow appropriate fungal management guidance per local extension'],
  },
  'Late Blight': {
    affectedCrop: 'Potato / Tomato',
    riskLevel: 'High',
    symptoms: ['Water-soaked, pale green to brown lesions on leaves', 'White mold on leaf undersides in humid conditions', 'Rapid plant collapse under favorable conditions'],
    management: ['Destroy infected plant material promptly', 'Avoid overhead irrigation', 'Consult local agricultural guidance for appropriate measures'],
  },
  'Leaf Scorch': {
    affectedCrop: 'Strawberry',
    riskLevel: 'Low',
    symptoms: ['Small purplish spots on upper leaf surface', 'Spots turn brown with red or purple borders', 'Severely infected leaves appear scorched'],
    management: ['Remove infected leaves', 'Avoid overhead irrigation', 'Follow local disease management guidelines'],
  },
  'Leaf Mold': {
    affectedCrop: 'Tomato',
    riskLevel: 'Moderate',
    symptoms: ['Pale greenish-yellow patches on upper leaf surface', 'Olive-green to grayish-purple mold on leaf undersides', 'Leaves wither and drop'],
    management: ['Ensure good ventilation in greenhouses', 'Reduce humidity', 'Consult local guidelines for fungal management'],
  },
  'Septoria Leaf Spot': {
    affectedCrop: 'Tomato',
    riskLevel: 'Moderate',
    symptoms: ['Small circular spots with gray centers and dark margins on older leaves', 'Spots contain black fruiting bodies', 'Progressive defoliation from base upward'],
    management: ['Remove infected leaves promptly', 'Avoid wetting foliage', 'Rotate with non-solanaceous crops'],
  },
  'Spider Mites Two-spotted Spider Mite': {
    affectedCrop: 'Tomato',
    riskLevel: 'Moderate',
    symptoms: ['Fine stippling or bronzing on leaf surface', 'Fine webbing on leaf undersides', 'Leaf yellowing and drop in severe cases'],
    management: ['Inspect plants regularly', 'Maintain adequate soil moisture', 'Consult local recommendations for mite management'],
  },
  'Target Spot': {
    affectedCrop: 'Tomato',
    riskLevel: 'Moderate',
    symptoms: ['Circular brown lesions with concentric rings', 'Lesions have yellow halos', 'Affected leaves wither and fall'],
    management: ['Improve air circulation', 'Avoid excessive nitrogen', 'Follow local fungal management guidance'],
  },
  'Tomato Yellow Leaf Curl Virus': {
    affectedCrop: 'Tomato',
    riskLevel: 'High',
    symptoms: ['Upward curling and yellowing of young leaves', 'Stunted plant growth', 'Severe yield reduction'],
    management: ['Use virus-resistant varieties', 'Control whitefly vector', 'Remove and destroy infected plants promptly'],
  },
  'Tomato Mosaic Virus': {
    affectedCrop: 'Tomato',
    riskLevel: 'Moderate',
    symptoms: ['Mosaic pattern of light and dark green on leaves', 'Leaf distortion and blistering', 'Stunted growth'],
    management: ['Use resistant varieties', 'Disinfect tools between plants', 'Remove severely infected plants'],
  },
  'Healthy': {
    affectedCrop: 'Various',
    riskLevel: 'None',
    symptoms: ['No visible disease symptoms detected'],
    management: ['Continue current crop management practices', 'Monitor regularly for early signs of disease', 'Maintain balanced crop nutrition and appropriate irrigation'],
  },
};

export function getDiseaseInfo(disease: string): DiseaseInfo {
  // Try exact match
  if (diseaseInfoMap[disease]) return diseaseInfoMap[disease];

  // Try partial match
  for (const key of Object.keys(diseaseInfoMap)) {
    if (disease.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(disease.toLowerCase())) {
      return diseaseInfoMap[key];
    }
  }

  // Default
  return {
    affectedCrop: 'Unknown',
    riskLevel: 'Unknown',
    symptoms: ['Refer to your local agricultural extension for specific symptom guidance.'],
    management: ['Consult a qualified agricultural expert for identification and management options.'],
  };
}

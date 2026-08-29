// FloraFarm — Fertilizer Result Component
import React from 'react';
import { FlaskConical, Info, Shield, Leaf, CheckCircle2, AlertCircle } from 'lucide-react';
import type { FertilizerResult } from '../types';
import { useLanguage } from '../context/LanguageContext';
import HealthScore from './HealthScore';
import ConfidenceBar from './ConfidenceBar';

interface FertilizerResultProps {
  result: FertilizerResult;
}

const FERTILIZER_DESCRIPTIONS: Record<string, string> = {
  Urea: 'High-nitrogen fertilizer (46% N) suitable for nitrogen-deficient soils.',
  DAP: 'Di-ammonium phosphate — provides both nitrogen (18%) and phosphorus (46%).',
  NPK: 'Balanced macro-nutrient fertilizer containing nitrogen, phosphorus, and potassium.',
  MOP: 'Muriate of Potash — high-potassium fertilizer (60% K₂O) for potassium-deficient soils.',
  SSP: 'Single Super Phosphate — provides phosphorus (16%) along with calcium and sulfur.',
  'Zinc Sulphate': 'Micronutrient fertilizer providing zinc, essential for enzyme function and growth.',
  Compost: 'Organic matter that improves soil structure, water retention, and provides slow-release nutrients.',
};

const FertilizerResultComponent: React.FC<FertilizerResultProps> = ({ result }) => {
  const { t } = useLanguage();

  const isOrganic = result.type === 'Organic';

  return (
    <div className="animate-fade-in space-y-6">
      {/* Demo banner */}
      {result.is_demo && (
        <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm">
          <Info size={15} />
          <span className="font-medium">{t.fertilizerResult.demoLabel}</span>
          <span className="text-amber-600">— Using sample prediction.</span>
        </div>
      )}

      {/* Main result card */}
      <div className="flora-card p-6 sm:p-8">
        <h2 className="text-xl font-bold text-flora-forest mb-6 flex items-center gap-2">
          <FlaskConical size={20} className="text-flora-green" />
          {t.fertilizerResult.heading}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            {/* Fertilizer name */}
            <div>
              <p className="text-xs font-semibold text-flora-text/50 uppercase tracking-wider mb-2">
                {t.fertilizerResult.heading}
              </p>
              <div className="flex items-center gap-3">
                <span className="text-4xl font-black text-flora-forest tracking-tight">
                  {result.fertilizer.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Type badge */}
            <div>
              <p className="text-xs font-semibold text-flora-text/50 uppercase tracking-wider mb-2">
                {t.fertilizerResult.type}
              </p>
              <span className={isOrganic ? 'badge-organic' : 'badge-inorganic'}>
                {isOrganic ? (
                  <><Leaf size={12} className="mr-1" />{t.fertilizerResult.organic}</>
                ) : (
                  <><FlaskConical size={12} className="mr-1" />{t.fertilizerResult.inorganic}</>
                )}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-flora-text/70 leading-relaxed">
              {FERTILIZER_DESCRIPTIONS[result.fertilizer] || t.fertilizerResult.reason}
            </p>

            <p className="text-xs text-flora-text/40 flex items-center gap-1.5">
              <Shield size={11} className="text-flora-green" />
              {result.model_version || 'Random Forest / Fertilizer Dataset'}
            </p>
          </div>

          {/* Confidence gauge */}
          <div className="flex justify-center">
            <HealthScore
              value={result.confidence}
              size={150}
              label={t.fertilizerResult.confidence}
              sublabel="AI confidence"
              color="#39FF88"
            />
          </div>
        </div>

        <div className="mt-6 p-4 bg-flora-soft rounded-xl border border-emerald-100">
          <p className="text-sm text-flora-forest/70 leading-relaxed">
            {t.fertilizerResult.reason}
          </p>
        </div>
      </div>

      {/* Top 3 options */}
      <div className="flora-card p-6">
        <h3 className="text-base font-semibold text-flora-forest mb-4 flex items-center gap-2">
          <CheckCircle2 size={16} className="text-flora-green" />
          {t.fertilizerResult.topOptions}
        </h3>
        <div className="space-y-4">
          {result.top_options.map((opt, i) => (
            <div key={opt.fertilizer} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    i === 0 ? 'bg-flora-green text-flora-dark' : 'bg-emerald-100 text-flora-forest'
                  }`}>
                    {i + 1}
                  </span>
                  <span className="font-semibold text-flora-forest">{opt.fertilizer}</span>
                  <span className={i === 0
                    ? 'text-xs font-medium text-flora-emerald bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200'
                    : 'text-xs text-flora-text/50'}>
                    {i === 0 ? t.fertilizerResult.recommended : t.fertilizerResult.alternative}
                  </span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  opt.type === 'Organic'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-blue-50 text-blue-700'
                }`}>
                  {opt.type === 'Organic' ? t.fertilizerResult.organic : t.fertilizerResult.inorganic}
                </span>
              </div>
              <ConfidenceBar value={opt.confidence} showLabel={false} height="md" />
              <div className="text-right text-xs font-bold text-flora-forest/70">{opt.confidence.toFixed(1)}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Organic vs Inorganic */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flora-card p-5 border-l-4 border-l-emerald-400">
          <div className="flex items-center gap-2 mb-2">
            <Leaf size={16} className="text-flora-emerald" />
            <h3 className="font-semibold text-flora-forest text-sm">Organic</h3>
            <span className="badge-organic text-xs">Compost</span>
          </div>
          <p className="text-xs text-flora-text/70 leading-relaxed">{t.fertilizerResult.organicDesc}</p>
        </div>
        <div className="flora-card p-5 border-l-4 border-l-blue-400">
          <div className="flex items-center gap-2 mb-2">
            <FlaskConical size={16} className="text-blue-500" />
            <h3 className="font-semibold text-flora-forest text-sm">Inorganic</h3>
          </div>
          <div className="flex flex-wrap gap-1 mb-2">
            {['Urea', 'DAP', 'NPK', 'MOP', 'SSP', 'Zinc Sulphate'].map((f) => (
              <span key={f} className="badge-inorganic text-xs px-1.5 py-0.5">{f}</span>
            ))}
          </div>
          <p className="text-xs text-flora-text/70 leading-relaxed">{t.fertilizerResult.inorganicDesc}</p>
        </div>
      </div>

      {/* Safety disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-700 mb-1">{t.fertilizerResult.safetyTitle}</p>
          <p className="text-xs text-amber-600 leading-relaxed">{t.fertilizerResult.safetyText}</p>
        </div>
      </div>
    </div>
  );
};

export default FertilizerResultComponent;


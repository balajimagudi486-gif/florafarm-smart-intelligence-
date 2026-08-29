// FloraFarm — Disease Result Component
import React from 'react';
import { AlertTriangle, CheckCircle2, Info, Leaf, Shield, FlaskConical } from 'lucide-react';
import type { DiseaseResult } from '../types';
import { getDiseaseInfo } from '../data/diseaseInfo';
import { useLanguage } from '../context/LanguageContext';
import HealthScore from './HealthScore';
import ConfidenceBar from './ConfidenceBar';

interface DiseaseResultProps {
  result: DiseaseResult;
}

const SeverityBadge: React.FC<{ severity: string }> = ({ severity }) => {
  const classes: Record<string, string> = {
    Healthy: 'badge-healthy',
    Low: 'badge-low',
    Moderate: 'badge-moderate',
    High: 'badge-high',
  };
  return (
    <span className={classes[severity] || 'badge-moderate'}>
      {severity === 'Healthy' && <CheckCircle2 size={12} className="mr-1" />}
      {(severity === 'Moderate' || severity === 'High') && <AlertTriangle size={12} className="mr-1" />}
      {severity}
    </span>
  );
};

const DiseaseResultComponent: React.FC<DiseaseResultProps> = ({ result }) => {
  const { t } = useLanguage();
  const info = getDiseaseInfo(result.disease);

  const gaugeColor =
    result.severity === 'Healthy'
      ? '#10B981'
      : result.severity === 'Low'
      ? '#F59E0B'
      : result.severity === 'Moderate'
      ? '#F97316'
      : '#EF4444';

  return (
    <div className="animate-fade-in space-y-6">
      {/* Demo banner */}
      {result.is_demo && (
        <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm">
          <Info size={15} />
          <span className="font-medium">{t.disease.demoLabel}</span>
          <span className="text-amber-600">— Using sample prediction. Upload a crop image for real analysis.</span>
        </div>
      )}

      {/* Main result card */}
      <div className="flora-card p-6 sm:p-8">
        <h2 className="text-xl font-bold text-flora-forest mb-6 flex items-center gap-2">
          <Leaf size={20} className="text-flora-green" />
          {t.disease.resultHeading}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
          {/* Left: crop + disease info */}
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-flora-text/50 uppercase tracking-wider mb-1">{t.disease.crop}</p>
              <p className="text-2xl font-bold text-flora-forest">{result.crop}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-flora-text/50 uppercase tracking-wider mb-1">{t.disease.condition}</p>
              <p className="text-xl font-semibold text-flora-text">{result.disease}</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div>
                <p className="text-xs font-semibold text-flora-text/50 uppercase tracking-wider mb-1.5">{t.disease.severity}</p>
                <SeverityBadge severity={result.severity} />
              </div>
            </div>
            <p className="text-xs text-flora-text/50 flex items-center gap-1.5">
              <Shield size={11} className="text-flora-green" />
              {result.model_version || 'MobileNetV2 / PlantVillage'}
            </p>
          </div>

          {/* Right: confidence gauge */}
          <div className="flex justify-center">
            <HealthScore
              value={result.confidence}
              size={150}
              label={t.disease.confidence}
              sublabel={`Top prediction`}
              color={gaugeColor}
            />
          </div>
        </div>
      </div>

      {/* Top predictions */}
      <div className="flora-card p-6">
        <h3 className="text-base font-semibold text-flora-forest mb-4 flex items-center gap-2">
          <FlaskConical size={16} className="text-flora-green" />
          {t.disease.topPredictions}
        </h3>
        <div className="space-y-3">
          {result.top_predictions.map((pred, i) => (
            <div key={pred.label} className="flex items-center gap-3">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                i === 0 ? 'bg-flora-green text-flora-dark' : 'bg-emerald-100 text-flora-forest'
              }`}>
                {i + 1}
              </span>
              <div className="flex-1">
                <ConfidenceBar
                  value={pred.confidence}
                  label={`${pred.crop} — ${pred.disease}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Disease information */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flora-card p-5">
          <h3 className="text-sm font-semibold text-flora-forest mb-3 flex items-center gap-2">
            <AlertTriangle size={14} className="text-amber-500" />
            {t.disease.symptoms}
          </h3>
          <ul className="space-y-2">
            {info.symptoms.map((s, i) => (
              <li key={i} className="text-sm text-flora-text/70 flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-flora-green mt-1.5 flex-shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="flora-card p-5">
          <h3 className="text-sm font-semibold text-flora-forest mb-3 flex items-center gap-2">
            <CheckCircle2 size={14} className="text-flora-green" />
            {t.disease.management}
          </h3>
          <ul className="space-y-2">
            {info.management.map((m, i) => (
              <li key={i} className="text-sm text-flora-text/70 flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                {m}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Nutrition note */}
      <div className="bg-flora-soft border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
        <Info size={16} className="text-flora-emerald flex-shrink-0 mt-0.5" />
        <p className="text-sm text-flora-forest/80">{t.disease.nutritionNote}</p>
      </div>

      {/* Disclaimer */}
      <p className="text-center text-xs text-flora-text/40 flex items-center justify-center gap-1.5">
        <Shield size={11} className="text-flora-green" />
        {t.disease.disclaimer}
      </p>
    </div>
  );
};

export default DiseaseResultComponent;


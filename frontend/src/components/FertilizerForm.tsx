// FloraFarm — Fertilizer Form Component
import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import type { FertilizerRequest } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface FertilizerFormProps {
  onSubmit: (data: FertilizerRequest) => void;
  loading?: boolean;
  initialValues?: Partial<FertilizerRequest>;
}

const Tooltip: React.FC<{ text: string }> = ({ text }) => (
  <div className="group relative inline-block ml-1">
    <HelpCircle size={13} className="text-flora-emerald/60 cursor-help hover:text-flora-emerald transition-colors" />
    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-56 bg-flora-forest text-white text-xs rounded-xl p-3 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 shadow-lg leading-relaxed">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-flora-forest" />
    </div>
  </div>
);

const SelectField: React.FC<{
  label: string; id: string; value: string; onChange: (v: string) => void; options: string[]; tooltip?: string;
}> = ({ label, id, value, onChange, options, tooltip }) => (
  <div>
    <label htmlFor={id} className="flora-label flex items-center">
      {label} {tooltip && <Tooltip text={tooltip} />}
    </label>
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flora-select pr-9"
        required
      >
        <option value="">Select…</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-flora-emerald pointer-events-none" />
    </div>
  </div>
);

const NumberField: React.FC<{
  label: string; id: string; value: string; onChange: (v: string) => void;
  min?: number; max?: number; step?: number; tooltip?: string; placeholder?: string;
}> = ({ label, id, value, onChange, min, max, step = 0.01, tooltip, placeholder }) => (
  <div>
    <label htmlFor={id} className="flora-label flex items-center">
      {label} {tooltip && <Tooltip text={tooltip} />}
    </label>
    <input
      type="number"
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      min={min}
      max={max}
      step={step}
      placeholder={placeholder}
      className="flora-input"
      required
    />
  </div>
);

const DEFAULT: FertilizerRequest = {
  Soil_Type: '',
  Soil_pH: 0,
  Soil_Moisture: 0,
  Organic_Carbon: 0,
  Electrical_Conductivity: 0,
  Nitrogen_Level: 0,
  Phosphorus_Level: 0,
  Potassium_Level: 0,
  Crop_Type: '',
  Crop_Growth_Stage: '',
  Season: '',
  Irrigation_Type: '',
  Previous_Crop: '',
  Region: '',
};

const FertilizerForm: React.FC<FertilizerFormProps> = ({ onSubmit, loading = false, initialValues }) => {
  const { t } = useLanguage();
  const [form, setForm] = useState<FertilizerRequest>({ ...DEFAULT, ...initialValues });

  const set = (key: keyof FertilizerRequest) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...form,
      Soil_pH: Number(form.Soil_pH),
      Soil_Moisture: Number(form.Soil_Moisture),
      Organic_Carbon: Number(form.Organic_Carbon),
      Electrical_Conductivity: Number(form.Electrical_Conductivity),
      Nitrogen_Level: Number(form.Nitrogen_Level),
      Phosphorus_Level: Number(form.Phosphorus_Level),
      Potassium_Level: Number(form.Potassium_Level),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-7" noValidate aria-label="Fertilizer recommendation form">
      {/* Soil properties */}
      <div>
        <h3 className="text-sm font-bold text-flora-forest uppercase tracking-wider mb-4 flex items-center gap-2">
          <div className="w-1 h-4 bg-flora-green rounded-full" />
          Soil Properties
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectField
            label={t.fertilizerAI.soilType}
            id="soil-type"
            value={form.Soil_Type}
            onChange={set('Soil_Type')}
            options={['Clay', 'Silt', 'Sandy', 'Loamy']}
          />
          <NumberField
            label={t.fertilizerAI.soilPH}
            id="soil-ph"
            value={String(form.Soil_pH || '')}
            onChange={set('Soil_pH')}
            min={0} max={14} step={0.01}
            placeholder="e.g. 6.5"
            tooltip={t.fertilizerAI.soilPHTooltip}
          />
          <NumberField
            label={t.fertilizerAI.soilMoisture}
            id="soil-moisture"
            value={String(form.Soil_Moisture || '')}
            onChange={set('Soil_Moisture')}
            min={0} max={100} step={0.1}
            placeholder="e.g. 35"
            tooltip={t.fertilizerAI.soilMoistureTooltip}
          />
          <NumberField
            label={t.fertilizerAI.organicCarbon}
            id="organic-carbon"
            value={String(form.Organic_Carbon || '')}
            onChange={set('Organic_Carbon')}
            min={0} step={0.01}
            placeholder="e.g. 0.32"
            tooltip={t.fertilizerAI.organicCarbonTooltip}
          />
          <NumberField
            label={t.fertilizerAI.electricalConductivity}
            id="electrical-conductivity"
            value={String(form.Electrical_Conductivity || '')}
            onChange={set('Electrical_Conductivity')}
            min={0} step={0.01}
            placeholder="e.g. 1.87"
            tooltip={t.fertilizerAI.electricalConductivityTooltip}
          />
        </div>
      </div>

      {/* Nutrient levels */}
      <div>
        <h3 className="text-sm font-bold text-flora-forest uppercase tracking-wider mb-4 flex items-center gap-2">
          <div className="w-1 h-4 bg-flora-green rounded-full" />
          Nutrient Levels (kg/ha)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <NumberField
            label={t.fertilizerAI.nitrogenLevel}
            id="nitrogen-level"
            value={String(form.Nitrogen_Level || '')}
            onChange={set('Nitrogen_Level')}
            min={0} step={1}
            placeholder="e.g. 61"
            tooltip={t.fertilizerAI.nitrogenTooltip}
          />
          <NumberField
            label={t.fertilizerAI.phosphorusLevel}
            id="phosphorus-level"
            value={String(form.Phosphorus_Level || '')}
            onChange={set('Phosphorus_Level')}
            min={0} step={1}
            placeholder="e.g. 45"
            tooltip={t.fertilizerAI.phosphorusTooltip}
          />
          <NumberField
            label={t.fertilizerAI.potassiumLevel}
            id="potassium-level"
            value={String(form.Potassium_Level || '')}
            onChange={set('Potassium_Level')}
            min={0} step={1}
            placeholder="e.g. 52"
            tooltip={t.fertilizerAI.potassiumTooltip}
          />
        </div>
      </div>

      {/* Crop & field info */}
      <div>
        <h3 className="text-sm font-bold text-flora-forest uppercase tracking-wider mb-4 flex items-center gap-2">
          <div className="w-1 h-4 bg-flora-green rounded-full" />
          Crop & Field Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectField
            label={t.fertilizerAI.cropType}
            id="crop-type"
            value={form.Crop_Type}
            onChange={set('Crop_Type')}
            options={['Cotton', 'Maize', 'Wheat', 'Potato', 'Rice', 'Sugarcane', 'Tomato']}
          />
          <SelectField
            label={t.fertilizerAI.cropGrowthStage}
            id="crop-growth-stage"
            value={form.Crop_Growth_Stage}
            onChange={set('Crop_Growth_Stage')}
            options={['Sowing', 'Vegetative', 'Flowering', 'Harvest']}
          />
          <SelectField
            label={t.fertilizerAI.season}
            id="season"
            value={form.Season}
            onChange={set('Season')}
            options={['Kharif', 'Zaid', 'Rabi']}
          />
          <SelectField
            label={t.fertilizerAI.irrigationType}
            id="irrigation-type"
            value={form.Irrigation_Type}
            onChange={set('Irrigation_Type')}
            options={['Canal', 'Sprinkler', 'Rainfed', 'Drip']}
          />
          <SelectField
            label={t.fertilizerAI.previousCrop}
            id="previous-crop"
            value={form.Previous_Crop}
            onChange={set('Previous_Crop')}
            options={['Wheat', 'Potato', 'Tomato', 'Maize', 'Sugarcane', 'Cotton', 'Rice']}
          />
          <SelectField
            label={t.fertilizerAI.region}
            id="region"
            value={form.Region}
            onChange={set('Region')}
            options={['South', 'Central', 'West', 'East', 'North']}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2 ${
          loading ? 'opacity-70 cursor-not-allowed' : ''
        }`}
        id="fertilizer-submit-btn"
        aria-busy={loading}
      >
        {loading ? (
          <>
            <div className="w-5 h-5 rounded-full border-2 border-flora-dark/30 border-t-flora-dark animate-spin" />
            {t.fertilizerAI.recommending}
          </>
        ) : (
          t.fertilizerAI.recommendBtn
        )}
      </button>
    </form>
  );
};

export default FertilizerForm;


// FloraFarm — Crop AI Page (Disease + Combined Flow)
import React, { useState, useCallback } from 'react';
import { Scan, Leaf, RefreshCcw, Zap } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { predictDisease } from '../services/diseaseApi';
import { recommendFertilizer } from '../services/fertilizerApi';
import type { DiseaseResult, FertilizerRequest, FertilizerResult, AnalysisRecord } from '../types';
import CropUploader from '../components/CropUploader';
import DiseaseResultComponent from '../components/DiseaseResult';
import FertilizerResultComponent from '../components/FertilizerResult';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

type Step = 'upload' | 'scanning' | 'complete';

const SCAN_STAGES = [
  'Reading crop image…',
  'Preparing image…',
  'Analyzing leaf patterns…',
  'Comparing disease features…',
  'Identifying crop condition…',
  'Generating fertilizer recommendation…',
  'Preparing results…',
];

const ScanningOverlay: React.FC<{ stages: string[] }> = ({ stages }) => {
  const [stageIdx, setStageIdx] = React.useState(0);

  React.useEffect(() => {
    const iv = setInterval(() => {
      setStageIdx((i) => (i < stages.length - 1 ? i + 1 : i));
    }, 800);
    return () => clearInterval(iv);
  }, [stages]);

  return (
    <div className="text-center py-16 animate-fade-in">
      <div className="relative w-48 h-48 mx-auto mb-8">
        <div className="absolute inset-0 rounded-3xl border-2 border-flora-green/40 bg-flora-green/5 overflow-hidden">
          <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-flora-green to-transparent animate-scan-line" />
          <div className="absolute top-3 left-3 w-8 h-8 border-l-2 border-t-2 border-flora-green rounded-tl-xl" />
          <div className="absolute top-3 right-3 w-8 h-8 border-r-2 border-t-2 border-flora-green rounded-tr-xl" />
          <div className="absolute bottom-3 left-3 w-8 h-8 border-l-2 border-b-2 border-flora-green rounded-bl-xl" />
          <div className="absolute bottom-3 right-3 w-8 h-8 border-r-2 border-b-2 border-flora-green rounded-br-xl" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-flora-green/20 flex items-center justify-center animate-pulse-green">
              <Scan size={32} className="text-flora-green" />
            </div>
          </div>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="particle absolute w-1.5 h-1.5 rounded-full bg-flora-green"
              style={{
                left: `${20 + i * 15}%`,
                bottom: `${20 + (i % 3) * 10}%`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>
        <div className="absolute -inset-3 rounded-3xl border border-flora-green/20 animate-ping" style={{ animationDuration: '2s' }} />
      </div>

      <h3 className="text-xl font-bold text-flora-forest mb-2">Analyzing your crop…</h3>
      <p className="text-flora-green font-medium text-sm animate-pulse">{stages[stageIdx]}</p>

      <div className="mt-6 flex justify-center gap-1">
        {stages.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i <= stageIdx ? 'w-6 bg-flora-green' : 'w-3 bg-emerald-100'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// ── Smart crop → fertilizer defaults ─────────────────────────────────────────
function buildFertilizerDefaults(cropName: string): FertilizerRequest {
  const crop = cropName.toLowerCase();
  // Map detected crop to fertilizer model's known crop types
  let cropType = 'Tomato';
  if (crop.includes('tomato')) cropType = 'Tomato';
  else if (crop.includes('potato')) cropType = 'Potato';
  else if (crop.includes('corn') || crop.includes('maize')) cropType = 'Maize';
  else if (crop.includes('rice')) cropType = 'Rice';
  else if (crop.includes('wheat')) cropType = 'Wheat';
  else if (crop.includes('cotton')) cropType = 'Cotton';
  else if (crop.includes('sugarcane')) cropType = 'Sugarcane';
  // Pepper, Apple, Grape, etc. → closest match: Tomato (nightshade family)

  return {
    Soil_Type: 'Loamy',
    Soil_pH: 6.5,
    Soil_Moisture: 40,
    Organic_Carbon: 0.5,
    Electrical_Conductivity: 1.5,
    Nitrogen_Level: 60,
    Phosphorus_Level: 45,
    Potassium_Level: 50,
    Crop_Type: cropType,
    Crop_Growth_Stage: 'Vegetative',
    Season: 'Kharif',
    Irrigation_Type: 'Drip',
    Previous_Crop: 'Wheat',
    Region: 'South',
  };
}

const CropAI: React.FC = () => {
  const { t } = useLanguage();
  const [step, setStep] = useState<Step>('upload');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [diseaseResult, setDiseaseResult] = useState<DiseaseResult | null>(null);
  const [fertilizerResult, setFertilizerResult] = useState<FertilizerResult | null>(null);
  const [error, setError] = useState<string>('');

  const handleImageReady = useCallback((file: File, url: string) => {
    setImageFile(file);
    setImagePreview(url);
    setError('');
  }, []);

  const handleAnalyze = async () => {
    if (!imageFile) return;
    setStep('scanning');
    setError('');

    try {
      // Step 1: Disease prediction
      const dResult = await predictDisease(imageFile);
      setDiseaseResult(dResult);

      // Step 2: Auto fertilizer recommendation using smart crop-based defaults
      let fResult: FertilizerResult | null = null;
      try {
        const defaults = buildFertilizerDefaults(dResult.crop);
        fResult = await recommendFertilizer(defaults);
        setFertilizerResult(fResult);
      } catch (fertErr) {
        console.warn('Auto fertilizer recommendation failed:', fertErr);
      }

      setStep('complete');

      // Save to history
      const record: AnalysisRecord = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        crop: dResult.crop,
        disease: dResult.disease,
        diseaseConfidence: dResult.confidence,
        severity: dResult.severity,
        is_demo: dResult.is_demo,
        imageUrl: imagePreview,
        fertilizer: fResult?.fertilizer,
        fertilizerType: fResult?.type,
        fertilizerConfidence: fResult?.confidence,
      };
      const history = JSON.parse(localStorage.getItem('florafarm_history') || '[]');
      localStorage.setItem('florafarm_history', JSON.stringify([record, ...history].slice(0, 100)));
    } catch (err: any) {
      setStep('upload');
      if (err?.response?.status === 400) {
        const detail: string = err.response.data.detail || '';
        if (
          detail.toLowerCase().includes('crop image') ||
          detail.toLowerCase().includes('non-crop') ||
          detail.toLowerCase().includes('plant')
        ) {
          setError(t.errors.nonCropImage);
        } else {
          setError(detail || t.errors.invalidImage);
        }
      } else if (err?.code === 'ECONNREFUSED' || !err?.response) {
        setError(t.errors.backendUnavailable);
      } else {
        setError(t.errors.genericError);
      }
    }
  };

  const reset = () => {
    setStep('upload');
    setImageFile(null);
    setImagePreview('');
    setDiseaseResult(null);
    setFertilizerResult(null);
    setError('');
  };

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-flora-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          <div className="text-center mb-10">
            <div className="section-tag inline-flex mb-4">
              <Scan size={13} className="text-flora-green" />
              AI Crop Analysis
            </div>
            <h1 className="text-4xl font-black text-flora-text mb-3 font-display">{t.cropAI.heading}</h1>
            <p className="text-flora-text/60 text-lg">{t.cropAI.subheading}</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm flex items-center gap-2" role="alert">
              <span>⚠️</span> {error}
            </div>
          )}

          {step === 'upload' && (
            <div className="flora-card p-8 animate-fade-in">
              <h2 className="text-lg font-semibold text-flora-forest mb-6 flex items-center gap-2">
                <Leaf size={18} className="text-flora-green" />
                {t.cropAI.uploadLabel}
              </h2>
              <CropUploader
                onImageReady={handleImageReady}
                onAnalyze={handleAnalyze}
              />
            </div>
          )}

          {step === 'scanning' && (
            <div className="flora-card">
              <ScanningOverlay stages={SCAN_STAGES} />
            </div>
          )}

          {step === 'complete' && diseaseResult && (
            <div className="space-y-6">

              {/* Demo mode warning */}
              {diseaseResult.is_demo && (
                <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl px-5 py-4 flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">⚠️</span>
                  <div>
                    <p className="font-bold text-amber-800 mb-1">Demo Mode — Not a Real Prediction</p>
                    <p className="text-sm text-amber-700">
                      The AI model is not loaded on the server. The result below is a <strong>hardcoded sample</strong>{' '}
                      (Tomato / Early Blight), <strong>not</strong> an analysis of your uploaded image.
                      To get real predictions, ensure the backend is running and the model file is present.
                    </p>
                  </div>
                </div>
              )}

              {imagePreview && (
                <div className="flora-card overflow-hidden">
                  <img src={imagePreview} alt="Analyzed crop" className="w-full object-cover max-h-48" />
                </div>
              )}
              <DiseaseResultComponent result={diseaseResult} />

              {fertilizerResult && (
                <>
                  <div className="flora-card p-6 border-l-4 border-l-flora-green">
                    <h2 className="text-xl font-bold text-flora-forest mb-4 flex items-center gap-2">
                      <Zap size={20} className="text-flora-green" />
                      {t.combined.advisory}
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                      {[
                        { label: 'Crop', value: diseaseResult.crop },
                        { label: 'Disease', value: diseaseResult.disease },
                        { label: 'AI Confidence', value: `${diseaseResult.confidence.toFixed(1)}%` },
                        { label: 'Severity', value: diseaseResult.severity },
                        { label: 'Fertilizer', value: fertilizerResult.fertilizer },
                        { label: 'Type', value: fertilizerResult.type },
                      ].map(({ label, value }) => (
                        <div key={label} className="bg-flora-soft rounded-xl p-3">
                          <p className="text-xs font-semibold text-flora-text/50 uppercase tracking-wider mb-1">{label}</p>
                          <p className="text-sm font-bold text-flora-forest">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <FertilizerResultComponent result={fertilizerResult} />
                </>
              )}

              <button
                onClick={reset}
                className="btn-ghost flex items-center gap-2 mx-auto"
              >
                <RefreshCcw size={16} />
                {t.common.newAnalysis}
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CropAI;

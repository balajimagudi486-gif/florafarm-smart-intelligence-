// FloraFarm — Fertilizer AI Page (standalone)
import React, { useState } from 'react';
import { FlaskConical, RefreshCcw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useChatContext } from '../context/ChatContext';
import { recommendFertilizer } from '../services/fertilizerApi';
import type { FertilizerRequest, FertilizerResult } from '../types';
import FertilizerForm from '../components/FertilizerForm';
import FertilizerResultComponent from '../components/FertilizerResult';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const FertilizerAI: React.FC = () => {
  const { t } = useLanguage();
  const { setFertilizerResult: setChatFertilizerResult, clearChatContext } = useChatContext();
  const [result, setResult] = useState<FertilizerResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (data: FertilizerRequest) => {
    setLoading(true);
    setError('');
    try {
      const res = await recommendFertilizer(data);
      setResult(res);
      setChatFertilizerResult(res);  // push to global chat context
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(t.errors.backendUnavailable);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError('');
    clearChatContext();  // clear chat advisor context when starting fresh
  };

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-FloraFarm-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Page header */}
          <div className="text-center mb-10">
            <div className="section-tag inline-flex mb-4">
              <FlaskConical size={13} className="text-FloraFarm-green" />
              Smart Nutrition
            </div>
            <h1 className="text-4xl font-black text-FloraFarm-text mb-3 font-display">{t.fertilizerAI.heading}</h1>
            <p className="text-FloraFarm-text/60 text-lg max-w-2xl mx-auto">{t.fertilizerAI.subheading}</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm flex items-center gap-2" role="alert">
              ⚠️ {error}
            </div>
          )}

          {result ? (
            <div className="space-y-6">
              <FertilizerResultComponent result={result} />
              <button onClick={reset} className="btn-ghost flex items-center gap-2 mx-auto">
                <RefreshCcw size={16} />
                {t.common.newAnalysis}
              </button>
            </div>
          ) : (
            <div className="FloraFarm-card p-6 sm:p-10">
              <h2 className="text-xl font-bold text-FloraFarm-forest mb-8 flex items-center gap-2">
                <FlaskConical size={20} className="text-FloraFarm-green" />
                {t.fertilizerAI.heading}
              </h2>
              <FertilizerForm onSubmit={handleSubmit} loading={loading} />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default FertilizerAI;

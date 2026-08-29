// FloraFarm — Language Selector Component
import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import type { Language } from '../types';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 p-1 rounded-lg bg-FloraFarm-light border border-emerald-200">
      <Globe size={13} className="text-FloraFarm-emerald ml-1" />
      <button
        onClick={() => setLanguage('en' as Language)}
        aria-label="Switch to English"
        className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all duration-200 ${
          language === 'en'
            ? 'bg-FloraFarm-green text-FloraFarm-dark shadow-sm'
            : 'text-FloraFarm-forest hover:bg-emerald-100'
        }`}
      >
        EN
      </button>
      <span className="text-emerald-300 text-xs">|</span>
      <button
        onClick={() => setLanguage('ta' as Language)}
        aria-label="Switch to Tamil"
        className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all duration-200 ${
          language === 'ta'
            ? 'bg-FloraFarm-green text-FloraFarm-dark shadow-sm'
            : 'text-FloraFarm-forest hover:bg-emerald-100'
        }`}
      >
        தமிழ்
      </button>
    </div>
  );
};

export default LanguageSelector;

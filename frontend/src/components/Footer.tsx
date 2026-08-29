// FloraFarm — Footer Component
import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Zap, Shield } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-flora-forest text-white/80 mt-24" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="relative w-9 h-9 flex items-center justify-center">
                <div className="absolute inset-0 bg-flora-green/20 rounded-xl" />
                <Leaf size={18} className="text-flora-green relative z-10" strokeWidth={2.5} />
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-flora-green rounded-full flex items-center justify-center">
                  <Zap size={7} className="text-white" strokeWidth={3} />
                </div>
              </div>
              <span className="text-xl font-black tracking-tight font-display text-white">FloraFarm</span>
            </div>
            <p className="text-sm leading-relaxed text-white/60 mb-4">
              {t.footer.tagline}
            </p>
            <p className="text-xs text-white/40 italic">"Detect. Understand. Nourish."</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">{t.footer.quickLinks}</h3>
            <ul className="space-y-2.5">
              {[
                { to: '/', label: t.nav.home },
                { to: '/dashboard', label: t.nav.dashboard },
                { to: '/history', label: t.nav.history },
                { to: '/how-it-works', label: t.nav.howItWorks },
                { to: '/about', label: t.nav.about },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/60 hover:text-flora-green transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* AI Modules */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">{t.footer.aiModules}</h3>
            <ul className="space-y-2.5">
              {[
                { to: '/crop-ai', label: t.nav.cropAI },
                { to: '/fertilizer-ai', label: t.nav.fertilizerAI },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/60 hover:text-flora-green transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <span className="inline-flex items-center gap-1.5 text-xs text-flora-green/80 bg-flora-green/10 px-2.5 py-1 rounded-full border border-flora-green/20">
                  MobileNetV2
                </span>
              </li>
              <li>
                <span className="inline-flex items-center gap-1.5 text-xs text-flora-green/80 bg-flora-green/10 px-2.5 py-1 rounded-full border border-flora-green/20">
                  Random Forest
                </span>
              </li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
              <Shield size={14} className="text-flora-green" />
              {t.footer.legal}
            </h3>
            <p className="text-xs text-white/50 leading-relaxed">
              {t.footer.legalText}
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-xs text-white/40">{t.footer.copyright}</p>
            <p className="text-xs font-medium text-flora-green">Developed by Balaji</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-white/30">FastAPI · TensorFlow · React</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

// FloraFarm — Navbar Component
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Leaf, Zap } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';

const Navbar: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const links = [
    { to: '/', label: t.nav.home },
    { to: '/crop-ai', label: t.nav.cropAI },
    { to: '/fertilizer-ai', label: t.nav.fertilizerAI },
    { to: '/how-it-works', label: t.nav.howItWorks },
    { to: '/dashboard', label: t.nav.dashboard },
    { to: '/about', label: t.nav.about },
  ];

  const isActive = (to: string) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-flora border-b border-emerald-100'
          : 'bg-white/80 backdrop-blur-sm'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group" aria-label="FloraFarm Home">
            <div className="relative w-9 h-9 flex items-center justify-center">
              <div className="absolute inset-0 bg-flora-green/20 rounded-xl group-hover:bg-flora-green/30 transition-colors" />
              <Leaf size={18} className="text-flora-green relative z-10" strokeWidth={2.5} />
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-flora-green rounded-full flex items-center justify-center">
                <Zap size={7} className="text-white" strokeWidth={3} />
              </div>
            </div>
            <div>
              <span className="text-xl font-black tracking-tight font-display text-flora-forest">
                FloraFarm
              </span>
              <div className="text-[9px] font-medium text-flora-emerald -mt-1 leading-none hidden sm:block">
                Smart Agriculture AI
              </div>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-link text-sm ${isActive(link.to) ? 'nav-link-active' : ''}`}
              >
                {link.label}
                {isActive(link.to) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-flora-green rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Right: Language + CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <LanguageSelector />
            <Link to="/crop-ai" className="btn-primary text-sm py-2.5 px-5">
              {t.nav.analyzeCrop}
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="lg:hidden flex items-center gap-2">
            <LanguageSelector />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg hover:bg-flora-light transition-colors"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <X size={20} className="text-flora-forest" />
              ) : (
                <Menu size={20} className="text-flora-forest" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-emerald-100 bg-white/98 backdrop-blur-md animate-slide-up">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`block px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive(link.to)
                    ? 'bg-flora-light text-flora-forest font-semibold border border-emerald-200'
                    : 'text-flora-text hover:bg-flora-light hover:text-flora-forest'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-emerald-100 mt-2">
              <Link to="/crop-ai" className="btn-primary w-full text-center block">
                {t.nav.analyzeCrop}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

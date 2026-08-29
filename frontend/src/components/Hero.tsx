// FloraFarm — Hero Section Component
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Scan, Leaf, Zap, CheckCircle2, TrendingUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const FloatingCard: React.FC<{
  className?: string;
  children: React.ReactNode;
  delay?: string;
}> = ({ className, children, delay = '0s' }) => (
  <div
    className={`glass-card p-3.5 min-w-[140px] shadow-FloraFarm animate-float ${className}`}
    style={{ animationDelay: delay }}
  >
    {children}
  </div>
);

const Hero: React.FC = () => {
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Particle animation on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: Array<{
      x: number; y: number; size: number; speedY: number; opacity: number; life: number;
    }> = [];

    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedY: -(Math.random() * 0.5 + 0.2),
        opacity: Math.random() * 0.5 + 0.1,
        life: Math.random(),
      });
    }

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.y += p.speedY;
        p.life += 0.003;
        if (p.y < 0 || p.life > 1) {
          p.y = canvas.height;
          p.x = Math.random() * canvas.width;
          p.life = 0;
        }
        const alpha = Math.sin(p.life * Math.PI) * p.opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(57,255,136,${alpha})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden bg-hero-gradient pt-16"
      aria-label="Hero section"
    >
      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Background orbs */}
      <div className="absolute top-20 -left-20 w-80 h-80 bg-flora-green/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 -right-20 w-96 h-96 bg-flora-emerald/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-flora-green/4 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left — Text Content */}
          <div className="animate-slide-up">
            {/* Tag */}
            <div className="section-tag mb-6 inline-flex">
              <Zap size={13} className="text-flora-green" />
              AI-Powered Agriculture Platform
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl font-black leading-tight text-flora-text mb-4 font-display">
              {t.hero.headline.split(' ').map((word, i) =>
                word === 'Smarter' || word === 'Here.' ? (
                  <span key={i} className="text-gradient-green">{word} </span>
                ) : (
                  <span key={i}>{word} </span>
                )
              )}
            </h1>

            <p className="text-lg text-flora-forest/70 font-medium mb-3">
              {t.hero.subheadline}
            </p>

            <p className="text-base text-flora-text/60 leading-relaxed mb-8 max-w-lg">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link to="/crop-ai" className="btn-primary flex items-center justify-center gap-2 text-base py-3.5 px-7">
                <Scan size={18} />
                {t.hero.primaryCta}
                <ArrowRight size={16} />
              </Link>
              <Link to="/how-it-works" className="btn-secondary flex items-center justify-center gap-2 text-base py-3.5">
                <Leaf size={18} />
                {t.hero.secondaryCta}
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4">
              {[
                { icon: CheckCircle2, label: '38 Disease Classes' },
                { icon: CheckCircle2, label: '7 Fertilizer Types' },
                { icon: CheckCircle2, label: 'EN | தமிழ்' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-sm text-flora-forest/70">
                  <Icon size={14} className="text-flora-green" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Visual with floating cards */}
          <div className="relative flex items-center justify-center lg:justify-end">
            {/* Central crop visual */}
            <div className="relative w-72 h-72 sm:w-80 sm:h-80">
              {/* Main circle */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-100 to-flora-green/20 border-2 border-flora-green/30 overflow-hidden shadow-flora-lg">
                {/* Leaf SVG illustration */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Large leaf */}
                    <svg width="180" height="180" viewBox="0 0 200 200" className="opacity-80">
                      <defs>
                        <radialGradient id="leafGrad" cx="40%" cy="40%">
                          <stop offset="0%" stopColor="#39FF88" stopOpacity="0.9" />
                          <stop offset="60%" stopColor="#10B981" stopOpacity="0.85" />
                          <stop offset="100%" stopColor="#047857" stopOpacity="0.8" />
                        </radialGradient>
                        <radialGradient id="leaf2Grad" cx="40%" cy="40%">
                          <stop offset="0%" stopColor="#6EE7B7" stopOpacity="0.7" />
                          <stop offset="100%" stopColor="#064E3B" stopOpacity="0.6" />
                        </radialGradient>
                      </defs>
                      {/* Stem */}
                      <path d="M100 190 Q100 130 100 100" stroke="#047857" strokeWidth="3" fill="none" strokeLinecap="round"/>
                      {/* Main leaf */}
                      <path d="M100 100 Q60 60 80 20 Q130 10 140 60 Q150 90 100 100Z" fill="url(#leafGrad)" />
                      {/* Veins */}
                      <path d="M100 100 Q90 70 80 45" stroke="#064E3B" strokeWidth="1.5" fill="none" opacity="0.4" strokeLinecap="round"/>
                      <path d="M100 90 Q115 75 128 58" stroke="#064E3B" strokeWidth="1" fill="none" opacity="0.3" strokeLinecap="round"/>
                      <path d="M100 80 Q108 68 115 55" stroke="#064E3B" strokeWidth="1" fill="none" opacity="0.3" strokeLinecap="round"/>
                      {/* Small leaf */}
                      <path d="M100 130 Q70 110 75 85 Q100 80 110 100 Q115 115 100 130Z" fill="url(#leaf2Grad)" opacity="0.7" />
                    </svg>

                    {/* AI scan line */}
                    <div className="absolute inset-0 overflow-hidden rounded-2xl">
                      <div
                        className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-flora-green to-transparent animate-scan-line opacity-80"
                        style={{ animationDuration: '2.5s' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Corner electric green dots */}
                <div className="absolute top-3 left-3 w-2 h-2 bg-flora-green rounded-full animate-pulse-green" />
                <div className="absolute top-3 right-3 w-2 h-2 bg-flora-green rounded-full animate-pulse-green" style={{ animationDelay: '0.5s' }} />
                <div className="absolute bottom-3 left-3 w-2 h-2 bg-flora-green rounded-full animate-pulse-green" style={{ animationDelay: '1s' }} />
                <div className="absolute bottom-3 right-3 w-2 h-2 bg-flora-green rounded-full animate-pulse-green" style={{ animationDelay: '1.5s' }} />

                {/* Corner frame lines */}
                <div className="absolute top-2 left-2 w-8 h-8 border-l-2 border-t-2 border-flora-green/70 rounded-tl-lg" />
                <div className="absolute top-2 right-2 w-8 h-8 border-r-2 border-t-2 border-flora-green/70 rounded-tr-lg" />
                <div className="absolute bottom-2 left-2 w-8 h-8 border-l-2 border-b-2 border-flora-green/70 rounded-bl-lg" />
                <div className="absolute bottom-2 right-2 w-8 h-8 border-r-2 border-b-2 border-flora-green/70 rounded-br-lg" />
              </div>

              {/* Floating Card 1 — AI Crop Analysis */}
              <FloatingCard
                className="absolute -top-8 -left-12 sm:-left-16"
                delay="0s"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-lg bg-flora-green/20 flex items-center justify-center">
                    <Scan size={14} className="text-flora-green" />
                  </div>
                  <span className="text-xs font-semibold text-flora-forest">{t.hero.card1Title}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-flora-green rounded-full animate-pulse" />
                  <span className="text-xs font-medium text-flora-emerald">{t.hero.card1Status}</span>
                </div>
              </FloatingCard>

              {/* Floating Card 2 — Crop Health */}
              <FloatingCard
                className="absolute -bottom-8 -left-12 sm:-left-16"
                delay="1s"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <Leaf size={14} className="text-flora-emerald" />
                  </div>
                  <span className="text-xs font-semibold text-flora-forest">{t.hero.card2Title}</span>
                </div>
                <span className="text-xs font-medium text-flora-emerald">{t.hero.card2Status}</span>
              </FloatingCard>

              {/* Floating Card 3 — AI Confidence */}
              <FloatingCard
                className="absolute -right-12 sm:-right-16 top-1/2 -translate-y-1/2"
                delay="2s"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-flora-green/20 flex items-center justify-center">
                    <TrendingUp size={14} className="text-flora-green" />
                  </div>
                  <span className="text-xs font-semibold text-flora-forest">{t.hero.card3Title}</span>
                </div>
                <div className="text-2xl font-black text-flora-green">{t.hero.card3Value}</div>
                <div className="mt-1 h-1 w-full rounded-full bg-emerald-100 overflow-hidden">
                  <div className="h-full w-[96%] bg-gradient-to-r from-flora-emerald to-flora-green rounded-full" />
                </div>
              </FloatingCard>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 60" className="w-full" preserveAspectRatio="none">
          <path d="M0,60 C360,0 1080,60 1440,20 L1440,60 Z" fill="white" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;

// FloraFarm — Hero Section with 3D Agricultural Graphics
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Scan, Leaf, Zap, CheckCircle2, TrendingUp, Wheat, Sprout, Sun, Droplets } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

// ── 3D Floating Info Card ─────────────────────────────────────────
const FloatingCard: React.FC<{
  className?: string;
  children: React.ReactNode;
  delay?: string;
}> = ({ className, children, delay = '0s' }) => (
  <div
    className={`glass-card p-3.5 min-w-[140px] shadow-3d animate-float tilt-card ${className}`}
    style={{ animationDelay: delay }}
  >
    {children}
  </div>
);

// ── 3D Rotating Crop Cube ─────────────────────────────────────────
const CropCube: React.FC = () => (
  <div className="perspective-1500 w-[200px] h-[200px]">
    <div className="crop-cube">
      <div className="face face-front">
        <div className="flex flex-col items-center gap-1">
          <Leaf size={48} className="text-flora-green drop-shadow-lg" />
          <span className="text-xs font-bold text-flora-forest/80">Disease AI</span>
        </div>
      </div>
      <div className="face face-back">
        <div className="flex flex-col items-center gap-1">
          <Wheat size={48} className="text-agri-wheat drop-shadow-lg" />
          <span className="text-xs font-bold text-agri-soil/80">Crop Health</span>
        </div>
      </div>
      <div className="face face-right">
        <div className="flex flex-col items-center gap-1">
          <Sprout size={48} className="text-agri-leaf-light drop-shadow-lg" />
          <span className="text-xs font-bold text-flora-forest/80">Fertilizer AI</span>
        </div>
      </div>
      <div className="face face-left">
        <div className="flex flex-col items-center gap-1">
          <Sun size={48} className="text-agri-harvest drop-shadow-lg" />
          <span className="text-xs font-bold text-agri-soil/80">Soil Analysis</span>
        </div>
      </div>
      <div className="face face-top">
        <div className="flex flex-col items-center gap-1">
          <Droplets size={48} className="text-agri-sky-deep drop-shadow-lg" />
          <span className="text-xs font-bold text-agri-sky-deep/80">Irrigation</span>
        </div>
      </div>
      <div className="face face-bottom">
        <div className="flex flex-col items-center gap-1">
          <TrendingUp size={48} className="text-flora-emerald drop-shadow-lg" />
          <span className="text-xs font-bold text-agri-soil/80">Analytics</span>
        </div>
      </div>
    </div>
  </div>
);

// ── Orbiting Decorative Rings ─────────────────────────────────────
const OrbitRings: React.FC = () => (
  <>
    <div
      className="orbit-ring"
      style={{ width: 280, height: 280, top: '50%', left: '50%', marginTop: -140, marginLeft: -140 }}
    />
    <div
      className="orbit-ring"
      style={{
        width: 360, height: 360, top: '50%', left: '50%', marginTop: -180, marginLeft: -180,
        animationDirection: 'reverse', animationDuration: '30s',
      }}
    />
    {/* Orbiting dot */}
    <div
      className="absolute w-3 h-3 bg-agri-wheat rounded-full shadow-lg"
      style={{
        top: '50%', left: '50%', marginTop: -6, marginLeft: -6,
        animation: 'orbit 20s linear infinite',
      }}
    />
    <div
      className="absolute w-2 h-2 bg-flora-green rounded-full shadow-lg"
      style={{
        top: '50%', left: '50%', marginTop: -4, marginLeft: -4,
        animation: 'orbit 25s linear infinite reverse',
      }}
    />
  </>
);

// ── Grain Particles ───────────────────────────────────────────────
const GrainParticles: React.FC = () => (
  <>
    {[...Array(8)].map((_, i) => (
      <div
        key={i}
        className="grain-particle"
        style={{
          left: `${15 + i * 10}%`,
          bottom: `${10 + (i % 3) * 15}%`,
          animationDelay: `${i * 0.5}s`,
          animationDuration: `${3 + (i % 3)}s`,
        }}
      />
    ))}
  </>
);

// ── Main Hero Component ───────────────────────────────────────────
const Hero: React.FC = () => {
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Particle animation on canvas — green + gold mixed particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles: Array<{
      x: number; y: number; size: number; speedY: number; opacity: number; life: number; color: string;
    }> = [];

    const colors = [
      'rgba(57,255,136,',   // green
      'rgba(16,185,129,',   // emerald
      'rgba(212,168,67,',   // wheat gold
      'rgba(196,114,47,',   // harvest orange
    ];

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedY: -(Math.random() * 0.4 + 0.15),
        opacity: Math.random() * 0.4 + 0.1,
        life: Math.random(),
        color: colors[Math.floor(Math.random() * colors.length)],
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
        ctx.fillStyle = `${p.color}${alpha})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden bg-hero-gradient pt-16"
      aria-label="Hero section"
    >
      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Background atmospheric orbs */}
      <div className="absolute top-20 -left-20 w-80 h-80 bg-flora-green/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 -right-20 w-96 h-96 bg-agri-wheat/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-agri-soil/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-flora-green/3 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle topographic lines — agricultural field feel */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 60px, #2D5016 60px, #2D5016 61px),
                            repeating-linear-gradient(90deg, transparent, transparent 60px, #2D5016 60px, #2D5016 61px)`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left — Text Content */}
          <div className="animate-slide-up">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r from-flora-green/15 to-agri-wheat/15 text-flora-forest border border-flora-green/30 mb-6">
              <Zap size={13} className="text-flora-green" />
              Smart Agriculture Platform
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl font-black leading-tight text-flora-text mb-4 font-display">
              {t.hero.headline.split(' ').map((word: string, i: number) =>
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

          {/* Right — 3D Agricultural Visual */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="relative w-[340px] h-[340px] sm:w-[380px] sm:h-[380px]">
              {/* Orbit rings */}
              <OrbitRings />

              {/* Central 3D cube */}
              <div className="absolute inset-0 flex items-center justify-center">
                <CropCube />
              </div>

              {/* Grain particles */}
              <GrainParticles />

              {/* Floating Card 1 — AI Crop Analysis */}
              <FloatingCard
                className="absolute -top-6 -left-10 sm:-left-14 z-10"
                delay="0s"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-flora-green/20 to-agri-wheat/20 flex items-center justify-center">
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
                className="absolute -bottom-6 -left-10 sm:-left-14 z-10"
                delay="1s"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-100 to-agri-cream flex items-center justify-center">
                    <Leaf size={14} className="text-flora-emerald" />
                  </div>
                  <span className="text-xs font-semibold text-flora-forest">{t.hero.card2Title}</span>
                </div>
                <span className="text-xs font-medium text-flora-emerald">{t.hero.card2Status}</span>
              </FloatingCard>

              {/* Floating Card 3 — AI Confidence */}
              <FloatingCard
                className="absolute -right-10 sm:-right-14 top-1/2 -translate-y-1/2 z-10"
                delay="2s"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-flora-green/20 to-agri-wheat/20 flex items-center justify-center">
                    <TrendingUp size={14} className="text-flora-green" />
                  </div>
                  <span className="text-xs font-semibold text-flora-forest">{t.hero.card3Title}</span>
                </div>
                <div className="text-2xl font-black text-gradient-green">{t.hero.card3Value}</div>
                <div className="mt-1 h-1.5 w-full rounded-full bg-emerald-100 overflow-hidden">
                  <div className="h-full w-[96%] bg-gradient-to-r from-flora-emerald via-flora-green to-agri-wheat rounded-full" />
                </div>
              </FloatingCard>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave — agricultural field contour */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 80" className="w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#F0FDF4" />
              <stop offset="50%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#FFF8E7" />
            </linearGradient>
          </defs>
          <path d="M0,80 C240,20 480,60 720,30 C960,0 1200,50 1440,25 L1440,80 Z" fill="url(#waveGrad)" />
          <path d="M0,80 C360,40 720,70 1080,35 C1260,18 1380,45 1440,40 L1440,80 Z" fill="white" opacity="0.6" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;

// FloraFarm — Home Page
import React from 'react';
import { Link } from 'react-router-dom';
import { Scan, FlaskConical, Leaf, Zap, ArrowRight, Shield, Brain, Globe, Upload, Eye, Droplets, Cpu, Server, Code2, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Hero from '../components/Hero';
import Footer from '../components/Footer';

const Home: React.FC = () => {
  const { t } = useLanguage();

  const howItWorksSteps = [
    { num: '01', icon: Upload, title: t.howItWorks.step1Title, text: t.howItWorks.step1Text, color: 'from-emerald-400 to-flora-green' },
    { num: '02', icon: Brain, title: t.howItWorks.step2Title, text: t.howItWorks.step2Text, color: 'from-flora-green to-emerald-500' },
    { num: '03', icon: Eye, title: t.howItWorks.step3Title, text: t.howItWorks.step3Text, color: 'from-emerald-500 to-flora-deep-emerald' },
    { num: '04', icon: Droplets, title: t.howItWorks.step4Title, text: t.howItWorks.step4Text, color: 'from-flora-deep-emerald to-flora-forest' },
  ];

  const techStack = [
    { label: 'MobileNetV2', category: 'Disease AI', icon: Brain },
    { label: 'PlantVillage', category: 'Dataset', icon: Leaf },
    { label: 'TensorFlow', category: 'Framework', icon: Cpu },
    { label: 'Random Forest', category: 'Fertilizer AI', icon: Zap },
    { label: 'Scikit-learn', category: 'ML Library', icon: FlaskConical },
    { label: 'FastAPI', category: 'Backend', icon: Server },
    { label: 'React', category: 'Frontend', icon: Code2 },
    { label: 'TypeScript', category: 'Language', icon: Code2 },
  ];

  return (
    <>
      {/* Hero */}
      <Hero />

      {/* Welcome Section */}
      <section id="welcome" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="section-tag inline-flex mb-4">
              <Leaf size={13} className="text-flora-green" />
              {t.welcome.heading}
            </div>
            <h2 className="text-4xl font-black text-flora-text mb-4 font-display">{t.welcome.heading}</h2>
            <p className="text-lg text-flora-text/60 max-w-2xl mx-auto leading-relaxed">
              {t.welcome.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                num: t.welcome.card1Number,
                title: t.welcome.card1Title,
                text: t.welcome.card1Text,
                icon: Scan,
                to: '/crop-ai',
                color: 'text-flora-green',
                bg: 'bg-flora-green/10',
              },
              {
                num: t.welcome.card2Number,
                title: t.welcome.card2Title,
                text: t.welcome.card2Text,
                icon: Shield,
                to: '/crop-ai',
                color: 'text-flora-emerald',
                bg: 'bg-emerald-100',
              },
              {
                num: t.welcome.card3Number,
                title: t.welcome.card3Title,
                text: t.welcome.card3Text,
                icon: FlaskConical,
                to: '/fertilizer-ai',
                color: 'text-blue-500',
                bg: 'bg-blue-50',
              },
            ].map((card) => (
              <Link
                key={card.num}
                to={card.to}
                className="flora-card-hover p-7 flex flex-col gap-4 group"
              >
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center`}>
                    <card.icon size={22} className={card.color} />
                  </div>
                  <span className="text-4xl font-black text-flora-text/8 font-display">{card.num}</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-flora-forest mb-2 group-hover:text-flora-deep-emerald transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-sm text-flora-text/60 leading-relaxed">{card.text}</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-flora-emerald mt-auto">
                  Learn more <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-flora-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="section-tag inline-flex mb-4">
              <Zap size={13} className="text-flora-green" />
              Process
            </div>
            <h2 className="text-4xl font-black text-flora-text font-display">{t.howItWorks.heading}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorksSteps.map((step, i) => (
              <div key={step.num} className="relative">
                {i < howItWorksSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-emerald-200 to-transparent z-0" style={{ width: 'calc(100% - 3rem)', left: '3.5rem' }} />
                )}
                <div className="flora-card p-6 text-center flex flex-col items-center gap-4 relative z-10">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-flora-green`}>
                    <step.icon size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-flora-green mb-1">{step.num}</p>
                    <h3 className="text-lg font-bold text-flora-forest mb-2">{step.title}</h3>
                    <p className="text-sm text-flora-text/60">{step.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Modules CTA */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Disease AI card */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-flora-dark to-flora-forest p-8 text-white">
              <div className="absolute top-0 right-0 w-64 h-64 bg-flora-green/10 rounded-full blur-3xl" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-flora-green/20 border border-flora-green/30 flex items-center justify-center mb-6">
                  <Scan size={28} className="text-flora-green" />
                </div>
                <h3 className="text-2xl font-black mb-3 font-display">Disease AI</h3>
                <p className="text-white/60 text-sm leading-relaxed mb-6">
                  MobileNetV2 computer-vision model trained on 87,000+ PlantVillage images. Detects 38 disease classes across 14 crops.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {['MobileNetV2', 'PlantVillage', '38 Classes', 'TensorFlow'].map((t) => (
                    <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-flora-green/15 text-flora-green border border-flora-green/20">
                      {t}
                    </span>
                  ))}
                </div>
                <Link to="/crop-ai" className="btn-primary inline-flex items-center gap-2">
                  Try Disease AI <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Fertilizer AI card */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 to-flora-forest p-8 text-white">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-emerald-400/20 border border-emerald-400/30 flex items-center justify-center mb-6">
                  <FlaskConical size={28} className="text-emerald-300" />
                </div>
                <h3 className="text-2xl font-black mb-3 font-display">Fertilizer AI</h3>
                <p className="text-white/60 text-sm leading-relaxed mb-6">
                  Random Forest classifier trained on 10,000 agricultural samples. Recommends from 7 fertilizer classes based on soil and crop data.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {['Random Forest', 'Scikit-learn', '7 Fertilizers', '14 Features'].map((t) => (
                    <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-emerald-400/15 text-emerald-300 border border-emerald-400/20">
                      {t}
                    </span>
                  ))}
                </div>
                <Link to="/fertilizer-ai" className="btn-secondary inline-flex items-center gap-2 border-emerald-300 text-emerald-300 hover:bg-emerald-300/10">
                  Try Fertilizer AI <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology section */}
      <section className="py-20 bg-flora-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="section-tag inline-flex mb-4">
              <Cpu size={13} className="text-flora-green" />
              Technology
            </div>
            <h2 className="text-3xl font-black text-flora-text font-display">{t.about.tech}</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {techStack.map(({ label, category, icon: Icon }) => (
              <div key={label} className="flora-card-hover p-5 text-center flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-flora-green/10 flex items-center justify-center">
                  <Icon size={18} className="text-flora-green" />
                </div>
                <div>
                  <p className="text-sm font-bold text-flora-forest">{label}</p>
                  <p className="text-xs text-flora-text/50">{category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SIH / Mission section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="section-tag inline-flex mb-6">
            <Globe size={13} className="text-flora-green" />
            Our Mission
          </div>
          <h2 className="text-4xl font-black text-flora-text mb-6 font-display">
            Technology for Early Crop Health Decisions
          </h2>
          <p className="text-lg text-flora-text/60 leading-relaxed mb-8">
            {t.about.mission}
          </p>
          <div className="inline-flex items-start gap-3 text-left bg-flora-soft border border-emerald-200 rounded-2xl p-5 text-sm text-flora-forest/70 max-w-xl">
            <CheckCircle2 size={16} className="text-flora-green flex-shrink-0 mt-0.5" />
            <span>
              <strong className="text-flora-forest">PlantVillage dataset</strong> powers Disease Detection. 
              A separate <strong className="text-flora-forest">Fertilizer dataset</strong> powers Fertilizer Recommendation.
              These are independent AI modules.
            </span>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Home;

// FloraFarm — About Page
import React from 'react';
import { Scan, FlaskConical, Globe, Leaf, Shield, Brain, Cpu, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const About: React.FC = () => {
  const { t } = useLanguage();

  const features = [
    { icon: Scan, title: t.about.feature1, desc: 'MobileNetV2 computer-vision model trained on PlantVillage. Identifies 38 disease classes across 14 crop types.', color: 'text-flora-green', bg: 'bg-flora-green/10' },
    { icon: FlaskConical, title: t.about.feature2, desc: 'Random Forest classifier recommends from 7 fertilizer classes based on 14 soil and crop features.', color: 'text-blue-500', bg: 'bg-blue-50' },
    { icon: Globe, title: t.about.feature3, desc: 'Full English and Tamil language support. Switch languages without page refresh.', color: 'text-flora-emerald', bg: 'bg-emerald-100' },
  ];

  const techStack = [
    { group: 'Disease AI', items: ['MobileNetV2', 'PlantVillage', 'TensorFlow / Keras', '38 Disease Classes', '224×224 Input'] },
    { group: 'Fertilizer AI', items: ['Random Forest', 'Scikit-learn', '7 Fertilizer Classes', '10,000 Samples', '14 Features'] },
    { group: 'Backend', items: ['Python', 'FastAPI', 'Uvicorn', 'Pydantic', 'Pillow'] },
    { group: 'Frontend', items: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Recharts'] },
  ];

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-flora-bg">
        {/* Hero */}
        <section className="bg-gradient-to-br from-flora-dark to-flora-forest py-24 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-flora-green"
                style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, opacity: Math.random() }}
              />
            ))}
          </div>
          <div className="relative max-w-4xl mx-auto px-4">
            <div className="section-tag inline-flex bg-flora-green/20 text-flora-green border-flora-green/30 mb-6">
              <Leaf size={13} />
              About FloraFarm
            </div>
            <h1 className="text-5xl font-black mb-6 font-display leading-tight">
              {t.about.heading}
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed mb-6">
              {t.about.description}
            </p>
            <p className="text-2xl font-bold text-flora-green italic">{t.about.tagline}</p>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-flora-text font-display">Core Capabilities</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((f) => (
                <div key={f.title} className="flora-card-hover p-7">
                  <div className={`w-14 h-14 rounded-2xl ${f.bg} flex items-center justify-center mb-5`}>
                    <f.icon size={26} className={f.color} />
                  </div>
                  <h3 className="text-lg font-bold text-flora-forest mb-3">{f.title}</h3>
                  <p className="text-sm text-flora-text/60 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Architecture */}
        <section className="py-20 bg-flora-soft">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="section-tag inline-flex mb-4">
                <Brain size={13} className="text-flora-green" />
                Architecture
              </div>
              <h2 className="text-3xl font-black text-flora-text font-display">Two Independent AI Modules</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flora-card p-6 border-t-4 border-t-flora-green">
                <h3 className="font-bold text-flora-forest mb-4 flex items-center gap-2">
                  <Scan size={18} className="text-flora-green" />
                  Disease AI Pipeline
                </h3>
                <div className="space-y-2">
                  {['Crop Image Upload', 'Resize → 224×224px', 'MobileNetV2 preprocess_input', 'Model Inference', 'Top-3 Predictions', 'Severity Classification'].map((step, i) => (
                    <div key={step} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-flora-green/20 flex items-center justify-center text-xs font-bold text-flora-green flex-shrink-0">{i + 1}</div>
                      <span className="text-sm text-flora-text/70">{step}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-emerald-100">
                  <p className="text-xs text-flora-text/50">Dataset: PlantVillage | Classes: 38 | Model: MobileNetV2</p>
                </div>
              </div>

              <div className="flora-card p-6 border-t-4 border-t-blue-400">
                <h3 className="font-bold text-flora-forest mb-4 flex items-center gap-2">
                  <FlaskConical size={18} className="text-blue-500" />
                  Fertilizer AI Pipeline
                </h3>
                <div className="space-y-2">
                  {['14 Soil & Crop Features', 'Categorical Encoding', 'Random Forest Inference', 'Class Probabilities', 'Top-3 Recommendations', 'Organic/Inorganic Tag'].map((step, i) => (
                    <div key={step} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600 flex-shrink-0">{i + 1}</div>
                      <span className="text-sm text-flora-text/70">{step}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-emerald-100">
                  <p className="text-xs text-flora-text/50">Dataset: Fertilizer Dataset | Classes: 7 | Model: Random Forest</p>
                </div>
              </div>
            </div>

            <div className="flora-card p-5 flex items-start gap-3">
              <CheckCircle2 size={16} className="text-flora-green flex-shrink-0 mt-0.5" />
              <p className="text-sm text-flora-forest/70">
                Disease AI and Fertilizer AI are completely independent models. The disease classification does not automatically determine the fertilizer recommendation — they are combined only in the farmer advisory view.
              </p>
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="section-tag inline-flex mb-4">
                <Cpu size={13} className="text-flora-green" />
                Technology
              </div>
              <h2 className="text-3xl font-black text-flora-text font-display">{t.about.tech}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {techStack.map(({ group, items }) => (
                <div key={group} className="flora-card p-5">
                  <h3 className="text-sm font-bold text-flora-forest mb-3 pb-2 border-b border-emerald-100">{group}</h3>
                  <ul className="space-y-2">
                    {items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-xs text-flora-text/70">
                        <div className="w-1.5 h-1.5 rounded-full bg-flora-green flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20 bg-flora-soft">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-black text-flora-text mb-6 font-display">Our Mission</h2>
            <p className="text-lg text-flora-text/60 leading-relaxed mb-8">{t.about.mission}</p>
            <div className="inline-flex items-center gap-3 bg-flora-green/10 border border-flora-green/30 rounded-2xl p-5">
              <Shield size={20} className="text-flora-green flex-shrink-0" />
              <p className="text-sm text-flora-forest text-left">
                FloraFarm is a decision-support tool. AI-generated results should always be verified with qualified agricultural professionals before taking significant crop management actions.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default About;

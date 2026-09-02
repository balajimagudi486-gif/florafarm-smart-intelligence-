// FloraFarm — How It Works Page
import React from 'react';
import { Upload, Brain, Eye, Droplets } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const HowItWorks: React.FC = () => {
  const { t } = useLanguage();

  const steps = [
    { num: '01', icon: Upload, title: t.howItWorks.step1Title, text: t.howItWorks.step1Text, color: 'from-emerald-400 to-FloraFarm-green' },
    { num: '02', icon: Brain, title: t.howItWorks.step2Title, text: t.howItWorks.step2Text, color: 'from-FloraFarm-green to-emerald-500' },
    { num: '03', icon: Eye, title: t.howItWorks.step3Title, text: t.howItWorks.step3Text, color: 'from-emerald-500 to-teal-500' },
    { num: '04', icon: Droplets, title: t.howItWorks.step4Title, text: t.howItWorks.step4Text, color: 'from-teal-500 to-FloraFarm-deep-emerald' },
  ];

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-FloraFarm-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-14">
            <div className="section-tag inline-flex mb-4">How It Works</div>
            <h1 className="text-4xl font-black text-FloraFarm-text mb-4 font-display">{t.howItWorks.heading}</h1>
          </div>

          <div className="space-y-8">
            {steps.map((step) => (
              <div key={step.num} className="FloraFarm-card p-8 flex items-start gap-6 hover:shadow-FloraFarm transition-shadow">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center flex-shrink-0 shadow-FloraFarm-green`}>
                  <step.icon size={28} className="text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-FloraFarm-green mb-1">STEP {step.num}</p>
                  <h2 className="text-2xl font-bold text-FloraFarm-forest mb-2">{step.title}</h2>
                  <p className="text-FloraFarm-text/60 leading-relaxed">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default HowItWorks;

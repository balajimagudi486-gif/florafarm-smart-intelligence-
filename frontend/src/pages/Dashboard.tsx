// FloraFarm — Dashboard Page
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Scan, Leaf, AlertTriangle, FlaskConical, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useLanguage } from '../context/LanguageContext';
import type { AnalysisRecord } from '../types';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const DEMO_HISTORY: AnalysisRecord[] = [
  { id: '1', date: '2026-08-29T09:00:00Z', crop: 'Tomato', disease: 'Early Blight', diseaseConfidence: 96.4, severity: 'Moderate', fertilizer: 'Urea', fertilizerType: 'Inorganic', fertilizerConfidence: 82.4, is_demo: true },
  { id: '2', date: '2026-08-28T12:00:00Z', crop: 'Potato', disease: 'Late Blight', diseaseConfidence: 94.2, severity: 'High', fertilizer: 'MOP', fertilizerType: 'Inorganic', fertilizerConfidence: 75.1, is_demo: true },
  { id: '3', date: '2026-08-27T15:00:00Z', crop: 'Apple', disease: 'Healthy', diseaseConfidence: 98.1, severity: 'Healthy', is_demo: true },
  { id: '4', date: '2026-08-26T08:00:00Z', crop: 'Corn (maize)', disease: 'Common Rust', diseaseConfidence: 87.3, severity: 'Low', fertilizer: 'NPK', fertilizerType: 'Inorganic', fertilizerConfidence: 68.9, is_demo: true },
  { id: '5', date: '2026-08-25T11:00:00Z', crop: 'Tomato', disease: 'Healthy', diseaseConfidence: 97.0, severity: 'Healthy', is_demo: true },
];

const PIE_COLORS = ['#10B981', '#39FF88', '#047857', '#064E3B'];

const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const [history, setHistory] = useState<AnalysisRecord[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('flora_history') || '[]') as AnalysisRecord[];
    setHistory(stored.length > 0 ? stored : DEMO_HISTORY);
  }, []);

  const totalAnalyses = history.length;
  const healthyCrops = history.filter((r) => r.severity === 'Healthy').length;
  const attentionCrops = totalAnalyses - healthyCrops;
  const fertilizerRecs = history.filter((r) => r.fertilizer).length;

  // Crop distribution for pie
  const cropCounts: Record<string, number> = {};
  history.forEach((r) => {
    cropCounts[r.crop] = (cropCounts[r.crop] || 0) + 1;
  });
  const pieData = Object.entries(cropCounts).map(([name, value]) => ({ name, value }));

  const stats = [
    { label: t.dashboard.totalAnalyses, value: totalAnalyses, icon: Scan, color: 'text-flora-green', bg: 'bg-flora-green/10' },
    { label: t.dashboard.healthyCrops, value: healthyCrops, icon: Leaf, color: 'text-flora-emerald', bg: 'bg-emerald-100' },
    { label: t.dashboard.attentionCrops, value: attentionCrops, icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: t.dashboard.fertilizerRecs, value: fertilizerRecs, icon: FlaskConical, color: 'text-blue-500', bg: 'bg-blue-50' },
  ];

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-flora-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
            <div>
              <div className="section-tag inline-flex mb-2">
                <TrendingUp size={13} className="text-flora-green" />
                Intelligence Dashboard
              </div>
              <h1 className="text-4xl font-black text-flora-text font-display">{t.dashboard.heading}</h1>
            </div>
            <Link to="/crop-ai" className="btn-primary flex items-center gap-2">
              <Scan size={16} />
              {t.nav.analyzeCrop}
            </Link>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {stats.map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="stat-card">
                <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}>
                  <Icon size={22} className={color} />
                </div>
                <div>
                  <p className="text-3xl font-black text-flora-forest">{value}</p>
                  <p className="text-sm text-flora-text/60">{label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            {/* Crop distribution chart */}
            <div className="flora-card p-6">
              <h2 className="text-base font-semibold text-flora-forest mb-4">Crop Distribution</h2>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: 'white', border: '1px solid #D1FAE5', borderRadius: '0.75rem', fontSize: '0.75rem' }}
                    />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: '0.75rem' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-flora-text/40 text-sm py-10">{t.dashboard.noHistory}</p>
              )}
            </div>

            {/* Recent analyses */}
            <div className="flora-card p-6 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-flora-forest">{t.dashboard.recentAnalyses}</h2>
                <Link to="/history" className="text-xs font-semibold text-flora-emerald hover:text-flora-deep-emerald flex items-center gap-1">
                  View all <ArrowRight size={11} />
                </Link>
              </div>

              {history.length === 0 ? (
                <p className="text-center text-flora-text/40 text-sm py-8">{t.dashboard.noHistory}</p>
              ) : (
                <div className="space-y-3">
                  {history.slice(0, 5).map((record) => (
                    <div key={record.id} className="flex items-center gap-4 p-3 rounded-xl bg-flora-soft hover:bg-flora-light transition-colors">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        record.severity === 'Healthy' ? 'bg-emerald-100' : 'bg-amber-50'
                      }`}>
                        {record.severity === 'Healthy'
                          ? <Leaf size={18} className="text-flora-emerald" />
                          : <AlertTriangle size={18} className="text-amber-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-flora-forest">{record.crop}</span>
                          <span className="text-xs text-flora-text/50">—</span>
                          <span className="text-xs text-flora-text/70 truncate">{record.disease}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-xs text-flora-text/50 flex items-center gap-1">
                            <Clock size={10} />
                            {new Date(record.date).toLocaleDateString()}
                          </span>
                          <span className="text-xs font-medium text-flora-green">
                            {record.diseaseConfidence.toFixed(1)}%
                          </span>
                          {record.fertilizer && (
                            <span className="text-xs text-blue-500">{record.fertilizer}</span>
                          )}
                        </div>
                      </div>
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        record.severity === 'Healthy' ? 'bg-flora-green' :
                        record.severity === 'Low' ? 'bg-yellow-400' :
                        record.severity === 'Moderate' ? 'bg-orange-400' : 'bg-red-400'
                      }`} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Demo notice if history came from demo data */}
          {history[0]?.is_demo && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700 flex items-center gap-2">
              ℹ️ Showing sample data. Your actual analyses will appear here after you use the Crop AI.
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Dashboard;

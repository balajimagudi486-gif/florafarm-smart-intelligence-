// FloraFarm — History Page
import React, { useEffect, useState, useMemo } from 'react';
import { Search, Trash2, Clock, FlaskConical } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import type { AnalysisRecord } from '../types';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

type FilterType = 'all' | 'healthy' | 'disease';
type SortType = 'date' | 'confidence' | 'crop';

const DEMO_HISTORY: AnalysisRecord[] = [
  { id: '1', date: '2026-08-29T09:00:00Z', crop: 'Tomato', disease: 'Early Blight', diseaseConfidence: 96.4, severity: 'Moderate', fertilizer: 'Urea', fertilizerType: 'Inorganic', fertilizerConfidence: 82.4, is_demo: true },
  { id: '2', date: '2026-08-28T12:00:00Z', crop: 'Potato', disease: 'Late Blight', diseaseConfidence: 94.2, severity: 'High', fertilizer: 'MOP', fertilizerType: 'Inorganic', fertilizerConfidence: 75.1, is_demo: true },
  { id: '3', date: '2026-08-27T15:00:00Z', crop: 'Apple', disease: 'Healthy', diseaseConfidence: 98.1, severity: 'Healthy', is_demo: true },
  { id: '4', date: '2026-08-26T08:00:00Z', crop: 'Corn (maize)', disease: 'Common Rust', diseaseConfidence: 87.3, severity: 'Low', fertilizer: 'NPK', fertilizerType: 'Inorganic', fertilizerConfidence: 68.9, is_demo: true },
  { id: '5', date: '2026-08-25T11:00:00Z', crop: 'Tomato', disease: 'Healthy', diseaseConfidence: 97.0, severity: 'Healthy', is_demo: true },
];

const SeverityBadge: React.FC<{ severity: string }> = ({ severity }) => {
  const classes: Record<string, string> = {
    Healthy: 'badge-healthy',
    Low: 'badge-low',
    Moderate: 'badge-moderate',
    High: 'badge-high',
  };
  return <span className={`text-xs ${classes[severity] || 'badge-moderate'}`}>{severity}</span>;
};

const History: React.FC = () => {
  const { t } = useLanguage();
  const [history, setHistory] = useState<AnalysisRecord[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('date');

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('flora_history') || '[]') as AnalysisRecord[];
    setHistory(stored.length > 0 ? stored : DEMO_HISTORY);
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('flora_history');
    setHistory([]);
  };

  const filtered = useMemo(() => {
    let result = [...history];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) => r.crop.toLowerCase().includes(q) || r.disease.toLowerCase().includes(q)
      );
    }

    if (filter === 'healthy') result = result.filter((r) => r.severity === 'Healthy');
    if (filter === 'disease') result = result.filter((r) => r.severity !== 'Healthy');

    if (sort === 'date') result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (sort === 'confidence') result.sort((a, b) => b.diseaseConfidence - a.diseaseConfidence);
    if (sort === 'crop') result.sort((a, b) => a.crop.localeCompare(b.crop));

    return result;
  }, [history, search, filter, sort]);

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-flora-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
            <div>
              <div className="section-tag inline-flex mb-2">
                <Clock size={13} className="text-flora-green" />
                Records
              </div>
              <h1 className="text-4xl font-black text-flora-text font-display">{t.history.heading}</h1>
            </div>
            {history.length > 0 && !history[0]?.is_demo && (
              <button onClick={clearHistory} className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 border border-red-200 hover:border-red-300 px-4 py-2 rounded-xl transition-all">
                <Trash2 size={14} />
                {t.history.clearHistory}
              </button>
            )}
          </div>

          {/* Filters & Search */}
          <div className="flora-card p-4 mb-6 flex flex-col sm:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-flora-emerald" />
              <input
                type="text"
                placeholder={t.history.searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flora-input pl-9"
                aria-label="Search history"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex gap-2 flex-shrink-0">
              {(['all', 'healthy', 'disease'] as FilterType[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    filter === f
                      ? 'bg-flora-green text-flora-dark'
                      : 'bg-flora-soft text-flora-forest hover:bg-flora-light border border-emerald-200'
                  }`}
                >
                  {f === 'all' ? t.history.filterAll : f === 'healthy' ? t.history.filterHealthy : t.history.filterDisease}
                </button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortType)}
              className="flora-select w-auto text-xs py-2"
              aria-label="Sort history"
            >
              <option value="date">Sort: Date</option>
              <option value="confidence">Sort: Confidence</option>
              <option value="crop">Sort: Crop</option>
            </select>
          </div>

          {/* History table */}
          {filtered.length === 0 ? (
            <div className="flora-card p-16 text-center">
              <p className="text-flora-text/40 text-sm">{t.history.noResults}</p>
            </div>
          ) : (
            <div className="flora-card overflow-hidden">
              {/* Desktop table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm" role="table">
                  <thead className="bg-flora-soft border-b border-emerald-100">
                    <tr>
                      {[t.history.date, t.history.crop, t.history.disease, t.history.confidence, t.history.fertilizer, t.history.status].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-flora-text/60 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-50">
                    {filtered.map((record) => (
                      <tr key={record.id} className="hover:bg-flora-soft transition-colors">
                        <td className="px-4 py-3 text-xs text-flora-text/60 whitespace-nowrap">
                          {new Date(record.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 font-semibold text-flora-forest">{record.crop}</td>
                        <td className="px-4 py-3 text-flora-text/70">{record.disease}</td>
                        <td className="px-4 py-3 font-bold text-flora-green">{record.diseaseConfidence.toFixed(1)}%</td>
                        <td className="px-4 py-3">
                          {record.fertilizer ? (
                            <div className="flex items-center gap-1.5">
                              <FlaskConical size={12} className="text-blue-400" />
                              <span className="text-xs font-medium">{record.fertilizer}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-flora-text/30">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <SeverityBadge severity={record.severity} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="sm:hidden divide-y divide-emerald-50">
                {filtered.map((record) => (
                  <div key={record.id} className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-flora-forest">{record.crop}</span>
                      <SeverityBadge severity={record.severity} />
                    </div>
                    <p className="text-sm text-flora-text/70">{record.disease}</p>
                    <div className="flex items-center gap-4 text-xs text-flora-text/50">
                      <span>{new Date(record.date).toLocaleDateString()}</span>
                      <span className="font-bold text-flora-green">{record.diseaseConfidence.toFixed(1)}%</span>
                      {record.fertilizer && <span className="text-blue-500">{record.fertilizer}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {history[0]?.is_demo && (
            <p className="text-center text-xs text-flora-text/40 mt-4">ℹ️ Showing sample data.</p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default History;

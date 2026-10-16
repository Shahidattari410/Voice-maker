import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronRight,
  ChevronDown,
  Heart,
  BookOpen,
  Search,
  Bookmark,
  Share2,
} from 'lucide-react';
import { usePrayer } from '../context/PrayerContext';
import { QA_CATEGORIES } from '../data/prayerData';

export const QuestionsAnswers: React.FC = () => {
  const { setActiveTab } = usePrayer();

  const [expandedId, setExpandedId] = useState<string | null>('qa_1');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeTabFilter, setActiveTabFilter] = useState<'all' | 'favorites'>('all');

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] pb-24 text-right">
      {/* Red Header (Exact match to screenshots 6 & 7) */}
      <div className="bg-[#b91c1c] text-white px-4 py-3 flex items-center justify-between shadow-md">
        <button
          onClick={() => setActiveTab('home')}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
        >
          <ChevronRight className="w-5 h-5 rtl:rotate-0" />
        </button>

        <h1 className="text-xl font-bold font-sans">
          Question and Answer
        </h1>

        <div className="w-8" />
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="شرعی مسئلہ تلاش کریں..."
            className="w-full bg-white rounded-xl py-2 pr-9 pl-3 text-xs border border-slate-200 focus:outline-none focus:border-red-600 shadow-2xs"
          />
        </div>

        {/* Categories and Accordion Items (Exact match to screenshot 7) */}
        <div className="space-y-4">
          {QA_CATEGORIES.map((cat, catIdx) => {
            const items = cat.items.filter((item) => {
              if (activeTabFilter === 'favorites' && !favorites.includes(item.id)) return false;
              if (searchQuery.trim()) {
                const matchTitle = item.title.toLowerCase().includes(searchQuery.toLowerCase());
                const matchAns = item.answer.toLowerCase().includes(searchQuery.toLowerCase());
                return matchTitle || matchAns;
              }
              return true;
            });

            if (items.length === 0) return null;

            return (
              <div key={catIdx} className="space-y-2">
                {/* Red/Coral Category Banner (Exact match to screenshot 7) */}
                <div className="bg-[#e11d48] text-white py-2 px-4 rounded-2xl text-center shadow-xs">
                  <h3 className="text-sm font-bold urdu-title">
                    {cat.category}
                  </h3>
                </div>

                {/* Gray Pill Accordion Rows */}
                <div className="space-y-2">
                  {items.map((item) => {
                    const isExpanded = expandedId === item.id;
                    const isFav = favorites.includes(item.id);

                    return (
                      <div
                        key={item.id}
                        className="bg-[#e2e8f0] rounded-2xl overflow-hidden transition-all shadow-2xs"
                      >
                        {/* Header Row */}
                        <div
                          onClick={() => toggleExpand(item.id)}
                          className="py-3 px-4 flex items-center justify-between cursor-pointer hover:bg-[#cbd5e1] transition-colors"
                        >
                          {/* Chevron Icon in Circle on left */}
                          <div className="w-6 h-6 rounded-full bg-white/70 flex items-center justify-center shrink-0">
                            <ChevronDown
                              className={`w-4 h-4 text-rose-600 transition-transform ${
                                isExpanded ? 'rotate-180' : ''
                              }`}
                            />
                          </div>

                          {/* Title */}
                          <div className="flex-1 pr-3 text-right">
                            <span className="text-xs md:text-sm font-bold text-slate-800 urdu-title">
                              {item.title}
                            </span>
                          </div>

                          {/* Fav heart */}
                          <button
                            onClick={(e) => toggleFavorite(item.id, e)}
                            className="p-1 text-slate-400 hover:text-rose-600"
                          >
                            <Heart
                              className={`w-4 h-4 ${
                                isFav ? 'fill-rose-600 text-rose-600' : ''
                              }`}
                            />
                          </button>
                        </div>

                        {/* Expanded Answer Content */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="px-4 pb-4 pt-1 bg-white border-t border-slate-200 text-right space-y-2"
                            >
                              <p className="text-xs text-slate-800 leading-relaxed font-urdu pt-2">
                                {item.answer}
                              </p>
                              {item.reference && (
                                <div className="text-[11px] text-emerald-700 font-bold bg-emerald-50 p-2 rounded-lg">
                                  حوالہ: {item.reference}
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Bar: Favorite & Resume (Exact match to screenshots 6 & 7) */}
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-200 p-2 flex items-center justify-around z-30 shadow-lg">
          <button
            onClick={() => setActiveTabFilter(activeTabFilter === 'favorites' ? 'all' : 'favorites')}
            className={`flex flex-col items-center gap-1 text-xs font-bold cursor-pointer ${
              activeTabFilter === 'favorites' ? 'text-rose-600' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Heart className={`w-5 h-5 ${activeTabFilter === 'favorites' ? 'fill-rose-600' : ''}`} />
            <span>Favorite ({favorites.length})</span>
          </button>

          <button
            onClick={() => setExpandedId('qa_1')}
            className="flex flex-col items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <span>Resume</span>
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Palette } from 'lucide-react';
import { usePrayer, PrayerThemeId } from '../context/PrayerContext';

export const ThemeModal: React.FC = () => {
  const {
    isThemeModalOpen,
    setIsThemeModalOpen,
    prayerTheme,
    setPrayerTheme,
    darkMode,
    setDarkMode,
  } = usePrayer();

  const themes: { id: PrayerThemeId; name: string; color: string; desc: string }[] = [
    {
      id: 'midnight-mosque',
      name: 'مسجد نبوی نائٹ (سلیٹ و نیوی)',
      color: '#1e293b',
      desc: 'رات کے وقت کا پرسکون منظر',
    },
    {
      id: 'madani-green',
      name: 'گنبدِ خضراء زمردی (مدنی سبز)',
      color: '#065f46',
      desc: 'خالص روحانی سبز و منور تھیم',
    },
    {
      id: 'royal-burgundy',
      name: 'شاہی عنابی و سرخ (Classic Red)',
      color: '#991b1b',
      desc: 'دعوت اسلامی ایپس کا مخصوص سرخ رنگ',
    },
    {
      id: 'golden-kaaba',
      name: 'سنہری کعبہ شریف (گولڈ و سیاہ)',
      color: '#d97706',
      desc: 'سنہری غلافِ کعبہ اور وقار',
    },
    {
      id: 'ocean-teal',
      name: 'پرسکون فیروزی و بحری',
      color: '#0f766e',
      desc: 'تازہ اور جدید فیروزی رنگ',
    },
  ];

  return (
    <AnimatePresence>
      {isThemeModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 text-right"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-[#b91c1c] text-white px-4 py-3 flex items-center justify-between">
              <button
                onClick={() => setIsThemeModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <h3 className="text-base font-bold urdu-title">
                اوقاتِ صلاۃ تھیم کلرز
              </h3>
            </div>

            <div className="p-4 space-y-4">
              {/* Dark mode quick switch */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                    darkMode ? 'bg-indigo-600 text-white' : 'bg-slate-300 text-slate-700'
                  }`}
                >
                  {darkMode ? 'فعال ہے' : 'غیر فعال'}
                </button>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-900">سیاہ تھیم (ڈارک موڈ)</span>
                  <p className="text-[10px] text-slate-500">رات کے وقت آنکھوں کے آرام کے لیے</p>
                </div>
              </div>

              {/* Theme Colors List */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700">تھیم کے رنگ:</div>
                {themes.map((t) => {
                  const isSelected = prayerTheme === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setPrayerTheme(t.id)}
                      className={`w-full p-3 rounded-xl border text-right flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/50'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-white"
                          style={{ backgroundColor: t.color }}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                      <div className="pr-2">
                        <div className="text-xs font-bold text-slate-900">{t.name}</div>
                        <div className="text-[10px] text-slate-500">{t.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setIsThemeModalOpen(false)}
                className="py-1.5 px-4 bg-slate-900 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                محفوظ اور بند کریں
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

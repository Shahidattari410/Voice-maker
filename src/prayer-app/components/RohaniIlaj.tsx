import React, { useState } from 'react';
import { ChevronRight, Heart, Sparkles, BookOpen } from 'lucide-react';
import { usePrayer } from '../context/PrayerContext';
import { ROHANI_ILAJ_ITEMS } from '../data/prayerData';

export const RohaniIlaj: React.FC = () => {
  const { setActiveTab } = usePrayer();
  const [selectedItem, setSelectedItem] = useState(ROHANI_ILAJ_ITEMS[0]);

  return (
    <div className="min-h-screen bg-[#faf8f5] pb-24 text-right">
      {/* Header */}
      <div className="bg-[#b91c1c] text-white px-4 py-3 flex items-center justify-between shadow-md">
        <button
          onClick={() => setActiveTab('home')}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
        >
          <ChevronRight className="w-5 h-5 rtl:rotate-0" />
        </button>

        <h1 className="text-xl font-bold urdu-title">
          روحانی علاج و مسنون دعائیں
        </h1>

        <div className="w-8" />
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Banner */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-emerald-800 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>بیماریوں اور پریشانیوں کے قرآنی و مسنون اوراد</span>
          </div>
          <p className="text-xs text-slate-600 font-urdu">
            امیرِ اہلِ سنت کے رسالے "روحانی علاج" سے ماخوذ مجرب اوراد
          </p>
        </div>

        {/* List of Duas */}
        <div className="space-y-3">
          {ROHANI_ILAJ_ITEMS.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs text-right space-y-2 hover:border-emerald-500 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  روحانی نسخہ
                </span>
                <h3 className="text-sm font-bold text-slate-900 urdu-title">
                  {item.disease}
                </h3>
              </div>

              {/* Arabic Dua */}
              <div
                className="bg-slate-50 p-3 rounded-xl text-center font-serif text-base font-bold text-slate-900 leading-loose border border-slate-100"
                dir="rtl"
              >
                {item.dua}
              </div>

              {/* Method */}
              <div className="text-xs text-slate-600 font-urdu leading-relaxed">
                <strong className="text-emerald-700">طریقۂ عمل:</strong> {item.method}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

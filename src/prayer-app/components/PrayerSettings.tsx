import React from 'react';
import {
  ChevronRight,
  ChevronLeft,
  Calculator,
  Bell,
  Hourglass,
  BookMarked,
  Moon,
  Check,
} from 'lucide-react';
import { usePrayer } from '../context/PrayerContext';

export const PrayerSettings: React.FC = () => {
  const {
    setActiveTab,
    fiqh,
    setFiqh,
    darkMode,
    setDarkMode,
  } = usePrayer();

  return (
    <div className="min-h-screen bg-[#faf8f5] pb-24 text-right">
      {/* Red Header (Exact match to screenshot 4) */}
      <div className="bg-[#b91c1c] text-white px-4 py-3 flex items-center justify-between shadow-md">
        <button
          onClick={() => setActiveTab('home')}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
        >
          <ChevronRight className="w-5 h-5 rtl:rotate-0" />
        </button>

        <h1 className="text-xl font-bold urdu-title">
          ترتیب
        </h1>

        <div className="w-8" />
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Settings List Items (Exact match to screenshot 4) */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100 shadow-xs">
          {/* 1. Fiqh Calculation Method */}
          <div
            onClick={() => setFiqh(fiqh === 'hanafi' ? 'shafii' : 'hanafi')}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-slate-400 rtl:rotate-0" />

            <div className="flex-1 pr-3">
              <span className="text-sm font-bold text-slate-900 urdu-title">
                نماز کے اوقات فقہ کے حساب سے
              </span>
              <div className="text-xs text-rose-600 font-bold mt-0.5">
                فقہ: {fiqh === 'hanafi' ? 'حنفی' : 'شافعی / دیگر'} (کلک کر کے تبدیل کریں)
              </div>
            </div>

            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <Calculator className="w-4 h-4" />
            </div>
          </div>

          {/* 2. Notification Alarm */}
          <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors">
            <ChevronLeft className="w-5 h-5 text-slate-400 rtl:rotate-0" />

            <div className="flex-1 pr-3">
              <span className="text-sm font-bold text-slate-900 urdu-title">
                نوٹیفیکیشن الارم
              </span>
              <div className="text-xs text-rose-600 font-bold mt-0.5">
                اوقاتِ صلاۃ کی ابتدا
              </div>
            </div>

            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4" />
            </div>
          </div>

          {/* 3. End Time Notifications */}
          <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors">
            <ChevronLeft className="w-5 h-5 text-slate-400 rtl:rotate-0" />

            <div className="flex-1 pr-3">
              <span className="text-sm font-bold text-slate-900 urdu-title">
                نماز کے اوقات کا اختتام
              </span>
              <div className="text-xs text-rose-600 font-bold mt-0.5">
                نوٹیفیکیشن
              </div>
            </div>

            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Hourglass className="w-4 h-4" />
            </div>
          </div>

          {/* 4. Surah Mulk Notification */}
          <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors">
            <ChevronLeft className="w-5 h-5 text-slate-400 rtl:rotate-0" />

            <div className="flex-1 pr-3">
              <span className="text-sm font-bold text-slate-900 urdu-title">
                سورہ ملک
              </span>
              <div className="text-xs text-rose-600 font-bold mt-0.5">
                نوٹیفیکیشن
              </div>
            </div>

            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <BookMarked className="w-4 h-4" />
            </div>
          </div>

          {/* 5. Dark Mode Toggle */}
          <div
            onClick={() => setDarkMode(!darkMode)}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-slate-400 rtl:rotate-0" />

            <div className="flex-1 pr-3">
              <span className="text-sm font-bold text-slate-900 urdu-title">
                اپنی سیاہ تھیم کو فعال کریں
              </span>
              <div className="text-xs text-rose-600 font-bold mt-0.5">
                {darkMode ? 'ڈارک موڈ آن ہے' : 'ڈارک موڈ'}
              </div>
            </div>

            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Moon className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

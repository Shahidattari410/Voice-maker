import React, { useState } from 'react';
import {
  ChevronRight,
  Pencil,
  Heart,
  RotateCcw,
  Sparkles,
  Check,
  Award,
} from 'lucide-react';
import { usePrayer } from '../context/PrayerContext';
import { toUrduNumber } from '../../utils/date';

export const DuroodTracker: React.FC = () => {
  const {
    setActiveTab,
    duroodCount,
    incrementDurood,
    resetDuroodToday,
    duroodTarget,
    setDuroodTarget,
  } = usePrayer();

  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [userName, setUserName] = useState('Attari qadri 848');
  const [isEditingName, setIsEditingName] = useState(false);

  const weekDays = [
    { day: 'منگل', num: '6', done: true },
    { day: 'بدھ', num: '7', done: true },
    { day: 'جمعرات', num: '8', done: true },
    { day: 'جمعہ', num: '9', done: true },
    { day: 'ہفتہ', num: '10', done: true },
    { day: 'اتوار', num: '11', done: true },
    { day: 'پیر', num: '12', active: true, done: duroodCount >= duroodTarget },
  ];

  return (
    <div className="min-h-screen bg-[#faf8f5] pb-24 text-right">
      {/* Header (Exact match to screenshot 10) */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-xs">
        <button
          onClick={() => setActiveTab('home')}
          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 cursor-pointer"
        >
          <ChevronRight className="w-5 h-5 rtl:rotate-0" />
        </button>

        <h1 className="text-lg font-bold text-slate-900 urdu-title">
          درود شریف
        </h1>

        {/* Profile Circle with 'A' */}
        <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
          A
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Top Target Card (Exact match to screenshot 10) */}
        <div className="bg-sky-50/70 border border-sky-100 rounded-2xl p-4 space-y-2">
          {/* User Name & Target */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-sky-700 font-bold">
              <button
                onClick={() => setIsEditingTarget(!isEditingTarget)}
                className="hover:underline flex items-center gap-0.5"
              >
                <Pencil className="w-3 h-3" />
                <span>تبدیل</span>
              </button>
              <span>کم سے کم</span>
            </div>

            <div className="flex items-center gap-1 font-bold text-slate-900">
              {isEditingName ? (
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  onBlur={() => setIsEditingName(false)}
                  autoFocus
                  className="bg-white text-xs px-2 py-0.5 rounded border border-sky-300"
                />
              ) : (
                <span
                  onClick={() => setIsEditingName(true)}
                  className="cursor-pointer hover:underline"
                >
                  {userName}
                </span>
              )}
            </div>
          </div>

          <div className="text-xs text-slate-600">
            {isEditingTarget ? (
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="number"
                  value={duroodTarget}
                  onChange={(e) => setDuroodTarget(Number(e.target.value) || 100)}
                  className="w-20 bg-white border border-slate-300 rounded px-2 py-1 text-xs"
                />
                <button
                  onClick={() => setIsEditingTarget(false)}
                  className="px-2 py-1 bg-sky-600 text-white rounded text-xs"
                >
                  محفوظ
                </button>
              </div>
            ) : (
              <span>{toUrduNumber(duroodTarget)} مرتبہ / روزانہ</span>
            )}
          </div>

          <div className="text-[11px] text-slate-500 flex items-center gap-1 justify-end">
            <span>یاد دہانی: فجر سے ۱۰ منٹ پہلے</span>
            <span className="text-sky-600">✎</span>
          </div>

          {/* Arabic Durood Text */}
          <div className="pt-2 border-t border-sky-100/80 text-center font-serif text-lg font-bold text-slate-900 leading-loose" dir="rtl">
            اَللّٰھُمَّ صَلِّ عَلٰی سَیِّدِنَا مُحَمَّدٍ
          </div>
        </div>

        {/* Days Row (منگل 6، بدھ 7، جمعرات 8، جمعہ 9، ہفتہ 10، اتوار 11، پیر 12) */}
        <div className="flex items-center justify-between gap-1 text-center">
          {weekDays.map((w, idx) => (
            <div
              key={idx}
              className={`flex-1 py-2 px-1 rounded-xl flex flex-col items-center justify-center transition-all ${
                w.active
                  ? 'border-2 border-slate-900 bg-white shadow-xs'
                  : 'bg-white/60 border border-slate-200'
              }`}
            >
              <span className="text-[10px] font-bold text-slate-600">{w.day}</span>
              <span className="text-xs font-bold text-slate-900 mt-0.5">{toUrduNumber(w.num)}</span>
              {w.done ? (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1" />
              )}
            </div>
          ))}
        </div>

        {/* Main Recitation Card with Emerald Gradient (Exact match to screenshot 10) */}
        <div className="bg-gradient-to-b from-[#0b3b2c] via-[#042f2c] to-[#02231c] text-white rounded-3xl p-6 text-center space-y-4 shadow-xl">
          <div className="text-sm font-semibold tracking-wide text-emerald-200 font-serif">
            اَلسَّلَامُ عَلَیْکُمْ وَرَحْمَۃُ اللہِ وَبَرَکَاتُہ
          </div>

          <div className="text-base md:text-lg font-bold leading-relaxed urdu-title">
            آپ کے روزانہ کے ہدف کے مطابق آج آپ نے {toUrduNumber(duroodTarget)} مرتبہ درود شریف پڑھ لیا؟
          </div>

          {/* Interactive Counter Clicker */}
          <div className="py-2">
            <button
              onClick={incrementDurood}
              className="w-full py-4 px-6 bg-[#d1fae5] hover:bg-[#a7f3d0] text-[#064e3b] font-black rounded-2xl shadow-lg transition-transform active:scale-95 text-lg cursor-pointer flex items-center justify-center gap-2"
            >
              <Heart className="w-5 h-5 fill-emerald-700 text-emerald-700" />
              <span>پڑھ لیا (کلک کریں: +۱)</span>
            </button>
          </div>

          <p className="text-[11px] text-emerald-300">
            ایک بار درود شریف پڑھنے پر ۱۰ رحمتیں نازل ہوتی ہیں اور ۱۰ گناہ معاف ہوتے ہیں۔
          </p>
        </div>

        {/* اعداد و شمار (Statistics - Exact match to screenshot 10) */}
        <div className="space-y-2">
          <div className="bg-white rounded-full py-1.5 px-4 text-center border border-slate-200 text-xs font-bold text-slate-700">
            اعداد و شمار
          </div>

          <div className="grid grid-cols-2 gap-2 text-center">
            {/* Today Count */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-1">
              <span className="text-xs font-bold text-slate-600">آج کے دن پڑھے گئے</span>
              <div className="text-3xl font-black text-emerald-800 tabular-nums">
                {toUrduNumber(duroodCount)}
              </div>
              <span className="text-[11px] text-emerald-600 font-bold">درود شریف</span>
            </div>

            {/* Global Counter */}
            <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 space-y-1">
              <span className="text-xs font-bold text-slate-600">عالمی صارفین نے اس ہفتے پڑھے</span>
              <div className="text-3xl font-black text-sky-800 font-sans">
                76.9M
              </div>
              <span className="text-[11px] text-sky-600 font-bold">درود شریف</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

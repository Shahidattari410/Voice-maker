import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  Info,
  MapPin,
  Pencil,
  Share2,
  Calendar,
  Sun,
  Moon,
  Sunrise,
  Sunset,
} from 'lucide-react';
import { usePrayer } from '../context/PrayerContext';
import { toUrduNumber } from '../../utils/date';

export const PrayerSchedule: React.FC = () => {
  const { setActiveTab } = usePrayer();

  const [mode, setMode] = useState<'daily' | 'monthly'>('daily');
  const [selectedDay, setSelectedDay] = useState(12);
  const [locationName, setLocationName] = useState('Sardargarh (Rahim Yar Khan), PK');
  const [isEditingLoc, setIsEditingLoc] = useState(false);

  // 8 Grid Cards matching Screenshot 5
  const prayerGrid = [
    { name: 'فجر', time: '04:58:09 AM', icon: 'sunrise' },
    { name: 'طلوع آفتاب', time: '06:16:23 AM', icon: 'sun-rise' },
    { name: 'اشراق', time: '06:36:23 AM', icon: 'sun' },
    { name: 'ضحوۃ کبریٰ', time: '11:25:01 AM', icon: 'sun-bold' },
    { name: 'ظہر', time: '12:04:47 PM', icon: 'sun-mid' },
    { name: 'عصر (حنفی)', time: '04:14:33 PM', icon: 'sun-low' },
    { name: 'مغرب', time: '05:52:46 PM', icon: 'sunset' },
    { name: 'عشاء (حنفی)', time: '07:10:26 PM', icon: 'moon' },
  ];

  const daysList = [12, 13, 14, 15, 16, 17, 18, 19, 20];

  return (
    <div className="min-h-screen bg-[#faf8f5] pb-24 text-right">
      {/* Header (Exact match to screenshot 5) */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-xs">
        <button
          onClick={() => setActiveTab('home')}
          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 cursor-pointer"
        >
          <ChevronRight className="w-5 h-5 rtl:rotate-0" />
        </button>

        <h1 className="text-lg font-bold text-slate-900 urdu-title">
          نماز کے اوقات
        </h1>

        <button
          title="معلومات"
          className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Location Bar with Pin & Pencil (Exact match to screenshot 5) */}
        <div className="bg-white rounded-full px-4 py-2 border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-800 shrink-0" />
            {isEditingLoc ? (
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                onBlur={() => setIsEditingLoc(false)}
                autoFocus
                className="text-xs font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded outline-none"
              />
            ) : (
              <span className="text-xs font-bold text-slate-800 font-sans truncate">
                {locationName}
              </span>
            )}
          </div>

          <button
            onClick={() => setIsEditingLoc(!isEditingLoc)}
            className="text-slate-600 hover:text-slate-900 cursor-pointer p-1"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Switch: روزانہ | ماہانہ */}
        <div className="flex items-center justify-center gap-3 text-xs font-bold">
          <span className={mode === 'daily' ? 'text-slate-900 font-bold' : 'text-slate-400'}>
            روزانہ
          </span>
          <button
            onClick={() => setMode(mode === 'daily' ? 'monthly' : 'daily')}
            className="w-12 h-6 rounded-full bg-slate-800 p-1 flex items-center transition-colors cursor-pointer"
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                mode === 'monthly' ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={mode === 'monthly' ? 'text-slate-900 font-bold' : 'text-slate-400'}>
            ماہانہ
          </span>
        </div>

        {/* Month Navigation: < اکتوبر 2026 > */}
        <div className="flex items-center justify-center gap-4 text-base font-bold text-slate-800">
          <button className="p-1 hover:text-emerald-700 cursor-pointer">
            <ChevronRight className="w-5 h-5 rtl:rotate-0" />
          </button>
          <span>اکتوبر 2026</span>
          <button className="p-1 hover:text-emerald-700 cursor-pointer">
            <ChevronLeft className="w-5 h-5 rtl:rotate-0" />
          </button>
        </div>

        {/* Horizontal Days Scroller (12, 13, 14, 15, 16, 17) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar justify-start">
          {daysList.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDay(d)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base transition-all shrink-0 cursor-pointer ${
                selectedDay === d
                  ? 'bg-[#1e293b] text-white shadow-md'
                  : 'bg-white text-slate-800 border border-slate-300 hover:bg-slate-100'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Subtitle with Icon */}
        <div className="text-right flex items-center justify-end gap-1 text-xs font-bold text-slate-700 pt-1">
          <span>نماز کے اوقات</span>
          <span className="text-slate-500">🔖</span>
        </div>

        {/* 8 Grid Cards (Exact match to screenshot 5) */}
        <div className="grid grid-cols-3 gap-2 text-center">
          {prayerGrid.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-xs flex flex-col items-center justify-center space-y-1"
            >
              <div className="w-7 h-7 flex items-center justify-center text-slate-700">
                {item.icon.includes('sun') ? (
                  <Sun className="w-5 h-5 text-amber-600" />
                ) : (
                  <Moon className="w-5 h-5 text-indigo-700" />
                )}
              </div>
              <span className="text-xs font-bold text-slate-900 urdu-title">
                {item.name}
              </span>
              <span className="text-[11px] font-bold font-mono text-slate-800">
                {item.time}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom Share Buttons (Exact match to screenshot 5) */}
        <div className="border border-slate-300 rounded-2xl p-3 bg-white/70 space-y-2 text-center">
          <div className="text-xs font-bold text-slate-700">شیئر</div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => alert('نماز کے اوقات کاپی کر لیے گئے!')}
              className="py-2.5 px-3 bg-[#1e293b] hover:bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              نماز کے اوقات
            </button>
            <button
              onClick={() => alert('افطار کے اوقات کاپی کر لیے گئے!')}
              className="py-2.5 px-3 bg-[#1e293b] hover:bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              افطار کے اوقات
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

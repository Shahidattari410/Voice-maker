import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Menu,
  Palette,
  Info,
  MapPin,
  Calendar,
  Compass,
  BookOpen,
  Volume2,
  VolumeX,
  Volume1,
  Sun,
  Moon,
  Sunset,
  Sunrise,
  Sparkles,
  ChevronLeft,
  Search,
  Check,
  Share2,
  Settings,
  HelpCircle,
  Heart,
  Scroll,
  Navigation,
  Pencil,
} from 'lucide-react';
import { usePrayer } from '../context/PrayerContext';

export const PrayerHome: React.FC = () => {
  const {
    currentCity,
    coordinates,
    fiqh,
    silentMode,
    setSilentMode,
    darkMode,
    prayerTheme,
    setIsThemeModalOpen,
    setIsLocationModalOpen,
    calculatedTimes,
    detectLocationViaGPS,
    isDetectingGPS,
    setActiveTab,
    playAdhanPreview,
    setShowSplash,
    switchToNaikAmaal,
  } = usePrayer();

  const [activeSegment, setActiveSegment] = useState<'fard' | 'others'>('fard');
  const [currentTimeStr, setCurrentTimeStr] = useState('');
  const [gpsNotification, setGpsNotification] = useState<string | null>(null);

  // Live ticking clock
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setCurrentTimeStr(d.toLocaleTimeString());
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAutoGPS = async () => {
    const res = await detectLocationViaGPS();
    setGpsNotification(res.message);
    setTimeout(() => setGpsNotification(null), 4000);
  };

  // Header gradients based on active theme
  const getHeaderGrad = () => {
    if (prayerTheme === 'madani-green') {
      return 'from-[#064e3b] via-[#043629] to-[#022c22]';
    }
    if (prayerTheme === 'royal-burgundy') {
      return 'from-[#7f1d1d] via-[#5c1313] to-[#450a0a]';
    }
    if (prayerTheme === 'golden-kaaba') {
      return 'from-[#78350f] via-[#451a03] to-[#1c1917]';
    }
    if (prayerTheme === 'ocean-teal') {
      return 'from-[#134e4a] via-[#0f3d3a] to-[#042f2e]';
    }
    return 'from-[#1e293b] via-[#0f172a] to-[#1e293b]';
  };

  const prayersList = [
    {
      id: 'fajr',
      name: 'فجر',
      startTime: calculatedTimes.fajr,
      endTime: calculatedTimes.fajrEnd,
      icon: <Sunrise className="w-4 h-4 text-amber-500" />,
    },
    {
      id: 'dhuhr',
      name: 'ظہر',
      startTime: calculatedTimes.dhuhr,
      icon: <Sun className="w-4 h-4 text-amber-500" />,
    },
    {
      id: 'asr',
      name: 'عصر',
      startTime: calculatedTimes.asr,
      fiqhSuffix: fiqh === 'hanafi' ? 'حنفی' : 'شافعی',
      icon: <Sun className="w-4 h-4 text-orange-500" />,
    },
    {
      id: 'maghrib',
      name: 'مغرب',
      startTime: calculatedTimes.maghrib,
      icon: <Sunset className="w-4 h-4 text-rose-500" />,
    },
    {
      id: 'isha',
      name: 'عشاء',
      startTime: calculatedTimes.isha,
      fiqhSuffix: fiqh === 'hanafi' ? 'حنفی' : 'شافعی',
      icon: <Moon className="w-4 h-4 text-indigo-400" />,
    },
  ];

  const othersList = [
    { name: 'طلوع آفتاب', time: calculatedTimes.sunrise },
    { name: 'اشراق', time: calculatedTimes.ishraq },
    { name: 'ضحوۃ کبریٰ (چاشت)', time: calculatedTimes.chasht },
    { name: 'نصف اللیل', time: calculatedTimes.nisf },
    { name: 'غروب آفتاب / افطار', time: calculatedTimes.maghrib },
  ];

  return (
    <div
      className={`min-h-screen ${
        darkMode ? 'bg-slate-950 text-white' : 'bg-[#faf8f5] text-slate-800'
      } pb-24 transition-colors`}
    >
      {/* Top Header with Mosque Silhouette & Live Dial (Exact match to Screenshots 2, 8, 12) */}
      <div
        className={`relative bg-gradient-to-b ${getHeaderGrad()} text-white pt-3 pb-6 px-4 shadow-lg overflow-hidden`}
      >
        {/* Subtle Mosque Domes and Stars in Background */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
            <path
              d="M0 200 L0 160 Q30 110 60 160 L100 160 Q130 90 160 160 L240 160 Q270 110 300 160 L350 160 Q375 130 400 160 L400 200 Z"
              fill="#ffffff"
            />
          </svg>
        </div>

        <div className="max-w-md mx-auto relative z-10 space-y-3">
          {/* Top Bar: Menu, Theme Button, Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('settings')}
                title="مینو"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer"
              >
                <Menu className="w-5 h-5 text-white" />
              </button>

              {/* Functional Theme Colors Button */}
              <button
                onClick={() => setIsThemeModalOpen(true)}
                title="تھیم کے رنگ تبدیل کیجئے"
                className="px-2.5 py-1 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-bold flex items-center gap-1.5 cursor-pointer text-white shadow-xs active:scale-95"
              >
                <Palette className="w-3.5 h-3.5 text-amber-300" />
                <span>تھیم تبدیل کیجئے</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              {/* App Switcher button right in header */}
              <button
                onClick={switchToNaikAmaal}
                className="px-2.5 py-1 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold shadow-xs flex items-center gap-1 cursor-pointer transition-transform active:scale-95"
                title="۷۲ نیک اعمال ایپ پر واپس جائیں"
              >
                <span>📋 نیک اعمال</span>
              </button>

              <button
                onClick={() => setShowSplash(true)}
                title="اوپننگ اسکرین"
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Hijri & Gregorian Dates and Location Header */}
          <div className="flex items-center justify-between gap-3 text-right">
            {/* Left Info: Hijri, Gregorian, Altitude */}
            <div className="space-y-0.5 text-xs">
              <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                <Moon className="w-3.5 h-3.5 fill-amber-300" />
                <span>29, ربیع الآخر, 1448</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300 text-[11px]">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>پیر 12 اکتوبر 2026</span>
              </div>
              <div className="text-[10px] text-slate-400 font-sans">
                بلندی {coordinates.altitudeFeet || 298} Feet, GMT 5.0
              </div>
            </div>

            {/* Right: Circular Radiating Dial "طلوعِ آفتاب" (Exact match to screenshot 2) */}
            <div
              onClick={() => setActiveTab('schedule')}
              className="relative w-24 h-24 shrink-0 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* 40 Radiating tick marks */}
                {Array.from({ length: 40 }).map((_, i) => {
                  const angle = (i * 9 * Math.PI) / 180;
                  const isLong = i % 5 === 0;
                  const r1 = 46;
                  const r2 = isLong ? 36 : 41;
                  const x1 = 50 + r1 * Math.sin(angle);
                  const y1 = 50 - r1 * Math.cos(angle);
                  const x2 = 50 + r2 * Math.sin(angle);
                  const y2 = 50 - r2 * Math.cos(angle);
                  return (
                    <line
                      key={i}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={isLong ? '#f97316' : '#94a3b8'}
                      strokeWidth={isLong ? 2 : 1}
                      strokeLinecap="round"
                    />
                  );
                })}
                <circle cx="50" cy="50" r="32" fill="#ffffff" />
                <text
                  x="50"
                  y="47"
                  textAnchor="middle"
                  fill="#ef4444"
                  fontSize="9"
                  fontWeight="bold"
                  fontFamily="serif"
                >
                  طلوعِ آفتاب
                </text>
                <text
                  x="50"
                  y="59"
                  textAnchor="middle"
                  fill="#1e293b"
                  fontSize="7"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                >
                  {calculatedTimes.sunrise.slice(0, 5)} AM
                </text>
              </svg>
            </div>
          </div>

          {/* Location Bar with Real Edit / GPS Option */}
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2 flex items-center justify-between gap-2 border border-white/10">
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="flex items-center gap-1.5 flex-1 min-w-0 text-right cursor-pointer hover:opacity-90 transition-opacity"
            >
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-xs font-bold text-white truncate">
                {currentCity}
              </span>
              <Pencil className="w-3 h-3 text-white/60 ml-1 shrink-0" />
            </button>

            {/* Quick 3 Icons: قبلہ, قرآن, سائلنٹ موڈ */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setActiveTab('questions')}
                title="قرآن و مسائل"
                className="w-7 h-7 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center text-white cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setActiveTab('schedule')}
                title="نماز و قبلہ اوقات"
                className="w-7 h-7 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center text-white cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setSilentMode(!silentMode)}
                title={silentMode ? 'سائلنٹ موڈ آن ہے' : 'سائلنٹ موڈ بند ہے'}
                className={`w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
                  silentMode ? 'bg-amber-500 text-white' : 'bg-white/15 text-white hover:bg-white/25'
                }`}
              >
                {silentMode ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-3 -mt-3 space-y-3 relative z-20">
        {/* Real GPS Notification message */}
        {gpsNotification && (
          <div className="p-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold text-center shadow-lg animate-bounce">
            {gpsNotification}
          </div>
        )}

        {/* Red Alert Banner - Clicking it executes REAL GPS auto detection or modal! */}
        <button
          onClick={handleAutoGPS}
          disabled={isDetectingGPS}
          className="w-full bg-[#b91c1c] hover:bg-[#991b1b] text-white py-2 px-3 rounded-lg text-center shadow-md flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer transition-all active:scale-98"
        >
          <Navigation className={`w-3.5 h-3.5 fill-white ${isDetectingGPS ? 'animate-spin' : ''}`} />
          <span>
            {isDetectingGPS
              ? 'جی پی ایس سے لوکیشن حاصل ہو رہی ہے...'
              : 'مزید درستگی کیلئے آٹو لوکیشن کا استعمال کریں!'}
          </span>
        </button>

        {/* Main Prayer Times Card (Calculated Live based on Coordinates!) */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 divide-y divide-slate-100">
          {activeSegment === 'fard'
            ? prayersList.map((p) => (
                <div key={p.id} className="py-2.5 flex items-center justify-between text-right group">
                  {/* Speaker Button (Real Takbeer Audio) */}
                  <button
                    onClick={playAdhanPreview}
                    title="اذان سنیں"
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-500 hover:text-emerald-600 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  {/* Prayer Time Range */}
                  <div className="flex-1 text-center font-mono font-bold text-slate-800 text-sm md:text-base tabular-nums">
                    <span>{p.startTime}</span>
                    {p.endTime && (
                      <span className="text-slate-400 font-normal text-xs mx-1">
                        — {p.endTime}
                      </span>
                    )}
                  </div>

                  {/* Prayer Name & Icon */}
                  <div className="flex items-center gap-2 justify-end w-28">
                    <span className="text-base font-bold text-slate-900 urdu-title">
                      {p.name}{' '}
                      {p.fiqhSuffix && (
                        <span className="text-xs font-normal text-slate-500">
                          ({p.fiqhSuffix})
                        </span>
                      )}
                    </span>
                    <span className="text-slate-500">{p.icon}</span>
                  </div>
                </div>
              ))
            : othersList.map((o, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-right">
                  <div className="w-8" />
                  <div className="flex-1 text-center font-mono font-bold text-slate-800 text-sm tabular-nums">
                    {o.time}
                  </div>
                  <div className="flex items-center gap-2 justify-end w-36">
                    <span className="text-sm font-bold text-slate-900 urdu-title">
                      {o.name}
                    </span>
                  </div>
                </div>
              ))}
        </div>

        {/* Segmented Switch: فرائض / دیگر اوقات */}
        <div className="flex items-center justify-center gap-2 bg-slate-200/80 p-1 rounded-full max-w-xs mx-auto text-xs font-bold">
          <button
            onClick={() => setActiveSegment('fard')}
            className={`flex-1 py-1.5 px-4 rounded-full transition-all cursor-pointer ${
              activeSegment === 'fard'
                ? 'bg-[#15803d] text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            فرائض
          </button>
          <button
            onClick={() => setActiveSegment('others')}
            className={`flex-1 py-1.5 px-4 rounded-full transition-all cursor-pointer ${
              activeSegment === 'others'
                ? 'bg-[#15803d] text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            دیگر اوقات
          </button>
        </div>

        {/* دیگر خصوصیات (Features Grid) */}
        <div>
          <div className="text-right text-xs font-bold text-slate-600 mb-2">
            دیگر خصوصیات
          </div>
          <div className="grid grid-cols-2 gap-2 text-right">
            {/* 1. قرآن */}
            <div
              onClick={() => setActiveTab('questions')}
              className="bg-white hover:bg-slate-50 p-3 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between cursor-pointer transition-all active:scale-98"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="pr-2">
                <div className="text-sm font-bold text-slate-900 urdu-title">قرآن مجید</div>
                <div className="text-[10px] text-slate-400">تلاوت و تفاسیر</div>
              </div>
            </div>

            {/* 2. حدیث پاک */}
            <div
              onClick={() => setActiveTab('questions')}
              className="bg-white hover:bg-slate-50 p-3 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between cursor-pointer transition-all active:scale-98"
            >
              <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Scroll className="w-5 h-5" />
              </div>
              <div className="pr-2">
                <div className="text-sm font-bold text-slate-900 urdu-title">حدیث شریف</div>
                <div className="text-[10px] text-slate-400">احادیثِ مبارکہ</div>
              </div>
            </div>

            {/* 3. سوال و جواب (احکام و مسائل) */}
            <div
              onClick={() => setActiveTab('questions')}
              className="bg-white hover:bg-slate-50 p-3 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between cursor-pointer transition-all active:scale-98"
            >
              <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div className="pr-2">
                <div className="text-sm font-bold text-slate-900 urdu-title">سوال و جواب</div>
                <div className="text-[10px] text-slate-400">شرعی مسائل و احکام</div>
              </div>
            </div>

            {/* 4. درود شریف ٹریکر */}
            <div
              onClick={() => setActiveTab('durood')}
              className="bg-white hover:bg-slate-50 p-3 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between cursor-pointer transition-all active:scale-98"
            >
              <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                <Heart className="w-5 h-5" />
              </div>
              <div className="pr-2">
                <div className="text-sm font-bold text-slate-900 urdu-title">درود شریف</div>
                <div className="text-[10px] text-slate-400">روزانہ کا ہدف و شمار</div>
              </div>
            </div>

            {/* 5. قضا نمازیں کاؤنٹر */}
            <div
              onClick={() => setActiveTab('qaza')}
              className="bg-white hover:bg-slate-50 p-3 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between cursor-pointer transition-all active:scale-98"
            >
              <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                <Sunset className="w-5 h-5" />
              </div>
              <div className="pr-2">
                <div className="text-sm font-bold text-slate-900 urdu-title">قضا نمازیں</div>
                <div className="text-[10px] text-slate-400">حساب و ادائیگی</div>
              </div>
            </div>

            {/* 6. مزید ایپلیکیشنز */}
            <div
              onClick={() => setActiveTab('more-apps')}
              className="bg-white hover:bg-slate-50 p-3 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between cursor-pointer transition-all active:scale-98"
            >
              <div className="w-9 h-9 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="pr-2">
                <div className="text-sm font-bold text-slate-900 urdu-title">مزید ایپس</div>
                <div className="text-[10px] text-slate-400">دعوتِ اسلامی ایپس</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

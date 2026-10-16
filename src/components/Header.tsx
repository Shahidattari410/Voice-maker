import React, { useRef } from 'react';
import {
  ChevronRight,
  RotateCw,
  Palette,
  Volume2,
  VolumeX,
  FileText,
  Sliders,
  Sparkles,
  Layers,
  BarChart3,
  CheckCircle2,
  Calendar,
  Globe,
  Upload,
  Type,
  Mic,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { THEMES } from '../data/themes';

export const Header: React.FC = () => {
  const {
    view,
    setView,
    selectedCategory,
    activeThemeId,
    soundEnabled,
    setSoundEnabled,
    setIsSettingsOpen,
    setShowSplash,
    templates,
    setActiveTemplateId,
    activeTemplateId,
    clearDayAnswers,
    setIsOtherWebModalOpen,
    uploadCustomFont,
    setActiveAppSuite,
  } = useApp();

  const theme = THEMES[activeThemeId];
  const quickFileInputRef = useRef<HTMLInputElement>(null);

  const handleQuickFontUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const ok = await uploadCustomFont(file);
      if (ok) {
        alert(`فونٹ کامیابی سے تبدیل ہو گیا: ${file.name}`);
      } else {
        alert('فونٹ فائل لوڈ نہیں ہو سکی۔ برائے مہربانی درست .ttf یا .woff فائل منتخب کریں۔');
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
      {/* Hidden file input for direct font upload button */}
      <input
        ref={quickFileInputRef}
        type="file"
        accept=".ttf,.otf,.woff,.woff2"
        className="hidden"
        onChange={handleQuickFontUpload}
      />

      <div className="max-w-2xl mx-auto px-2 py-1.5 flex items-center justify-between gap-1.5">
        {/* Right Section: Back/Reset + Compact Title + Template selector */}
        <div className="flex items-center gap-1.5 shrink-0">
          {view !== 'dashboard' ? (
            <button
              onClick={() => setView('dashboard')}
              title="ڈیش بورڈ پر واپس جائیں"
              className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-100 hover:bg-slate-200 transition-colors text-slate-700 cursor-pointer active:scale-95"
            >
              <ChevronRight className="w-4 h-4 rtl:rotate-0" />
            </button>
          ) : (
            <button
              onClick={() => {
                if (confirm('کیا آپ آج کے نشانات صاف کرنا چاہتے ہیں؟')) {
                  clearDayAnswers();
                }
              }}
              title="دوبارہ لوڈ / ری سیٹ کریں"
              className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-100 hover:bg-slate-200 transition-colors text-slate-700 cursor-pointer active:scale-95"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          )}

          <span className="font-bold text-slate-900 text-sm tracking-tight urdu-title">
            نیک اعمال
          </span>

          {/* Compact Template Switcher */}
          <div className="relative inline-block">
            <select
              value={activeTemplateId}
              onChange={(e) => setActiveTemplateId(e.target.value)}
              aria-label="نیک اعمال کا ٹیمپلیٹ منتخب کریں"
              className="text-[10px] bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 rounded-md px-1.5 py-0.5 cursor-pointer focus:outline-none appearance-none font-semibold max-w-[85px] sm:max-w-[110px] truncate"
            >
              {templates.map((t) => (
                <option key={t.id} value={t.id} className="text-slate-800 bg-white">
                  {t.badge}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Center: Slim Clean View Tabs */}
        <div className="flex items-center gap-0.5 bg-slate-100/90 p-0.5 rounded-lg border border-slate-200/80 text-[11px] font-bold">
          <button
            onClick={() => setView('dashboard')}
            className={`py-1 px-2 rounded-md transition-all cursor-pointer ${
              view === 'dashboard'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ڈیش بورڈ
          </button>
          <button
            onClick={() => setView('workplan')}
            className={`py-1 px-2 rounded-md transition-all cursor-pointer ${
              view === 'workplan'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            اعمال
          </button>
          <button
            onClick={() => setView('reports')}
            className={`py-1 px-2 rounded-md transition-all cursor-pointer ${
              view === 'reports'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            رپورٹس
          </button>
        </div>

        {/* Left Section: Action Buttons (اسپیچ AI، دوسری ویب، تھیم، فونٹ اپلوڈ، آواز) */}
        <div className="flex items-center gap-1 shrink-0">
          {/* اے آئی موٹیویشنل اسپیچ اسٹوڈیو بٹن */}
          <button
            onClick={() => setActiveAppSuite('speech-studio')}
            className="py-1 px-2 bg-gradient-to-r from-indigo-600 via-purple-700 to-indigo-800 hover:from-indigo-700 hover:to-purple-900 text-white rounded-lg text-[10px] font-bold shadow-2xs flex items-center gap-1 cursor-pointer transition-transform active:scale-95 border border-indigo-400/40"
            title="اے آئی موٹیویشنل اسپیچ اسٹوڈیو اور وائس کلوننگ مکمل دوسری ویب پر جائیں"
          >
            <Mic className="w-3 h-3 text-indigo-200" />
            <span className="hidden sm:inline">اسپیچ اسٹوڈیو</span>
            <span className="sm:hidden">اسپیچ</span>
          </button>

          {/* دوسری ویب سائٹ بٹن (Opens Other Web in full isolation) */}
          <button
            onClick={() => setIsOtherWebModalOpen(true)}
            className="py-1 px-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-lg text-[10px] font-bold shadow-2xs flex items-center gap-1 cursor-pointer transition-transform active:scale-95"
            title="دوسری ویب سائٹ یا اوقات الصلوٰۃ ایپ کھولیں"
          >
            <Globe className="w-3 h-3 text-cyan-200" />
            <span className="hidden sm:inline">دوسری ویب</span>
            <span className="sm:hidden">ویب</span>
          </button>

          {/* فونٹ اپلوڈ بٹن */}
          <button
            onClick={() => quickFileInputRef.current?.click()}
            title="کمپیوٹر/موبائل سے فونٹ فائل اپلوڈ کریں (.ttf, .otf, .woff)"
            className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-100 hover:bg-slate-200 transition-colors text-slate-700 cursor-pointer"
          >
            <Type className="w-3.5 h-3.5 text-indigo-600" />
          </button>

          {/* تھیم کلرز بٹن */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            title="تھیم کلرز اور سیٹنگز تبدیل کریں"
            className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-100 hover:bg-slate-200 transition-colors text-slate-700 cursor-pointer"
          >
            <Palette className="w-3.5 h-3.5 text-amber-600" />
          </button>

          {/* آواز ٹوگل */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'آواز بند کریں' : 'آواز کھولیں'}
            className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-100 hover:bg-slate-200 transition-colors text-slate-700 cursor-pointer"
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-slate-700" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

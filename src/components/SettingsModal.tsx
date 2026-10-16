import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Upload,
  Type,
  Palette,
  Layers,
  Volume2,
  Trash2,
  Check,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { THEMES } from '../data/themes';
import { FontId, ThemeId } from '../types';
import { toUrduNumber } from '../utils/date';

export const SettingsModal: React.FC = () => {
  const {
    isSettingsOpen,
    setIsSettingsOpen,
    activeThemeId,
    setActiveThemeId,
    fontId,
    setFontId,
    fontSize,
    setFontSize,
    customFontName,
    uploadCustomFont,
    templates,
    activeTemplateId,
    setActiveTemplateId,
    soundEnabled,
    setSoundEnabled,
    resetAllData,
    deletedQuestionIds,
    restoreAllQuestions,
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadStatus('فونٹ اپلوڈ ہو رہا ہے...');
    const ok = await uploadCustomFont(file);
    if (ok) {
      setUploadStatus(`فونٹ کامیابی سے لوڈ ہو گیا: ${file.name}`);
    } else {
      setUploadStatus('فونٹ لوڈ نہیں ہو سکا۔ برائے مہربانی درست .ttf یا .woff فائل منتخب کریں۔');
    }
  };

  const fonts: { id: FontId; name: string; urduName: string; sample: string }[] = [
    {
      id: 'noto-nastaliq',
      name: 'Noto Nastaliq Urdu',
      urduName: 'نوٹو نستعلیق اردو (معیاری خوبصورت)',
      sample: 'نیک اعمال کا محاسبہ',
    },
    {
      id: 'gulzar',
      name: 'Gulzar',
      urduName: 'گلزار نستعلیق (کلاسک خطاطی)',
      sample: 'نیک اعمال کا محاسبہ',
    },
    {
      id: 'amiri',
      name: 'Amiri',
      urduName: 'امیری قرآنی خط (واضح عربی و اردو)',
      sample: 'نیک اعمال کا محاسبہ',
    },
    {
      id: 'lateef',
      name: 'Lateef',
      urduName: 'لطیف (روانی و خوبصورت رسم الخط)',
      sample: 'نیک اعمال کا محاسبہ',
    },
    {
      id: 'noto-sans-arabic',
      name: 'Noto Sans Arabic',
      urduName: 'نوٹو سَنس (سادہ اور آسان پڑھائی)',
      sample: 'نیک اعمال کا محاسبہ',
    },
  ];

  if (customFontName && customFontName !== 'CustomFont') {
    fonts.unshift({
      id: 'custom-uploaded',
      name: customFontName,
      urduName: `آپ کا اپلوڈ کردہ فونٹ (${customFontName})`,
      sample: 'نیک اعمال کا محاسبہ',
    });
  }

  return (
    <AnimatePresence>
      {isSettingsOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden text-right max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <h2 className="text-lg font-bold urdu-title">
                ایپ سیٹنگز، تھیمز اور فونٹ اپلوڈ
              </h2>
            </div>

            {/* Scrollable Body */}
            <div className="p-4 space-y-5 overflow-y-auto flex-1">
              {/* 1. Theme Selection (تھیم سیٹنگز) */}
              <div>
                <div className="flex items-center gap-1.5 font-bold text-slate-800 text-sm mb-2">
                  <Palette className="w-4 h-4 text-emerald-600" />
                  <span>تھیم کا انتخاب (Theme Settings)</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(THEMES) as ThemeId[]).map((themeKey) => {
                    const t = THEMES[themeKey];
                    const isSelected = activeThemeId === themeKey;

                    return (
                      <button
                        key={themeKey}
                        onClick={() => setActiveThemeId(themeKey)}
                        className={`p-2.5 rounded-xl border text-right transition-all flex items-center justify-between gap-2 cursor-pointer ${
                          isSelected
                            ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/40'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center" style={{ backgroundColor: t.accentColor }}>
                          {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <div className="flex-1 min-w-0 pr-1">
                          <div className="text-xs font-bold text-slate-900 truncate">
                            {t.urduName}
                          </div>
                          <div className="text-[10px] text-slate-400 font-sans truncate">
                            {t.name}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Custom Font Upload & Built-in Fonts (فونٹ اپلوڈ) */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 text-sm">
                    <Type className="w-4 h-4 text-sky-600" />
                    <span>اردو فونٹس اور فونٹ اپلوڈ</span>
                  </div>

                  {/* Upload button trigger */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="py-1 px-2.5 bg-sky-600 hover:bg-sky-700 text-white text-[11px] font-bold rounded-lg flex items-center gap-1 cursor-pointer shadow-xs active:scale-95"
                  >
                    <Upload className="w-3 h-3" />
                    <span>اپنا فونٹ اپلوڈ کریں (.ttf / .woff)</span>
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".ttf,.woff,.woff2,.otf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                {uploadStatus && (
                  <p className="text-[11px] text-emerald-600 mb-2 font-medium bg-emerald-50 p-2 rounded-lg">
                    {uploadStatus}
                  </p>
                )}

                <div className="space-y-1.5">
                  {fonts.map((f) => {
                    const isSelected = fontId === f.id;
                    return (
                      <button
                        key={f.id}
                        onClick={() => setFontId(f.id)}
                        className={`w-full p-2.5 rounded-xl border flex items-center justify-between gap-2 text-right transition-all cursor-pointer ${
                          isSelected
                            ? 'border-sky-500 ring-2 ring-sky-500/20 bg-sky-50/50'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="shrink-0">
                          {isSelected ? (
                            <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs">
                              ✓
                            </span>
                          ) : (
                            <span className="w-5 h-5 rounded-full border border-slate-300 block" />
                          )}
                        </div>
                        <div className="flex-1 pr-2">
                          <div className="text-xs font-bold text-slate-900">{f.urduName}</div>
                          <div className="text-sm text-slate-600 mt-0.5 urdu-content">{f.sample}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Font Size Controls (فونٹ سائز ایڈجسٹمنٹ) */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-2">
                  <span>فونٹ سائز کا انتخاب (Font Size)</span>
                  <span className="text-slate-500 tabular-nums">{fontSize}px</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {[13, 15, 16, 18, 20].map((size) => (
                    <button
                      key={size}
                      onClick={() => setFontSize(size)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        fontSize === size
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {size === 13 ? 'چھوٹا' : size === 16 ? 'معیاری' : size === 18 ? 'بڑا' : `${size}px`}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Templates Selector (مختلف ایڈیشنز اور ٹیمپلیٹس) */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 text-sm mb-2">
                  <Layers className="w-4 h-4 text-purple-600" />
                  <span>نیک اعمال کے مختلف ٹیمپلیٹس (Deed Templates)</span>
                </div>

                <div className="space-y-2">
                  {templates.map((tpl) => {
                    const isSelected = activeTemplateId === tpl.id;
                    return (
                      <button
                        key={tpl.id}
                        onClick={() => setActiveTemplateId(tpl.id)}
                        className={`w-full p-2.5 rounded-xl border text-right transition-all cursor-pointer flex items-center justify-between gap-2 ${
                          isSelected
                            ? 'border-purple-500 ring-2 ring-purple-500/20 bg-purple-50/40'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold shrink-0">
                          {tpl.badge}
                        </span>
                        <div className="flex-1 pr-2">
                          <div className="text-xs font-bold text-slate-900">{tpl.title}</div>
                          <div className="text-[11px] text-slate-500 truncate">{tpl.subtitle}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 5. Sound & Reset Actions */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-bold text-slate-700">کلک کی تصدیقی آواز (Sound Effects)</span>
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                      soundEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {soundEnabled ? 'فعال ہے' : 'بند ہے'}
                  </button>
                </div>

                {/* Deleted Deeds Restoration */}
                {deletedQuestionIds.length > 0 && (
                  <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50 border border-amber-200">
                    <div className="text-right">
                      <span className="text-xs font-bold text-amber-900">
                        حذف شدہ اعمال ({toUrduNumber(deletedQuestionIds.length)})
                      </span>
                      <p className="text-[10px] text-amber-700">
                        آپ کے حذف کیے گئے اعمال کو دوبارہ لسٹ میں شامل کریں
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        restoreAllQuestions();
                        alert('تمام حذف شدہ اعمال کامیابی سے بحال کر دیے گئے!');
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>بحال کریں</span>
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between p-2 rounded-xl bg-rose-50 border border-rose-200">
                  <div className="text-right">
                    <span className="text-xs font-bold text-rose-800">ڈیٹا ری سیٹ کریں</span>
                    <p className="text-[10px] text-rose-600">تمام نشانات اور ریکارڈز ختم کر دے گا</p>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm('کیا آپ تمام ریکارڈز اور سوالات کو بالکل ابتدا کی طرح صاف کرنا چاہتے ہیں؟')) {
                        resetAllData();
                      }
                    }}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>ری سیٹ</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 p-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="py-1.5 px-5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg cursor-pointer"
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

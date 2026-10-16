import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Globe,
  ExternalLink,
  Layers,
  Sparkles,
  ArrowRight,
  Maximize2,
  Check,
  Compass,
  Mic,
  Headphones,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const OtherWebModal: React.FC = () => {
  const {
    isOtherWebModalOpen,
    setIsOtherWebModalOpen,
    setActiveAppSuite,
    customWebUrl,
    setCustomWebUrl,
    setIsCustomWebActive,
  } = useApp();

  const [inputUrl, setInputUrl] = useState(customWebUrl || 'https://www.dawateislami.net');
  const [copiedNotice, setCopiedNotice] = useState(false);

  if (!isOtherWebModalOpen) return null;

  const handleOpenSpeechStudio = () => {
    setIsOtherWebModalOpen(false);
    setActiveAppSuite('speech-studio');
  };

  const handleOpenPrayerApp = () => {
    setIsOtherWebModalOpen(false);
    setActiveAppSuite('prayer-times');
  };

  const handleOpenExternalTab = (urlToOpen: string) => {
    let finalUrl = urlToOpen.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }
    setCustomWebUrl(finalUrl);
    window.open(finalUrl, '_blank', 'noopener,noreferrer');
    setIsOtherWebModalOpen(false);
  };

  const handleOpenFullscreenMode = (urlToOpen: string) => {
    let finalUrl = urlToOpen.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }
    setCustomWebUrl(finalUrl);
    setIsCustomWebActive(true);
    setIsOtherWebModalOpen(false);
  };

  const presetWebs = [
    { title: 'دعوتِ اسلامی مرکزی ویب سائٹ', url: 'https://www.dawateislami.net', badge: 'مرکزی پورٹل' },
    { title: 'القرآن الکریم مع ترجمہ و تفسیر', url: 'https://quran.com', badge: 'تلاوت و تفسیر' },
    { title: 'مدنی چینل لائیو نشریات', url: 'https://www.dawateislami.net/medanichannel', badge: 'لائیو' },
    { title: 'اسلامک کتب خانہ و رسائل', url: 'https://www.dawateislami.net/bookslibrary', badge: 'کتب' },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 text-right overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => setIsOtherWebModalOpen(false)}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              <h3 className="text-base font-bold urdu-title">
                دوسری ویب سائٹ / ایپلیکیشن
              </h3>
            </div>
          </div>

          <div className="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
            <p className="text-slate-600 leading-relaxed">
              آپ یہاں سے مکمل الگ تھلگ دوسری ویب یا اوقات الصلوٰۃ ایپ کھول سکتے ہیں۔ پہلی ایپ اور دوسری ایپ ایک دوسرے کو بالکل متاثر نہیں کریں گی۔
            </p>

            {/* Option 1: AI Motivational Speech & Voice Cloning Studio */}
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-900 via-purple-950 to-slate-900 border border-indigo-400/50 shadow-md space-y-2 text-white">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full bg-indigo-500 text-white text-[10px] font-bold">
                  جدید اے آئی فیچر
                </span>
                <span className="font-bold text-indigo-200 text-sm urdu-title flex items-center gap-1.5">
                  <Mic className="w-4 h-4 text-indigo-400" />
                  <span>اے آئی موٹیویشنل اسپیچ اسٹوڈیو</span>
                </span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                اپنی آواز کا آڈیو نمونہ اپلوڈ یا ریکارڈ کر کے اسی آواز میں لامحدود موٹیویشنل تقاریر اور آڈیو جنریٹ کریں!
              </p>
              <button
                onClick={handleOpenSpeechStudio}
                className="w-full py-2.5 px-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-transform active:scale-98 text-xs border border-indigo-400/40"
              >
                <span>🎙️ اسپیچ اسٹوڈیو مکمل دوسری ویب کھولیں</span>
                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </button>
            </div>

            {/* Option 2: Prayer App Switcher */}
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-emerald-50 to-green-100 border border-emerald-300/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                  بلٹ ان دوسری ویب
                </span>
                <span className="font-bold text-emerald-950 text-sm urdu-title">
                  🕌 اوقات الصلوٰۃ مکمل ایپ
                </span>
              </div>
              <p className="text-emerald-900 text-[11px] leading-relaxed">
                نماز کے اوقات، قضا عمری ٹریکر، درود پاک کاؤنٹر، اور روحانی علاج کا مکمل سسٹم۔
              </p>
              <button
                onClick={handleOpenPrayerApp}
                className="w-full py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-transform active:scale-98 text-xs"
              >
                <span>اوقات الصلوٰۃ مکمل ایپ پر سوئچ کریں</span>
                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </button>
            </div>

            {/* Option 2: Custom External Web URL */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold">
                  اپنی مرضی کی ویب سائٹ
                </span>
                <span className="font-bold text-slate-800 text-xs">
                  ویب لنک (URL) درج کریں
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  dir="ltr"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => handleOpenExternalTab(inputUrl)}
                  className="py-2 px-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors text-[11px]"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>نئے ٹیب میں کھولیں</span>
                </button>

                <button
                  onClick={() => handleOpenFullscreenMode(inputUrl)}
                  className="py-2 px-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors text-[11px]"
                >
                  <Maximize2 className="w-3 h-3" />
                  <span>الگ اسکرین پر کھولیں</span>
                </button>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <span className="text-slate-500 font-bold text-[11px] block">
                فوری اسلامی ویب لنکس:
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                {presetWebs.map((preset, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleOpenExternalTab(preset.url)}
                    className="p-2 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 flex items-center justify-between gap-2 cursor-pointer transition-colors"
                  >
                    <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-medium">
                      {preset.badge}
                    </span>
                    <span className="font-bold text-slate-800 text-xs truncate">
                      {preset.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

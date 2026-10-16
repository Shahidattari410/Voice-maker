import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, Type, Check, Sparkles, RefreshCw, ZoomIn, ZoomOut } from 'lucide-react';

interface FontUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFontId: string;
  onSelectFont: (fontId: string, fontName?: string) => void;
  customFontName: string;
  fontSize: number;
  onChangeFontSize: (size: number) => void;
  isLight?: boolean;
}

const PRESET_FONTS = [
  { id: 'noto-nastaliq', name: 'جمیل / نوری نستعلیق', sample: 'خودی کو کر بلند اتنا کہ ہر تقدیر سے پہلے', family: "'Noto Nastaliq Urdu', serif" },
  { id: 'gulzar', name: 'خطِ گلزار (Gulzar)', sample: 'ہمت، عزم اور مسلسل جدوجہد ہی کامیابی کی ضمانت ہے', family: "'Gulzar', serif" },
  { id: 'amiri', name: 'خطِ امیری (Amiri Arabic)', sample: 'اقرأ باسم ربک الذی خلق', family: "'Amiri', serif" },
  { id: 'lateef', name: 'خطِ لطیف (Lateef Urdu)', sample: 'سنو اور غور کرو! جو انسان محنت کرتا ہے سرخرو ہوتا ہے', family: "'Lateef', serif" },
  { id: 'noto-sans-arabic', name: 'خطِ نسخ جدید (Modern Sans)', sample: 'اے آئی موٹیویشنل اسپیچ اینڈ وائس اسٹوڈیو', family: "'Noto Sans Arabic', sans-serif" },
];

export const FontUploadModal: React.FC<FontUploadModalProps> = ({
  isOpen,
  onClose,
  currentFontId,
  onSelectFont,
  customFontName,
  fontSize,
  onChangeFontSize,
  isLight = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFontFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage('');
    setIsUploading(true);
    setUploadSuccess(false);

    try {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_\u0600-\u06FF]/g, '_');
      const fontName = `UserFont_${cleanName || 'Custom'}`;

      const reader = new FileReader();
      reader.onload = async (ev) => {
        const buffer = ev.target?.result as ArrayBuffer;
        if (buffer) {
          try {
            const fontFace = new FontFace(fontName, buffer);
            await fontFace.load();
            document.fonts.add(fontFace);

            // Apply font family variable
            document.documentElement.style.setProperty('--app-font-family', `"${fontName}", 'Noto Nastaliq Urdu', serif`);

            // Store font in localStorage
            try {
              localStorage.setItem('speech_studio_custom_font_name', fontName);
              localStorage.setItem('speech_studio_font_id', 'custom-uploaded');
            } catch {}

            onSelectFont('custom-uploaded', fontName);
            setIsUploading(false);
            setUploadSuccess(true);
            setTimeout(() => {
              setUploadSuccess(false);
            }, 3000);
          } catch (loadErr) {
            console.error('Font load error:', loadErr);
            setErrorMessage('فونٹ فائل لوڈ کرنے میں دشواری پیش آئی۔ برائے مہربانی درست TTF، OTF یا WOFF فائل منتخب کریں۔');
            setIsUploading(false);
          }
        }
      };
      reader.onerror = () => {
        setErrorMessage('فائل پڑھنے میں مسئلہ پیش آیا۔');
        setIsUploading(false);
      };
      reader.readAsArrayBuffer(file);
    } catch {
      setErrorMessage('فونٹ فائل پروسیس نہ ہو سکی۔');
      setIsUploading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 text-right font-urdu"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          className={`rounded-2xl max-w-lg w-full shadow-2xl border overflow-hidden flex flex-col max-h-[90vh] transition-colors ${
            isLight
              ? 'bg-white border-slate-200 text-slate-800'
              : 'bg-slate-900 border-slate-700 text-slate-100'
          }`}
        >
          {/* Header */}
          <div
            className={`px-4 py-3 border-b flex items-center justify-between ${
              isLight
                ? 'bg-slate-50 border-slate-200'
                : 'bg-slate-950/80 border-slate-800'
            }`}
          >
            <button
              onClick={onClose}
              className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                isLight
                  ? 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-emerald-500" />
              <h3 className="text-base font-bold urdu-title">
                ڈیش بورڈ فونٹ ترتیبات و فونٹ اپلوڈ
              </h3>
            </div>
          </div>

          <div className="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
            {/* Custom Font Upload Area */}
            <div
              className={`p-4 rounded-xl border-2 border-dashed transition-all ${
                isLight
                  ? 'bg-emerald-50/50 border-emerald-300 hover:border-emerald-500'
                  : 'bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-500'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".ttf,.otf,.woff,.woff2"
                className="hidden"
                onChange={handleFontFileChange}
              />

              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">
                    اپنا ذاتی اردو فونٹ اپلوڈ کریں (.TTF, .OTF, .WOFF)
                  </h4>
                  <p className="text-[11px] opacity-75 mt-0.5">
                    مثلاً جمیل نوری نستعلیق، مہر نستعلیق، القلم، یا کوئی بھی پسندیدہ خط
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="mt-1 py-2 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition-transform active:scale-95 disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>فونٹ انسٹال ہو رہا ہے...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>کمپیوٹر / موبائل سے فونٹ فائل چنیں</span>
                    </>
                  )}
                </button>

                {uploadSuccess && (
                  <p className="text-emerald-500 font-bold text-xs flex items-center gap-1 mt-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>فونٹ کامیابی سے ڈیش بورڈ میں انسٹال ہو گیا ہے!</span>
                  </p>
                )}

                {errorMessage && (
                  <p className="text-rose-500 font-bold text-xs mt-1">{errorMessage}</p>
                )}
              </div>
            </div>

            {/* Custom Uploaded Font status if present */}
            {customFontName && (
              <div
                onClick={() => onSelectFont('custom-uploaded', customFontName)}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  currentFontId === 'custom-uploaded'
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 ' +
                      (isLight ? 'bg-emerald-50' : 'bg-emerald-950/40')
                    : isLight
                    ? 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      currentFontId === 'custom-uploaded'
                        ? 'bg-emerald-600 text-white'
                        : isLight
                        ? 'bg-slate-200'
                        : 'bg-slate-700'
                    }`}
                  >
                    {currentFontId === 'custom-uploaded' && <Check className="w-3 h-3" />}
                  </div>
                  <div>
                    <span className="font-bold block text-xs">
                      🌟 آپ کا اپلوڈ کردہ فونٹ: {customFontName.replace('UserFont_', '')}
                    </span>
                    <span
                      className="text-xs opacity-75 block mt-0.5"
                      style={{ fontFamily: `"${customFontName}", serif` }}
                    >
                      یہ نمونہ آپ کے اپلوڈ شدہ فونٹ میں نظر آ رہا ہے۔
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-300">
                  انسٹال شدہ
                </span>
              </div>
            )}

            {/* Standard Preloaded Fonts */}
            <div className="space-y-2">
              <label className="font-bold block text-xs opacity-80">
                یا دستیاب خوبصورت اردو فونٹس میں سے منتخب کریں:
              </label>

              <div className="space-y-1.5">
                {PRESET_FONTS.map((font) => {
                  const isSelected = currentFontId === font.id;
                  return (
                    <div
                      key={font.id}
                      onClick={() => onSelectFont(font.id)}
                      className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? 'border-emerald-500 ring-2 ring-emerald-500/20 ' +
                            (isLight ? 'bg-emerald-50' : 'bg-emerald-950/40')
                          : isLight
                          ? 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                          : 'bg-slate-800/40 border-slate-700 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center ${
                            isSelected
                              ? 'bg-emerald-600 text-white'
                              : isLight
                              ? 'bg-slate-200'
                              : 'bg-slate-700'
                          }`}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5" />}
                        </div>
                        <div>
                          <span className="font-bold text-xs block">{font.name}</span>
                          <span
                            className="text-xs opacity-75 block mt-0.5"
                            style={{ fontFamily: font.family }}
                          >
                            {font.sample}
                          </span>
                        </div>
                      </div>
                      {isSelected && (
                        <span className="text-[10px] text-emerald-500 font-bold">فعال</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Font Size Adjuster */}
            <div
              className={`p-3 rounded-xl border space-y-2 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs">فونٹ سائز (متن کا سائز):</span>
                <span className="font-bold tabular-nums text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-300">
                  {fontSize}px
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onChangeFontSize(Math.max(13, fontSize - 1))}
                  className={`p-1.5 rounded-lg border flex items-center justify-center cursor-pointer ${
                    isLight ? 'bg-white border-slate-300' : 'bg-slate-800 border-slate-700'
                  }`}
                  title="فونٹ چھوٹا کریں"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>

                <input
                  type="range"
                  min={13}
                  max={28}
                  step={1}
                  value={fontSize}
                  onChange={(e) => onChangeFontSize(Number(e.target.value))}
                  className="flex-1 accent-emerald-600 cursor-pointer"
                />

                <button
                  type="button"
                  onClick={() => onChangeFontSize(Math.min(28, fontSize + 1))}
                  className={`p-1.5 rounded-lg border flex items-center justify-center cursor-pointer ${
                    isLight ? 'bg-white border-slate-300' : 'bg-slate-800 border-slate-700'
                  }`}
                  title="فونٹ بڑا کریں"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className={`p-3 border-t flex items-center justify-end ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
            }`}
          >
            <button
              onClick={onClose}
              className="py-1.5 px-5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs cursor-pointer transition-transform active:scale-95"
            >
              ٹھیک ہے، محفوظ کریں
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

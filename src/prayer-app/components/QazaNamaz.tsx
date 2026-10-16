import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronRight,
  Bell,
  Plus,
  Minus,
  Save,
  HelpCircle,
  X,
  Check,
  RotateCcw,
} from 'lucide-react';
import { usePrayer } from '../context/PrayerContext';
import { toUrduNumber } from '../../utils/date';

export const QazaNamaz: React.FC = () => {
  const {
    setActiveTab,
    qazaCounts,
    updateQazaCount,
    setQazaCountDirect,
    totalQaza,
    saveQaza,
  } = usePrayer();

  const [showMethodModal, setShowMethodModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const prayers = [
    { id: 'fajr', name: 'فجر', bg: 'bg-[#38bdf8]', text: 'text-white' },
    { id: 'dhuhr', name: 'ظہر', bg: 'bg-[#fbbf24]', text: 'text-slate-900' },
    { id: 'asr', name: 'عصر', bg: 'bg-[#fb923c]', text: 'text-white' },
    { id: 'maghrib', name: 'مغرب', bg: 'bg-[#818cf8]', text: 'text-white' },
    { id: 'isha', name: 'عشاء', bg: 'bg-[#1e3a8a]', text: 'text-white' },
    { id: 'witr', name: 'وتر', bg: 'bg-[#0f766e]', text: 'text-white' },
  ];

  const handleSave = () => {
    saveQaza();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] pb-24 text-right">
      {/* Red Header (Exact match to screenshot 3) */}
      <div className="bg-[#b91c1c] text-white px-4 py-3 flex items-center justify-between shadow-md">
        <button
          onClick={() => setActiveTab('home')}
          title="واپس جائیں"
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
        >
          <ChevronRight className="w-5 h-5 rtl:rotate-0" />
        </button>

        <h1 className="text-xl font-bold urdu-title">
          قضا نمازیں
        </h1>

        <div className="w-8" />
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Method Banner (Exact match to screenshot 3 with Dome illustration) */}
        <div
          onClick={() => setShowMethodModal(true)}
          className="bg-gradient-to-l from-amber-200 via-amber-100 to-amber-50 rounded-2xl p-3 border border-amber-300/80 shadow-xs flex items-center justify-between cursor-pointer hover:shadow-sm transition-all active:scale-98"
        >
          {/* Left Mini Green Dome Illustration */}
          <div className="w-14 h-14 relative shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs">
              <path d="M20 70 C20 40 40 25 50 25 C60 25 80 40 80 70 Z" fill="#15803d" />
              <rect x="20" y="70" width="60" height="12" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
              <circle cx="50" cy="18" r="4" fill="#eab308" />
            </svg>
          </div>

          {/* Right Text */}
          <div className="text-right flex items-center gap-2">
            <span className="text-sm font-bold text-slate-800 urdu-title">
              قضاء نماز کا طریقہ
            </span>
            <span className="text-base text-amber-700">👆</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-800 urdu-title">
            قضا نمازیں
          </h2>
        </div>

        {/* List of 6 Prayers (Exact cards matching Screenshot 3) */}
        <div className="space-y-3">
          {prayers.map((p) => {
            const count = qazaCounts[p.id] || 0;

            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center overflow-hidden h-16"
              >
                {/* Left Colored Badge with Name & Bell (Exact match to screenshot 3) */}
                <div
                  className={`w-32 h-full ${p.bg} ${p.text} flex items-center justify-between px-3 shrink-0`}
                >
                  <div className="flex flex-col items-center">
                    <Bell className="w-4 h-4 opacity-80" />
                    <span className="text-[10px] font-mono mt-0.5 opacity-90">00:00</span>
                  </div>
                  <span className="text-base font-bold urdu-title">{p.name}</span>
                </div>

                {/* Right Counter with [-] [Value] [+] */}
                <div className="flex-1 flex items-center justify-evenly px-3">
                  {/* Plus Button */}
                  <button
                    onClick={() => updateQazaCount(p.id, 1)}
                    className="w-8 h-8 rounded-full border border-slate-300 hover:border-emerald-600 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 flex items-center justify-center cursor-pointer transition-colors active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                  </button>

                  {/* Count Value Input */}
                  <div className="w-16 text-center border-b-2 border-slate-400 py-1">
                    <input
                      type="number"
                      value={count}
                      onChange={(e) => setQazaCountDirect(p.id, parseInt(e.target.value) || 0)}
                      className="w-full text-center font-bold text-lg text-slate-800 focus:outline-none bg-transparent"
                    />
                  </div>

                  {/* Minus Button */}
                  <button
                    onClick={() => updateQazaCount(p.id, -1)}
                    className="w-8 h-8 rounded-full border border-slate-300 hover:border-rose-600 hover:bg-rose-50 text-slate-700 hover:text-rose-700 flex items-center justify-center cursor-pointer transition-colors active:scale-95"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Bar: مجموعی عدد & محفوظ کیجئے Button (Exact match to screenshot 3) */}
        <div className="pt-2 flex items-center gap-3">
          {/* Save Button */}
          <button
            onClick={handleSave}
            className="flex-1 py-3 px-4 bg-[#b91c1c] hover:bg-[#991b1b] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all active:scale-95"
          >
            {saveSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>محفوظ ہو گیا!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>محفوظ کیجئے</span>
              </>
            )}
          </button>

          {/* Total Count Display */}
          <div className="flex-1 py-3 px-3 rounded-xl border-2 border-sky-600 bg-white text-center">
            <span className="text-xs text-slate-500 ml-1">مجموعی عدد:</span>
            <span className="text-lg font-bold text-slate-900 tabular-nums">
              {toUrduNumber(totalQaza)}
            </span>
          </div>
        </div>
      </div>

      {/* Shariah Method Modal */}
      <AnimatePresence>
        {showMethodModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-5 text-right shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b pb-2">
                <button
                  onClick={() => setShowMethodModal(false)}
                  className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
                <h3 className="text-base font-bold text-slate-900 urdu-title">
                  قضاء نمازوں کی ادائیگی کا شرعی طریقہ
                </h3>
              </div>

              <div className="text-xs text-slate-700 leading-relaxed font-urdu space-y-2 max-h-80 overflow-y-auto pr-1">
                <p>
                  <strong>۱. نیت کا طریقہ:</strong> دل میں پختہ ارادہ کافی ہے، زبان سے کہیں: "میں اپنی سب سے پہلی قضاء فجر (یا جو بھی نماز ہو) اللہ کے واسطے ادا کرتا ہوں۔"
                </p>
                <p>
                  <strong>۲. کونسی نمازیں قضاء کی جائیں گی:</strong> پانچوں وقت کے فرائض اور عشاء کے تین وتر، یعنی ایک دن کی کل ۲۰ رکعتیں قضاء ہوتی ہیں۔
                </p>
                <p>
                  <strong>۳. آسانی کا طریقہ:</strong> قضاءِ عمری کی ادائیگی میں سورتیں چھوٹی پڑھ سکتے ہیں، رکوع اور سجود میں تین تین بار تسبیح پڑھیں اور تشہد کے بعد مختصر درود و دعا پڑھ سکتے ہیں تاکہ جلد مکمل ہوں۔
                </p>
                <p>
                  <strong>۴. اوقات:</strong> طلوعِ آفتاب، غروبِ آفتاب اور نصف النہار (زوال) کے مکروہ اوقات کے علاوہ دن یا رات کے کسی بھی وقت قضاء پڑھی جا سکتی ہے۔
                </p>
              </div>

              <button
                onClick={() => setShowMethodModal(false)}
                className="w-full py-2 bg-slate-900 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                سمجھ گیا / بند کریں
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

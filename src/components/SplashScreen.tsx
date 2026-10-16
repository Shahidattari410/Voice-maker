import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowLeft, BookOpen } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SplashScreen: React.FC = () => {
  const { showSplash, setShowSplash, activeTemplate } = useApp();

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-sky-50 via-white to-blue-50 overflow-y-auto p-4 select-none"
        >
          {/* Top Hexagonal Geometric Pattern (matching screenshot 3) */}
          <div className="absolute top-0 left-0 right-0 h-40 pointer-events-none opacity-40 overflow-hidden">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="hex-grid" width="34" height="58.88" patternUnits="userSpaceOnUse" patternTransform="scale(1)">
                  <path
                    d="M17 0 L34 9.8 L34 29.4 L17 39.2 L0 29.4 L0 9.8 Z M17 58.88 L34 49.08 L34 29.48 L17 39.28 L0 29.48 L0 49.08 Z"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="1.2"
                    strokeOpacity="0.4"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#hex-grid)" />
            </svg>
          </div>

          <div className="relative z-10 w-full max-w-md mx-auto text-center flex flex-col items-center py-6">
            {/* Semicircular Dial Graphic (Exact match to screenshot 3) */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring' }}
              className="relative w-72 h-44 mb-6 flex items-end justify-center"
            >
              <svg viewBox="0 0 320 180" className="w-full h-full drop-shadow-sm">
                <defs>
                  {/* Radial gradient for the arc */}
                  <linearGradient id="blueDialGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0284c7" />
                    <stop offset="50%" stopColor="#0369a1" />
                    <stop offset="100%" stopColor="#0284c7" />
                  </linearGradient>
                </defs>

                {/* Outer Semicircle Track */}
                <path
                  d="M 20 170 A 140 140 0 0 1 300 170"
                  fill="none"
                  stroke="url(#blueDialGrad)"
                  strokeWidth="60"
                  strokeLinecap="round"
                />

                {/* Dial Radial Dividers / Sectors */}
                <line x1="160" y1="30" x2="160" y2="90" stroke="#ffffff" strokeWidth="2.5" />
                <line x1="88" y1="62" x2="122" y2="108" stroke="#ffffff" strokeWidth="2.5" />
                <line x1="232" y1="62" x2="198" y2="108" stroke="#ffffff" strokeWidth="2.5" />
                <line x1="42" y1="126" x2="98" y2="136" stroke="#ffffff" strokeWidth="2.5" />
                <line x1="278" y1="126" x2="222" y2="136" stroke="#ffffff" strokeWidth="2.5" />

                {/* 6 Icons inside sectors */}
                {/* 1. Writing / Notepad */}
                <g transform="translate(42, 110) scale(0.7)" fill="none" stroke="#ffffff" strokeWidth="2">
                  <rect x="0" y="0" width="16" height="18" rx="2" />
                  <line x1="4" y1="5" x2="12" y2="5" />
                  <line x1="4" y1="10" x2="12" y2="10" />
                </g>

                {/* 2. Handshake / Brotherhood */}
                <g transform="translate(74, 52) scale(0.75)" fill="none" stroke="#ffffff" strokeWidth="2">
                  <path d="M4 14 L10 8 L16 12 L22 6" />
                  <circle cx="8" cy="8" r="2" />
                  <circle cx="18" cy="8" r="2" />
                </g>

                {/* 3. Islamic Dress / Amama */}
                <g transform="translate(142, 38) scale(0.8)" fill="none" stroke="#ffffff" strokeWidth="2">
                  <path d="M12 2 C8 2 8 8 12 8 C16 8 16 2 12 2 Z" />
                  <path d="M6 14 C6 10 18 10 18 14 L18 24 L6 24 Z" />
                </g>

                {/* 4. Finger on lips (Qufl-e-Madina silence) */}
                <g transform="translate(198, 48) scale(0.75)" fill="none" stroke="#ffffff" strokeWidth="2">
                  <path d="M10 4 C14 4 16 8 16 14 C16 18 12 22 8 22" />
                  <line x1="12" y1="10" x2="12" y2="18" strokeWidth="3" />
                </g>

                {/* 5. Sajdah / Namaz prayer */}
                <g transform="translate(244, 76) scale(0.7)" fill="none" stroke="#ffffff" strokeWidth="2">
                  <circle cx="16" cy="6" r="3" />
                  <path d="M4 20 L10 14 L14 16 L20 10" />
                </g>

                {/* 6. Quran / Rehl */}
                <g transform="translate(260, 116) scale(0.7)" fill="none" stroke="#ffffff" strokeWidth="2">
                  <path d="M4 16 L12 8 L20 16 M12 8 L12 2" />
                  <line x1="2" y1="18" x2="22" y2="18" />
                </g>

                {/* White Inner Arc Boundary with circular check pins */}
                <path
                  d="M 52 170 A 108 108 0 0 1 268 170"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="8"
                />

                {/* Dial indicator circular dots with ticks */}
                {[
                  { cx: 70, cy: 140 },
                  { cx: 92, cy: 104 },
                  { cx: 128, cy: 78 },
                  { cx: 160, cy: 70 },
                  { cx: 192, cy: 78 },
                  { cx: 228, cy: 104 },
                  { cx: 250, cy: 140 },
                ].map((pin, i) => (
                  <g key={i}>
                    <circle cx={pin.cx} cy={pin.cy} r="10" fill="#ffffff" stroke="#0284c7" strokeWidth="2.5" />
                    <path
                      d={`M ${pin.cx - 4} ${pin.cy} L ${pin.cx - 1} ${pin.cy + 3} L ${pin.cx + 5} ${pin.cy - 3}`}
                      fill="none"
                      stroke="#0284c7"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </g>
                ))}
              </svg>
            </motion.div>

            {/* Central Urdu Calligraphy "نیک اعمال" */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="relative -mt-16 mb-4 z-20"
            >
              <div className="text-5xl md:text-6xl font-bold tracking-tight text-[#0284c7] drop-shadow-sm urdu-title">
                نیک اعمال
              </div>
            </motion.div>

            {/* Template Badge and Subtitle */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-3 mb-6"
            >
              <span className="inline-block px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-xs font-semibold mb-2">
                {activeTemplate.title}
              </span>
              <p className="text-slate-600 text-sm max-w-xs mx-auto leading-relaxed">
                {activeTemplate.subtitle}
              </p>
            </motion.div>

            {/* Primary Action Button */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="w-full max-w-xs flex flex-col gap-2"
            >
              <button
                onClick={() => setShowSplash(false)}
                className="w-full py-3.5 px-6 bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-700 hover:to-blue-800 text-white font-bold rounded-xl shadow-lg shadow-sky-600/25 flex items-center justify-center gap-2 transition-all active:scale-98 text-base cursor-pointer"
              >
                <span>اپنے اعمال کا جائزہ شروع کریں</span>
                <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
              </button>

              <p className="text-[11px] text-slate-400 mt-1">
                حاسِبُوا اَنفُسَکُم قَبلَ اَن تُحَاسَبُوا (اپنے اعمال کا محاسبہ کرو)
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

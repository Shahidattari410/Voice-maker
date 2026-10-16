import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePrayer } from '../context/PrayerContext';

export const PrayerSplash: React.FC = () => {
  const { showSplash, setShowSplash } = usePrayer();

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-[#faf8f5] flex flex-col items-center justify-between p-6 select-none overflow-hidden"
        >
          {/* Subtle Islamic Geometric Pattern Background (matching screenshot 1) */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="islamic-tile" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path
                    d="M20 0 L40 20 L20 40 L0 20 Z M20 8 L32 20 L20 32 L8 20 Z"
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth="0.8"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#islamic-tile)" />
            </svg>
          </div>

          <div className="w-full flex-1 flex flex-col items-center justify-center relative z-10">
            {/* Center Circular Clock & Green Dome (Exact match to screenshot 1) */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring' }}
              className="relative w-64 h-64 mb-6 flex items-center justify-center"
            >
              <svg viewBox="0 0 280 280" className="w-full h-full drop-shadow-md">
                <defs>
                  {/* Radial dial gradient (orange top, crimson bottom) */}
                  <linearGradient id="clockDialGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="60%" stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#b91c1c" />
                  </linearGradient>
                </defs>

                {/* Outer Circular Dial with Hour Markers */}
                <circle cx="140" cy="140" r="115" fill="url(#clockDialGrad)" />
                <circle cx="140" cy="140" r="115" fill="none" stroke="#ffffff" strokeWidth="4" />

                {/* Dial Tick Marks (60 ticks) */}
                {Array.from({ length: 36 }).map((_, i) => {
                  const angle = (i * 10 * Math.PI) / 180;
                  const isMajor = i % 3 === 0;
                  const r1 = 110;
                  const r2 = isMajor ? 96 : 103;
                  const x1 = 140 + r1 * Math.sin(angle);
                  const y1 = 140 - r1 * Math.cos(angle);
                  const x2 = 140 + r2 * Math.sin(angle);
                  const y2 = 140 - r2 * Math.cos(angle);
                  return (
                    <line
                      key={i}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="#ffffff"
                      strokeWidth={isMajor ? 3 : 1.5}
                      strokeLinecap="round"
                    />
                  );
                })}

                {/* Green Dome of Masjid Nabawi (گنبدِ خضراء) */}
                <g transform="translate(42, 60)">
                  {/* Base Zig-Zag Chevron Pattern */}
                  <g transform="translate(18, 108)">
                    <rect x="0" y="0" width="160" height="24" fill="#ffffff" stroke="#1e293b" strokeWidth="2" />
                    {/* Black & White Chevron zigzag tiles */}
                    <path
                      d="M0 0 L10 12 L0 24 M20 0 L30 12 L20 24 M40 0 L50 12 L40 24 M60 0 L70 12 L60 24 M80 0 L90 12 L80 24 M100 0 L110 12 L100 24 M120 0 L130 12 L120 24 M140 0 L150 12 L140 24"
                      stroke="#0f172a"
                      strokeWidth="5"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </g>

                  {/* Arched Windows band below dome */}
                  <g transform="translate(20, 92)">
                    <rect x="0" y="0" width="156" height="18" fill="#1d4ed8" rx="2" />
                    {[8, 26, 44, 62, 80, 98, 116, 134].map((x, idx) => (
                      <path
                        key={idx}
                        d={`M${x} 14 L${x} 6 Q${x + 5} 0 ${x + 10} 6 L${x + 10} 14 Z`}
                        fill="#ffffff"
                      />
                    ))}
                  </g>

                  {/* The Green Dome Body */}
                  <path
                    d="M 22 96 C 22 36, 68 18, 98 18 C 128 18, 174 36, 174 96 Z"
                    fill="#15803d"
                    stroke="#ffffff"
                    strokeWidth="3.5"
                  />

                  {/* Golden Pinnacle / Spire */}
                  <g transform="translate(94, -6)">
                    <rect x="2.5" y="6" width="3" height="18" fill="#eab308" />
                    <circle cx="4" cy="5" r="3" fill="#eab308" />
                    <circle cx="4" cy="0" r="2" fill="#ca8a04" />
                    <path d="M4 -5 L7 -1 L1 -1 Z" fill="#eab308" />
                  </g>
                </g>
              </svg>
            </motion.div>

            {/* English Title "Prayer Times" (Exact match to screenshot 1) */}
            <motion.h2
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight font-sans"
            >
              Prayer Times
            </motion.h2>

            {/* Arabic Calligraphy "مواقيت الصلاة" (Exact match to screenshot 1) */}
            <motion.h3
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl font-bold text-slate-800 mt-1 font-serif"
              dir="rtl"
            >
              مواقيت الصلاة
            </motion.h3>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              onClick={() => setShowSplash(false)}
              className="mt-6 py-2 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-bold shadow-md cursor-pointer transition-all active:scale-95"
            >
              اوقات دیکھیں ←
            </motion.button>
          </div>

          {/* Bottom Powered By Dawat-e-Islami (Exact match to screenshot 1) */}
          <div className="relative z-10 text-center pb-4">
            {/* Dawat-e-Islami Logo Leaf Symbol */}
            <div className="w-12 h-12 mx-auto mb-1 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <path
                  d="M50 5 C25 25 15 60 50 95 C85 60 75 25 50 5 Z"
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="5"
                />
                <path
                  d="M50 20 C35 38 30 58 50 82 C70 58 65 38 50 20 Z"
                  fill="#16a34a"
                  opacity="0.15"
                />
                {/* Arabic Calligraphy 'دعوت اسلامی' */}
                <text
                  x="50"
                  y="58"
                  textAnchor="middle"
                  fill="#16a34a"
                  fontSize="22"
                  fontWeight="bold"
                  fontFamily="serif"
                >
                  دعوت
                </text>
                <text
                  x="50"
                  y="74"
                  textAnchor="middle"
                  fill="#16a34a"
                  fontSize="16"
                  fontWeight="bold"
                  fontFamily="serif"
                >
                  اسلامی
                </text>
              </svg>
            </div>
            <p className="text-xs text-slate-600 font-sans font-semibold">
              Powered By
            </p>
            <p className="text-sm font-bold text-slate-800 font-sans tracking-wide">
              Dawat-e-Islami
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

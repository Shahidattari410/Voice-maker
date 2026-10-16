import React from 'react';
import { motion } from 'motion/react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  BarChart2,
  PlusCircle,
  FileSpreadsheet,
  CheckCircle,
  HelpCircle,
  Sliders,
  CalendarCheck,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CategoryId } from '../types';
import { formatDateUrdu, shiftDate, toUrduNumber, getHijriDateUrdu, getTodayDateString } from '../utils/date';
import { THEMES } from '../data/themes';

export const DashboardView: React.FC = () => {
  const {
    setView,
    setSelectedCategory,
    activeDate,
    setActiveDate,
    activeTemplate,
    categoryStats,
    overallPercentage,
    activeThemeId,
    setIsAddQuestionOpen,
    setIsPrintOpen,
  } = useApp();

  const theme = THEMES[activeThemeId];
  const dateInfo = formatDateUrdu(activeDate);
  const hijriDate = getHijriDateUrdu(activeDate);
  const isToday = activeDate === getTodayDateString();

  const handleCategoryClick = (catId: CategoryId) => {
    setSelectedCategory(catId);
    setView('workplan');
  };

  // Helper for Circular Donut SVG
  const renderProgressRing = (percentage: number, color: string, size = 76, stroke = 7) => {
    const radius = size / 2;
    const normalizedRadius = radius - stroke / 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative shrink-0 flex items-center justify-center" style={{ width: size, height: size }}>
        <svg height={size} width={size} className="rotate-[-90deg]">
          {/* Background track */}
          <circle
            stroke="#e2e8f0"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Active progress */}
          <circle
            stroke={color}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease-in-out' }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm sm:text-base font-bold text-slate-800 tabular-nums font-urdu">
            {toUrduNumber(percentage)}٪
          </span>
        </div>
      </div>
    );
  };

  // Helper for mini bar chart graphic (matching screenshot 4)
  const renderMiniBarChart = (color: string) => {
    return (
      <div className="w-7 h-7 flex items-end justify-center gap-1 opacity-80 shrink-0">
        <div className="w-1.5 h-3.5 rounded-xs" style={{ backgroundColor: color }} />
        <div className="w-1.5 h-6 rounded-xs" style={{ backgroundColor: color }} />
        <div className="w-1.5 h-4.5 rounded-xs" style={{ backgroundColor: color }} />
      </div>
    );
  };

  // Overall stats summary
  const totalQuestions = Object.values(categoryStats).reduce((acc, c) => acc + c.total, 0);
  const doneQuestions = Object.values(categoryStats).reduce((acc, c) => acc + c.done, 0);

  return (
    <div className={`min-h-[calc(100vh-120px)] ${theme.pageBg} py-3 px-3 transition-colors duration-200 font-urdu`}>
      <div className="max-w-2xl mx-auto space-y-3">
        {/* Date & Performance Bar (بھیجی گئی تصاویر کے مطابق باوقار سسٹم) */}
        <div className="bg-white/90 backdrop-blur-xs rounded-xl border border-slate-200 shadow-xs p-2.5 flex items-center justify-between gap-2 text-xs text-slate-800">
          {/* Next Day */}
          <button
            onClick={() => setActiveDate(shiftDate(activeDate, 1))}
            title="اگلا دن"
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all cursor-pointer active:scale-95 shrink-0"
          >
            <ChevronRight className="w-4 h-4 rtl:rotate-0" />
            <span className="hidden sm:inline">اگلا دن</span>
          </button>

          {/* Date Info Center */}
          <div className="text-center flex-1">
            <div className="flex items-center justify-center gap-1.5">
              <span className="font-bold text-slate-900 text-xs sm:text-sm urdu-title">
                {dateInfo.formatted}
              </span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-md font-semibold">
                {hijriDate}
              </span>
            </div>
            <div className="flex items-center justify-center gap-2 mt-0.5 text-[11px] text-slate-600">
              <span>
                مجموعی کارکردگی:{' '}
                <span className="font-bold text-emerald-600 tabular-nums">
                  {toUrduNumber(overallPercentage)}٪
                </span>
              </span>
              <span>•</span>
              <span>
                مکمل شدہ: <span className="font-bold text-slate-800">{toUrduNumber(doneQuestions)}</span> / {toUrduNumber(totalQuestions)}
              </span>
            </div>
          </div>

          {/* Today + Previous Day */}
          <div className="flex items-center gap-1 shrink-0">
            {!isToday && (
              <button
                onClick={() => setActiveDate(getTodayDateString())}
                title="آج کی تاریخ پر جائیں"
                className="px-2 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-700 transition-all cursor-pointer active:scale-95"
              >
                آج
              </button>
            )}
            <button
              onClick={() => setActiveDate(shiftDate(activeDate, -1))}
              title="پچھلا دن"
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all cursor-pointer active:scale-95"
            >
              <span className="hidden sm:inline">پچھلا دن</span>
              <ChevronLeft className="w-4 h-4 rtl:rotate-0" />
            </button>
          </div>
        </div>

        {/* Category Cards (Exact structure of Screenshot 4) */}
        <div className="space-y-2.5">
          {activeTemplate.categories.map((cat, idx) => {
            const stat = categoryStats[cat.id] || { total: 0, done: 0, percentage: 0 };
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                onClick={() => handleCategoryClick(cat.id)}
                className="bg-white hover:bg-slate-50/90 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md p-3.5 flex items-center justify-between gap-3 cursor-pointer transition-all active:scale-[0.99] group"
              >
                {/* Right: Circular Progress Ring (matching screenshot 4) */}
                <div className="shrink-0">
                  {renderProgressRing(stat.percentage, cat.color, 76, 7)}
                </div>

                {/* Center: Title & Question count button & Description */}
                <div className="flex-1 text-right pr-1 sm:pr-3">
                  <div className="flex items-center gap-2 justify-start">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 urdu-title group-hover:text-emerald-700 transition-colors">
                      {cat.title}
                    </h3>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCategoryClick(cat.id);
                    }}
                    className="mt-1.5 inline-flex items-center gap-1.5 text-xs md:text-sm font-semibold text-emerald-700 hover:text-emerald-900 transition-colors cursor-pointer bg-emerald-50/80 hover:bg-emerald-100/80 px-2.5 py-0.5 rounded-md border border-emerald-200/60"
                  >
                    <span>{toUrduNumber(stat.total)} سوالات دیکھیں</span>
                    <span className="text-emerald-500">←</span>
                  </button>

                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                    {cat.description}
                  </p>
                </div>

                {/* Left: Mini bar chart graphic + Arrow (matching screenshot 4) */}
                <div className="shrink-0 flex items-center gap-2">
                  {renderMiniBarChart(cat.color)}
                  <ChevronLeft className="w-5 h-5 text-slate-300 group-hover:text-slate-600 transition-colors rtl:rotate-0" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Action Buttons (فوری اختیارات و ٹولز) */}
        <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-xs space-y-2">
          <div className="text-xs font-bold text-slate-600 text-center mb-1">
            فوری اختیارات و ٹولز
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => {
                setSelectedCategory('all');
                setView('workplan');
              }}
              className="py-2.5 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>تمام اعمال</span>
            </button>

            <button
              onClick={() => setIsAddQuestionOpen(true)}
              className="py-2.5 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>نیا سوال</span>
            </button>

            <button
              onClick={() => setView('reports')}
              className="py-2.5 px-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>ماہانہ رپورٹ</span>
            </button>

            <button
              onClick={() => setIsPrintOpen(true)}
              className="py-2.5 px-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>پرنٹ کارنامہ</span>
            </button>
          </div>
        </div>

        {/* Motivational Hadith / Quote Footer */}
        <div className="p-3 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl text-center text-xs text-emerald-950 shadow-2xs">
          <p className="font-urdu leading-relaxed text-sm font-semibold text-emerald-900">
            «حاسِبُوا اَنفُسَکُم قَبلَ اَن تُحَاسَبُوا وَزِنُوا قَبلَ اَن تُوزَنُوا»
          </p>
          <p className="text-[11px] text-emerald-700 mt-1">
            (اپنے اعمال کا محاسبہ کر لو اس سے پہلے کہ تمہارا حساب لیا جائے - حضرت عمر فاروق رضی اللہ عنہ)
          </p>
        </div>
      </div>
    </div>
  );
};

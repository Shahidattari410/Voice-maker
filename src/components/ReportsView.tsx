import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  FileSpreadsheet,
  Printer,
  TrendingUp,
  Award,
  Calendar,
  Check,
  X,
  Minus,
  Sparkles,
  Share2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { THEMES } from '../data/themes';
import { toUrduNumber } from '../utils/date';

export const ReportsView: React.FC = () => {
  const {
    activeThemeId,
    activeTemplate,
    allQuestions,
    answers,
    monthlyStats,
    setIsPrintOpen,
  } = useApp();

  const theme = THEMES[activeThemeId];

  // Past 6 months list (Exact match to screenshot 1: جنوری, دسمبر, نومبر, اکتوبر, ستمبر, اگست)
  const months = [
    { id: 'jan', label: 'جنوری', year: '2026', totalScore: 47 },
    { id: 'dec', label: 'دسمبر', year: '2025', totalScore: 41 },
    { id: 'nov', label: 'نومبر', year: '2025', totalScore: 36 },
    { id: 'oct', label: 'اکتوبر', year: '2025', totalScore: 28 },
    { id: 'sep', label: 'ستمبر', year: '2025', totalScore: 24 },
    { id: 'aug', label: 'اگست', year: '2025', totalScore: 19 },
  ];

  // Specific matrix items from screenshot 1:
  // 1. روزانہ کم از کم 12 بار لکھ کر گفتگو؟
  // 2. روزانہ کم از کم 12 بار اشارے سے گفتگو؟
  // 3. روزانہ کم از کم 12 بار سامنے والے کے چہرے پر نظریں گاڑے بغیر گفتگو؟
  // Plus questions from the active template!
  const [matrixData, setMatrixData] = useState<Record<string, Record<string, boolean>>>({
    qufl1: { jan: false, dec: false, nov: false, oct: false, sep: false, aug: false },
    qufl2: { jan: true, dec: false, nov: false, oct: false, sep: false, aug: false },
    qufl3: { jan: false, dec: false, nov: false, oct: false, sep: false, aug: false },
    q1: { jan: true, dec: true, nov: true, oct: false, sep: false, aug: false },
    q2: { jan: true, dec: true, nov: true, oct: true, sep: false, aug: false },
    q4: { jan: true, dec: false, nov: true, oct: false, sep: false, aug: false },
    w1: { jan: true, dec: true, nov: false, oct: false, sep: false, aug: false },
    w2: { jan: true, dec: true, nov: true, oct: false, sep: false, aug: false },
  });

  const toggleMonthStatus = (questionId: string, monthId: string) => {
    setMatrixData((prev) => {
      const qRow = { ...(prev[questionId] || {}) };
      qRow[monthId] = !qRow[monthId];
      return { ...prev, [questionId]: qRow };
    });
  };

  // Featured sample questions for the report matrix
  const reportQuestions = allQuestions.slice(0, 10);

  return (
    <div className={`min-h-[calc(100vh-120px)] ${theme.pageBg} py-3 px-2.5 transition-colors duration-200`}>
      <div className="max-w-2xl mx-auto space-y-3">
        {/* Top Summary Banner */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-3 flex items-center justify-between gap-3">
          <div className="text-right">
            <h2 className="text-base font-bold text-slate-900 urdu-title">
              ماہانہ تقابلی جائزہ و کارکردگی
            </h2>
            <p className="text-xs text-slate-500">
              گزشتہ ۶ ماہ کا تفصیلی ریکارڈ و محاسبہ
            </p>
          </div>

          <button
            onClick={() => setIsPrintOpen(true)}
            className="py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-95 shrink-0"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>پرنٹ / محفوظ کریں</span>
          </button>
        </div>

        {/* Matrix Cards (Exact Structure and Layout of Screenshot 1) */}
        <div className="space-y-3">
          {reportQuestions.map((q, idx) => {
            const rowStatuses = matrixData[q.id] || {};

            return (
              <div
                key={q.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs p-3.5 text-right space-y-3"
              >
                {/* Question Title Header */}
                <div className="font-bold text-slate-900 text-sm md:text-base urdu-title leading-relaxed">
                  <span className="text-emerald-700 font-bold ml-1">{toUrduNumber(idx + 1)}-</span>
                  <span>{q.text}</span>
                </div>

                {/* 6 Months Columns Row (Matching screenshot 1 exactly) */}
                <div className="grid grid-cols-6 gap-1 pt-1 border-t border-slate-100">
                  {months.map((m) => {
                    const isDone = rowStatuses[m.id];

                    return (
                      <div
                        key={m.id}
                        onClick={() => toggleMonthStatus(q.id, m.id)}
                        className="flex flex-col items-center justify-center p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group"
                      >
                        {/* Checkmark or Cross (Matching Screenshot 1) */}
                        <div className="h-7 flex items-center justify-center">
                          {isDone ? (
                            <span className="text-emerald-600 font-bold text-xl leading-none">
                              ✓
                            </span>
                          ) : (
                            <span className="text-slate-300 group-hover:text-slate-400 font-bold text-base leading-none">
                              ✕
                            </span>
                          )}
                        </div>

                        {/* Month Label (جنوری، دسمبر، نومبر، اکتوبر، ستمبر، اگست) */}
                        <span className="text-[11px] md:text-xs font-medium text-slate-600 urdu-content mt-1">
                          {m.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Bottom Score Row (Exact match to row 4 of Screenshot 1) */}
          {/* "اس ماہ 72 نیک اعمال میں سے کتنے پر عمل کی کوشش رہی؟" */}
          <div className="bg-white rounded-xl border-2 border-emerald-500/30 shadow-xs p-3.5 text-right space-y-3">
            <div className="font-bold text-slate-900 text-sm md:text-base urdu-title">
              <span className="text-emerald-700 font-bold ml-1">★-</span>
              <span>اس ماہ ۷۲ نیک اعمال میں سے کتنے پر عمل کی کوشش رہی؟</span>
            </div>

            <div className="grid grid-cols-6 gap-1 pt-1 border-t border-slate-100">
              {months.map((m) => (
                <div
                  key={m.id}
                  className="flex flex-col items-center justify-center p-1.5"
                >
                  {/* Score Number with Underline (Exact match to screenshot 1: 47, 41, 36, 2, 2, 2) */}
                  <div className="h-7 flex items-center justify-center border-b-2 border-slate-300 w-full text-center">
                    <span className="text-sm md:text-base font-bold text-slate-800 tabular-nums">
                      {toUrduNumber(m.totalScore)}
                    </span>
                  </div>

                  {/* Month Label */}
                  <span className="text-[11px] md:text-xs font-medium text-slate-600 urdu-content mt-1">
                    {m.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Motivational Card */}
        <div className="bg-gradient-to-r from-sky-50 to-emerald-50 border border-sky-100 rounded-xl p-3.5 text-center space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-sky-800 font-bold text-xs">
            <Award className="w-4 h-4 text-amber-500" />
            <span>ماشاءاللہ! مسلسل بہتری کی طرف سفر جاری ہے</span>
          </div>
          <p className="text-[11px] text-slate-600 font-urdu leading-relaxed">
            ہر ماہ کے اختتام پر اپنے رسالے کا حساب لگائیں تاکہ کمیوں کی تلافی اور اگلے ماہ مزید استقامت نصیب ہو۔
          </p>
        </div>
      </div>
    </div>
  );
};

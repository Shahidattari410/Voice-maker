import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Printer, Download, Check, Minus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatDateUrdu, toUrduNumber } from '../utils/date';

export const PrintReportModal: React.FC = () => {
  const {
    isPrintOpen,
    setIsPrintOpen,
    activeDate,
    activeTemplate,
    allQuestions,
    answers,
    categoryStats,
    overallPercentage,
  } = useApp();

  const dateInfo = formatDateUrdu(activeDate);

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      {isPrintOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden text-right max-h-[92vh] flex flex-col"
          >
            {/* Header */}
            <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="py-1 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>پرنٹ کریں (Print)</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold urdu-title">
                  کارنامہ نیک اعمال - پرنٹ ایبل رپورٹ
                </h3>
                <button
                  onClick={() => setIsPrintOpen(false)}
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Printable Content Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4 print:p-0 print:m-0" id="printable-report">
              {/* Document Header */}
              <div className="border-b-2 border-slate-800 pb-3 text-center">
                <div className="text-2xl font-bold text-slate-900 urdu-title">
                  نیک اعمال - روزانہ کارنامہ
                </div>
                <div className="text-sm font-semibold text-slate-600 font-urdu mt-0.5">
                  {activeTemplate.title}
                </div>
                <div className="text-xs text-slate-500 mt-1 font-mono">
                  تاریخ: {dateInfo.formatted} | مجموعی اسکور: {overallPercentage}%
                </div>
              </div>

              {/* Stats Summary Table */}
              <div className="grid grid-cols-5 gap-2 text-center text-xs">
                {activeTemplate.categories.map((c) => {
                  const s = categoryStats[c.id] || { total: 0, done: 0, percentage: 0 };
                  return (
                    <div key={c.id} className="p-2 border border-slate-200 rounded-lg bg-slate-50">
                      <div className="font-bold text-slate-800 text-[11px]">{c.title}</div>
                      <div className="text-sm font-bold text-emerald-700 mt-0.5 tabular-nums">
                        {toUrduNumber(s.percentage)}%
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {toUrduNumber(s.done)}/{toUrduNumber(s.total)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Deeds List Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <div className="bg-slate-100 font-bold p-2 border-b border-slate-200 flex justify-between">
                  <span>کیفیت (عمل)</span>
                  <span>نیک عمل کی تفصیل</span>
                  <span>شمار</span>
                </div>

                <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                  {allQuestions.map((q, idx) => {
                    const st = answers[q.id];
                    return (
                      <div key={q.id} className="p-2 flex items-center justify-between gap-3 text-right">
                        <div className="w-16 text-center shrink-0">
                          {st === 'done' ? (
                            <span className="font-bold text-emerald-600">✓ عمل ہوا</span>
                          ) : st === 'not_done' ? (
                            <span className="font-bold text-rose-500">✗ نہیں</span>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </div>
                        <div className="flex-1 pr-1">
                          <span className="font-medium text-slate-900">{q.text}</span>
                        </div>
                        <div className="w-8 text-center shrink-0 font-bold text-slate-600 tabular-nums">
                          {q.urduNumber || toUrduNumber(idx + 1)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer Stamp / Signature Line */}
              <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
                <div>
                  دستخط نگران / فرد: ________________
                </div>
                <div className="font-urdu">
                  یا اللہ عزوجل! ہمیں استقامت کے ساتھ نیک اعمال پر عمل کی توفیق عطا فرما۔ آمین
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

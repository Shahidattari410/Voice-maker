import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, PlusCircle, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CategoryId } from '../types';
import { toUrduNumber } from '../utils/date';

export const AddQuestionModal: React.FC = () => {
  const {
    isAddQuestionOpen,
    setIsAddQuestionOpen,
    addCustomQuestion,
    selectedCategory,
  } = useApp();

  const [text, setText] = useState('');
  const [subtext, setSubtext] = useState('');
  const [category, setCategory] = useState<CategoryId>(
    selectedCategory === 'all' ? 'daily' : selectedCategory
  );
  const [urduNumber, setUrduNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    addCustomQuestion({
      category,
      urduNumber: urduNumber.trim() || '★',
      text: text.trim(),
      subtext: subtext.trim() ? `(${subtext.trim()})` : undefined,
      type: 'boolean',
    });

    setText('');
    setSubtext('');
    setUrduNumber('');
    setIsAddQuestionOpen(false);
  };

  return (
    <AnimatePresence>
      {isAddQuestionOpen && (
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
            className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden text-right"
          >
            {/* Header */}
            <div className="bg-emerald-700 text-white px-4 py-3 flex items-center justify-between">
              <button
                onClick={() => setIsAddQuestionOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <h3 className="text-base font-bold urdu-title">
                نیا نیک عمل / سوال شامل کریں
              </h3>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-4 space-y-3.5">
              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  شعبہ (Category)
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CategoryId)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-600 bg-white"
                >
                  <option value="daily">روزانہ (Daily)</option>
                  <option value="qufl">قفل مدینہ (Qufl-e-Madina)</option>
                  <option value="weekly">ہفتہ وار (Weekly)</option>
                  <option value="monthly">ماہانہ (Monthly)</option>
                  <option value="yearly">سالانہ (Yearly)</option>
                </select>
              </div>

              {/* Number Badge */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  نمبر شمار (اختیاری)
                </label>
                <input
                  type="text"
                  value={urduNumber}
                  onChange={(e) => setUrduNumber(e.target.value)}
                  placeholder="مثلاً: ۵۷ یا ★"
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-600"
                />
              </div>

              {/* Question Text */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  نیک عمل کا سوال / متن <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="کیا آج آپ نے صلوٰۃ التسبیح پڑھی؟"
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-600 urdu-content"
                />
              </div>

              {/* Subtext / Kaash note */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  وضاحتی نوٹ یا ترغیب (کاش! ...) (اختیاری)
                </label>
                <input
                  type="text"
                  value={subtext}
                  onChange={(e) => setSubtext(e.target.value)}
                  placeholder="کاش! روزانہ یا ہفتہ میں ایک بار معمول بنائیں"
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-600 urdu-content"
                />
              </div>

              {/* Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddQuestionOpen(false)}
                  className="py-1.5 px-3 rounded-lg border border-slate-300 text-xs text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  منسوخ کریں
                </button>
                <button
                  type="submit"
                  className="py-1.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>شامل کریں</span>
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

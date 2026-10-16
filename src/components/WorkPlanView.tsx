import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Check,
  X,
  Minus,
  CheckCheck,
  RotateCcw,
  PlusCircle,
  Filter,
  Search,
  Volume2,
  Calendar,
  Sparkles,
  Trash2,
  Undo2,
  ArrowUpDown,
  SlidersHorizontal,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatDateUrdu, shiftDate, toUrduNumber } from '../utils/date';
import { THEMES } from '../data/themes';
import { CategoryId, AnswerStatus, SortOrder } from '../types';

export const WorkPlanView: React.FC = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    activeDate,
    setActiveDate,
    allQuestions,
    answers,
    setAnswer,
    markAll,
    clearDayAnswers,
    activeThemeId,
    setIsAddQuestionOpen,
    categoryStats,
    soundEnabled,
    deleteQuestion,
    restoreAllQuestions,
    deletedQuestionIds,
    sortOrder,
    setSortOrder,
    moveQuestionUp,
    moveQuestionDown,
  } = useApp();

  const theme = THEMES[activeThemeId];
  const dateInfo = formatDateUrdu(activeDate);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'pending' | 'done'>('all');
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);

  // Filter questions based on category, search, and status
  const filteredQuestions = allQuestions.filter((q) => {
    if (selectedCategory !== 'all' && q.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const matchText = q.text.toLowerCase().includes(searchQuery.toLowerCase());
      const matchSub = q.subtext?.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchText && !matchSub) return false;
    }
    const currentStatus = answers[q.id] || 'none';
    if (filterMode === 'done' && currentStatus !== 'done') return false;
    if (filterMode === 'pending' && currentStatus === 'done') return false;
    return true;
  });

  const categoriesList: { id: CategoryId | 'all'; title: string }[] = [
    { id: 'all', title: 'تمام' },
    { id: 'daily', title: 'روزانہ' },
    { id: 'qufl', title: 'قفل مدینہ' },
    { id: 'weekly', title: 'ہفتہ وار' },
    { id: 'monthly', title: 'ماہانہ' },
    { id: 'yearly', title: 'سالانہ' },
  ];

  return (
    <div className={`min-h-[calc(100vh-120px)] ${theme.pageBg} py-2 px-2.5 transition-colors duration-200`}>
      <div className="max-w-2xl mx-auto space-y-2">
        {/* Sleek Minimal Inline Date Navigation (No bulky heading box) */}
        <div className="flex items-center justify-between text-xs px-2 py-1 text-slate-700 bg-white/70 rounded-lg border border-slate-200/60 shadow-2xs">
          <button
            onClick={() => setActiveDate(shiftDate(activeDate, 1))}
            title="اگلا دن"
            className="flex items-center gap-1 font-bold text-slate-700 hover:text-slate-900 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>اگلا دن</span>
          </button>

          <div className="text-center">
            <span className="font-bold text-slate-900 text-sm urdu-title">
              {dateInfo.formatted}
            </span>
          </div>

          <button
            onClick={() => setActiveDate(shiftDate(activeDate, -1))}
            title="پچھلا دن"
            className="flex items-center gap-1 font-bold text-slate-700 hover:text-slate-900 cursor-pointer"
          >
            <span>پچھلا دن</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Category Tabs (Interactive Segmented Bar) */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs no-scrollbar">
          {categoriesList.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>

        {/* Search & Mini Action Buttons Row (چھوٹے چھوٹے پریمیم بٹن) */}
        <div className="bg-white rounded-xl p-2 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-2">
          {/* Quick Search */}
          <div className="relative flex-1 min-w-[140px]">
            <Search className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="نیک عمل تلاش کریں..."
              className="w-full text-xs pr-8 pl-2 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500 bg-slate-50 focus:bg-white"
            />
          </div>

          {/* Mini Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
            {/* Sorting Menu Toggle (ترتیب والے تمام بٹن) */}
            <div className="relative">
              <button
                onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
                className={`px-2 py-1 rounded-md text-[11px] font-bold border flex items-center gap-1 cursor-pointer transition-colors ${
                  sortOrder !== 'default'
                    ? 'bg-indigo-50 border-indigo-400 text-indigo-700'
                    : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
                title="اعمال کی ترتیب تبدیل کریں"
              >
                <ArrowUpDown className="w-3 h-3 text-indigo-600" />
                <span>
                  ترتیب:{' '}
                  {sortOrder === 'default'
                    ? 'اصل'
                    : sortOrder === 'pending_first'
                    ? 'غیر مکمل'
                    : sortOrder === 'done_first'
                    ? 'مکمل'
                    : sortOrder === 'alphabetical'
                    ? 'الف بائی'
                    : sortOrder === 'reverse'
                    ? 'الٹ'
                    : 'کسٹم'}
                </span>
              </button>

              {/* Dropdown for Sort Options */}
              {isSortMenuOpen && (
                <div className="absolute left-0 top-full mt-1 w-36 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-30 text-xs">
                  <button
                    onClick={() => {
                      setSortOrder('default');
                      setIsSortMenuOpen(false);
                    }}
                    className={`w-full text-right px-3 py-1.5 hover:bg-slate-50 flex items-center justify-between cursor-pointer ${
                      sortOrder === 'default' ? 'font-bold text-indigo-600 bg-indigo-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>اصل ترتیب (۱، ۲، ۳)</span>
                    {sortOrder === 'default' && <Check className="w-3 h-3" />}
                  </button>
                  <button
                    onClick={() => {
                      setSortOrder('pending_first');
                      setIsSortMenuOpen(false);
                    }}
                    className={`w-full text-right px-3 py-1.5 hover:bg-slate-50 flex items-center justify-between cursor-pointer ${
                      sortOrder === 'pending_first' ? 'font-bold text-indigo-600 bg-indigo-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>غیر مکمل اعمال پہلے</span>
                    {sortOrder === 'pending_first' && <Check className="w-3 h-3" />}
                  </button>
                  <button
                    onClick={() => {
                      setSortOrder('done_first');
                      setIsSortMenuOpen(false);
                    }}
                    className={`w-full text-right px-3 py-1.5 hover:bg-slate-50 flex items-center justify-between cursor-pointer ${
                      sortOrder === 'done_first' ? 'font-bold text-indigo-600 bg-indigo-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>مکمل شدہ اعمال پہلے</span>
                    {sortOrder === 'done_first' && <Check className="w-3 h-3" />}
                  </button>
                  <button
                    onClick={() => {
                      setSortOrder('alphabetical');
                      setIsSortMenuOpen(false);
                    }}
                    className={`w-full text-right px-3 py-1.5 hover:bg-slate-50 flex items-center justify-between cursor-pointer ${
                      sortOrder === 'alphabetical' ? 'font-bold text-indigo-600 bg-indigo-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>حروفِ تہجی (الف، ب، ت)</span>
                    {sortOrder === 'alphabetical' && <Check className="w-3 h-3" />}
                  </button>
                  <button
                    onClick={() => {
                      setSortOrder('reverse');
                      setIsSortMenuOpen(false);
                    }}
                    className={`w-full text-right px-3 py-1.5 hover:bg-slate-50 flex items-center justify-between cursor-pointer ${
                      sortOrder === 'reverse' ? 'font-bold text-indigo-600 bg-indigo-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>الٹ ترتیب (Reverse)</span>
                    {sortOrder === 'reverse' && <Check className="w-3 h-3" />}
                  </button>
                </div>
              )}
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => {
                if (filterMode === 'all') setFilterMode('pending');
                else if (filterMode === 'pending') setFilterMode('done');
                else setFilterMode('all');
              }}
              className="px-2 py-1 rounded-md text-[11px] font-bold border border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center gap-1 cursor-pointer"
              title="فلٹر کریں"
            >
              <Filter className="w-3 h-3 text-emerald-600" />
              <span>
                {filterMode === 'all' ? 'سب' : filterMode === 'pending' ? 'باقی' : 'مکمل'}
              </span>
            </button>

            {/* Mark All Done (Mini Button) */}
            <button
              onClick={() => markAll('done', selectedCategory)}
              className="px-2 py-1 rounded-md text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 cursor-pointer shadow-xs active:scale-95"
              title="تمام پر عمل کا نشان لگائیں"
            >
              <CheckCheck className="w-3 h-3" />
              <span>سب مکمل</span>
            </button>

            {/* Clear All (Mini Button) */}
            <button
              onClick={() => markAll('none', selectedCategory)}
              className="px-2 py-1 rounded-md text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center gap-1 cursor-pointer active:scale-95"
              title="خالی کریں"
            >
              <RotateCcw className="w-3 h-3" />
              <span>صاف</span>
            </button>

            {/* Add New Question (Mini Button) */}
            <button
              onClick={() => setIsAddQuestionOpen(true)}
              className="px-2 py-1 rounded-md text-[11px] font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1 cursor-pointer shadow-xs active:scale-95"
              title="نیا سوال شامل کریں"
            >
              <PlusCircle className="w-3 h-3" />
              <span>نیا عمل</span>
            </button>

            {/* Restore Deleted Deeds Button */}
            {deletedQuestionIds.length > 0 && (
              <button
                onClick={() => {
                  if (confirm(`کیا آپ حذف شدہ (${deletedQuestionIds.length}) اعمال بحال کرنا چاہتے ہیں؟`)) {
                    restoreAllQuestions();
                  }
                }}
                className="px-2 py-1 rounded-md text-[11px] font-bold bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-1 cursor-pointer shadow-xs active:scale-95"
                title="حذف شدہ اعمال بحال کریں"
              >
                <Undo2 className="w-3 h-3" />
                <span>بحال کریں ({toUrduNumber(deletedQuestionIds.length)})</span>
              </button>
            )}
          </div>
        </div>

        {/* Questions List (Exact styling of Screenshot 2 + Delete Button) */}
        <div className="space-y-2">
          {filteredQuestions.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center border border-slate-200 text-slate-500">
              <p className="text-sm">کوئی نیک عمل نہیں ملا</p>
              {deletedQuestionIds.length > 0 && (
                <button
                  onClick={restoreAllQuestions}
                  className="mt-3 py-1.5 px-4 text-xs bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold cursor-pointer inline-flex items-center gap-1"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                  <span>تمام حذف شدہ اعمال بحال کریں</span>
                </button>
              )}
              <div className="mt-2">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilterMode('all');
                  }}
                  className="text-xs text-emerald-600 underline font-bold cursor-pointer"
                >
                  فلٹرز ختم کریں
                </button>
              </div>
            </div>
          ) : (
            filteredQuestions.map((q, idx) => {
              const status = answers[q.id] || 'none';

              return (
                <div
                  key={q.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all p-3 flex items-start justify-between gap-3 relative group"
                >
                  {/* Left Slot: Checkmark toggle button (Exact green tick appearance from screenshot 2) */}
                  <div className="shrink-0 pt-0.5 flex flex-col items-center gap-1.5">
                    {/* Main Big Checkmark Box */}
                    <button
                      onClick={() => {
                        if (status === 'done') setAnswer(q.id, 'none');
                        else setAnswer(q.id, 'done');
                      }}
                      title="عمل کیا (✓)"
                      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer border ${
                        status === 'done'
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-600 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-300 hover:border-slate-400 hover:text-slate-400'
                      }`}
                    >
                      {/* Stylized slanted green tick mark matching screenshot 2 */}
                      <svg
                        viewBox="0 0 24 24"
                        className={`w-6 h-6 stroke-current fill-none stroke-[2.8] stroke-linecap-round stroke-linejoin-round transition-transform ${
                          status === 'done' ? 'scale-100 opacity-100 text-emerald-600' : 'scale-90 opacity-40'
                        }`}
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </button>

                    {/* Mini Quick Buttons for Cross / Partial (چھوٹے چھوٹے پریمیم بٹن) */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setAnswer(q.id, status === 'not_done' ? 'none' : 'not_done')}
                        title="عمل نہ ہو سکا (✗)"
                        className={`w-4.5 h-4.5 rounded text-[10px] flex items-center justify-center cursor-pointer transition-colors ${
                          status === 'not_done'
                            ? 'bg-rose-600 text-white font-bold'
                            : 'bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-600'
                        }`}
                      >
                        <X className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => setAnswer(q.id, status === 'partial' ? 'none' : 'partial')}
                        title="جزوی عمل (½)"
                        className={`w-4.5 h-4.5 rounded text-[9px] font-bold flex items-center justify-center cursor-pointer transition-colors ${
                          status === 'partial'
                            ? 'bg-amber-500 text-white'
                            : 'bg-slate-100 hover:bg-amber-100 text-slate-400 hover:text-amber-600'
                        }`}
                      >
                        ½
                      </button>
                    </div>
                  </div>

                  {/* Center Content: Question Text & Subtext */}
                  <div className="flex-1 text-right">
                    <p className="text-slate-900 font-medium leading-relaxed urdu-content text-[15px]">
                      {q.text}
                    </p>
                    {q.subtext && (
                      <p className="text-slate-500 text-xs mt-1 leading-relaxed urdu-content italic">
                        {q.subtext}
                      </p>
                    )}
                  </div>

                  {/* Right Slot: Red Circular Numbered Badge, Reorder buttons & Delete Deed Option */}
                  <div className="shrink-0 pt-0.5 flex flex-col items-center gap-1">
                    <div className="w-7 h-7 rounded-full bg-rose-500 text-white font-bold flex items-center justify-center text-xs shadow-xs border border-rose-300 tabular-nums">
                      {q.urduNumber || toUrduNumber(idx + 1)}
                    </div>

                    {/* Move Up / Down Buttons (ترتیب تبدیل کریں) */}
                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveQuestionUp(q.id);
                        }}
                        disabled={idx === 0}
                        title="عمل کو ایک درجہ اوپر کریں"
                        className="w-4.5 h-4.5 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-slate-600 cursor-pointer transition-colors"
                      >
                        <ChevronUp className="w-3 h-3" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveQuestionDown(q.id);
                        }}
                        disabled={idx === filteredQuestions.length - 1}
                        title="عمل کو ایک درجہ نیچے کریں"
                        className="w-4.5 h-4.5 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-slate-600 cursor-pointer transition-colors"
                      >
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Delete Deed Button (اعمال کو ڈلیٹ کرنے کا آپشن) */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`کیا آپ یہ عمل "${q.text.slice(0, 30)}..." لسٹ سے حذف کرنا چاہتے ہیں؟`)) {
                          deleteQuestion(q.id);
                        }
                      }}
                      title="یہ عمل فہرست سے حذف کریں"
                      className="w-6 h-6 rounded flex items-center justify-center text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Floating Stats Bar */}
        <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">کل سوالات:</span>
            <span className="font-bold text-slate-900 tabular-nums">{toUrduNumber(filteredQuestions.length)}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-slate-600">مکمل:</span>
              <span className="font-bold text-emerald-600 tabular-nums">
                {toUrduNumber(
                  filteredQuestions.filter((q) => answers[q.id] === 'done').length
                )}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="text-slate-600">غیر مکمل:</span>
              <span className="font-bold text-rose-600 tabular-nums">
                {toUrduNumber(
                  filteredQuestions.filter((q) => answers[q.id] === 'not_done').length
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

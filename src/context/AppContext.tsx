import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { AppView, CategoryId, AnswerStatus, ThemeId, FontId, QuestionItem, DeedTemplate, SortOrder, AppSuite } from '../types';
import { TEMPLATES } from '../data/templates';
import { THEMES } from '../data/themes';
import { getTodayDateString } from '../utils/date';
import { sound } from '../utils/sound';

interface AppContextType {
  // Navigation & Suite Switcher
  view: AppView;
  setView: (v: AppView) => void;
  selectedCategory: CategoryId | 'all';
  setSelectedCategory: (c: CategoryId | 'all') => void;
  showSplash: boolean;
  setShowSplash: (s: boolean) => void;
  activeAppSuite: AppSuite;
  setActiveAppSuite: (suite: AppSuite) => void;

  // External / Other Web Switcher
  isOtherWebModalOpen: boolean;
  setIsOtherWebModalOpen: (o: boolean) => void;
  customWebUrl: string;
  setCustomWebUrl: (url: string) => void;
  isCustomWebActive: boolean;
  setIsCustomWebActive: (a: boolean) => void;

  // Date
  activeDate: string;
  setActiveDate: (d: string) => void;

  // Templates
  templates: DeedTemplate[];
  activeTemplate: DeedTemplate;
  activeTemplateId: string;
  setActiveTemplateId: (id: string) => void;

  // Answers & records
  answers: Record<string, AnswerStatus>;
  setAnswer: (questionId: string, status: AnswerStatus) => void;
  toggleAnswer: (questionId: string) => void;
  markAll: (status: AnswerStatus, category?: CategoryId | 'all') => void;
  clearDayAnswers: () => void;

  // Custom questions & Deletions
  customQuestions: QuestionItem[];
  addCustomQuestion: (q: Omit<QuestionItem, 'id'>) => void;
  deleteCustomQuestion: (id: string) => void;
  deleteQuestion: (id: string) => void;
  restoreQuestion: (id: string) => void;
  restoreAllQuestions: () => void;
  deletedQuestionIds: string[];
  allQuestions: QuestionItem[];

  // Sorting and Reordering (ترتیب والے تمام بٹن)
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
  moveQuestionUp: (id: string) => void;
  moveQuestionDown: (id: string) => void;

  // Statistics
  categoryStats: Record<CategoryId, { total: number; done: number; percentage: number }>;
  overallPercentage: number;
  monthlyStats: { month: string; label: string; score: number }[];

  // Appearance & Fonts
  activeThemeId: ThemeId;
  setActiveThemeId: (t: ThemeId) => void;
  fontId: FontId;
  setFontId: (f: FontId) => void;
  fontSize: number;
  setFontSize: (s: number) => void;
  customFontName: string;
  customFontUrl: string | null;
  uploadCustomFont: (file: File) => Promise<boolean>;

  // Settings & Modals
  soundEnabled: boolean;
  setSoundEnabled: (e: boolean) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (o: boolean) => void;
  isQuickThemeOpen: boolean;
  setIsQuickThemeOpen: (o: boolean) => void;
  isQuickFontOpen: boolean;
  setIsQuickFontOpen: (o: boolean) => void;
  isAddQuestionOpen: boolean;
  setIsAddQuestionOpen: (o: boolean) => void;
  isPrintOpen: boolean;
  setIsPrintOpen: (o: boolean) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEY_ANSWERS = 'naik_amaal_answers_v2';
const STORAGE_KEY_CUSTOM_Q = 'naik_amaal_custom_questions_v2';
const STORAGE_KEY_THEME = 'naik_amaal_theme_v2';
const STORAGE_KEY_FONT = 'naik_amaal_font_v2';
const STORAGE_KEY_FONT_SIZE = 'naik_amaal_font_size_v2';
const STORAGE_KEY_TEMPLATE = 'naik_amaal_template_v2';
const STORAGE_KEY_SOUND = 'naik_amaal_sound_v2';
const STORAGE_KEY_DELETED_Q = 'naik_amaal_deleted_ids_v2';
const STORAGE_KEY_SUITE = 'active_selected_app_suite_v1';
const STORAGE_KEY_SORT = 'naik_amaal_sort_order_v2';
const STORAGE_KEY_CUSTOM_ORDER = 'naik_amaal_custom_order_v2';
const STORAGE_KEY_OTHER_URL = 'naik_amaal_other_web_url_v2';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [view, setView] = useState<AppView>('dashboard');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('daily');
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [activeDate, setActiveDate] = useState<string>(getTodayDateString());

  // App Suite Switcher: 'naik-amaal' vs 'speech-studio' vs 'prayer-times'
  const [activeAppSuite, setActiveAppSuiteState] = useState<AppSuite>(() => {
    return (localStorage.getItem(STORAGE_KEY_SUITE) as AppSuite) || 'naik-amaal';
  });

  const setActiveAppSuite = (suite: AppSuite) => {
    setActiveAppSuiteState(suite);
    localStorage.setItem(STORAGE_KEY_SUITE, suite);
  };

  // Other External Web state & URL
  const [isOtherWebModalOpen, setIsOtherWebModalOpen] = useState<boolean>(false);
  const [customWebUrl, setCustomWebUrlState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_OTHER_URL) || 'https://www.dawateislami.net';
  });

  const setCustomWebUrl = (url: string) => {
    setCustomWebUrlState(url);
    localStorage.setItem(STORAGE_KEY_OTHER_URL, url);
  };

  const [isCustomWebActive, setIsCustomWebActive] = useState<boolean>(false);
  const [isQuickThemeOpen, setIsQuickThemeOpen] = useState<boolean>(false);
  const [isQuickFontOpen, setIsQuickFontOpen] = useState<boolean>(false);

  // Template
  const [activeTemplateId, setActiveTemplateIdState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_TEMPLATE) || '72-naik-amaal';
  });

  const setActiveTemplateId = (id: string) => {
    setActiveTemplateIdState(id);
    localStorage.setItem(STORAGE_KEY_TEMPLATE, id);
  };

  // Appearance
  const [activeThemeId, setActiveThemeIdState] = useState<ThemeId>(() => {
    return (localStorage.getItem(STORAGE_KEY_THEME) as ThemeId) || 'classic-slate';
  });

  const setActiveThemeId = (t: ThemeId) => {
    setActiveThemeIdState(t);
    localStorage.setItem(STORAGE_KEY_THEME, t);
  };

  const [fontId, setFontIdState] = useState<FontId>(() => {
    return (localStorage.getItem(STORAGE_KEY_FONT) as FontId) || 'noto-nastaliq';
  });

  const setFontId = (f: FontId) => {
    setFontIdState(f);
    localStorage.setItem(STORAGE_KEY_FONT, f);
  };

  const [fontSize, setFontSizeState] = useState<number>(() => {
    const s = localStorage.getItem(STORAGE_KEY_FONT_SIZE);
    return s ? Number(s) : 16;
  });

  const setFontSize = (s: number) => {
    setFontSizeState(s);
    localStorage.setItem(STORAGE_KEY_FONT_SIZE, String(s));
  };

  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => {
    const s = localStorage.getItem(STORAGE_KEY_SOUND);
    return s !== null ? s === 'true' : true;
  });

  const setSoundEnabled = (val: boolean) => {
    setSoundEnabledState(val);
    sound.enabled = val;
    localStorage.setItem(STORAGE_KEY_SOUND, String(val));
  };

  useEffect(() => {
    sound.enabled = soundEnabled;
  }, [soundEnabled]);

  // Custom Font Upload
  const [customFontName, setCustomFontName] = useState<string>('CustomFont');
  const [customFontUrl, setCustomFontUrl] = useState<string | null>(null);

  const uploadCustomFont = async (file: File): Promise<boolean> => {
    try {
      const fontName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.onload = async (e) => {
          const buffer = e.target?.result as ArrayBuffer;
          if (buffer) {
            try {
              const fontFace = new FontFace(fontName, buffer);
              await fontFace.load();
              document.fonts.add(fontFace);
              setCustomFontName(fontName);
              setFontId('custom-uploaded');
              resolve(true);
            } catch (err) {
              console.error('FontFace load failed', err);
              resolve(false);
            }
          } else {
            resolve(false);
          }
        };
        reader.onerror = () => resolve(false);
        reader.readAsArrayBuffer(file);
      });
    } catch {
      return false;
    }
  };

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState<boolean>(false);
  const [isPrintOpen, setIsPrintOpen] = useState<boolean>(false);

  // Custom questions
  const [customQuestions, setCustomQuestions] = useState<QuestionItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CUSTOM_Q);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const addCustomQuestion = (q: Omit<QuestionItem, 'id'>) => {
    const newQ: QuestionItem = {
      ...q,
      id: `custom_${Date.now()}`,
    };
    const updated = [...customQuestions, newQ];
    setCustomQuestions(updated);
    localStorage.setItem(STORAGE_KEY_CUSTOM_Q, JSON.stringify(updated));
  };

  // Deleted questions tracker (works for both standard and custom deeds)
  const [deletedQuestionIds, setDeletedQuestionIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DELETED_Q);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const deleteQuestion = (id: string) => {
    // If it's a custom question, also remove from custom questions
    if (id.startsWith('custom_')) {
      const updatedCustom = customQuestions.filter((q) => q.id !== id);
      setCustomQuestions(updatedCustom);
      localStorage.setItem(STORAGE_KEY_CUSTOM_Q, JSON.stringify(updatedCustom));
    }
    // Add to deleted ids
    setDeletedQuestionIds((prev) => {
      if (prev.includes(id)) return prev;
      const updated = [...prev, id];
      localStorage.setItem(STORAGE_KEY_DELETED_Q, JSON.stringify(updated));
      return updated;
    });
  };

  const restoreQuestion = (id: string) => {
    setDeletedQuestionIds((prev) => {
      const updated = prev.filter((item) => item !== id);
      localStorage.setItem(STORAGE_KEY_DELETED_Q, JSON.stringify(updated));
      return updated;
    });
  };

  const restoreAllQuestions = () => {
    setDeletedQuestionIds([]);
    localStorage.removeItem(STORAGE_KEY_DELETED_Q);
  };

  const deleteCustomQuestion = (id: string) => {
    deleteQuestion(id);
  };

  // Sorting and Reordering state
  const [sortOrder, setSortOrderState] = useState<SortOrder>(() => {
    return (localStorage.getItem(STORAGE_KEY_SORT) as SortOrder) || 'default';
  });

  const setSortOrder = (order: SortOrder) => {
    setSortOrderState(order);
    localStorage.setItem(STORAGE_KEY_SORT, order);
  };

  const [customOrderIds, setCustomOrderIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CUSTOM_ORDER);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Active Template
  const activeTemplate = useMemo(() => {
    return TEMPLATES.find((t) => t.id === activeTemplateId) || TEMPLATES[0];
  }, [activeTemplateId]);

  // Raw list without ordering
  const rawQuestions = useMemo(() => {
    return [...activeTemplate.questions, ...customQuestions].filter(
      (q) => !deletedQuestionIds.includes(q.id)
    );
  }, [activeTemplate, customQuestions, deletedQuestionIds]);

  // Move a question Up in custom order
  const moveQuestionUp = (id: string) => {
    const list = [...allQuestions];
    const index = list.findIndex((q) => q.id === id);
    if (index > 0) {
      const temp = list[index];
      list[index] = list[index - 1];
      list[index - 1] = temp;
      const ids = list.map((q) => q.id);
      setCustomOrderIds(ids);
      localStorage.setItem(STORAGE_KEY_CUSTOM_ORDER, JSON.stringify(ids));
      setSortOrder('custom');
    }
  };

  // Move a question Down in custom order
  const moveQuestionDown = (id: string) => {
    const list = [...allQuestions];
    const index = list.findIndex((q) => q.id === id);
    if (index >= 0 && index < list.length - 1) {
      const temp = list[index];
      list[index] = list[index + 1];
      list[index + 1] = temp;
      const ids = list.map((q) => q.id);
      setCustomOrderIds(ids);
      localStorage.setItem(STORAGE_KEY_CUSTOM_ORDER, JSON.stringify(ids));
      setSortOrder('custom');
    }
  };

  // All day records { 'YYYY-MM-DD': { questionId: 'done' | ... } }
  const [allRecords, setAllRecords] = useState<Record<string, Record<string, AnswerStatus>>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ANSWERS);
      if (saved) return JSON.parse(saved);
      // default mock seed for past dates so Reports matrix looks vibrant immediately
      const initialSeed: Record<string, Record<string, AnswerStatus>> = {};
      const today = getTodayDateString();
      initialSeed[today] = {
        q1: 'done',
        q2: 'done',
        q3: 'done',
        q4: 'not_done',
        q5: 'done',
        q6: 'done',
        qufl1: 'done',
        qufl2: 'not_done',
        qufl3: 'done',
        w1: 'done',
        w2: 'done',
        w5: 'done',
        m1: 'done',
        m2: 'done',
        y1: 'done',
      };
      return initialSeed;
    } catch {
      return {};
    }
  });

  const answers = allRecords[activeDate] || {};

  // Compute allQuestions with sorting
  const allQuestions = useMemo(() => {
    const list = [...rawQuestions];

    if (sortOrder === 'custom' && customOrderIds.length > 0) {
      const orderMap = new Map<string, number>();
      customOrderIds.forEach((id, idx) => orderMap.set(id, idx));
      list.sort((a, b) => {
        const idxA = orderMap.has(a.id) ? (orderMap.get(a.id) as number) : 9999;
        const idxB = orderMap.has(b.id) ? (orderMap.get(b.id) as number) : 9999;
        return idxA - idxB;
      });
    } else if (sortOrder === 'pending_first') {
      list.sort((a, b) => {
        const isDoneA = answers[a.id] === 'done' ? 1 : 0;
        const isDoneB = answers[b.id] === 'done' ? 1 : 0;
        return isDoneA - isDoneB;
      });
    } else if (sortOrder === 'done_first') {
      list.sort((a, b) => {
        const isDoneA = answers[a.id] === 'done' ? 1 : 0;
        const isDoneB = answers[b.id] === 'done' ? 1 : 0;
        return isDoneB - isDoneA;
      });
    } else if (sortOrder === 'alphabetical') {
      list.sort((a, b) => a.text.localeCompare(b.text, 'ur'));
    } else if (sortOrder === 'reverse') {
      list.reverse();
    }
    return list;
  }, [rawQuestions, sortOrder, customOrderIds, answers]);

  const setAnswer = (questionId: string, status: AnswerStatus) => {
    setAllRecords((prev) => {
      const dayAnswers = { ...(prev[activeDate] || {}) };
      if (status === 'none') {
        delete dayAnswers[questionId];
      } else {
        dayAnswers[questionId] = status;
      }
      const updated = { ...prev, [activeDate]: dayAnswers };
      localStorage.setItem(STORAGE_KEY_ANSWERS, JSON.stringify(updated));
      return updated;
    });

    if (status === 'done') {
      sound.playCheck();
    } else if (status === 'not_done') {
      sound.playCross();
    }
  };

  const toggleAnswer = (questionId: string) => {
    const current = answers[questionId] || 'none';
    let next: AnswerStatus = 'done';
    if (current === 'none') next = 'done';
    else if (current === 'done') next = 'not_done';
    else if (current === 'not_done') next = 'none';

    setAnswer(questionId, next);
  };

  const markAll = (status: AnswerStatus, category?: CategoryId | 'all') => {
    setAllRecords((prev) => {
      const dayAnswers = { ...(prev[activeDate] || {}) };
      allQuestions.forEach((q) => {
        if (!category || category === 'all' || q.category === category) {
          if (status === 'none') {
            delete dayAnswers[q.id];
          } else {
            dayAnswers[q.id] = status;
          }
        }
      });
      const updated = { ...prev, [activeDate]: dayAnswers };
      localStorage.setItem(STORAGE_KEY_ANSWERS, JSON.stringify(updated));
      return updated;
    });

    if (status === 'done') {
      sound.playMilestone();
    }
  };

  const clearDayAnswers = () => {
    setAllRecords((prev) => {
      const updated = { ...prev, [activeDate]: {} };
      localStorage.setItem(STORAGE_KEY_ANSWERS, JSON.stringify(updated));
      return updated;
    });
  };

  const resetAllData = () => {
    setAllRecords({});
    setCustomQuestions([]);
    localStorage.removeItem(STORAGE_KEY_ANSWERS);
    localStorage.removeItem(STORAGE_KEY_CUSTOM_Q);
  };

  // Stats calculation
  const categoryStats = useMemo(() => {
    const result: Record<CategoryId, { total: number; done: number; percentage: number }> = {
      daily: { total: 0, done: 0, percentage: 0 },
      qufl: { total: 0, done: 0, percentage: 0 },
      weekly: { total: 0, done: 0, percentage: 0 },
      monthly: { total: 0, done: 0, percentage: 0 },
      yearly: { total: 0, done: 0, percentage: 0 },
    };

    allQuestions.forEach((q) => {
      if (result[q.category]) {
        result[q.category].total += 1;
        if (answers[q.id] === 'done') {
          result[q.category].done += 1;
        }
      }
    });

    (Object.keys(result) as CategoryId[]).forEach((cat) => {
      const c = result[cat];
      c.percentage = c.total > 0 ? Math.round((c.done / c.total) * 100) : 0;
    });

    return result;
  }, [allQuestions, answers]);

  const overallPercentage = useMemo(() => {
    const total = allQuestions.length;
    if (total === 0) return 0;
    let done = 0;
    allQuestions.forEach((q) => {
      if (answers[q.id] === 'done') done++;
    });
    return Math.round((done / total) * 100);
  }, [allQuestions, answers]);

  // Monthly stats for Report Matrix
  const monthlyStats = useMemo(() => {
    const months = [
      { month: '01', label: 'جنوری', score: 47 },
      { month: '12', label: 'دسمبر', score: 41 },
      { month: '11', label: 'نومبر', score: 36 },
      { month: '10', label: 'اکتوبر', score: 28 },
      { month: '09', label: 'ستمبر', score: 24 },
      { month: '08', label: 'اگست', score: 19 },
    ];
    return months;
  }, []);

  // Splash auto-dismiss timer on first mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AppContext.Provider
      value={{
        view,
        setView,
        selectedCategory,
        setSelectedCategory,
        showSplash,
        setShowSplash,
        activeAppSuite,
        setActiveAppSuite,
        activeDate,
        setActiveDate,
        templates: TEMPLATES,
        activeTemplate,
        activeTemplateId,
        setActiveTemplateId,
        answers,
        setAnswer,
        toggleAnswer,
        markAll,
        clearDayAnswers,
        customQuestions,
        addCustomQuestion,
        deleteCustomQuestion,
        deleteQuestion,
        restoreAllQuestions,
        deletedQuestionIds,
        allQuestions,
        restoreQuestion,
        sortOrder,
        setSortOrder,
        moveQuestionUp,
        moveQuestionDown,
        categoryStats,
        overallPercentage,
        monthlyStats,
        activeThemeId,
        setActiveThemeId,
        fontId,
        setFontId,
        fontSize,
        setFontSize,
        customFontName,
        customFontUrl,
        uploadCustomFont,
        isOtherWebModalOpen,
        setIsOtherWebModalOpen,
        customWebUrl,
        setCustomWebUrl,
        isCustomWebActive,
        setIsCustomWebActive,
        isQuickThemeOpen,
        setIsQuickThemeOpen,
        isQuickFontOpen,
        setIsQuickFontOpen,
        soundEnabled,
        setSoundEnabled,
        isSettingsOpen,
        setIsSettingsOpen,
        isAddQuestionOpen,
        setIsAddQuestionOpen,
        isPrintOpen,
        setIsPrintOpen,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

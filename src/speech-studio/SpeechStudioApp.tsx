import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic,
  Upload,
  Play,
  Pause,
  Square,
  Download,
  Sparkles,
  Palette,
  Headphones,
  RotateCcw,
  Sliders,
  Copy,
  Check,
  Bookmark,
  BookOpen,
  ArrowRight,
  Trash2,
  Share2,
  RefreshCw,
  Sun,
  Moon,
  Type,
  Settings,
  Layers,
  Activity,
  Zap,
} from 'lucide-react';
import { VoiceProfile, MotivationalSpeech } from '../types';
import { PRESET_VOICES } from './services/voiceAnalyzer';
import {
  MOTIVATIONAL_TOPICS,
  SPEECH_STYLES,
  DEFAULT_SPEECHES,
  generateMotivationalSpeechAI,
} from './services/motivationalPrompts';
import { speechSynthesizer } from './services/speechSynthesizer';
import { WaveformVisualizer } from './components/WaveformVisualizer';
import { VoiceUploadModal } from './components/VoiceUploadModal';
import { FontUploadModal } from './components/FontUploadModal';
import { SPEECH_STUDIO_THEMES, SpeechStudioTheme } from './data/speechThemes';

interface SpeechStudioAppProps {
  onSwitchToNaikAmaal: () => void;
}

const STORAGE_SAVED_SPEECHES = 'speech_studio_saved_speeches_v1';
const STORAGE_ACTIVE_VOICE = 'speech_studio_active_voice_v1';
const STORAGE_UPLOADED_VOICES = 'speech_studio_user_uploaded_voices_v1';
const STORAGE_STUDIO_THEME = 'speech_studio_theme_id_v2';
const STORAGE_STUDIO_FONT = 'speech_studio_font_id_v1';
const STORAGE_STUDIO_FONT_NAME = 'speech_studio_custom_font_name';
const STORAGE_STUDIO_FONT_SIZE = 'speech_studio_font_size_v1';

type StudioAppTab = 'studio' | 'voices' | 'library' | 'settings';

export const SpeechStudioApp: React.FC<SpeechStudioAppProps> = ({ onSwitchToNaikAmaal }) => {
  // Native App Active Tab Navigation (App Tabs)
  const [activeTab, setActiveTab] = useState<StudioAppTab>('studio');

  // Theme State: Instant Light vs Dark mode toggle
  const [activeThemeId, setActiveThemeId] = useState<string>(() => {
    return localStorage.getItem(STORAGE_STUDIO_THEME) || 'classic-light';
  });
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  const theme: SpeechStudioTheme =
    SPEECH_STUDIO_THEMES[activeThemeId] || SPEECH_STUDIO_THEMES['classic-light'];

  const setTheme = (id: string) => {
    setActiveThemeId(id);
    localStorage.setItem(STORAGE_STUDIO_THEME, id);
    setIsThemeModalOpen(false);
  };

  // 1-Click Light vs Dark Toggle
  const toggleLightDark = () => {
    if (theme.isLight) {
      setTheme('cyber-obsidian');
    } else {
      setTheme('classic-light');
    }
  };

  // Font Management State (Dashboard Font Upload)
  const [fontId, setFontId] = useState<string>(() => {
    return localStorage.getItem(STORAGE_STUDIO_FONT) || 'noto-nastaliq';
  });
  const [customFontName, setCustomFontName] = useState<string>(() => {
    return localStorage.getItem(STORAGE_STUDIO_FONT_NAME) || '';
  });
  const [fontSize, setFontSize] = useState<number>(() => {
    return Number(localStorage.getItem(STORAGE_STUDIO_FONT_SIZE)) || 16;
  });
  const [isFontModalOpen, setIsFontModalOpen] = useState(false);

  // Apply Font globally
  useEffect(() => {
    let chosenFont = "'Noto Nastaliq Urdu', serif";
    if (fontId === 'gulzar') {
      chosenFont = "'Gulzar', serif";
    } else if (fontId === 'amiri') {
      chosenFont = "'Amiri', serif";
    } else if (fontId === 'lateef') {
      chosenFont = "'Lateef', serif";
    } else if (fontId === 'noto-sans-arabic') {
      chosenFont = "'Noto Sans Arabic', sans-serif";
    } else if (fontId === 'custom-uploaded' && customFontName) {
      chosenFont = `"${customFontName}", 'Noto Nastaliq Urdu', serif`;
    }

    document.documentElement.style.setProperty('--app-font-family', chosenFont);
    localStorage.setItem(STORAGE_STUDIO_FONT, fontId);
    localStorage.setItem(STORAGE_STUDIO_FONT_SIZE, String(fontSize));
  }, [fontId, customFontName, fontSize]);

  const handleSelectFont = (id: string, name?: string) => {
    setFontId(id);
    if (name) setCustomFontName(name);
  };

  // User Uploaded Voices List
  const [userUploadedVoices, setUserUploadedVoices] = useState<VoiceProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_UPLOADED_VOICES);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  // Active Voice Profile
  const [activeVoice, setActiveVoice] = useState<VoiceProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ACTIVE_VOICE);
      if (saved) return JSON.parse(saved);
    } catch {}
    return PRESET_VOICES[0];
  });

  const [isVoiceUploadModalOpen, setIsVoiceUploadModalOpen] = useState(false);
  const [voiceGalleryTab, setVoiceGalleryTab] = useState<'presets' | 'uploaded'>('presets');

  // Speech Text & Content
  const [selectedTopic, setSelectedTopic] = useState(MOTIVATIONAL_TOPICS[0].id);
  const [selectedStyle, setSelectedStyle] = useState(SPEECH_STYLES[0].label);
  const [customPrompt, setCustomPrompt] = useState('');
  const [speechTitle, setSpeechTitle] = useState(DEFAULT_SPEECHES[0].title);
  const [speechText, setSpeechText] = useState(DEFAULT_SPEECHES[0].scriptText);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Audio Playback State
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSynthesizingAudio, setIsSynthesizingAudio] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);

  // Sample Preview Playing State
  const [playingPreviewVoiceId, setPlayingPreviewVoiceId] = useState<string | null>(null);
  const sampleAudioRef = useRef<HTMLAudioElement | null>(null);

  // Audio Tuning Controls
  const [pitchMultiplier, setPitchMultiplier] = useState(1.0);
  const [rateMultiplier, setRateMultiplier] = useState(1.0);

  // Feedback states
  const [copiedText, setCopiedText] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  // Saved Speeches Library
  const [savedSpeeches, setSavedSpeeches] = useState<MotivationalSpeech[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SAVED_SPEECHES);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_SPEECHES;
  });

  // Save active voice
  useEffect(() => {
    try {
      // Don't store large blob URLs in storage
      const safeVoice = { ...activeVoice, audioBlobUrl: undefined, audioBase64: undefined };
      localStorage.setItem(STORAGE_ACTIVE_VOICE, JSON.stringify(safeVoice));
    } catch {}
  }, [activeVoice]);

  // Save uploaded voices
  useEffect(() => {
    try {
      const safeList = userUploadedVoices.map((v) => ({
        ...v,
        audioBlobUrl: undefined,
        audioBase64: undefined,
      }));
      localStorage.setItem(STORAGE_UPLOADED_VOICES, JSON.stringify(safeList));
    } catch {}
  }, [userUploadedVoices]);

  // Clean up audio playback on unmount
  useEffect(() => {
    return () => {
      speechSynthesizer.stop();
      if (sampleAudioRef.current) {
        sampleAudioRef.current.pause();
      }
    };
  }, []);

  // Handle Voice Profile created from Upload Modal
  const handleVoiceProfileCreated = (profile: VoiceProfile, speechTextFromAudio?: string) => {
    setUserUploadedVoices((prev) => {
      const filtered = prev.filter((v) => v.id !== profile.id);
      return [profile, ...filtered];
    });

    setActiveVoice(profile);
    setVoiceGalleryTab('uploaded');

    if (speechTextFromAudio && speechTextFromAudio.trim().length > 0) {
      setSpeechText(speechTextFromAudio.trim());
      setSpeechTitle(`${profile.name} سے ماخوذ موٹیویشنل تقریر`);
      setVoiceNotice(`کلون شدہ آواز ایکٹو ہو گئی اور اس کا اصل متن ایڈیٹر میں سیٹ کر دیا گیا ہے!`);
    } else {
      setVoiceNotice(`کلون شدہ آواز "${profile.name}" کامیابی سے ایکٹو ہو گئی ہے!`);
    }

    // Switch to studio tab so user can immediately generate or listen
    setActiveTab('studio');
    setTimeout(() => setVoiceNotice(null), 6000);
  };

  // Delete an uploaded voice
  const handleDeleteUploadedVoice = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('کیا آپ اس اپلوڈ شدہ آواز کو حذف کرنا چاہتے ہیں؟')) {
      setUserUploadedVoices((prev) => prev.filter((v) => v.id !== id));
      if (activeVoice.id === id) {
        setActiveVoice(PRESET_VOICES[0]);
      }
    }
  };

  // Generate Motivational Speech using AI
  const handleGenerateAI = async () => {
    setIsGeneratingAI(true);
    speechSynthesizer.stop();
    setIsPlaying(false);

    const topicObj = MOTIVATIONAL_TOPICS.find((t) => t.id === selectedTopic);
    const topicTitle = topicObj ? topicObj.title : 'کامیابی اور عزم';

    try {
      const generated = await generateMotivationalSpeechAI({
        topic: topicTitle,
        style: selectedStyle,
        userPrompt: customPrompt,
        referenceText: activeVoice.transcribedText || speechText,
      });

      setSpeechText(generated);
      setSpeechTitle(`${topicTitle} پر موٹیویشنل خطاب`);
    } catch {
      alert('اسپیچ تیار کرنے میں دشواری ہوئی۔ برائے مہربانی دوبارہ کوشش کریں۔');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Play Sample Preview for Preset or Uploaded Voice
  const handlePlayVoicePreview = (voice: VoiceProfile, e: React.MouseEvent) => {
    e.stopPropagation();

    if (playingPreviewVoiceId === voice.id) {
      speechSynthesizer.stop();
      if (sampleAudioRef.current) {
        sampleAudioRef.current.pause();
      }
      setPlayingPreviewVoiceId(null);
      return;
    }

    speechSynthesizer.stop();
    setIsPlaying(false);

    if (voice.sourceType !== 'preset' && voice.audioBlobUrl) {
      if (!sampleAudioRef.current) {
        sampleAudioRef.current = new Audio(voice.audioBlobUrl);
      } else {
        sampleAudioRef.current.src = voice.audioBlobUrl;
      }

      setPlayingPreviewVoiceId(voice.id);
      sampleAudioRef.current.onended = () => setPlayingPreviewVoiceId(null);
      sampleAudioRef.current.onerror = () => setPlayingPreviewVoiceId(null);
      sampleAudioRef.current.play().catch(() => setPlayingPreviewVoiceId(null));
      return;
    }

    const sampleText =
      voice.previewSampleText ||
      'سنو اور یاد رکھو! زندگی میں اصل شکست گرنا نہیں، بلکہ گر کر ہمت ہار بیٹھنا ہے۔';

    setPlayingPreviewVoiceId(voice.id);
    speechSynthesizer.speak({
      text: sampleText,
      voiceProfile: voice,
      pitchMultiplier: 1.0,
      rateMultiplier: 1.0,
      onStart: () => setPlayingPreviewVoiceId(voice.id),
      onEnd: () => setPlayingPreviewVoiceId(null),
      onError: () => setPlayingPreviewVoiceId(null),
    });
  };

  // Main Speech Play / Pause / Resume
  const handleTogglePlay = async () => {
    if (playingPreviewVoiceId) {
      speechSynthesizer.stop();
      if (sampleAudioRef.current) sampleAudioRef.current.pause();
      setPlayingPreviewVoiceId(null);
    }

    if (isPlaying) {
      if (isPaused) {
        speechSynthesizer.resume();
        setIsPaused(false);
      } else {
        speechSynthesizer.pause();
        setIsPaused(true);
      }
      return;
    }

    if (!speechText.trim()) {
      alert('برائے مہربانی پہلے تقریر کا متن لکھیں یا AI سے تیار کروائیں!');
      return;
    }

    setIsSynthesizingAudio(true);
    setPlaybackProgress(0);

    try {
      await speechSynthesizer.speak({
        text: speechText,
        voiceProfile: activeVoice,
        pitchMultiplier,
        rateMultiplier,
        onStart: () => {
          setIsSynthesizingAudio(false);
          setIsPlaying(true);
          setIsPaused(false);
        },
        onEnd: () => {
          setIsPlaying(false);
          setIsPaused(false);
          setPlaybackProgress(speechText.length);
        },
        onError: () => {
          setIsSynthesizingAudio(false);
          setIsPlaying(false);
          setIsPaused(false);
        },
        onProgress: (charIndex) => {
          setPlaybackProgress(charIndex);
        },
      });
    } catch {
      setIsSynthesizingAudio(false);
      setIsPlaying(false);
    }
  };

  // Stop Speech
  const handleStop = () => {
    speechSynthesizer.stop();
    if (sampleAudioRef.current) {
      sampleAudioRef.current.pause();
    }
    setPlayingPreviewVoiceId(null);
    setIsPlaying(false);
    setIsPaused(false);
    setIsSynthesizingAudio(false);
    setPlaybackProgress(0);
  };

  // Download Audio File (.WAV)
  const handleDownloadAudio = async () => {
    if (!speechText.trim()) return;

    setIsDownloading(true);
    try {
      const wavBlob = await speechSynthesizer.exportSpeechWav({
        text: speechText,
        voiceProfile: activeVoice,
        title: speechTitle,
      });

      const url = URL.createObjectURL(wavBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${speechTitle.replace(/\s+/g, '_')}_${activeVoice.name.replace(/\s+/g, '_')}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      alert('آڈیو فائل تیار کرنے میں دشواری پیش آئی۔');
    } finally {
      setIsDownloading(false);
    }
  };

  // Copy Speech Text
  const handleCopyText = () => {
    navigator.clipboard.writeText(speechText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // Save current speech to library
  const handleSaveSpeech = () => {
    const newSpeech: MotivationalSpeech = {
      id: `speech_${Date.now()}`,
      title: speechTitle.trim() || 'موٹیویشنل تقریر',
      category: MOTIVATIONAL_TOPICS.find((t) => t.id === selectedTopic)?.title || 'عمومی',
      style: selectedStyle,
      scriptText: speechText,
      durationEstimateSeconds: Math.round((speechText.trim().split(/\s+/).length / 130) * 60),
      dateCreated: new Date().toLocaleDateString('ur-PK'),
      voiceProfileId: activeVoice.id,
    };

    const updated = [newSpeech, ...savedSpeeches];
    setSavedSpeeches(updated);
    try {
      localStorage.setItem(STORAGE_SAVED_SPEECHES, JSON.stringify(updated));
    } catch {}
    alert('یہ تقریر آپ کی ذاتی لائبریری میں محفوظ ہو گئی ہے!');
  };

  // Load a speech from library
  const handleLoadSpeech = (speech: MotivationalSpeech) => {
    speechSynthesizer.stop();
    setIsPlaying(false);
    setSpeechTitle(speech.title);
    setSpeechText(speech.scriptText);
    setSelectedStyle(speech.style);
    setActiveTab('studio');
  };

  const wordCount = speechText.trim() ? speechText.trim().split(/\s+/).length : 0;
  const estimatedMinutes = Math.ceil(wordCount / 120);

  return (
    <div
      className={`min-h-screen ${theme.pageBg} ${theme.textPrimary} flex flex-col font-urdu transition-colors duration-300 selection:bg-emerald-500 selection:text-white pb-24`}
      style={{ fontFamily: 'var(--app-font-family)' }}
    >
      {/* 1. NATIVE APP TOP HEADER (موبائل و ڈیسک ٹاپ ایپ ہیڈر) */}
      <header
        className={`sticky top-0 z-40 ${theme.headerBg} backdrop-blur-md border-b ${theme.headerBorder} shadow-sm`}
      >
        <div className="max-w-5xl mx-auto px-3 py-2 flex items-center justify-between gap-2">
          {/* Back Button to Naik Amaal */}
          <button
            onClick={() => {
              speechSynthesizer.stop();
              onSwitchToNaikAmaal();
            }}
            className="py-1.5 px-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-transform active:scale-95 border border-emerald-500/30 shrink-0"
            title="پہلی ایپ (نیک اعمال ڈیش بورڈ) پر واپس جائیں"
          >
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-0" />
            <span className="hidden sm:inline">نیک اعمال ایپ پر واپس</span>
            <span className="sm:hidden">واپس</span>
          </button>

          {/* App Branding & Status */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-xs">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm sm:text-base font-bold urdu-title leading-tight">
                  اسپیچ اسٹوڈیو پرو
                </h1>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="آن لائن" />
              </div>
              <span className={`text-[10px] ${theme.accentColor} block font-sans`}>
                AI Speech & Voice Studio
              </span>
            </div>
          </div>

          {/* Top Quick Actions: Light/Dark Switch, Font Upload, Voice Scanner Button */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Quick 1-Click Light Theme / Dark Theme Switcher */}
            <button
              onClick={toggleLightDark}
              className={`p-1.5 sm:py-1.5 sm:px-2.5 rounded-xl text-xs font-bold border flex items-center gap-1 cursor-pointer transition-all active:scale-95 ${
                theme.isLight
                  ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300 shadow-xs'
                  : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700'
              }`}
              title={theme.isLight ? 'ڈارک تھیم لگائیں' : 'لائٹ تھیم لگائیں'}
            >
              {theme.isLight ? (
                <>
                  <Moon className="w-4 h-4 text-indigo-600" />
                  <span className="hidden sm:inline text-slate-800">ڈارک تھیم</span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline text-amber-300">لائٹ تھیم</span>
                </>
              )}
            </button>

            {/* Font Upload & Selector Button */}
            <button
              onClick={() => setIsFontModalOpen(true)}
              className={`p-1.5 sm:py-1.5 sm:px-2.5 rounded-xl text-xs font-bold border flex items-center gap-1 cursor-pointer transition-all active:scale-95 ${
                theme.isLight
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
              title="ڈیش بورڈ میں فونٹ اپلوڈ اور سائز تبدیل کریں"
            >
              <Type className="w-4 h-4 text-emerald-500" />
              <span className="hidden sm:inline">فونٹ اپلوڈ</span>
            </button>

            {/* Quick Voice Scanner Modal Opener */}
            <button
              onClick={() => setIsVoiceUploadModalOpen(true)}
              className="py-1.5 px-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1 cursor-pointer transition-transform active:scale-95 border border-emerald-500/30"
              title="آواز اسکین اور کلون کریں"
            >
              <Mic className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">آواز اسکین کریں</span>
              <span className="sm:hidden">اسکین</span>
            </button>
          </div>
        </div>

        {/* 2. NATIVE SEGMENTED APP TABS (ایپ نیویگیشن ٹیب بار) */}
        <div className="max-w-5xl mx-auto px-3 pb-2">
          <div
            className={`grid grid-cols-4 gap-1 p-1 rounded-xl border ${
              theme.isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-800'
            }`}
          >
            <button
              onClick={() => setActiveTab('studio')}
              className={`py-1.5 px-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'studio'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>اسٹوڈیو</span>
            </button>

            <button
              onClick={() => setActiveTab('voices')}
              className={`py-1.5 px-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'voices'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span className="truncate">صوتی کلون ({userUploadedVoices.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('library')}
              className={`py-1.5 px-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'library'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>لائبریری</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`py-1.5 px-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>ترتیبات و فونٹ</span>
            </button>
          </div>
        </div>
      </header>

      {/* Voice Notice Notification */}
      <AnimatePresence>
        {voiceNotice && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-5xl mx-auto px-3 pt-3"
          >
            <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-md text-xs font-bold flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-200" />
                <span>{voiceNotice}</span>
              </div>
              <button
                onClick={() => setVoiceNotice(null)}
                className="opacity-80 hover:opacity-100 text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN APP CONTAINER */}
      <main className="max-w-5xl mx-auto px-3 pt-3 flex-1 w-full space-y-4">
        {/* ================= TAB 1: STUDIO (تقریر ایڈیٹر، جنریٹر اور صوتی فائن ٹیوننگ) ================= */}
        {activeTab === 'studio' && (
          <div className="space-y-4">
            {/* Active Voice Banner Bar */}
            <div
              className={`${theme.cardBg} rounded-2xl p-3 sm:p-4 border ${theme.cardBorder} shadow-sm flex items-center justify-between gap-2 flex-wrap`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-xs shrink-0">
                  <Mic className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                      {activeVoice.sourceType === 'uploaded_audio'
                        ? '🧬 آپ کی اسکین شدہ کلون آواز'
                        : '🌟 ریڈی میڈ صوتی نمونہ'}
                    </span>
                    <span className={`text-[10px] ${theme.accentColor} font-mono`}>
                      {activeVoice.pitchHz}Hz
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold urdu-title mt-0.5">
                    {activeVoice.name}
                  </h2>
                  <p className={`${theme.textSecondary} text-[11px]`}>
                    انداز: {activeVoice.voiceStyle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handlePlayVoicePreview(activeVoice, e)}
                  className={`py-1.5 px-3 rounded-xl text-xs font-bold border flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 ${
                    playingPreviewVoiceId === activeVoice.id
                      ? 'bg-rose-600 text-white border-rose-500'
                      : `${theme.buttonSecondary}`
                  }`}
                  title="اس آواز کا نمونہ سنیں"
                >
                  {playingPreviewVoiceId === activeVoice.id ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>روکیں</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 text-emerald-500" />
                      <span>آواز ٹیسٹ کریں</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setIsVoiceUploadModalOpen(true)}
                  className={`py-1.5 px-3 ${theme.buttonPrimary} rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-transform active:scale-95`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>آواز بدلیں / اسکین کریں</span>
                </button>
              </div>
            </div>

            {/* AI Speech Generator Options Card */}
            <div
              className={`${theme.cardBg} rounded-2xl p-4 border ${theme.cardBorder} shadow-sm space-y-3`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <h3 className="font-bold text-sm urdu-title">
                    اے آئی موٹیویشنل تقریر خودکار تیار کریں
                  </h3>
                </div>
                <span className="text-[10px] opacity-75">
                  Gemini AI Speech Generator
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Topic Selector */}
                <div className="space-y-1">
                  <label className="font-bold block opacity-80">
                    موضوع منتخب کریں:
                  </label>
                  <select
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    className={`w-full ${theme.inputBg} border ${theme.inputBorder} rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 font-urdu`}
                  >
                    {MOTIVATIONAL_TOPICS.map((topic) => (
                      <option key={topic.id} value={topic.id}>
                        {topic.icon} {topic.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Style Selector */}
                <div className="space-y-1">
                  <label className="font-bold block opacity-80">
                    خطیبانہ انداز و لہجہ:
                  </label>
                  <select
                    value={selectedStyle}
                    onChange={(e) => setSelectedStyle(e.target.value)}
                    className={`w-full ${theme.inputBg} border ${theme.inputBorder} rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 font-urdu`}
                  >
                    {SPEECH_STYLES.map((style) => (
                      <option key={style.id} value={style.label}>
                        {style.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Custom Prompt Input */}
              <div className="space-y-1 text-xs">
                <label className="font-bold block opacity-80">
                  اضافی ہدایت یا خاص نکتہ (اختیاری):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="مثلاً: علامہ اقبال کا کوئی شعر شامل کریں، یا نوجوانوں کو خاص پیغام دیں..."
                    className={`flex-1 ${theme.inputBg} border ${theme.inputBorder} rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 font-urdu`}
                  />

                  <button
                    onClick={handleGenerateAI}
                    disabled={isGeneratingAI}
                    className={`py-2 px-4 ${theme.buttonPrimary} rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-transform active:scale-95 disabled:opacity-50 shrink-0 shadow-xs`}
                  >
                    {isGeneratingAI ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>تقریر تیار ہو رہی ہے...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>تقریر تیار کریں</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Speech Text Editor Canvas */}
            <div
              className={`${theme.cardBg} rounded-2xl p-4 border ${theme.cardBorder} shadow-sm space-y-3`}
            >
              {/* Title & Stats */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <input
                  type="text"
                  value={speechTitle}
                  onChange={(e) => setSpeechTitle(e.target.value)}
                  className={`text-sm sm:text-base font-bold urdu-title bg-transparent border-b border-transparent hover:border-emerald-500/40 focus:border-emerald-500 focus:outline-none py-1 flex-1`}
                  placeholder="تقریر کا عنوان لکھیں..."
                />

                <div className="flex items-center gap-2 text-[11px] opacity-75">
                  <span>الفاظ: {wordCount}</span>
                  <span>•</span>
                  <span>تخمینہ وقت: {estimatedMinutes} منٹ</span>
                </div>
              </div>

              {/* Textarea */}
              <textarea
                rows={9}
                value={speechText}
                onChange={(e) => setSpeechText(e.target.value)}
                placeholder="یہاں اپنی تقریر، خطاب یا کوئی بھی موٹیویشنل متن تحریر کریں یا اوپر AI سے تیار کروائیں..."
                className={`w-full ${theme.inputBg} border ${theme.inputBorder} rounded-xl p-3.5 text-sm sm:text-base focus:outline-none focus:border-emerald-500 font-urdu leading-relaxed resize-y transition-colors`}
                style={{ fontSize: `${fontSize}px` }}
              />

              {/* Editor Bottom Actions */}
              <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleCopyText}
                    className={`py-1.5 px-3 rounded-xl text-xs font-bold border flex items-center gap-1.5 cursor-pointer ${theme.buttonSecondary}`}
                    title="متن کاپی کریں"
                  >
                    {copiedText ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>کاپی ہو گیا!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>متن کاپی کریں</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleSaveSpeech}
                    className={`py-1.5 px-3 rounded-xl text-xs font-bold border flex items-center gap-1.5 cursor-pointer ${theme.buttonSecondary}`}
                    title="لائبریری میں محفوظ کریں"
                  >
                    <Bookmark className="w-3.5 h-3.5 text-indigo-500" />
                    <span>محفوظ کریں</span>
                  </button>

                  <button
                    onClick={() => setSpeechText('')}
                    className={`py-1.5 px-3 rounded-xl text-xs font-bold border flex items-center gap-1.5 cursor-pointer opacity-70 hover:opacity-100 ${theme.buttonSecondary}`}
                    title="متن صاف کریں"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>صاف کریں</span>
                  </button>
                </div>

                {/* Primary Action Button: Speak / Listen */}
                <button
                  onClick={handleTogglePlay}
                  disabled={isSynthesizingAudio}
                  className={`py-2 px-5 ${theme.buttonPrimary} rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md transition-transform active:scale-95 disabled:opacity-50`}
                >
                  {isSynthesizingAudio ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>صوتی اسپیچ تیار ہو رہی ہے...</span>
                    </>
                  ) : isPlaying ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>{isPaused ? 'دوبارہ سنیں' : 'آواز روکیں'}</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      <span>اس آواز میں تقریر سنیں</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Audio Tuning Sliders (صوتی فریکوئنسی اور رفتار ایڈجسٹمنٹ) */}
            <div
              className={`${theme.cardBg} rounded-2xl p-4 border ${theme.cardBorder} shadow-sm space-y-3`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-emerald-500" />
                  <h4 className="font-bold text-xs urdu-title">
                    صوتی فریکوئنسی اور رفتار کی فائن ٹیوننگ
                  </h4>
                </div>
                <button
                  onClick={() => {
                    setPitchMultiplier(1.0);
                    setRateMultiplier(1.0);
                  }}
                  className="text-[11px] opacity-75 hover:opacity-100 cursor-pointer"
                >
                  ری سیٹ کریں
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Pitch */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="opacity-80">پچ ایڈجسٹمنٹ (سُر):</span>
                    <span className="font-bold font-mono">{pitchMultiplier.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min={0.7}
                    max={1.4}
                    step={0.05}
                    value={pitchMultiplier}
                    onChange={(e) => setPitchMultiplier(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] opacity-60">
                    <span>گہری بارعب</span>
                    <span>معمول</span>
                    <span>تیز و باریک</span>
                  </div>
                </div>

                {/* Rate */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="opacity-80">بولنے کی رفتار:</span>
                    <span className="font-bold font-mono">{rateMultiplier.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min={0.75}
                    max={1.35}
                    step={0.05}
                    value={rateMultiplier}
                    onChange={(e) => setRateMultiplier(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] opacity-60">
                    <span>پرسکون دھیمی</span>
                    <span>معمول</span>
                    <span>پرجوش تیز</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: VOICES (صوتی کلوننگ، نمونے اور مائیکروفون) ================= */}
        {activeTab === 'voices' && (
          <div className="space-y-4">
            {/* Gallery Selector Tab */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setVoiceGalleryTab('presets')}
                  className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    voiceGalleryTab === 'presets'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : `${theme.buttonSecondary}`
                  }`}
                >
                  🌟 ریڈی میڈ صوتی نمونے ({PRESET_VOICES.length})
                </button>

                <button
                  onClick={() => setVoiceGalleryTab('uploaded')}
                  className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    voiceGalleryTab === 'uploaded'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : `${theme.buttonSecondary}`
                  }`}
                >
                  📁 آپ کی اپلوڈڈ و کلون شدہ آوازیں ({userUploadedVoices.length})
                </button>
              </div>

              <button
                onClick={() => setIsVoiceUploadModalOpen(true)}
                className="py-1.5 px-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1 cursor-pointer transition-transform active:scale-95"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>نئی آواز اپلوڈ یا اسکین کریں</span>
              </button>
            </div>

            {/* Presets Gallery */}
            {voiceGalleryTab === 'presets' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {PRESET_VOICES.map((v) => {
                  const isCurrent = activeVoice.id === v.id;
                  const isPlayingThis = playingPreviewVoiceId === v.id;

                  return (
                    <div
                      key={v.id}
                      onClick={() => {
                        setActiveVoice(v);
                        setActiveTab('studio');
                      }}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                        isCurrent
                          ? 'border-emerald-500 bg-emerald-500/10 shadow-md ring-2 ring-emerald-500/30'
                          : `${theme.cardBg} border ${theme.cardBorder} hover:border-emerald-400/60`
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            {isCurrent && (
                              <span className="bg-emerald-600 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold flex items-center gap-0.5">
                                <Check className="w-2.5 h-2.5" />
                                فعال
                              </span>
                            )}
                            <span className={`text-[10px] ${theme.accentColor} font-mono`}>
                              {v.pitchHz}Hz
                            </span>
                          </div>
                          <h4 className="font-bold text-xs sm:text-sm urdu-title text-right">
                            {v.name}
                          </h4>
                        </div>

                        <p className={`text-[11px] ${theme.textSecondary} text-right mt-1`}>
                          {v.voiceStyle}
                        </p>

                        {v.previewSampleText && (
                          <div
                            className={`mt-2 p-2 rounded-xl ${theme.inputBg} text-[11px] border ${theme.inputBorder} text-right leading-relaxed italic line-clamp-2 opacity-90`}
                          >
                            "{v.previewSampleText}"
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-700/30">
                        <button
                          onClick={(e) => handlePlayVoicePreview(v, e)}
                          className={`py-1 px-2.5 rounded-xl text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                            isPlayingThis
                              ? 'bg-rose-600 text-white'
                              : `${theme.buttonSecondary}`
                          }`}
                        >
                          {isPlayingThis ? (
                            <>
                              <Pause className="w-3 h-3" />
                              <span>روکیں</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3 h-3 text-emerald-500" />
                              <span>نمونہ سنیں</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => {
                            setActiveVoice(v);
                            setActiveTab('studio');
                          }}
                          className={`py-1 px-3 rounded-xl text-[11px] font-bold cursor-pointer transition-all ${
                            isCurrent
                              ? 'bg-emerald-600 text-white'
                              : `${theme.buttonSecondary}`
                          }`}
                        >
                          {isCurrent ? 'منتخب شدہ' : 'منتخب کریں'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Uploaded Voices Gallery */}
            {voiceGalleryTab === 'uploaded' && (
              <div>
                {userUploadedVoices.length === 0 ? (
                  <div
                    className={`${theme.cardBg} text-center py-12 px-4 rounded-2xl border border-dashed ${theme.cardBorder} space-y-3`}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 text-indigo-500 mx-auto flex items-center justify-center">
                      <Mic className="w-7 h-7" />
                    </div>
                    <h4 className="font-bold text-sm urdu-title">
                      ابھی تک کوئی ذاتی آواز اسکین نہیں کی گئی
                    </h4>
                    <p className="text-xs opacity-75 max-w-md mx-auto leading-relaxed">
                      آپ اپنے موبائل یا کمپیوٹر سے کسی بھی آڈیو فائل (MP3، WAV، M4A) کا نمونہ اپلوڈ کریں، یا مائیکروفون سے بول کر ریکارڈ کریں۔ AI صوتی فریکوئنسی اور لہجے کو اسکین کر کے آپ کے متن سے تقریر تیار کرے گا!
                    </p>
                    <button
                      onClick={() => setIsVoiceUploadModalOpen(true)}
                      className="py-2 px-5 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-transform active:scale-95 inline-flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>آواز اپلوڈ اور اسکین کریں</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {userUploadedVoices.map((v) => {
                      const isCurrent = activeVoice.id === v.id;
                      const isPlayingThis = playingPreviewVoiceId === v.id;

                      return (
                        <div
                          key={v.id}
                          onClick={() => {
                            setActiveVoice(v);
                            setActiveTab('studio');
                          }}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                            isCurrent
                              ? 'border-indigo-500 bg-indigo-500/10 shadow-md ring-2 ring-indigo-500/30'
                              : `${theme.cardBg} border ${theme.cardBorder} hover:border-indigo-400/60`
                          }`}
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-1.5">
                                {isCurrent && (
                                  <span className="bg-indigo-600 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold flex items-center gap-0.5">
                                    <Check className="w-2.5 h-2.5" />
                                    فعال
                                  </span>
                                )}
                                <span className="text-[10px] text-indigo-500 font-mono">
                                  {v.pitchHz}Hz
                                </span>
                              </div>
                              <h4 className="font-bold text-xs sm:text-sm urdu-title text-right truncate">
                                {v.name}
                              </h4>
                            </div>

                            <p className={`text-[11px] ${theme.textSecondary} text-right mt-1`}>
                              {v.voiceStyle}
                            </p>

                            {v.transcribedText && (
                              <div
                                className={`mt-2 p-2 rounded-xl ${theme.inputBg} text-[11px] border ${theme.inputBorder} text-right leading-relaxed line-clamp-2 opacity-90`}
                              >
                                "{v.transcribedText}"
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-700/30">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={(e) => handlePlayVoicePreview(v, e)}
                                className={`py-1 px-2.5 rounded-xl text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                                  isPlayingThis
                                    ? 'bg-rose-600 text-white'
                                    : `${theme.buttonSecondary}`
                                }`}
                              >
                                {isPlayingThis ? (
                                  <>
                                    <Pause className="w-3 h-3" />
                                    <span>روکیں</span>
                                  </>
                                ) : (
                                  <>
                                    <Play className="w-3 h-3 text-indigo-500" />
                                    <span>نمونہ</span>
                                  </>
                                )}
                              </button>

                              <button
                                onClick={(e) => handleDeleteUploadedVoice(v.id, e)}
                                className="p-1 rounded-xl text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                                title="حذف کریں"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <button
                              onClick={() => {
                                setActiveVoice(v);
                                setActiveTab('studio');
                              }}
                              className={`py-1 px-3 rounded-xl text-[11px] font-bold cursor-pointer transition-all ${
                                isCurrent
                                  ? 'bg-indigo-600 text-white'
                                  : `${theme.buttonSecondary}`
                              }`}
                            >
                              {isCurrent ? 'منتخب شدہ' : 'منتخب کریں'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: LIBRARY (محفوظ شدہ تقاریر اور موضوعات) ================= */}
        {activeTab === 'library' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm urdu-title flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-500" />
                <span>محفوظ شدہ موٹیویشنل تقاریر لائبریری ({savedSpeeches.length})</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {savedSpeeches.map((speech) => (
                <div
                  key={speech.id}
                  className={`${theme.cardBg} rounded-2xl p-4 border ${theme.cardBorder} shadow-sm space-y-2 flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-purple-500/20 text-purple-600 dark:text-purple-400">
                        {speech.category}
                      </span>
                      <h4 className="font-bold text-sm urdu-title text-right">
                        {speech.title}
                      </h4>
                    </div>

                    <p className="text-xs opacity-80 line-clamp-3 leading-relaxed mt-2 text-right">
                      {speech.scriptText}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-700/20 text-xs">
                    <span className="opacity-60 text-[10px]">{speech.dateCreated}</span>

                    <button
                      onClick={() => handleLoadSpeech(speech)}
                      className="py-1 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs cursor-pointer shadow-xs transition-transform active:scale-95"
                    >
                      اسٹوڈیو میں لوڈ کریں
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 4: SETTINGS (ترتیبات، فونٹ اپلوڈ اور تھیم) ================= */}
        {activeTab === 'settings' && (
          <div className="space-y-4">
            {/* Font Settings Card */}
            <div
              className={`${theme.cardBg} rounded-2xl p-4 border ${theme.cardBorder} shadow-sm space-y-3`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4 text-emerald-500" />
                  <h3 className="font-bold text-sm urdu-title">
                    ڈیش بورڈ فونٹ ترتیبات و فونٹ اپلوڈ
                  </h3>
                </div>

                <button
                  onClick={() => setIsFontModalOpen(true)}
                  className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs"
                >
                  نیا فونٹ اپلوڈ کریں
                </button>
              </div>

              <p className="text-xs opacity-80 leading-relaxed">
                آپ اپنا پسندیدہ اردو فونٹ (مثلاً جمیل نوری نستعلیق، مہر نستعلیق، یا القلم) اپلوڈ کر سکتے ہیں۔
              </p>

              {customFontName && (
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs font-bold flex items-center justify-between">
                  <span>فعال اپلوڈڈ فونٹ: {customFontName.replace('UserFont_', '')}</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400">انسٹال شدہ</span>
                </div>
              )}
            </div>

            {/* Theme Toggle Card */}
            <div
              className={`${theme.cardBg} rounded-2xl p-4 border ${theme.cardBorder} shadow-sm space-y-3`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-amber-500" />
                  <h3 className="font-bold text-sm urdu-title">
                    تھیم اور لائٹ موڈ سسٹم
                  </h3>
                </div>

                <button
                  onClick={toggleLightDark}
                  className="py-1.5 px-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs"
                >
                  {theme.isLight ? 'ڈارک تھیم لگائیں' : 'لائٹ تھیم لگائیں'}
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.values(SPEECH_STUDIO_THEMES).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`p-2.5 rounded-xl border text-right cursor-pointer transition-all ${
                      activeThemeId === t.id
                        ? 'border-emerald-500 bg-emerald-500/15 font-bold ring-2 ring-emerald-500/30'
                        : `${theme.inputBg} border ${theme.inputBorder}`
                    }`}
                  >
                    <span className="text-xs block">{t.badge}</span>
                    <span className="text-[10px] opacity-75 block mt-0.5">{t.urduName}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 3. DOCKED NATIVE AUDIO PLAYER TOOLBAR (مستقل آڈیو پلیئر بار) */}
      <footer
        className={`fixed bottom-0 left-0 right-0 z-40 ${theme.headerBg} backdrop-blur-md border-t ${theme.headerBorder} shadow-2xl p-2.5 transition-colors`}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          {/* Active Voice Info */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-xs">
              <Headphones className="w-4 h-4" />
            </div>
            <div className="hidden xs:block">
              <span className="text-xs font-bold block truncate max-w-[120px] sm:max-w-[200px]">
                {activeVoice.name}
              </span>
              <span className="text-[10px] opacity-70 block font-mono">
                {activeVoice.pitchHz}Hz • {rateMultiplier}x
              </span>
            </div>
          </div>

          {/* Player Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleStop}
              className={`p-2 rounded-xl border flex items-center justify-center cursor-pointer transition-all ${theme.buttonSecondary}`}
              title="آواز بند کریں"
            >
              <Square className="w-4 h-4" />
            </button>

            <button
              onClick={handleTogglePlay}
              disabled={isSynthesizingAudio}
              className={`py-2 px-4 ${theme.buttonPrimary} rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md transition-transform active:scale-95 disabled:opacity-50`}
            >
              {isSynthesizingAudio ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">تیار ہو رہی ہے...</span>
                </>
              ) : isPlaying ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>{isPaused ? 'دوبارہ سنیں' : 'روکیں'}</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>تقریر بولیں</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadAudio}
              disabled={isDownloading || !speechText.trim()}
              className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-transform active:scale-95 disabled:opacity-40 ${
                theme.isLight
                  ? 'bg-slate-200 hover:bg-slate-300 text-slate-800 border-slate-300'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
              title="خالص آڈیو فائل (.WAV) ڈاؤنلوڈ کریں"
            >
              {isDownloading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5 text-emerald-500" />
              )}
              <span className="hidden sm:inline">ڈاؤنلوڈ WAV</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Voice Upload & AI Scanner Modal */}
      <VoiceUploadModal
        isOpen={isVoiceUploadModalOpen}
        onClose={() => setIsVoiceUploadModalOpen(false)}
        onVoiceProfileCreated={handleVoiceProfileCreated}
        isLight={theme.isLight}
      />

      {/* Font Upload & Sizing Modal */}
      <FontUploadModal
        isOpen={isFontModalOpen}
        onClose={() => setIsFontModalOpen(false)}
        currentFontId={fontId}
        onSelectFont={handleSelectFont}
        customFontName={customFontName}
        fontSize={fontSize}
        onChangeFontSize={setFontSize}
        isLight={theme.isLight}
      />
    </div>
  );
};

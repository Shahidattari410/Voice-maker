export interface SpeechStudioTheme {
  id: string;
  name: string;
  urduName: string;
  badge: string;
  pageBg: string;
  cardBg: string;
  cardBorder: string;
  headerBg: string;
  headerBorder: string;
  inputBg: string;
  inputBorder: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accentColor: string;
  accentBg: string;
  accentBorder: string;
  buttonPrimary: string;
  buttonSecondary: string;
  waveformColor: string;
  isLight: boolean;
}

export const SPEECH_STUDIO_THEMES: Record<string, SpeechStudioTheme> = {
  'cyber-obsidian': {
    id: 'cyber-obsidian',
    name: 'Cyber Studio Dark',
    urduName: 'ڈارک اسٹوڈیو (بلیک و زمرد)',
    badge: '⚫ نائٹ اسٹوڈیو',
    pageBg: 'bg-slate-950',
    cardBg: 'bg-slate-900/90',
    cardBorder: 'border-slate-800',
    headerBg: 'bg-slate-900/95',
    headerBorder: 'border-slate-800',
    inputBg: 'bg-slate-950',
    inputBorder: 'border-slate-800',
    textPrimary: 'text-slate-100',
    textSecondary: 'text-slate-300',
    textMuted: 'text-slate-500',
    accentColor: 'text-emerald-400',
    accentBg: 'bg-emerald-500/15',
    accentBorder: 'border-emerald-500/30',
    buttonPrimary: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white',
    buttonSecondary: 'bg-slate-800 hover:bg-slate-700 text-slate-300',
    waveformColor: '#10b981',
    isLight: false,
  },
  'royal-emerald': {
    id: 'royal-emerald',
    name: 'Royal Emerald & Gold',
    urduName: 'شاہی زمرد و سنہری (اسلامک گرین)',
    badge: '👑 شاہی زمرد',
    pageBg: 'bg-[#041a12]',
    cardBg: 'bg-[#08291d]/90',
    cardBorder: 'border-[#124b37]',
    headerBg: 'bg-[#06241a]/95',
    headerBorder: 'border-[#124b37]',
    inputBg: 'bg-[#03130d]',
    inputBorder: 'border-[#124b37]',
    textPrimary: 'text-emerald-50',
    textSecondary: 'text-emerald-200',
    textMuted: 'text-emerald-400/60',
    accentColor: 'text-amber-300',
    accentBg: 'bg-amber-400/15',
    accentBorder: 'border-amber-400/30',
    buttonPrimary: 'bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 hover:from-emerald-700 hover:to-amber-700 text-white shadow-emerald-950',
    buttonSecondary: 'bg-[#0e3a2b] hover:bg-[#144d3a] text-emerald-100',
    waveformColor: '#fbbf24',
    isLight: false,
  },
  'deep-ocean': {
    id: 'deep-ocean',
    name: 'Deep Sapphire Ocean',
    urduName: 'گہرا بحری نیلا (سیفائر بلیو)',
    badge: '🌊 گہرا سمندر',
    pageBg: 'bg-[#061226]',
    cardBg: 'bg-[#0c2040]/90',
    cardBorder: 'border-[#17376a]',
    headerBg: 'bg-[#081a38]/95',
    headerBorder: 'border-[#17376a]',
    inputBg: 'bg-[#040e1e]',
    inputBorder: 'border-[#17376a]',
    textPrimary: 'text-blue-50',
    textSecondary: 'text-blue-200',
    textMuted: 'text-blue-400/60',
    accentColor: 'text-cyan-300',
    accentBg: 'bg-cyan-500/15',
    accentBorder: 'border-cyan-500/30',
    buttonPrimary: 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white',
    buttonSecondary: 'bg-[#102b54] hover:bg-[#16396e] text-blue-100',
    waveformColor: '#38bdf8',
    isLight: false,
  },
  'classic-light': {
    id: 'classic-light',
    name: 'Classic Executive Light',
    urduName: 'روشن کلاسک سفید (Executive Light)',
    badge: '☀️ روشن سفید',
    pageBg: 'bg-slate-100',
    cardBg: 'bg-white',
    cardBorder: 'border-slate-200 shadow-sm',
    headerBg: 'bg-white/95',
    headerBorder: 'border-slate-200 shadow-2xs',
    inputBg: 'bg-slate-50',
    inputBorder: 'border-slate-200',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-700',
    textMuted: 'text-slate-400',
    accentColor: 'text-emerald-700',
    accentBg: 'bg-emerald-50',
    accentBorder: 'border-emerald-300',
    buttonPrimary: 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white shadow-xs',
    buttonSecondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700',
    waveformColor: '#059669',
    isLight: true,
  },
  'sunset-crimson': {
    id: 'sunset-crimson',
    name: 'Sunset Crimson Fire',
    urduName: 'پرجوش یاقوتی شفق (Crimson Red)',
    badge: '🔥 پرجوش یاقوتی',
    pageBg: 'bg-[#1c0714]',
    cardBg: 'bg-[#2e0e22]/90',
    cardBorder: 'border-[#521b3e]',
    headerBg: 'bg-[#240a1b]/95',
    headerBorder: 'border-[#521b3e]',
    inputBg: 'bg-[#14040e]',
    inputBorder: 'border-[#521b3e]',
    textPrimary: 'text-rose-50',
    textSecondary: 'text-rose-200',
    textMuted: 'text-rose-400/60',
    accentColor: 'text-rose-300',
    accentBg: 'bg-rose-500/15',
    accentBorder: 'border-rose-500/30',
    buttonPrimary: 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white',
    buttonSecondary: 'bg-[#3e1430] hover:bg-[#521b3e] text-rose-100',
    waveformColor: '#fb7185',
    isLight: false,
  },
  'cosmic-amethyst': {
    id: 'cosmic-amethyst',
    name: 'Cosmic Amethyst',
    urduName: 'پراسرار کہکشاں جامنی (Royal Purple)',
    badge: '🔮 کہکشاں جامنی',
    pageBg: 'bg-[#110724]',
    cardBg: 'bg-[#1e0e3e]/90',
    cardBorder: 'border-[#381a70]',
    headerBg: 'bg-[#180a32]/95',
    headerBorder: 'border-[#381a70]',
    inputBg: 'bg-[#0a0317]',
    inputBorder: 'border-[#381a70]',
    textPrimary: 'text-purple-50',
    textSecondary: 'text-purple-200',
    textMuted: 'text-purple-400/60',
    accentColor: 'text-purple-300',
    accentBg: 'bg-purple-500/15',
    accentBorder: 'border-purple-500/30',
    buttonPrimary: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white',
    buttonSecondary: 'bg-[#2a1352] hover:bg-[#381a70] text-purple-100',
    waveformColor: '#c084fc',
    isLight: false,
  },
};

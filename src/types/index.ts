export type CategoryId = 'daily' | 'qufl' | 'weekly' | 'monthly' | 'yearly';

export interface QuestionItem {
  id: string;
  category: CategoryId;
  urduNumber: string;
  text: string;
  subtext?: string; // کاش! ...
  type: 'boolean' | 'count';
  targetCount?: number;
}

export interface DeedTemplate {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  categories: {
    id: CategoryId;
    title: string;
    subtitle: string;
    color: string;
    description: string;
  }[];
  questions: QuestionItem[];
}

export type AnswerStatus = 'done' | 'not_done' | 'partial' | 'none';

export interface DayRecord {
  date: string; // YYYY-MM-DD
  answers: Record<string, AnswerStatus>;
  notes?: Record<string, string>;
  counts?: Record<string, number>;
}

export type ThemeId = 'classic-slate' | 'madani-emerald' | 'royal-burgundy' | 'midnight-dark' | 'sunset-rose' | 'ocean-teal';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  urduName: string;
  headerBg: string;
  headerText: string;
  accentColor: string;
  pageBg: string;
  cardBg: string;
  textPrimary: string;
  textSecondary: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
  ringColor: string;
}

export type FontId = 'noto-nastaliq' | 'gulzar' | 'amiri' | 'lateef' | 'noto-sans-arabic' | 'custom-uploaded';

export type SortOrder = 'default' | 'pending_first' | 'done_first' | 'alphabetical' | 'reverse' | 'custom';

export type AppView = 'splash' | 'dashboard' | 'workplan' | 'reports';

export type AppSuite = 'naik-amaal' | 'speech-studio' | 'prayer-times';

export interface VoiceProfile {
  id: string;
  name: string;
  dateCreated: string;
  sourceType: 'uploaded_audio' | 'microphone_recording' | 'preset';
  durationSeconds: number;
  pitchHz: number;
  pitchRatio: number;
  speechRate: number;
  timbreWarmth: number;
  resonanceFactor: number;
  voiceStyle: string;
  matchScore: number;
  audioBlobUrl?: string;
  audioBase64?: string;
  transcribedText?: string;
  fileName?: string;
  geminiVoiceName?: 'Fenrir' | 'Kore' | 'Puck' | 'Charon' | 'Zephyr';
  previewSampleText?: string;
}

export interface MotivationalSpeech {
  id: string;
  title: string;
  category: string;
  style: string;
  scriptText: string;
  durationEstimateSeconds: number;
  dateCreated: string;
  voiceProfileId?: string;
}

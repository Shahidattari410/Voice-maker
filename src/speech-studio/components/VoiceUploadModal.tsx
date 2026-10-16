import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Upload,
  Mic,
  Square,
  Play,
  Pause,
  Sparkles,
  Check,
  AlertCircle,
  FileAudio,
  Radio,
  Activity,
  Layers,
  Wand2,
  Volume2,
} from 'lucide-react';
import { VoiceProfile } from '../../types';
import { analyzeVoiceSample } from '../services/voiceAnalyzer';
import { WaveformVisualizer } from './WaveformVisualizer';

interface VoiceUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVoiceProfileCreated: (profile: VoiceProfile, speechText?: string) => void;
  isLight?: boolean;
}

export const VoiceUploadModal: React.FC<VoiceUploadModalProps> = ({
  isOpen,
  onClose,
  onVoiceProfileCreated,
  isLight = false,
}) => {
  const [tab, setTab] = useState<'upload' | 'record'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzingStep, setAnalyzingStep] = useState<number>(0);
  const [analyzedProfile, setAnalyzedProfile] = useState<VoiceProfile | null>(null);
  const [customVoiceName, setCustomVoiceName] = useState('');
  const [transcribedSpeechText, setTranscribedSpeechText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordIntervalRef = useRef<number | null>(null);

  // Audio sample playback
  const [isPlayingSample, setIsPlayingSample] = useState(false);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Perform full scan on audio blob
  const performVoiceScan = async (blob: Blob, name: string) => {
    setIsAnalyzing(true);
    setErrorMessage('');
    setAnalyzingStep(1); // Stage 1: Waveform & Acoustic frequency

    const stepTimer1 = setTimeout(() => setAnalyzingStep(2), 600); // Stage 2: Urdu Speech recognition
    const stepTimer2 = setTimeout(() => setAnalyzingStep(3), 1400); // Stage 3: Pitch & Timbre extraction
    const stepTimer3 = setTimeout(() => setAnalyzingStep(4), 2200); // Stage 4: Neural Voice Clone ready

    try {
      const profile = await analyzeVoiceSample(blob, name);
      setAnalyzedProfile(profile);
      setCustomVoiceName(name.replace(/\.[^/.]+$/, ''));
      if (profile.transcribedText) {
        setTranscribedSpeechText(profile.transcribedText);
      }
    } catch (err) {
      console.error('Scan error:', err);
      setErrorMessage('آواز اسکین کرنے میں دشواری پیش آئی۔ برائے مہربانی کوئی دوسری فائل اپلوڈ کریں یا مائیکروفون سے بول کر ریکارڈ کریں۔');
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);
      setIsAnalyzing(false);
      setAnalyzingStep(0);
    }
  };

  // Handle Audio File Selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    await performVoiceScan(file, file.name);
  };

  // Start Live Microphone Recording
  const startRecording = async () => {
    try {
      setErrorMessage('');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await performVoiceScan(audioBlob, 'میری براہِ راست ریکارڈ شدہ آواز');
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      recordIntervalRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 25) {
            stopRecording();
            return 25;
          }
          return prev + 1;
        });
      }, 1000);
    } catch {
      setErrorMessage('مائیکروفون تک رسائی حاصل نہیں ہو سکی۔ برائے مہربانی براؤزر میں مائیکروفون کی اجازت دیں۔');
    }
  };

  // Stop Live Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordIntervalRef.current) {
        clearInterval(recordIntervalRef.current);
      }
    }
  };

  // Toggle sample playback
  const togglePlaySample = () => {
    if (!analyzedProfile?.audioBlobUrl) return;

    if (!audioPlayerRef.current) {
      audioPlayerRef.current = new Audio(analyzedProfile.audioBlobUrl);
      audioPlayerRef.current.onended = () => setIsPlayingSample(false);
    }

    if (isPlayingSample) {
      audioPlayerRef.current.pause();
      setIsPlayingSample(false);
    } else {
      audioPlayerRef.current.play();
      setIsPlayingSample(true);
    }
  };

  // Confirm and set profile
  const handleSaveProfile = () => {
    if (!analyzedProfile) return;
    const finalProfile: VoiceProfile = {
      ...analyzedProfile,
      name: customVoiceName.trim() || analyzedProfile.name,
      transcribedText: transcribedSpeechText.trim() || analyzedProfile.transcribedText,
    };
    onVoiceProfileCreated(finalProfile, transcribedSpeechText.trim() || analyzedProfile.transcribedText);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 text-right overflow-y-auto font-urdu"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          className={`rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border transition-colors ${
            isLight
              ? 'bg-white border-slate-200 text-slate-800'
              : 'bg-slate-900 border-slate-700 text-slate-100'
          }`}
        >
          {/* Header */}
          <div
            className={`px-4 py-3 border-b flex items-center justify-between ${
              isLight
                ? 'bg-slate-50 border-slate-200'
                : 'bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border-slate-800'
            }`}
          >
            <button
              onClick={onClose}
              className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                isLight
                  ? 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <h3 className="text-base font-bold urdu-title">
                صوتی نمونہ اسکینر و وائس کلوننگ
              </h3>
            </div>
          </div>

          <div className="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
            {/* Top Selector: File Upload vs Live Record */}
            <div
              className={`grid grid-cols-2 gap-1.5 p-1 rounded-xl border ${
                isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-800'
              }`}
            >
              <button
                onClick={() => setTab('upload')}
                className={`py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  tab === 'upload'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : isLight
                    ? 'text-slate-600 hover:text-slate-900'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>آڈیو فائل اپلوڈ کریں</span>
              </button>

              <button
                onClick={() => setTab('record')}
                className={`py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  tab === 'record'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : isLight
                    ? 'text-slate-600 hover:text-slate-900'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>مائیک سے بول کر ریکارڈ کریں</span>
              </button>
            </div>

            {/* Tab 1: File Upload */}
            {tab === 'upload' && (
              <div className="space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg"
                  className="hidden"
                  onChange={handleFileChange}
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group ${
                    isLight
                      ? 'border-slate-300 hover:border-emerald-600 bg-slate-50 hover:bg-emerald-50/30'
                      : 'border-slate-700 hover:border-emerald-500/80 bg-slate-950/60 hover:bg-slate-950'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                    <FileAudio className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">
                      {selectedFile ? selectedFile.name : 'یہاں آڈیو فائل منتخب کریں یا ڈریگ کریں'}
                    </p>
                    <p className="text-[11px] opacity-75 mt-1">
                      سپورٹ شدہ فارمیٹس: MP3, WAV, M4A, AAC, OGG (کم از کم ۵ تا ۱۰ سیکنڈ)
                    </p>
                  </div>
                  <span
                    className={`py-1 px-3 rounded-md text-[11px] font-semibold border ${
                      isLight
                        ? 'bg-white border-slate-300 text-emerald-700'
                        : 'bg-slate-800 border-slate-700 text-emerald-300'
                    }`}
                  >
                    کمپیوٹر / موبائل سے فائل چنیں
                  </span>
                </div>
              </div>
            )}

            {/* Tab 2: Live Recording */}
            {tab === 'record' && (
              <div
                className={`space-y-3 p-4 rounded-xl border text-center ${
                  isLight
                    ? 'bg-slate-50 border-slate-200'
                    : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <p className="text-xs leading-relaxed opacity-90">
                  اپنے مائیکروفون میں کوئی بھی جملہ یا تقریر کا حصہ (۵ سے ۱۵ سیکنڈ) صاف آواز میں بولیں تاکہ AI آپ کی آواز کا مکمل صوتی نمونہ حاصل کر سکے۔
                </p>

                {/* Animated Waveform */}
                <WaveformVisualizer isPlaying={false} isRecording={isRecording} height={48} />

                {/* Record Button & Timer */}
                <div className="flex flex-col items-center justify-center gap-2 pt-2">
                  <div className="text-base font-bold tabular-nums">
                    {isRecording ? (
                      <span className="text-rose-500 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                        ریکارڈنگ جاری ہے: {recordingSeconds}s / 25s
                      </span>
                    ) : (
                      <span className="opacity-75 text-xs">ریکارڈ کرنے کے لیے نیچے بٹن دبائیں</span>
                    )}
                  </div>

                  {!isRecording ? (
                    <button
                      onClick={startRecording}
                      className="py-2.5 px-6 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-bold shadow-md flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
                    >
                      <Mic className="w-4 h-4" />
                      <span>ریکارڈنگ شروع کریں</span>
                    </button>
                  ) : (
                    <button
                      onClick={stopRecording}
                      className="py-2.5 px-6 bg-slate-800 hover:bg-slate-700 text-white rounded-full font-bold shadow-md flex items-center gap-2 cursor-pointer border border-rose-500 text-rose-300 transition-transform active:scale-95"
                    >
                      <Square className="w-4 h-4 fill-rose-500 text-rose-500" />
                      <span>ریکارڈنگ مکمل اور اسکین کریں</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Error Display */}
            {errorMessage && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-600 dark:text-rose-300 flex items-center gap-2 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Real-time Voice Scanning Animation & Progress */}
            {isAnalyzing && (
              <div
                className={`p-4 rounded-xl border space-y-3 ${
                  isLight
                    ? 'bg-emerald-50/70 border-emerald-300'
                    : 'bg-slate-950 border-emerald-500/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-500 animate-spin" />
                    <span className="font-bold text-xs text-emerald-600 dark:text-emerald-400">
                      صوتی تجزیہ اور اسکیننگ کا عمل جاری ہے...
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-300">
                    AI Voice Scanner
                  </span>
                </div>

                {/* Scanning 4 Steps */}
                <div className="space-y-1.5 text-[11px]">
                  <div className={`flex items-center gap-2 ${analyzingStep >= 1 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'opacity-40'}`}>
                    <Check className="w-3.5 h-3.5" />
                    <span>مرحلہ ۱: صوتی لہروں اور فریکوئنسی کا اسکین (Acoustic Spectrum)</span>
                  </div>
                  <div className={`flex items-center gap-2 ${analyzingStep >= 2 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'opacity-40'}`}>
                    <Check className="w-3.5 h-3.5" />
                    <span>مرحلہ ۲: بولے گئے الفاظ اور تقریر کی پہچان (Urdu Speech Recognition)</span>
                  </div>
                  <div className={`flex items-center gap-2 ${analyzingStep >= 3 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'opacity-40'}`}>
                    <Check className="w-3.5 h-3.5" />
                    <span>مرحلہ ۳: پچ فریکوئنسی اور لہجے کی شناخت (Pitch & Timbre Extraction)</span>
                  </div>
                  <div className={`flex items-center gap-2 ${analyzingStep >= 4 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'opacity-40'}`}>
                    <Check className="w-3.5 h-3.5" />
                    <span>مرحلہ ۴: نیورل وائس کلون پروفائل کی تشکیل (Neural Voice Ready)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Analyzed Voice Profile Card (صوتی کلوننگ رپورٹ) */}
            {analyzedProfile && !isAnalyzing && (
              <div
                className={`p-4 rounded-xl border space-y-3 ${
                  isLight
                    ? 'bg-emerald-50/40 border-emerald-300 shadow-sm'
                    : 'bg-gradient-to-br from-emerald-950/60 to-slate-950 border-emerald-500/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/40 text-[11px] font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-500" />
                    <span>صوتی مماثلت: {analyzedProfile.matchScore}%</span>
                  </span>
                  <span className="font-bold text-sm text-emerald-600 dark:text-emerald-300 urdu-title">
                    ✅ صوتی کلون کامیابی سے اسکین ہو گیا!
                  </span>
                </div>

                {/* Voice Profile Breakdown */}
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div
                    className={`p-2 rounded-lg border ${
                      isLight ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-slate-800'
                    }`}
                  >
                    <span className="opacity-70 block">پچ فریکوئنسی (Pitch):</span>
                    <span className="font-bold tabular-nums text-xs">
                      {analyzedProfile.pitchHz} Hz
                    </span>
                  </div>

                  <div
                    className={`p-2 rounded-lg border ${
                      isLight ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-slate-800'
                    }`}
                  >
                    <span className="opacity-70 block">صوتی انداز (Tone & Style):</span>
                    <span className="font-bold text-[10px] truncate block">
                      {analyzedProfile.voiceStyle}
                    </span>
                  </div>

                  <div
                    className={`p-2 rounded-lg border ${
                      isLight ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-slate-800'
                    }`}
                  >
                    <span className="opacity-70 block">بولنے کی رفتار (Speech Rate):</span>
                    <span className="font-bold tabular-nums text-xs">
                      {analyzedProfile.speechRate}x
                    </span>
                  </div>

                  <div
                    className={`p-2 rounded-lg border ${
                      isLight ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-slate-800'
                    }`}
                  >
                    <span className="opacity-70 block">گونج و گرمجوشی (Timbre):</span>
                    <span className="font-bold tabular-nums text-xs">
                      {analyzedProfile.timbreWarmth}%
                    </span>
                  </div>
                </div>

                {/* Custom Profile Name */}
                <div className="space-y-1">
                  <label className="font-bold block text-xs">
                    کلون شدہ آواز کا نام:
                  </label>
                  <input
                    type="text"
                    value={customVoiceName}
                    onChange={(e) => setCustomVoiceName(e.target.value)}
                    placeholder="مثلاً: میری پرجوش آواز، یا خطیبانہ لہجہ"
                    className={`w-full border rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-500 font-urdu ${
                      isLight
                        ? 'bg-white border-slate-300 text-slate-800'
                        : 'bg-slate-950 border-slate-700 text-white'
                    }`}
                  />
                </div>

                {/* Transcribed Speech Text from Uploaded Audio */}
                <div
                  className={`space-y-1.5 p-3 rounded-xl border shadow-inner ${
                    isLight
                      ? 'bg-white border-emerald-300'
                      : 'bg-slate-950/90 border-emerald-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30">
                      ✨ اسکین شدہ تقریر (Speech-to-Text)
                    </span>
                    <span className="font-bold text-xs">
                      آواز کا متن:
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={transcribedSpeechText}
                    onChange={(e) => setTranscribedSpeechText(e.target.value)}
                    className={`w-full border rounded-lg p-2 text-xs focus:outline-none focus:border-emerald-500 font-urdu leading-relaxed resize-y ${
                      isLight
                        ? 'bg-slate-50 border-slate-300 text-slate-800'
                        : 'bg-slate-900 border-slate-700 text-white'
                    }`}
                    placeholder="آڈیو میں بولی گئی تقریر کا متن یہاں منتقل ہو جائے گا..."
                  />
                  <p className="text-[10px] opacity-75 leading-tight">
                    💡 یہ متن خود بخود آپ کے اسپیچ اسٹوڈیو ایڈیٹر میں منتقل ہو جائے گا اور اسی آواز کے مطابق ادا ہوگا۔
                  </p>
                </div>

                {/* Sample playback button */}
                {analyzedProfile.audioBlobUrl && (
                  <button
                    onClick={togglePlaySample}
                    className={`w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer border transition-colors ${
                      isLight
                        ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                        : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                    }`}
                  >
                    {isPlayingSample ? (
                      <>
                        <Pause className="w-3.5 h-3.5 text-emerald-500" />
                        <span>نمونہ آواز روکیں</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 text-emerald-500" />
                        <span>اصل ریکارڈ شدہ نمونہ سنیں</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Footer Save Button */}
          <div
            className={`p-4 border-t flex items-center justify-end gap-2 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
            }`}
          >
            <button
              onClick={onClose}
              className={`py-2 px-4 rounded-lg font-bold text-xs cursor-pointer ${
                isLight ? 'bg-slate-200 hover:bg-slate-300 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              منسوخ کریں
            </button>

            <button
              onClick={handleSaveProfile}
              disabled={!analyzedProfile}
              className="py-2 px-5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-transform active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>یہ آواز ایکٹو کریں اور اسپیچ اسٹوڈیو میں لوڈ کریں</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

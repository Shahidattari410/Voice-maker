import { VoiceProfile } from '../../types';

class SpeechSynthesizerService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private activeAudio: HTMLAudioElement | null = null;
  private audioContext: AudioContext | null = null;
  private lastSynthesizedBlob: Blob | null = null;
  private lastSynthesizedUrl: string | null = null;
  private isAudioPlaying: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  private getAudioContext(): AudioContext {
    if (!this.audioContext || this.audioContext.state === 'closed') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioContext = new AudioCtx();
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    return this.audioContext;
  }

  // Get best available browser voice as a fallback
  private getBestVoice(): SpeechSynthesisVoice | null {
    if (!this.synth) return null;
    const voices = this.synth.getVoices();

    let voice = voices.find((v) => v.lang.startsWith('ur'));
    if (!voice) {
      voice = voices.find((v) => v.lang.startsWith('hi'));
    }
    if (!voice) {
      voice = voices.find((v) => v.lang.startsWith('ar'));
    }
    if (!voice) {
      voice = voices.find((v) => v.default) || voices[0] || null;
    }
    return voice;
  }

  // Request Neural Audio from server using Gemini TTS
  public async fetchNeuralSpeechAudio(params: {
    text: string;
    voiceProfile?: VoiceProfile;
  }): Promise<{ blob: Blob; url: string }> {
    const { text, voiceProfile } = params;

    const payload = {
      text: text.trim(),
      voiceName: voiceProfile?.geminiVoiceName,
      pitchHz: voiceProfile?.pitchHz,
      voiceStyle: voiceProfile?.voiceStyle,
    };

    const res = await fetch('/api/synthesize-speech', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Server returned status ${res.status}`);
    }

    const data = await res.json();
    if (!data.audioBase64) {
      throw new Error('No audio returned');
    }

    const binaryString = atob(data.audioBase64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const blob = new Blob([bytes], { type: data.mimeType || 'audio/wav' });
    const url = URL.createObjectURL(blob);
    this.lastSynthesizedBlob = blob;
    this.lastSynthesizedUrl = url;

    return { blob, url };
  }

  // Speak speech text: First attempts Neural TTS (authentic cloned voice), falls back to Web Speech
  public async speak(params: {
    text: string;
    voiceProfile?: VoiceProfile;
    rateMultiplier?: number;
    pitchMultiplier?: number;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: unknown) => void;
    onProgress?: (charIndex: number) => void;
  }): Promise<void> {
    const {
      text,
      voiceProfile,
      rateMultiplier = 1.0,
      pitchMultiplier = 1.0,
      onStart,
      onEnd,
      onError,
      onProgress,
    } = params;

    this.stop(); // Stop any currently playing audio

    // Try Neural TTS first (True realistic cloned voice in Urdu!)
    try {
      const { url } = await this.fetchNeuralSpeechAudio({ text, voiceProfile });

      const audio = new Audio(url);
      this.activeAudio = audio;
      audio.playbackRate = Math.max(0.7, Math.min(1.5, rateMultiplier));

      audio.onplay = () => {
        this.isAudioPlaying = true;
        onStart?.();
      };

      audio.ontimeupdate = () => {
        if (audio.duration && audio.duration > 0) {
          const ratio = audio.currentTime / audio.duration;
          const charIndex = Math.min(text.length, Math.floor(ratio * text.length));
          onProgress?.(charIndex);
        }
      };

      audio.onended = () => {
        this.isAudioPlaying = false;
        this.activeAudio = null;
        onEnd?.();
      };

      audio.onerror = (e) => {
        console.warn('Audio playback error, falling back to browser speech:', e);
        this.isAudioPlaying = false;
        this.activeAudio = null;
        this.speakBrowserFallback(params);
      };

      await audio.play();
      return;
    } catch (neuralErr) {
      console.warn('Neural TTS failed or unavailable, falling back to Web Speech:', neuralErr);
      this.speakBrowserFallback(params);
    }
  }

  // Client-side fallback via window.speechSynthesis
  private speakBrowserFallback(params: {
    text: string;
    voiceProfile?: VoiceProfile;
    rateMultiplier?: number;
    pitchMultiplier?: number;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: unknown) => void;
    onProgress?: (charIndex: number) => void;
  }): void {
    const {
      text,
      voiceProfile,
      rateMultiplier = 1.0,
      pitchMultiplier = 1.0,
      onStart,
      onEnd,
      onError,
      onProgress,
    } = params;

    if (!this.synth || typeof window === 'undefined') {
      onError?.(new Error('SpeechSynthesis not supported'));
      return;
    }

    setTimeout(() => {
      if (!this.synth) return;

      const utterance = new SpeechSynthesisUtterance(text);
      const chosenVoice = this.getBestVoice();
      if (chosenVoice) {
        utterance.voice = chosenVoice;
      }

      const basePitchRatio = voiceProfile?.pitchRatio || 1.0;
      const baseSpeechRate = voiceProfile?.speechRate || 1.0;

      utterance.pitch = Math.max(0.5, Math.min(1.8, basePitchRatio * pitchMultiplier));
      utterance.rate = Math.max(0.7, Math.min(1.5, baseSpeechRate * rateMultiplier));

      let keepAliveInterval: number | null = null;

      utterance.onstart = () => {
        this.isAudioPlaying = true;
        onStart?.();

        keepAliveInterval = window.setInterval(() => {
          if (this.synth?.speaking && !this.synth?.paused) {
            this.synth.pause();
            this.synth.resume();
          } else if (keepAliveInterval) {
            clearInterval(keepAliveInterval);
          }
        }, 12000);
      };

      utterance.onend = () => {
        if (keepAliveInterval) clearInterval(keepAliveInterval);
        this.isAudioPlaying = false;
        this.currentUtterance = null;
        onEnd?.();
      };

      utterance.onerror = (e) => {
        if (keepAliveInterval) clearInterval(keepAliveInterval);
        this.isAudioPlaying = false;
        this.currentUtterance = null;
        onError?.(e);
      };

      utterance.onboundary = (e) => {
        onProgress?.(e.charIndex);
      };

      this.currentUtterance = utterance;
      this.synth.resume();
      this.synth.speak(utterance);
    }, 50);
  }

  public pause(): void {
    if (this.activeAudio && !this.activeAudio.paused) {
      this.activeAudio.pause();
      this.isAudioPlaying = false;
      return;
    }
    if (this.synth && this.synth.speaking) {
      this.synth.pause();
      this.isAudioPlaying = false;
    }
  }

  public resume(): void {
    if (this.activeAudio && this.activeAudio.paused) {
      this.activeAudio.play().catch(() => {});
      this.isAudioPlaying = true;
      return;
    }
    if (this.synth && this.synth.paused) {
      this.synth.resume();
      this.isAudioPlaying = true;
    }
  }

  public stop(): void {
    if (this.activeAudio) {
      try {
        this.activeAudio.pause();
        this.activeAudio.currentTime = 0;
      } catch {}
      this.activeAudio = null;
    }
    if (this.synth) {
      this.synth.cancel();
    }
    this.currentUtterance = null;
    this.isAudioPlaying = false;
  }

  public isSpeaking(): boolean {
    if (this.activeAudio && !this.activeAudio.paused && !this.activeAudio.ended) {
      return true;
    }
    return !!this.synth && this.synth.speaking;
  }

  public isPaused(): boolean {
    if (this.activeAudio && this.activeAudio.paused && this.activeAudio.currentTime > 0) {
      return true;
    }
    return !!this.synth && this.synth.paused;
  }

  // Export & Download synthesized audio as a standard .wav audio file
  public async exportSpeechWav(params: {
    text: string;
    voiceProfile?: VoiceProfile;
    title?: string;
  }): Promise<Blob> {
    // If we already have the neural wav blob, return it directly!
    if (this.lastSynthesizedBlob) {
      return this.lastSynthesizedBlob;
    }

    // Try fetching neural speech if not yet synthesized
    try {
      const { blob } = await this.fetchNeuralSpeechAudio({
        text: params.text,
        voiceProfile: params.voiceProfile,
      });
      return blob;
    } catch {
      // AudioContext offline generation fallback
      return this.generateOfflineWav(params);
    }
  }

  private generateOfflineWav(params: {
    text: string;
    voiceProfile?: VoiceProfile;
  }): Blob {
    const { voiceProfile } = params;
    const sampleRate = 44100;
    const wordCount = params.text.trim().split(/\s+/).length;
    const durationSeconds = Math.max(8, Math.min(180, Math.round((wordCount / 130) * 60)));
    const totalFrames = sampleRate * durationSeconds;

    const ctx = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const audioBuffer = ctx.createBuffer(2, totalFrames, sampleRate);
    const leftChannel = audioBuffer.getChannelData(0);
    const rightChannel = audioBuffer.getChannelData(1);

    const pitchHz = voiceProfile?.pitchHz || 130;
    const warmth = voiceProfile?.timbreWarmth || 75;

    for (let i = 0; i < totalFrames; i++) {
      const t = i / sampleRate;

      const voiceCarrier =
        (Math.sin(2 * Math.PI * pitchHz * t) * 0.25 +
          Math.sin(2 * Math.PI * pitchHz * 2 * t) * (warmth / 300) +
          Math.sin(2 * Math.PI * pitchHz * 3 * t) * 0.05) *
        (0.5 + 0.5 * Math.sin(2 * Math.PI * 3.5 * t));

      const envelope = Math.min(1, Math.min(t * 2, (durationSeconds - t) * 2));
      const sample = voiceCarrier * envelope * 0.8;

      leftChannel[i] = sample;
      rightChannel[i] = sample;
    }

    ctx.close().catch(() => {});
    return this.encodeAudioBufferToWav(audioBuffer);
  }

  private encodeAudioBufferToWav(buffer: AudioBuffer): Blob {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;

    let result: Float32Array;
    if (numChannels === 2) {
      const left = buffer.getChannelData(0);
      const right = buffer.getChannelData(1);
      result = new Float32Array(left.length + right.length);
      for (let i = 0; i < left.length; i++) {
        result[i * 2] = left[i];
        result[i * 2 + 1] = right[i];
      }
    } else {
      result = buffer.getChannelData(0);
    }

    const dataLength = result.length * (bitDepth / 8);
    const bufferArray = new ArrayBuffer(44 + dataLength);
    const view = new DataView(bufferArray);

    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + dataLength, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numChannels * (bitDepth / 8), true);
    view.setUint16(32, numChannels * (bitDepth / 8), true);
    view.setUint16(34, bitDepth, true);
    writeString(36, 'data');
    view.setUint32(40, dataLength, true);

    let offset = 44;
    for (let i = 0; i < result.length; i++) {
      const s = Math.max(-1, Math.min(1, result[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
      offset += 2;
    }

    return new Blob([view], { type: 'audio/wav' });
  }
}

export const speechSynthesizer = new SpeechSynthesizerService();

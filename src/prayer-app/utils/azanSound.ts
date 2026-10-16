// Web Audio API synthesizer for Azan call preview
class AzanAudio {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  public playTakbeer() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      // Melodic Adhan Takbeer tonal notes: G3, C4, D4, Eb4, D4, C4
      const notes = [
        { freq: 196.0, duration: 0.6 }, // Al-
        { freq: 261.63, duration: 0.8 }, // laa-
        { freq: 293.66, duration: 0.7 }, // hu
        { freq: 311.13, duration: 1.1 }, // Ak-
        { freq: 261.63, duration: 1.4 }, // bar
      ];

      let currentTime = this.ctx.currentTime + 0.05;

      notes.forEach((note) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(note.freq, currentTime);

        gain.gain.setValueAtTime(0.001, currentTime);
        gain.gain.linearRampToValueAtTime(0.2, currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, currentTime + note.duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(currentTime);
        osc.stop(currentTime + note.duration + 0.05);

        currentTime += note.duration * 0.9;
      });
    } catch {
      // Audio not permitted
    }
  }
}

export const azanAudio = new AzanAudio();

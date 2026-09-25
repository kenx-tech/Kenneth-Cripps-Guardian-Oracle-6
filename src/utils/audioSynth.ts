// Web Audio API Sacred Frequency Synthesizer for The Guardian Oracle

class SacredSoundEngine {
  private ctx: AudioContext | null = null;
  private droneGain: GainNode | null = null;
  private osc1: OscillatorNode | null = null;
  private osc2: OscillatorNode | null = null;
  private isDroneActive: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playGnosticChime(freq: number = 432) {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Subtle frequency bend for esoteric warmth
      osc.frequency.exponentialRampToValueAtTime(freq * 1.005, this.ctx.currentTime + 1.2);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 2.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 2.6);
    } catch (e) {
      console.warn("Audio chime error", e);
    }
  }

  public toggleSacredDrone(): boolean {
    try {
      this.initCtx();
      if (!this.ctx) return false;

      if (this.isDroneActive) {
        this.stopDrone();
        return false;
      } else {
        this.startDrone();
        return true;
      }
    } catch (e) {
      console.warn("Drone error", e);
      return false;
    }
  }

  private startDrone() {
    if (!this.ctx) return;

    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.droneGain.gain.linearRampToValueAtTime(0.04, this.ctx.currentTime + 2);

    // Fundamental 108Hz (Solfeggio harmonic)
    this.osc1 = this.ctx.createOscillator();
    this.osc1.type = 'triangle';
    this.osc1.frequency.setValueAtTime(108, this.ctx.currentTime);

    // 432Hz Solfeggio upper harmonic
    this.osc2 = this.ctx.createOscillator();
    this.osc2.type = 'sine';
    this.osc2.frequency.setValueAtTime(432, this.ctx.currentTime);

    this.osc1.connect(this.droneGain);
    this.osc2.connect(this.droneGain);
    this.droneGain.connect(this.ctx.destination);

    this.osc1.start();
    this.osc2.start();
    this.isDroneActive = true;
  }

  private stopDrone() {
    if (!this.ctx || !this.droneGain) return;
    this.droneGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 1.5);
    setTimeout(() => {
      try {
        this.osc1?.stop();
        this.osc2?.stop();
        this.osc1?.disconnect();
        this.osc2?.disconnect();
        this.droneGain?.disconnect();
      } catch (e) {}
      this.isDroneActive = false;
    }, 1600);
  }

  private solfeggioOsc: OscillatorNode | null = null;
  private solfeggioSubOsc: OscillatorNode | null = null;
  private solfeggioGain: GainNode | null = null;
  private currentSolfeggioFreq: number = 528;
  private isSolfeggioPlaying: boolean = false;

  public startSolfeggioTone(freq: number = 528) {
    try {
      this.initCtx();
      if (!this.ctx) return;

      if (this.isSolfeggioPlaying) {
        this.setSolfeggioFrequency(freq);
        return;
      }

      this.currentSolfeggioFreq = freq;
      this.solfeggioGain = this.ctx.createGain();
      this.solfeggioGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.solfeggioGain.gain.linearRampToValueAtTime(0.06, this.ctx.currentTime + 1.5);

      // Primary Solfeggio Pure Sine Wave
      this.solfeggioOsc = this.ctx.createOscillator();
      this.solfeggioOsc.type = 'sine';
      this.solfeggioOsc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Warm Sub-octave (Fundamental) Harmonic
      this.solfeggioSubOsc = this.ctx.createOscillator();
      this.solfeggioSubOsc.type = 'triangle';
      this.solfeggioSubOsc.frequency.setValueAtTime(freq / 2, this.ctx.currentTime);

      this.solfeggioOsc.connect(this.solfeggioGain);
      this.solfeggioSubOsc.connect(this.solfeggioGain);
      this.solfeggioGain.connect(this.ctx.destination);

      this.solfeggioOsc.start();
      this.solfeggioSubOsc.start();
      this.isSolfeggioPlaying = true;
    } catch (e) {
      console.warn("Solfeggio tone start error", e);
    }
  }

  public setSolfeggioFrequency(freq: number) {
    this.currentSolfeggioFreq = freq;
    if (this.ctx && this.solfeggioOsc && this.solfeggioSubOsc && this.isSolfeggioPlaying) {
      this.solfeggioOsc.frequency.exponentialRampToValueAtTime(freq, this.ctx.currentTime + 0.8);
      this.solfeggioSubOsc.frequency.exponentialRampToValueAtTime(freq / 2, this.ctx.currentTime + 0.8);
    } else {
      this.startSolfeggioTone(freq);
    }
  }

  public stopSolfeggioTone() {
    if (!this.ctx || !this.solfeggioGain || !this.isSolfeggioPlaying) return;
    this.solfeggioGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 1.0);
    setTimeout(() => {
      try {
        this.solfeggioOsc?.stop();
        this.solfeggioSubOsc?.stop();
        this.solfeggioOsc?.disconnect();
        this.solfeggioSubOsc?.disconnect();
        this.solfeggioGain?.disconnect();
      } catch (e) {}
      this.isSolfeggioPlaying = false;
      this.solfeggioOsc = null;
      this.solfeggioSubOsc = null;
      this.solfeggioGain = null;
    }, 1100);
  }

  public getIsSolfeggioPlaying(): boolean {
    return this.isSolfeggioPlaying;
  }

  public getIsDroneActive(): boolean {
    return this.isDroneActive;
  }
}

export const sacredSound = new SacredSoundEngine();

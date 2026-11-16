/**
 * Realistic Web Audio API Sound Synthesizer for Mechanical Keyboard Switches
 * No external media files needed - works instantly and offline with zero latency.
 */

import { SoundProfile } from '../types/keyboard';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private volume: number = 0.75;
  private currentProfile: SoundProfile = 'red';

  public initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public unlockAudio() {
    this.initContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setProfile(profile: SoundProfile) {
    this.currentProfile = profile;
  }

  public getProfile(): SoundProfile {
    return this.currentProfile;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public getVolume(): number {
    return this.volume;
  }

  // Google Pixel Fast Pair pop up connection chime
  public playPixelPairChime() {
    try {
      this.unlockAudio();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(this.volume * 0.95, now);
      masterGain.connect(this.ctx.destination);

      // Lowpass filter for warm, rounded Google acoustic signature
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(4500, now);
      filter.connect(masterGain);

      // Note 1: Warm initial bell tone (G5 - 783.99 Hz)
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(783.99, now);

      const harm1 = this.ctx.createOscillator();
      const harmGain1 = this.ctx.createGain();
      harm1.type = 'triangle';
      harm1.frequency.setValueAtTime(1567.98, now);

      gain1.gain.setValueAtTime(0, now);
      gain1.gain.linearRampToValueAtTime(0.75, now + 0.012);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      harmGain1.gain.setValueAtTime(0, now);
      harmGain1.gain.linearRampToValueAtTime(0.2, now + 0.012);
      harmGain1.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc1.connect(gain1);
      harm1.connect(harmGain1);
      gain1.connect(filter);
      harmGain1.connect(filter);

      osc1.start(now);
      harm1.start(now);
      osc1.stop(now + 0.25);
      harm1.stop(now + 0.25);

      // Note 2: Higher ascending resolving pure chime (+80ms, C6 - 1046.5 Hz)
      const t2 = now + 0.08;
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1046.5, t2);

      const harm2 = this.ctx.createOscillator();
      const harmGain2 = this.ctx.createGain();
      harm2.type = 'triangle';
      harm2.frequency.setValueAtTime(2093, t2);

      gain2.gain.setValueAtTime(0, t2);
      gain2.gain.linearRampToValueAtTime(0.9, t2 + 0.012);
      gain2.gain.exponentialRampToValueAtTime(0.0001, t2 + 0.65);

      harmGain2.gain.setValueAtTime(0, t2);
      harmGain2.gain.linearRampToValueAtTime(0.22, t2 + 0.012);
      harmGain2.gain.exponentialRampToValueAtTime(0.0001, t2 + 0.4);

      osc2.connect(gain2);
      harm2.connect(harmGain2);
      gain2.connect(filter);
      harmGain2.connect(filter);

      osc2.start(t2);
      harm2.start(t2);
      osc2.stop(t2 + 0.7);
      harm2.stop(t2 + 0.7);
    } catch {
      // AudioContext might be blocked until user gesture, handle gracefully
    }
  }

  // Soft Google descending error chime when non-Pixel device attempts pairing
  public playPixelErrorChime() {
    try {
      this.unlockAudio();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(this.volume * 0.7, now);
      masterGain.connect(this.ctx.destination);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3200, now);
      filter.connect(masterGain);

      // Note 1: Soft upper tone (E5 - 659.25 Hz)
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, now);
      gain1.gain.setValueAtTime(0, now);
      gain1.gain.linearRampToValueAtTime(0.6, now + 0.012);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      osc1.connect(gain1);
      gain1.connect(filter);
      osc1.start(now);
      osc1.stop(now + 0.18);

      // Note 2: Lower resolving tone (+110ms, Bb4 - 466.16 Hz)
      const t2 = now + 0.11;
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(466.16, t2);
      gain2.gain.setValueAtTime(0, t2);
      gain2.gain.linearRampToValueAtTime(0.7, t2 + 0.012);
      gain2.gain.exponentialRampToValueAtTime(0.0001, t2 + 0.35);
      osc2.connect(gain2);
      gain2.connect(filter);
      osc2.start(t2);
      osc2.stop(t2 + 0.38);
    } catch {
      // Ignore autoplay blocks
    }
  }

  // Dedicated Deep Thocky Mechanical Switch sound
  public playThock(isLargeKey: boolean = false) {
    try {
      this.unlockAudio();
      if (!this.ctx) return;
      this.playLinearRed(isLargeKey);
    } catch {
      // AudioContext might be blocked until user gesture, handle silently
    }
  }

  // Authentic Sanwa / Seimitsu Arcade Pushbutton Microswitch Click + Body Thud
  public playArcadeClick() {
    try {
      this.unlockAudio();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(this.volume * 0.9, now);
      masterGain.connect(this.ctx.destination);

      // 1. Crisp microswitch leaf snap transient
      const click = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();
      click.type = 'triangle';
      click.frequency.setValueAtTime(2800, now);
      click.frequency.exponentialRampToValueAtTime(750, now + 0.012);
      clickGain.gain.setValueAtTime(0.75, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.016);
      click.connect(clickGain);
      clickGain.connect(masterGain);
      click.start(now);
      click.stop(now + 0.02);

      // 2. Solid plastic bottom-out body thud
      const thud = this.ctx.createOscillator();
      const thudGain = this.ctx.createGain();
      thud.type = 'sine';
      thud.frequency.setValueAtTime(175, now + 0.002);
      thud.frequency.exponentialRampToValueAtTime(42, now + 0.045);
      thudGain.gain.setValueAtTime(0.9, now + 0.002);
      thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      thud.connect(thudGain);
      thudGain.connect(masterGain);
      thud.start(now + 0.002);
      thud.stop(now + 0.055);
    } catch {
      // AudioContext might be blocked until user gesture, handle silently
    }
  }

  public playKeySound(keyCode?: string) {
    if (this.currentProfile === 'off') return;

    try {
      this.unlockAudio();
      if (!this.ctx) return;

      const isSpace = keyCode === 'Space';
      const isEnter = keyCode === 'Enter';

      switch (this.currentProfile) {
        case 'blue':
          this.playClickyBlue(isSpace || isEnter);
          break;
        case 'red':
          this.playLinearRed(isSpace || isEnter);
          break;
        case 'typewriter':
          this.playTypewriter(isEnter);
          break;
        case 'bubble':
          this.playBubble(isSpace);
          break;
        default:
          this.playLinearRed(isSpace || isEnter);
          break;
      }
    } catch {
      // AudioContext might be blocked until user gesture, handle silently
    }
  }

  // Clicky Blue Switch: Crisp snap + low bottom out resonance
  private playClickyBlue(isLargeKey: boolean) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.7, now);
    masterGain.connect(this.ctx.destination);

    // 1. High crisp click transient (leaf snapping)
    const clickOsc = this.ctx.createOscillator();
    const clickGain = this.ctx.createGain();
    clickOsc.type = 'triangle';
    clickOsc.frequency.setValueAtTime(isLargeKey ? 1400 : 2200, now);
    clickOsc.frequency.exponentialRampToValueAtTime(600, now + 0.015);

    clickGain.gain.setValueAtTime(1, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.018);

    clickOsc.connect(clickGain);
    clickGain.connect(masterGain);
    clickOsc.start(now);
    clickOsc.stop(now + 0.02);

    // 2. Plastic bottom-out clack
    const thudOsc = this.ctx.createOscillator();
    const thudGain = this.ctx.createGain();
    thudOsc.type = 'sine';
    thudOsc.frequency.setValueAtTime(isLargeKey ? 130 : 210, now + 0.005);
    thudOsc.frequency.exponentialRampToValueAtTime(50, now + 0.05);

    thudGain.gain.setValueAtTime(0, now);
    thudGain.gain.setValueAtTime(0.7, now + 0.005);
    thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    thudOsc.connect(thudGain);
    thudGain.connect(masterGain);
    thudOsc.start(now + 0.005);
    thudOsc.stop(now + 0.065);
  }

  // Linear Red / Lubed Mechanical Switch: Authentic Deep Thocky sound
  private playLinearRed(isLargeKey: boolean) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.85, now);
    masterGain.connect(this.ctx.destination);

    // 1. Soft acoustic transient (keycap stem contacting switch housing)
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.025);
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(isLargeKey ? 320 : 480, now);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.7, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(masterGain);
    noise.start(now);

    // 2. Deep body thock (sub-resonance from mechanical keyboard chassis)
    const bodyOsc = this.ctx.createOscillator();
    const bodyGain = this.ctx.createGain();
    bodyOsc.type = 'sine';
    bodyOsc.frequency.setValueAtTime(isLargeKey ? 95 : 145, now);
    bodyOsc.frequency.exponentialRampToValueAtTime(38, now + 0.06);

    bodyGain.gain.setValueAtTime(0.9, now);
    bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);

    bodyOsc.connect(bodyGain);
    bodyGain.connect(masterGain);
    bodyOsc.start(now);
    bodyOsc.stop(now + 0.07);

    // 3. Subtle hollow cavity resonance
    const cavityOsc = this.ctx.createOscillator();
    const cavityGain = this.ctx.createGain();
    cavityOsc.type = 'triangle';
    cavityOsc.frequency.setValueAtTime(isLargeKey ? 180 : 260, now + 0.002);
    cavityOsc.frequency.exponentialRampToValueAtTime(80, now + 0.04);

    cavityGain.gain.setValueAtTime(0.35, now + 0.002);
    cavityGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    cavityOsc.connect(cavityGain);
    cavityGain.connect(masterGain);
    cavityOsc.start(now + 0.002);
    cavityOsc.stop(now + 0.045);
  }

  // Typewriter: Heavy mechanical strike, metal click, plus bell on Enter
  private playTypewriter(isEnter: boolean) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.75, now);
    masterGain.connect(this.ctx.destination);

    const strike = this.ctx.createOscillator();
    const strikeGain = this.ctx.createGain();
    strike.type = 'sawtooth';
    strike.frequency.setValueAtTime(800, now);
    strike.frequency.exponentialRampToValueAtTime(200, now + 0.03);

    strikeGain.gain.setValueAtTime(0.6, now);
    strikeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    strike.connect(strikeGain);
    strikeGain.connect(masterGain);
    strike.start(now);
    strike.stop(now + 0.045);

    if (isEnter) {
      const bell = this.ctx.createOscillator();
      const bellGain = this.ctx.createGain();
      bell.type = 'sine';
      bell.frequency.setValueAtTime(2093, now + 0.03);

      bellGain.gain.setValueAtTime(0, now + 0.03);
      bellGain.gain.setValueAtTime(0.4, now + 0.04);
      bellGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

      bell.connect(bellGain);
      bellGain.connect(masterGain);
      bell.start(now + 0.03);
      bell.stop(now + 0.65);
    }
  }

  // Bubble / Soft Membrane: Playful popping tone
  private playBubble(isSpace: boolean) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.7, now);
    masterGain.connect(this.ctx.destination);

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    const startFreq = isSpace ? 320 : 440 + Math.random() * 80;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(isSpace ? 110 : 180, now + 0.05);

    gain.gain.setValueAtTime(0.8, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(now);
    osc.stop(now + 0.055);
  }
}

export const soundEngine = new SoundEngine();

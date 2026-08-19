// Audio and Haptic Feedback Engine for FitHub
// Uses Web Audio API (zero external asset requests, works 100% offline)

let audioCtx = null;

function getAudioContext() {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Triggers device haptic vibration if supported
 * @param {number|number[]} pattern - Vibration duration in ms or pattern array
 */
export function triggerHaptic(pattern = [50]) {
  try {
    if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(pattern);
    }
  } catch (err) {
    // Ignore unsupported devices / environments
  }
}

/**
 * Plays a single synthesized tone with smooth gain attack and decay
 */
export function playTone(frequency = 440, duration = 0.15, type = "sine", volume = 0.15) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (err) {
    // Fail silently if audio blocked by autoplay policy
  }
}

/**
 * Plays a subtle, tactile click/pop when a set is completed
 */
export function playSetCompleteSound() {
  triggerHaptic([40]);
  playTone(880, 0.08, "sine", 0.12);
}

/**
 * Plays a 2-tone melodic chime when a rest interval completes
 */
export function playRestCompleteSound() {
  triggerHaptic([120, 60, 120]);
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Tone 1: D5 (587 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.frequency.setValueAtTime(587.33, now);
    gain1.gain.setValueAtTime(0.001, now);
    gain1.gain.linearRampToValueAtTime(0.2, now + 0.03);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.25);

    // Tone 2: A5 (880 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.frequency.setValueAtTime(880, now + 0.2);
    gain2.gain.setValueAtTime(0.001, now + 0.2);
    gain2.gain.linearRampToValueAtTime(0.25, now + 0.23);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.2);
    osc2.stop(now + 0.6);
  } catch (err) {
    // Ignore audio errors
  }
}

/**
 * Plays an upbeat 3-tone victory fanfare upon workout completion
 */
export function playWorkoutCompleteSound() {
  triggerHaptic([100, 50, 100, 50, 200]);
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [
      { freq: 523.25, time: 0, dur: 0.18 },   // C5
      { freq: 659.25, time: 0.16, dur: 0.18 }, // E5
      { freq: 783.99, time: 0.32, dur: 0.4 },  // G5
      { freq: 1046.5, time: 0.52, dur: 0.6 },  // C6
    ];

    notes.forEach(({ freq, time, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now + time);
      gain.gain.setValueAtTime(0.001, now + time);
      gain.gain.linearRampToValueAtTime(0.22, now + time + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + time + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + time);
      osc.stop(now + time + dur);
    });
  } catch (err) {
    // Ignore
  }
}

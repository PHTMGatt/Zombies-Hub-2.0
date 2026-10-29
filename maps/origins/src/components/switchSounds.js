// Tiny synthesized effects for the practice dials (no audio files): a short electric zap per turn
// and a two-tone chime when a switch lands on its final position. Only ever started by a click.
let context = null;

const audio = () => {
  if (typeof window === 'undefined') return null;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;
  context ??= new AudioContext();
  if (context.state === 'suspended') context.resume();
  return context;
};

const tone = (ctx, { type, from, to, start, length, peak }) => {
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(from, start);
  if (to) oscillator.frequency.exponentialRampToValueAtTime(to, start + length);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(peak, start + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + length);
  oscillator.connect(gain).connect(ctx.destination);
  oscillator.start(start);
  oscillator.stop(start + length + 0.02);
};

export function playTurn() {
  const ctx = audio();
  if (!ctx) return;
  const now = ctx.currentTime;
  tone(ctx, { type: 'sawtooth', from: 1400, to: 160, start: now, length: 0.12, peak: 0.07 });
  tone(ctx, { type: 'square', from: 90, to: 60, start: now, length: 0.06, peak: 0.05 });
}

export function playSet() {
  const ctx = audio();
  if (!ctx) return;
  const now = ctx.currentTime;
  tone(ctx, { type: 'sine', from: 660, start: now + 0.05, length: 0.22, peak: 0.08 });
  tone(ctx, { type: 'sine', from: 990, start: now + 0.14, length: 0.3, peak: 0.07 });
}

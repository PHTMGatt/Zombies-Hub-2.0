/*
 * An original "achievement unlocked" chime, synthesized with Web Audio (no audio files, nothing
 * borrowed): a soft low thump, then a quick rising major third that rings out with a light shimmer.
 * About 0.9 s, peak gain 0.16. It only ever plays right after a player's own tap (the unlock happens on
 * "Mark step done"), which browsers accept as a user gesture; any failure is silent.
 */
let context = null;

const audioContext = () => {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!context) context = new AudioContextClass();
  return context;
};

const tone = (ctx, { type, frequency, start, duration, peak, out }) => {
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(peak, start + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain).connect(out);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.05);
};

export async function playChime() {
  try {
    const ctx = audioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') await ctx.resume();
    const now = ctx.currentTime + 0.02;
    const master = ctx.createGain();
    master.gain.value = 0.9;
    master.connect(ctx.destination);

    // Low "pop" so it lands even on phone speakers.
    const thump = ctx.createOscillator();
    const thumpGain = ctx.createGain();
    thump.type = 'sine';
    thump.frequency.setValueAtTime(180, now);
    thump.frequency.exponentialRampToValueAtTime(70, now + 0.12);
    thumpGain.gain.setValueAtTime(0.16, now);
    thumpGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
    thump.connect(thumpGain).connect(master);
    thump.start(now);
    thump.stop(now + 0.2);

    // Rising third: G5 then B5, each with a quiet octave for sparkle.
    tone(ctx, { type: 'triangle', frequency: 783.99, start: now + 0.05, duration: 0.32, peak: 0.12, out: master });
    tone(ctx, { type: 'sine', frequency: 1567.98, start: now + 0.05, duration: 0.22, peak: 0.03, out: master });
    tone(ctx, { type: 'triangle', frequency: 987.77, start: now + 0.16, duration: 0.75, peak: 0.14, out: master });
    tone(ctx, { type: 'sine', frequency: 1975.53, start: now + 0.16, duration: 0.5, peak: 0.035, out: master });
    // Shimmer tail.
    tone(ctx, { type: 'sine', frequency: 2959.96, start: now + 0.24, duration: 0.45, peak: 0.015, out: master });
  } catch {
    // No audio available: the toast still shows.
  }
}

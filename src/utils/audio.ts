/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const playHospitalNurseCallChime = () => {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const playTone = (freq: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      // Bell chime envelope
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.35, startTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    // Standard 2-tone hospital chime
    playTone(987.77, now, 0.45);        // B5
    playTone(659.25, now + 0.2, 0.7);    // E5

    playTone(987.77, now + 0.75, 0.45);  // B5
    playTone(659.25, now + 0.95, 0.85);  // E5
  } catch (err) {
    console.warn('Web Audio chime playback error:', err);
  }
};

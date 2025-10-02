// Simple sound effects using Web Audio API

type SoundType = 'point' | 'achievement' | 'error';

const audioContext = typeof window !== 'undefined' ? new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)() : null;

function beep(frequency: number, duration: number, volume: number = 0.3) {
  if (!audioContext) return;

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = frequency;
  oscillator.type = 'sine';

  gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
}

export function playSound(soundType: SoundType) {
  try {
    switch (soundType) {
      case 'point':
        // Happy chirp sound for points
        beep(523.25, 0.1); // C5
        setTimeout(() => beep(659.25, 0.1), 100); // E5
        setTimeout(() => beep(783.99, 0.15), 200); // G5
        break;

      case 'achievement':
        // Victory fanfare for achievements
        beep(523.25, 0.1); // C5
        setTimeout(() => beep(659.25, 0.1), 100); // E5
        setTimeout(() => beep(783.99, 0.1), 200); // G5
        setTimeout(() => beep(1046.50, 0.3), 300); // C6
        break;

      case 'error':
        // Low buzzer for errors
        beep(200, 0.2, 0.2);
        setTimeout(() => beep(150, 0.3, 0.2), 200);
        break;

      default:
        break;
    }
  } catch (error) {
    // Silently fail if audio context is not available
    console.log('Audio playback failed:', error);
  }
}

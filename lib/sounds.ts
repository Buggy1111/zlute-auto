// Enhanced sound effects using Web Audio API with reverb and filters

type SoundType = 'point' | 'achievement' | 'error';

const audioContext = typeof window !== 'undefined' ? new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)() : null;

// Create a reverb effect
let reverbNode: ConvolverNode | null = null;
if (audioContext) {
  reverbNode = audioContext.createConvolver();
  // Simple impulse response for reverb
  const sampleRate = audioContext.sampleRate;
  const length = sampleRate * 0.5; // 0.5 second reverb
  const impulse = audioContext.createBuffer(2, length, sampleRate);
  const impulseL = impulse.getChannelData(0);
  const impulseR = impulse.getChannelData(1);

  for (let i = 0; i < length; i++) {
    impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
    impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
  }
  reverbNode.buffer = impulse;
}

function beep(frequency: number, duration: number, volume: number = 0.3, type: OscillatorType = 'sine', useReverb: boolean = false) {
  if (!audioContext) return;

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();

  // Configure filter for warmer sound
  filter.type = 'lowpass';
  filter.frequency.value = frequency * 2;
  filter.Q.value = 1;

  oscillator.connect(filter);
  filter.connect(gainNode);

  if (useReverb && reverbNode) {
    const dry = audioContext.createGain();
    const wet = audioContext.createGain();
    dry.gain.value = 0.7;
    wet.gain.value = 0.3;

    gainNode.connect(dry);
    gainNode.connect(wet);
    wet.connect(reverbNode);
    dry.connect(audioContext.destination);
    reverbNode.connect(audioContext.destination);
  } else {
    gainNode.connect(audioContext.destination);
  }

  oscillator.frequency.value = frequency;
  oscillator.type = type;

  gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
}

export function playSound(soundType: SoundType) {
  try {
    switch (soundType) {
      case 'point':
        // Premium chirp sound for points with reverb
        beep(523.25, 0.12, 0.25, 'sine', true); // C5
        setTimeout(() => beep(659.25, 0.12, 0.28, 'sine', true), 80); // E5
        setTimeout(() => beep(783.99, 0.18, 0.32, 'sine', true), 160); // G5
        break;

      case 'achievement':
        // Rich victory fanfare with reverb and harmonics
        beep(523.25, 0.12, 0.25, 'triangle', true); // C5
        setTimeout(() => beep(659.25, 0.12, 0.28, 'triangle', true), 100); // E5
        setTimeout(() => beep(783.99, 0.12, 0.30, 'triangle', true), 200); // G5
        setTimeout(() => beep(1046.50, 0.35, 0.35, 'triangle', true), 300); // C6
        setTimeout(() => beep(1318.51, 0.15, 0.20, 'sine', true), 450); // E6 sparkle
        break;

      case 'error':
        // Subtle error buzz with dampened reverb
        beep(200, 0.15, 0.18, 'square', false);
        setTimeout(() => beep(150, 0.25, 0.15, 'square', false), 150);
        break;

      default:
        break;
    }
  } catch {
    // Silently fail if audio context is not available
  }
}

export type SoundType =
  | "ui-click"
  | "correct"
  | "wrong"
  | "timeout"
  | "enemy-hit"
  | "shield"
  | "defeated"
  | "victory"
  | "shop-buy"
  | "shop-error"
  | "reroll"
  | "event"
  | "mastery-up";

type AudioSettings = {
  enabled: boolean;
};

type ToneStep = {
  frequency: number;
  duration: number;
  type?: OscillatorType;
  volume?: number;
};

const audioSettingsKey = "wordquest_audio_settings";
const defaultAudioSettings: AudioSettings = { enabled: false };
const masterVolume = 0.045;

let audioContext: AudioContext | null = null;

type BrowserWindowWithAudio = Window & {
  webkitAudioContext?: typeof AudioContext;
};

const soundPatterns: Record<SoundType, ToneStep[]> = {
  "ui-click": [{ frequency: 520, duration: 0.055, type: "triangle", volume: 0.45 }],
  correct: [
    { frequency: 540, duration: 0.08, type: "sine", volume: 0.55 },
    { frequency: 720, duration: 0.1, type: "sine", volume: 0.5 },
  ],
  wrong: [{ frequency: 180, duration: 0.15, type: "sawtooth", volume: 0.35 }],
  timeout: [
    { frequency: 330, duration: 0.08, type: "square", volume: 0.32 },
    { frequency: 220, duration: 0.12, type: "square", volume: 0.25 },
  ],
  "enemy-hit": [{ frequency: 120, duration: 0.11, type: "triangle", volume: 0.55 }],
  shield: [
    { frequency: 620, duration: 0.07, type: "triangle", volume: 0.42 },
    { frequency: 820, duration: 0.09, type: "sine", volume: 0.32 },
  ],
  defeated: [
    { frequency: 220, duration: 0.12, type: "triangle", volume: 0.38 },
    { frequency: 140, duration: 0.18, type: "triangle", volume: 0.34 },
  ],
  victory: [
    { frequency: 520, duration: 0.1, type: "sine", volume: 0.52 },
    { frequency: 660, duration: 0.1, type: "sine", volume: 0.5 },
    { frequency: 880, duration: 0.18, type: "triangle", volume: 0.42 },
  ],
  "shop-buy": [
    { frequency: 880, duration: 0.06, type: "triangle", volume: 0.45 },
    { frequency: 1180, duration: 0.08, type: "sine", volume: 0.35 },
  ],
  "shop-error": [{ frequency: 150, duration: 0.16, type: "square", volume: 0.25 }],
  reroll: [
    { frequency: 360, duration: 0.05, type: "triangle", volume: 0.32 },
    { frequency: 500, duration: 0.05, type: "triangle", volume: 0.32 },
    { frequency: 640, duration: 0.08, type: "triangle", volume: 0.28 },
  ],
  event: [
    { frequency: 440, duration: 0.09, type: "sine", volume: 0.35 },
    { frequency: 600, duration: 0.12, type: "triangle", volume: 0.28 },
  ],
  "mastery-up": [
    { frequency: 760, duration: 0.08, type: "sine", volume: 0.38 },
    { frequency: 980, duration: 0.13, type: "sine", volume: 0.34 },
  ],
};

function getStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function getAudioContext() {
  if (typeof window === "undefined") {
    return null;
  }

  if (audioContext) {
    return audioContext;
  }

  const browserWindow = window as BrowserWindowWithAudio;
  const AudioContextConstructor =
    (typeof AudioContext === "undefined" ? undefined : AudioContext) ??
    browserWindow.webkitAudioContext;

  if (!AudioContextConstructor) {
    return null;
  }

  try {
    audioContext = new AudioContextConstructor();
    return audioContext;
  } catch {
    return null;
  }
}

export function getAudioSettings(): AudioSettings {
  const storage = getStorage();

  if (!storage) {
    return defaultAudioSettings;
  }

  try {
    const savedValue = storage.getItem(audioSettingsKey);

    if (!savedValue) {
      return defaultAudioSettings;
    }

    const parsedValue = JSON.parse(savedValue) as Partial<AudioSettings>;

    return { enabled: parsedValue.enabled === true };
  } catch {
    return defaultAudioSettings;
  }
}

export function saveAudioSettings(settings: AudioSettings) {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  try {
    storage.setItem(audioSettingsKey, JSON.stringify(settings));
  } catch {
    // Audio preferences are optional; ignore storage failures.
  }
}

export function isSoundEnabled() {
  return getAudioSettings().enabled;
}

export function setSoundEnabled(enabled: boolean) {
  saveAudioSettings({ enabled });

  if (!enabled) {
    return;
  }

  const context = getAudioContext();

  if (context?.state === "suspended") {
    void context.resume().catch(() => undefined);
  }
}

export function playSound(soundType: SoundType) {
  if (!isSoundEnabled()) {
    return;
  }

  try {
    const context = getAudioContext();

    if (!context) {
      return;
    }

    const playPattern = () => {
      const pattern = soundPatterns[soundType];
      let startTime = context.currentTime;

      pattern.forEach((step) => {
        playTone(context, step, startTime);
        startTime += step.duration + 0.015;
      });
    };

    if (context.state === "suspended") {
      void context
        .resume()
        .then(playPattern)
        .catch(() => undefined);
      return;
    }

    playPattern();
  } catch {
    // Sound is an enhancement only; never let audio errors affect the game.
  }
}

function playTone(context: AudioContext, step: ToneStep, startTime: number) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const endTime = startTime + step.duration;
  const peakVolume = masterVolume * (step.volume ?? 1);

  oscillator.type = step.type ?? "sine";
  oscillator.frequency.setValueAtTime(step.frequency, startTime);

  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(peakVolume, startTime + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, endTime);

  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(startTime);
  oscillator.stop(endTime + 0.02);
}

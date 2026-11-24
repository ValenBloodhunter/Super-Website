export const TOTAL_FRAMES = 79;
export const LAST_FRAME_INDEX = TOTAL_FRAMES - 1;

export interface CameraKeyframe {
  progress: number;
  frame: number;
  zoom: number;
  /** Source focal point in normalized [0..1] frame coordinates */
  anchorX: number;
  anchorY: number;
  /** Target screen focal point in normalized [0..1] viewport coordinates */
  targetX: number;
  targetY: number;
  warmth: number;
}

export interface CameraPose {
  frameFloat: number;
  zoom: number;
  anchorX: number;
  anchorY: number;
  targetX: number;
  targetY: number;
  warmth: number;
}

/**
 * Keyframes synchronized directly to measured frame events in wan22_output_2K_upscaled.mp4:
 * - F00..F15: Side profile, eyes closed
 * - F16..F38: Shoulder & cranium rotation toward camera
 * - F38..F49: Pre-awakening frontal stillness (visual silence)
 * - F50..F54: Golden-eye ignition (F51 spark -> F54 luminous iris)
 * - F55..F78: Intimate frontal gaze lock
 */
const DESKTOP_KEYFRAMES: CameraKeyframe[] = [
  { progress: 0.00, frame: 0,  zoom: 1.00, anchorX: 0.575, anchorY: 0.365, targetX: 0.56, targetY: 0.38, warmth: 0.0 },
  { progress: 0.20, frame: 16, zoom: 1.08, anchorX: 0.575, anchorY: 0.368, targetX: 0.60, targetY: 0.38, warmth: 0.0 },
  { progress: 0.42, frame: 38, zoom: 1.18, anchorX: 0.580, anchorY: 0.376, targetX: 0.55, targetY: 0.39, warmth: 0.0 },
  { progress: 0.50, frame: 49, zoom: 1.24, anchorX: 0.585, anchorY: 0.384, targetX: 0.56, targetY: 0.39, warmth: 0.05 },
  { progress: 0.56, frame: 55, zoom: 1.32, anchorX: 0.565, anchorY: 0.371, targetX: 0.66, targetY: 0.40, warmth: 0.85 },
  { progress: 0.65, frame: 61, zoom: 1.38, anchorX: 0.560, anchorY: 0.366, targetX: 0.65, targetY: 0.40, warmth: 1.0 },
  { progress: 0.85, frame: 71, zoom: 1.46, anchorX: 0.544, anchorY: 0.360, targetX: 0.62, targetY: 0.41, warmth: 0.9 },
  { progress: 1.00, frame: 78, zoom: 1.54, anchorX: 0.532, anchorY: 0.356, targetX: 0.59, targetY: 0.42, warmth: 1.0 },
];

function smoothstep01(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function evaluateCamera(
  rawProgress: number,
  viewportW: number,
  viewportH: number,
  reducedMotion: boolean
): CameraPose {
  const p = Math.max(0, Math.min(1, rawProgress));
  const kf = DESKTOP_KEYFRAMES;

  let i = 0;
  while (i < kf.length - 2 && p > kf[i + 1].progress) {
    i++;
  }

  const k0 = kf[i];
  const k1 = kf[i + 1];
  const span = Math.max(1e-5, k1.progress - k0.progress);
  const localT = (p - k0.progress) / span;
  const easedT = smoothstep01(localT);

  // Frame progression uses gentle blend between linear & eased so scrubbing stays deterministic
  const frameFloat = reducedMotion
    ? p * LAST_FRAME_INDEX
    : lerp(k0.frame, k1.frame, lerp(localT, easedT, 0.35));

  const anchorX = lerp(k0.anchorX, k1.anchorX, easedT);
  const anchorY = lerp(k0.anchorY, k1.anchorY, easedT);
  const warmth = lerp(k0.warmth, k1.warmth, easedT);

  if (reducedMotion) {
    const isMobile = viewportW < 768;
    return {
      frameFloat,
      zoom: isMobile ? 1.06 : 1.04,
      anchorX,
      anchorY,
      targetX: isMobile ? 0.50 : 0.56,
      targetY: isMobile ? 0.32 : 0.38,
      warmth,
    };
  }

  let zoom = lerp(k0.zoom, k1.zoom, easedT);
  let targetX = lerp(k0.targetX, k1.targetX, easedT);
  let targetY = lerp(k0.targetY, k1.targetY, easedT);

  const aspect = viewportW / Math.max(1, viewportH);

  if (viewportW < 768) {
    // Portrait mobile: keep face + orchid crown in upper 58% above lower text
    zoom = 1.0 + (zoom - 1.0) * 0.42;
    targetX = 0.50;
    targetY = lerp(0.30, 0.33, p);
  } else if (viewportW < 900) {
    zoom = 1.0 + (zoom - 1.0) * 0.55;
    targetX = lerp(0.56, 0.64, easedT);
    targetY = 0.37;
  } else if (aspect > 2.15) {
    // Ultrawide protection: restrain vertical zoom so crown & torso hardware remain framed
    const ultrawideDamp = Math.max(0.65, 2.15 / aspect);
    zoom = 1.0 + (zoom - 1.0) * ultrawideDamp;
  }

  return {
    frameFloat,
    zoom,
    anchorX,
    anchorY,
    targetX,
    targetY,
    warmth,
  };
}

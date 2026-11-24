import { LAST_FRAME_INDEX, TOTAL_FRAMES } from './cameraKeyframes';

export type FrameVariant = 'desktop' | 'mobile';

export interface FrameLoaderCallbacks {
  onPriorityProgress?: (ratio: number) => void;
  onPriorityReady?: () => void;
  onFrameDecoded?: (index: number) => void;
  onFatalFallback?: () => void;
}

const KEYFRAME_STRIDE = 4;

export class ProgressiveFrameLoader {
  private readonly variant: FrameVariant;
  private readonly frames: Array<HTMLImageElement | null> = new Array(TOTAL_FRAMES).fill(null);
  private readonly loadedFlags: boolean[] = new Array(TOTAL_FRAMES).fill(false);
  private readonly pendingQueue: number[] = [];
  private activeDownloads = 0;
  private readonly maxConcurrency: number;
  private disposed = false;
  private focusFrame = 0;
  private callbacks: FrameLoaderCallbacks;
  private priorityStarted = false;

  constructor(callbacks: FrameLoaderCallbacks) {
    this.callbacks = callbacks;
    const isNarrow = typeof window !== 'undefined' && window.innerWidth < 768;
    const saveData =
      typeof navigator !== 'undefined' &&
      'connection' in navigator &&
      Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);
    this.variant = isNarrow || saveData ? 'mobile' : 'desktop';
    this.maxConcurrency = this.variant === 'mobile' ? 3 : 5;
  }

  public getFrameUrl(index: number): string {
    const padded = String(index).padStart(3, '0');
    return `${import.meta.env.BASE_URL}frames/${this.variant}/frame_${padded}.webp`;
  }

  public getVariant(): FrameVariant {
    return this.variant;
  }

  public setFocusFrame(index: number): void {
    this.focusFrame = Math.max(0, Math.min(LAST_FRAME_INDEX, Math.round(index)));
  }

  public getFrame(index: number): HTMLImageElement | null {
    if (index < 0 || index >= TOTAL_FRAMES) return null;
    return this.loadedFlags[index] ? this.frames[index] : null;
  }

  public findNearestLoadedFrame(index: number): HTMLImageElement | null {
    const clamped = Math.max(0, Math.min(LAST_FRAME_INDEX, Math.round(index)));
    if (this.loadedFlags[clamped]) return this.frames[clamped];

    for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
      const left = clamped - offset;
      if (left >= 0 && this.loadedFlags[left]) return this.frames[left];
      const right = clamped + offset;
      if (right < TOTAL_FRAMES && this.loadedFlags[right]) return this.frames[right];
    }
    return null;
  }

  public start(): void {
    if (this.priorityStarted || this.disposed) return;
    this.priorityStarted = true;

    const priorityIndices: number[] = [];
    const secondaryIndices: number[] = [];

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      if (i === 0 || i === LAST_FRAME_INDEX || i % KEYFRAME_STRIDE === 0) {
        priorityIndices.push(i);
      } else {
        secondaryIndices.push(i);
      }
    }

    let settled = 0;
    const totalPriority = priorityIndices.length;

    const loadPriorityOne = (idx: number): Promise<void> =>
      this.decodeFrame(idx, idx === 0).then(() => {
        if (this.disposed) return;
        settled += 1;
        this.callbacks.onPriorityProgress?.(settled / totalPriority);
      });

    // Prioritize frame 0 first, then parallel keyframe decode
    loadPriorityOne(0)
      .then(() => {
        if (this.disposed) return;
        if (!this.loadedFlags[0]) {
          // Try static poster fallback
          return this.decodeUrlIntoSlot(0, `${import.meta.env.BASE_URL}frames/poster.webp`).catch(() => undefined);
        }
        return undefined;
      })
      .then(() => Promise.all(priorityIndices.slice(1).map((idx) => loadPriorityOne(idx))))
      .then(() => {
        if (this.disposed) return;
        const anyLoaded = this.loadedFlags.some(Boolean);
        if (!anyLoaded) {
          this.callbacks.onFatalFallback?.();
        }
        this.callbacks.onPriorityReady?.();
        this.pendingQueue.push(...secondaryIndices);
        this.pumpQueue();
      });
  }

  private pumpQueue(): void {
    if (this.disposed) return;
    while (this.activeDownloads < this.maxConcurrency && this.pendingQueue.length > 0) {
      // Pick closest frame to current scroll position
      let bestIdxPos = 0;
      let bestDist = Infinity;
      for (let i = 0; i < this.pendingQueue.length; i++) {
        const d = Math.abs(this.pendingQueue[i] - this.focusFrame);
        if (d < bestDist) {
          bestDist = d;
          bestIdxPos = i;
        }
      }
      const [nextIndex] = this.pendingQueue.splice(bestIdxPos, 1);
      this.activeDownloads += 1;
      this.decodeFrame(nextIndex, false).finally(() => {
        this.activeDownloads -= 1;
        this.pumpQueue();
      });
    }
  }

  private decodeFrame(index: number, highPriority: boolean): Promise<void> {
    return this.decodeUrlIntoSlot(index, this.getFrameUrl(index), highPriority);
  }

  private decodeUrlIntoSlot(index: number, url: string, highPriority = false): Promise<void> {
    if (this.disposed) return Promise.resolve();
    return new Promise((resolve) => {
      const img = new Image();
      img.decoding = 'async';
      if (highPriority && 'fetchPriority' in img) {
        (img as HTMLImageElement & { fetchPriority?: string }).fetchPriority = 'high';
      }
      img.onload = () => {
        if (this.disposed) {
          resolve();
          return;
        }
        const finish = () => {
          if (!this.disposed) {
            this.frames[index] = img;
            this.loadedFlags[index] = true;
            this.callbacks.onFrameDecoded?.(index);
          }
          resolve();
        };
        if (typeof img.decode === 'function') {
          img.decode().then(finish).catch(finish);
        } else {
          finish();
        }
      };
      img.onerror = () => resolve();
      img.src = url;
    });
  }

  public dispose(): void {
    this.disposed = true;
    this.pendingQueue.length = 0;
  }
}

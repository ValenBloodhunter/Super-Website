import { useEffect, useRef } from 'react';
import { LAST_FRAME_INDEX, evaluateCamera } from './cameraKeyframes';
import type { ProgressiveFrameLoader } from './frameLoader';

interface CinematicCanvasProps {
  loader: ProgressiveFrameLoader | null;
  progressRef: React.MutableRefObject<number>;
}

export function CinematicCanvas({ loader, progressRef }: CinematicCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerTargetRef = useRef({ x: 0, y: 0 });
  const pointerCurrentRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !loader) return;
    const ctx = canvas.getContext('2d', { desynchronized: true });
    if (!ctx) return;

    let rafId = 0;
    let vw = window.innerWidth;
    let vh = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      vw = canvas.clientWidth;
      vh = canvas.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, vw < 768 ? 1.75 : 2);
      canvas.width = Math.max(1, Math.floor(vw * dpr));
      canvas.height = Math.max(1, Math.floor(vh * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (vw < 900) return;
      const nx = (e.clientX / vw - 0.5) * 2;
      const ny = (e.clientY / vh - 0.5) * 2;
      pointerTargetRef.current.x = nx * -10;
      pointerTargetRef.current.y = ny * -6;
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const drawImageWithCamera = (
      img: HTMLImageElement,
      drawX: number,
      drawY: number,
      drawW: number,
      drawH: number,
      alpha: number
    ) => {
      ctx.globalAlpha = alpha;
      ctx.drawImage(img, drawX, drawY, drawW, drawH);
    };

    const renderFrame = () => {
      rafId = window.requestAnimationFrame(renderFrame);

      // Smooth pointer parallax damping
      pointerCurrentRef.current.x += (pointerTargetRef.current.x - pointerCurrentRef.current.x) * 0.06;
      pointerCurrentRef.current.y += (pointerTargetRef.current.y - pointerCurrentRef.current.y) * 0.06;

      const progress = progressRef.current;
      const pose = evaluateCamera(progress, vw, vh, false);
      loader.setFocusFrame(pose.frameFloat);

      const baseIndex = Math.max(0, Math.min(LAST_FRAME_INDEX, Math.floor(pose.frameFloat)));
      const nextIndex = Math.min(LAST_FRAME_INDEX, baseIndex + 1);
      const frac = pose.frameFloat - baseIndex;

      const img0 = loader.getFrame(baseIndex) ?? loader.findNearestLoadedFrame(baseIndex);
      if (!img0) return;

      const imgW = img0.naturalWidth || 1920;
      const imgH = img0.naturalHeight || 1080;

      // Base cover-or-height scaling: preserve character silhouette on ultrawide while filling portrait
      const rawCoverScale = Math.max(vw / imgW, vh / imgH);
      const coverScale =
        vw / Math.max(1, vh) > 1.95
          ? Math.min(rawCoverScale, (vh / imgH) * 1.15)
          : rawCoverScale;
      const scale = coverScale * pose.zoom;
      const drawW = imgW * scale;
      const drawH = imgH * scale;

      let drawX = vw * pose.targetX - pose.anchorX * drawW + pointerCurrentRef.current.x;
      let drawY = vh * pose.targetY - pose.anchorY * drawH + pointerCurrentRef.current.y;

      // Clamp vertical boundaries so torso base never floats above bottom or crown clips severely
      if (drawY > 0) drawY = 0;
      if (drawY + drawH < vh) drawY = vh - drawH;

      // On standard/mobile screens prevent hard left/right image cutoff gaps
      if (drawW >= vw) {
        if (drawX > 0) drawX = 0;
        if (drawX + drawW < vw) drawX = vw - drawW;
      }

      ctx.globalAlpha = 1;
      ctx.fillStyle = '#030504';
      ctx.fillRect(0, 0, vw, vh);

      // Primary frame
      drawImageWithCamera(img0, drawX, drawY, drawW, drawH, 1);

      // Sub-frame cross-dissolve for temporal smoothness between 16fps frames
      if (frac > 0.02 && nextIndex !== baseIndex) {
        const img1 = loader.getFrame(nextIndex);
        if (img1) {
          const blendAlpha = frac * frac * (3 - 2 * frac);
          drawImageWithCamera(img1, drawX, drawY, drawW, drawH, blendAlpha);
        }
      }

      ctx.globalAlpha = 1;

      // Soft lateral vignette if ultrawide edges reveal frame borders
      if (drawW < vw || drawX > 0 || drawX + drawW < vw) {
        const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
        const leftSolid = clamp01(drawX / vw);
        const leftFade = Math.max(leftSolid, clamp01((drawX + drawW * 0.14) / vw));
        const rightSolid = clamp01((drawX + drawW) / vw);
        const rightFade = Math.min(rightSolid, Math.max(leftFade, clamp01((drawX + drawW * 0.86) / vw)));
        const edgeGrad = ctx.createLinearGradient(0, 0, vw, 0);
        edgeGrad.addColorStop(0, '#030504');
        edgeGrad.addColorStop(leftSolid, '#030504');
        edgeGrad.addColorStop(leftFade, 'rgba(3,5,4,0)');
        edgeGrad.addColorStop(rightFade, 'rgba(3,5,4,0)');
        edgeGrad.addColorStop(rightSolid, '#030504');
        edgeGrad.addColorStop(1, '#030504');
        ctx.fillStyle = edgeGrad;
        ctx.fillRect(0, 0, vw, vh);
      }

      // Restrained perceived golden warmth centered on eyes during Awakening -> Transcendence
      if (pose.warmth > 0.02) {
        const eyeX = drawX + pose.anchorX * drawW;
        const eyeY = drawY + pose.anchorY * drawH;
        const radius = Math.min(vw, vh) * 0.48;
        const warmGrad = ctx.createRadialGradient(eyeX, eyeY, radius * 0.05, eyeX, eyeY, radius);
        warmGrad.addColorStop(0, `rgba(229, 183, 91, ${(0.055 * pose.warmth).toFixed(4)})`);
        warmGrad.addColorStop(0.5, `rgba(229, 183, 91, ${(0.018 * pose.warmth).toFixed(4)})`);
        warmGrad.addColorStop(1, 'rgba(229, 183, 91, 0)');
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.fillStyle = warmGrad;
        ctx.fillRect(0, 0, vw, vh);
        ctx.restore();
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      window.cancelAnimationFrame(rafId);
      if (entry.isIntersecting) rafId = window.requestAnimationFrame(renderFrame);
    });
    observer.observe(canvas);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, [loader, progressRef]);

  return (
    <canvas
      ref={canvasRef}
      className="cinematic-canvas"
      aria-hidden="true"
    />
  );
}

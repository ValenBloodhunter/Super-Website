import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { GenesisOverlay } from './components/GenesisOverlay';
import { NarrativeStage } from './components/NarrativeStage';
import { NavigationChrome } from './components/NavigationChrome';
import { PrologueLoader } from './components/PrologueLoader';
import { CinematicCanvas } from './engine/CinematicCanvas';
import { CHAPTERS, type ChapterDefinition } from './engine/cameraKeyframes';
import { ProgressiveFrameLoader } from './engine/frameLoader';

gsap.registerPlugin(ScrollTrigger);

function chapterForProgress(progress: number): {
  chapter: ChapterDefinition;
  isSilence: boolean;
} {
  if (progress >= 0.43 && progress < 0.505) {
    return { chapter: CHAPTERS[2], isSilence: true };
  }
  if (progress < 0.21) return { chapter: CHAPTERS[0], isSilence: false };
  if (progress < 0.43) return { chapter: CHAPTERS[1], isSilence: false };
  if (progress < 0.66) return { chapter: CHAPTERS[2], isSilence: false };
  if (progress < 0.855) return { chapter: CHAPTERS[3], isSilence: false };
  return { chapter: CHAPTERS[4], isSilence: false };
}

export function App() {
  const progressRef = useRef(0);
  const lenisRef = useRef<Lenis | null>(null);
  const lastTriggerRef = useRef<HTMLElement | null>(null);

  const [loadProgress, setLoadProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [activeKey, setActiveKey] = useState(() => chapterForProgress(0));
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  // Progressive frame loader instance
  const loader = useMemo(
    () =>
      new ProgressiveFrameLoader({
        onPriorityProgress: (ratio) => setLoadProgress(ratio),
        onPriorityReady: () => {
          setLoadProgress(1);
          setIsReady(true);
        },
        onFatalFallback: () => {
          setIsReady(true);
        },
      }),
    []
  );

  useEffect(() => {
    loader.start();
    // Safety cap: never trap visitor if network stalls on secondary frames
    const safetyTimer = window.setTimeout(() => setIsReady(true), 4500);
    return () => {
      window.clearTimeout(safetyTimer);
      loader.dispose();
    };
  }, [loader]);

  // Listen to OS reduced motion changes
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Inertial smooth scrolling (Lenis) synced to GSAP ScrollTrigger
  useEffect(() => {
    if (reducedMotion) {
      lenisRef.current = null;
      return;
    }

    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.35,
    });

    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion]);

  // Pause Lenis scroll while modal dossier is open
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (overlayOpen) {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [overlayOpen]);

  const handleProgressChange = useCallback((p: number) => {
    progressRef.current = p;
    const next = chapterForProgress(p);
    setActiveKey((prev) =>
      prev.chapter.id === next.chapter.id && prev.isSilence === next.isSilence
        ? prev
        : next
    );
  }, []);

  const handleJumpProgress = useCallback(
    (targetProgress: number) => {
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const targetY = targetProgress * maxScroll;

      if (lenisRef.current && !reducedMotion) {
        lenisRef.current.scrollTo(targetY, { duration: 1.35 });
      } else {
        window.scrollTo({
          top: targetY,
          behavior: reducedMotion ? 'auto' : 'smooth',
        });
      }
    },
    [reducedMotion]
  );

  const openOverlay = useCallback((triggerEl: HTMLElement | null) => {
    lastTriggerRef.current = triggerEl;
    setOverlayOpen(true);
  }, []);

  const closeOverlay = useCallback(() => {
    setOverlayOpen(false);
    const trigger = lastTriggerRef.current;
    if (trigger) {
      window.requestAnimationFrame(() => trigger.focus());
    }
  }, []);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to experience
      </a>

      <PrologueLoader progress={loadProgress} ready={isReady} />

      <CinematicCanvas
        loader={loader}
        progressRef={progressRef}
        reducedMotion={reducedMotion}
      />

      <div className="film-grain-overlay" aria-hidden="true" />

      <NavigationChrome
        activeChapter={activeKey.chapter}
        isSilence={activeKey.isSilence}
        onJumpProgress={handleJumpProgress}
        onOpenOverlay={openOverlay}
      />

      <NarrativeStage
        activeChapterId={activeKey.chapter.id}
        isSilence={activeKey.isSilence}
        reducedMotion={reducedMotion}
        onProgressChange={handleProgressChange}
        onOpenOverlay={openOverlay}
      />

      <GenesisOverlay open={overlayOpen} onClose={closeOverlay} />
    </>
  );
}

export default App;

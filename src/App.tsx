import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { CinematicCanvas } from './engine/CinematicCanvas';
import { ProgressiveFrameLoader } from './engine/frameLoader';
import { NarrativeStage } from './components/NarrativeStage';
import { NavigationChrome } from './components/NavigationChrome';
import { Portfolio } from './components/Portfolio';

gsap.registerPlugin(ScrollTrigger);

export function App() {
  const progressRef = useRef(0);
  const lenisRef = useRef<Lenis | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [loader, setLoader] = useState<ProgressiveFrameLoader | null>(null);
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReducedMotion(query.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const frames = new ProgressiveFrameLoader({});
    setLoader(frames);
    frames.start();

    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.35,
      anchors: { immediate: true },
    });
    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);

    return () => {
      frames.dispose();
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion]);

  function jumpToChapter(progress: number) {
    const track = trackRef.current;
    const stage = track?.firstElementChild;
    if (!track || !stage) return;

    const top = track.getBoundingClientRect().top + window.scrollY;
    const target = top + (track.clientHeight - stage.clientHeight) * progress;
    lenisRef.current?.scrollTo(target, { duration: 1.2 });
  }

  return (
    <>
      <a className="skip-link" href="#work">Skip to projects</a>
      <NavigationChrome />
      <main>
        <NarrativeStage
          trackRef={trackRef}
          progressRef={progressRef}
          reducedMotion={reducedMotion}
          onJump={jumpToChapter}
        >
          {!reducedMotion && <CinematicCanvas loader={loader} progressRef={progressRef} />}
        </NarrativeStage>
        <Portfolio />
      </main>
    </>
  );
}

export default App;

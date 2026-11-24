import { useEffect, useRef, useState } from 'react';
import heroReelUrl from '../../wan22_output_2K_upscaled.mp4';
import { ArrowDownIcon, ArrowUpRightIcon, PauseIcon, PlayIcon } from './Icons';

interface HeroProps {
  onOpenFeaturedStudy: () => void;
}

export function Hero({ onOpenFeaturedStudy }: HeroProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const shouldPause = mediaQuery.matches;
    setReducedMotion(shouldPause);

    const setHeroStillFrame = () => {
      if (shouldPause && video.duration >= 3.5) {
        video.currentTime = 3.5;
      }
    };

    if (shouldPause) {
      video.pause();
      setIsPlaying(false);
      if (video.readyState >= 1) {
        setHeroStillFrame();
      } else {
        video.addEventListener('loadedmetadata', setHeroStillFrame, { once: true });
      }
    } else {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            setIsPlaying(false);
          });
      }
    }

    return () => {
      video.removeEventListener('loadedmetadata', setHeroStillFrame);
    };
  }, []);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <section
      id="top"
      aria-label="Hero showcase"
      className="relative flex min-h-[100svh] w-full flex-col justify-between overflow-hidden bg-black pt-24 pb-8 sm:pt-28 sm:pb-10"
    >
      {/* Centerpiece 2K Hero Video */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden bg-black">
        <video
          ref={videoRef}
          src={heroReelUrl}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="h-full w-full object-cover object-[56%_center] sm:object-[62%_center] lg:object-[66%_center]"
        />

        {/* Directional obsidian scrims: guarantee WCAG AA text contrast and dissolve outer video edges seamlessly */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(0,0,0,0.94) 0%, rgba(0,0,0,0.78) 32%, rgba(0,0,0,0.28) 54%, rgba(0,0,0,0.06) 76%, rgba(0,0,0,0.92) 96%, #000000 100%)',
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.08) 26%, rgba(6,8,8,0.12) 68%, #060808 100%)',
          }}
        />
      </div>

      {/* Top Editorial Index Strip */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DCE8E4]/12 pb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-[#A6B0AC]">
          <span>00 // PORTFOLIO ARCHIVE — 2026</span>
          <span className="hidden sm:inline">DIRECTION · GENERATIVE MOTION · INTERACTIVE CRAFT</span>
        </div>
      </div>

      {/* Main Focal Copy */}
      <div className="relative z-10 mx-auto my-auto w-full max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
        <div className="max-w-2xl">
          <p className="mb-5 inline-flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.18em] text-[#E8A656]">
            <span aria-hidden="true" className="h-px w-7 bg-[#E8A656]" />
            <span>Visual Direction &amp; Digital Flagships</span>
          </p>

          <h1 className="text-hero-display text-[#F3EFE8]">
            Sculpting luminous{' '}
            <em className="font-display italic text-[#E8A656]">living</em>{' '}
            worlds for the web.
          </h1>

          <p className="mt-6 max-w-[46ch] text-base leading-relaxed text-[#C9D1CE] sm:text-lg">
            Independent creative studio crafting atmospheric motion studies, editorial brand
            systems, and tactile interactive flagships built for speed and permanence.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#works"
              className="inline-flex items-center gap-2 rounded-full bg-[#F3EFE8] px-6 py-3.5 text-sm font-semibold text-[#060808] transition-colors duration-150 hover:bg-[#E8A656]"
            >
              <span>Explore Selected Works</span>
              <ArrowDownIcon className="h-4 w-4" />
            </a>

            <button
              type="button"
              onClick={onOpenFeaturedStudy}
              className="inline-flex items-center gap-2 rounded-full border border-[#DCE8E4]/25 bg-black/55 px-6 py-3.5 text-sm font-medium text-[#F3EFE8] backdrop-blur-sm transition-colors duration-150 hover:border-[#E8A656]/70 hover:text-[#E8A656]"
            >
              <span>About this reel</span>
              <ArrowUpRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Metadata & Ambient Video Controls */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4 border-t border-[#DCE8E4]/12 pt-5">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.15em] text-[#A6B0AC]">
            <span className="inline-flex items-center gap-2 text-[#F3EFE8]">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#2F8F86]" />
              <span>Available for select commissions</span>
            </span>
            <span className="hidden text-[#7C8883] md:inline">SPECIMEN: VITREOUS BLOOM (2K)</span>
          </div>

          <div className="flex items-center gap-3">
            {reducedMotion && !isPlaying && (
              <span className="hidden font-mono text-[11px] text-[#A6B0AC] sm:inline">
                Paused for reduced motion
              </span>
            )}
            <button
              type="button"
              onClick={togglePlayback}
              aria-pressed={!isPlaying}
              aria-label={isPlaying ? 'Pause background reel' : 'Play background reel'}
              className="inline-flex items-center gap-2 rounded-full border border-[#DCE8E4]/20 bg-[#0D1111]/85 px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[#F3EFE8] backdrop-blur-sm transition-colors hover:border-[#E8A656]/60 hover:text-[#E8A656]"
            >
              {isPlaying ? (
                <>
                  <PauseIcon className="h-3.5 w-3.5" />
                  <span>Pause reel</span>
                </>
              ) : (
                <>
                  <PlayIcon className="h-3.5 w-3.5" />
                  <span>Play reel</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

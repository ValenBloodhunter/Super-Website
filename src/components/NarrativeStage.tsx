import { useEffect, useState, type ReactNode, type RefObject } from 'react';
import gsap from 'gsap';
import { CHAPTERS } from '../data/portfolio';
import { ArrowDownIcon, ArrowUpRightIcon } from './Icons';

interface NarrativeStageProps {
  trackRef: RefObject<HTMLDivElement | null>;
  progressRef: RefObject<number>;
  reducedMotion: boolean;
  onJump: (progress: number) => void;
  children: ReactNode;
}

const INTRO_COPY = 'I build software across applied AI, machine learning, and the web.';

export function NarrativeStage({ trackRef, progressRef, reducedMotion, onJump, children }: NarrativeStageProps) {
  const [current, setCurrent] = useState<number | null>(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || reducedMotion) return;

    const updateProgress = ({ progress }: { progress: number }) => {
      progressRef.current = progress;
      const nextChapter = CHAPTERS.findIndex((chapter) => progress < chapter.startProgress);
      setCurrent(progress >= 0.43 && progress < 0.502
        ? null
        : nextChapter === -1 ? CHAPTERS.length - 1 : nextChapter - 1);
    };

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: track,
          start: 'top top',
          end: () => track.clientHeight - (track.firstElementChild?.clientHeight ?? window.innerHeight),
          scrub: 0.35,
          onUpdate: updateProgress,
          onRefresh: updateProgress,
        },
      });

      // Keep chapter transitions aligned with the camera sequence, including the pause before the eye reveal.
      timeline.to({}, { duration: 1 }, 0);
      CHAPTERS.forEach((chapter, index) => {
        const layer = track.querySelector<HTMLElement>(`[data-chapter="${index}"]`);
        if (!layer) return;

        const lines = layer.querySelectorAll('.line-inner');
        const meta = layer.querySelectorAll('.chapter-meta');
        if (index > 0) {
          gsap.set(layer, { autoAlpha: 0 });
          gsap.set(lines, { opacity: 0, yPercent: 108 });
          gsap.set(meta, { opacity: 0, y: 12 });
          timeline.set(layer, { autoAlpha: 1 }, chapter.startProgress);
          timeline.to(lines, {
            yPercent: 0, opacity: 1, stagger: 0.012, duration: 0.055, ease: 'power2.out',
          }, chapter.startProgress + 0.01);
          timeline.to(meta, {
            y: 0, opacity: 1, duration: 0.05, ease: 'power2.out',
          }, chapter.startProgress + 0.025);
        }

        const next = CHAPTERS[index + 1];
        if (next) {
          const end = index === 1 ? 0.435 : next.startProgress;
          timeline.to(lines, { opacity: 0, yPercent: -108, stagger: 0.01, duration: 0.045 }, end - 0.065);
          timeline.to(meta, { opacity: 0, y: -10, duration: 0.04 }, end - 0.065);
          timeline.set(layer, { autoAlpha: 0 }, end);
        }
      });
    }, track);

    return () => ctx.revert();
  }, [progressRef, reducedMotion, trackRef]);

  return (
    <div ref={trackRef} id="top" className="scroll-story-track" data-reduced-motion={reducedMotion}>
      <div className="pinned-narrative-stage">
        <img
          className="cinematic-poster"
          src={`${import.meta.env.BASE_URL}frames/poster.webp`}
          alt=""
          fetchPriority="high"
        />
        {children}
        <div className="cinematic-scrim" aria-hidden="true" />

        <section className="chapter-layer layer-intro" data-chapter={0} inert={!reducedMotion && current !== 0}>
          <div className="chapter-content">
            <p className="eyebrow chapter-meta">Software developer</p>
            <h1 className="display-primary">
              <span className="line-mask"><span className="line-inner">Debashis</span></span>{' '}
              <span className="line-mask"><span className="line-inner">Das<span className="accent">.</span></span></span>
            </h1>
            <p className="chapter-copy chapter-meta">{INTRO_COPY}</p>
            <div className="chapter-actions chapter-meta">
              <a className="primary-link" href="#work">Explore my work <ArrowUpRightIcon /></a>
            </div>
          </div>
          {!reducedMotion && (
            <span className="scroll-cue chapter-meta" aria-hidden="true"><ArrowDownIcon /> Scroll to play</span>
          )}
        </section>

        {!reducedMotion && CHAPTERS.slice(1).map((chapter, index) => (
          <section
            key={chapter.code}
            className="chapter-layer layer-scene"
            data-chapter={index + 1}
            inert={current !== index + 1}
          >
            <div className="chapter-content">
              <p className="eyebrow chapter-meta">{chapter.eyebrow}</p>
              <h2 className="display-secondary">
                {chapter.lines.map((line, i) => (
                  <span className="line-mask" key={line}>
                    <span className="line-inner">{i > 0 && ' '}{line}</span>
                  </span>
                ))}
              </h2>
              <p className="chapter-copy chapter-meta">{chapter.description}</p>
              <a className="primary-link chapter-meta" href={chapter.href}>
                {chapter.linkLabel} <ArrowUpRightIcon />
              </a>
            </div>
          </section>
        ))}

        {!reducedMotion && (
          <nav className="chapter-rail" aria-label="Scroll film chapters">
            {CHAPTERS.map((chapter, index) => (
              <button
                key={chapter.code}
                type="button"
                className="chapter-rail-item"
                aria-current={current === index ? 'true' : undefined}
                aria-label={`Chapter ${chapter.code}, ${chapter.label}`}
                onClick={() => onJump(chapter.targetProgress)}
              >
                <span className="chapter-rail-code" aria-hidden="true">{chapter.code}</span>
                <span className="chapter-rail-tick" aria-hidden="true" />
              </button>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}

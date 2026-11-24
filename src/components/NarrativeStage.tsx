import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface NarrativeStageProps {
  activeChapterId: string;
  isSilence: boolean;
  reducedMotion: boolean;
  onProgressChange: (progress: number) => void;
  onOpenOverlay: (triggerEl: HTMLElement | null) => void;
}

const DESIGN_SPECS = [
  { code: '01', label: 'BIOLOGICAL FORM' },
  { code: '02', label: 'SYNTHETIC INTELLIGENCE' },
  { code: '03', label: 'ORGANIC EVOLUTION' },
];

export function NarrativeStage({
  activeChapterId,
  isSilence,
  reducedMotion,
  onProgressChange,
  onOpenOverlay,
}: NarrativeStageProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const ctx = gsap.context(() => {
      const ch1Lines = gsap.utils.toArray<HTMLElement>('.ch1-line');
      const ch1Meta = gsap.utils.toArray<HTMLElement>('.ch1-meta');
      const ch2Lines = gsap.utils.toArray<HTMLElement>('.ch2-line');
      const ch2Meta = gsap.utils.toArray<HTMLElement>('.ch2-meta');
      const ch2Rules = gsap.utils.toArray<HTMLElement>('.callout-rule');
      const ch3Lines = gsap.utils.toArray<HTMLElement>('.ch3-line');
      const ch3Meta = gsap.utils.toArray<HTMLElement>('.ch3-meta');
      const ch4Lines = gsap.utils.toArray<HTMLElement>('.ch4-line');
      const ch4Meta = gsap.utils.toArray<HTMLElement>('.ch4-meta');
      const ch4Dividers = gsap.utils.toArray<HTMLElement>('.spec-divider, .spec-divider-top');
      const ch5Lines = gsap.utils.toArray<HTMLElement>('.ch5-line');
      const ch5Meta = gsap.utils.toArray<HTMLElement>('.ch5-meta');

      const yShift = reducedMotion ? 0 : 108;

      // Initial state: Chapter 01 open, chapters 02-05 cleanly hidden
      gsap.set('.layer-ch1', { autoAlpha: 1 });
      gsap.set(['.layer-ch2', '.layer-ch3', '.layer-ch4', '.layer-ch5'], { autoAlpha: 0 });
      gsap.set([ch2Lines, ch3Lines, ch4Lines, ch5Lines], { yPercent: yShift, opacity: 0 });
      gsap.set([ch2Meta, ch3Meta, ch4Meta, ch5Meta], { opacity: 0, y: reducedMotion ? 0 : 12 });
      gsap.set([ch2Rules, ch4Dividers], { scaleX: 0 });

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: track,
          start: 'top top',
          end: 'bottom bottom',
          scrub: reducedMotion ? false : 0.35,
          onUpdate: (self) => {
            onProgressChange(self.progress);
          },
        },
      });

      // Normalize 1.0 timeline duration so every keyframe corresponds directly to scrollProgress [0..1]
      tl.to({}, { duration: 1.0 }, 0);

      // --- CHAPTER 01: 0.00 -> 0.21 ---
      tl.to(ch1Lines, { yPercent: -yShift, opacity: 0, stagger: 0.012, duration: 0.055 }, 0.145);
      tl.to(ch1Meta, { opacity: 0, y: reducedMotion ? 0 : -10, duration: 0.045 }, 0.145);
      tl.to('.scroll-cue', { opacity: 0, duration: 0.04 }, 0.10);
      tl.set('.layer-ch1', { autoAlpha: 0 }, 0.21);

      // --- CHAPTER 02: 0.21 -> 0.43 ---
      tl.set('.layer-ch2', { autoAlpha: 1 }, 0.205);
      tl.to(ch2Lines, { yPercent: 0, opacity: 1, stagger: 0.014, duration: 0.065, ease: 'power2.out' }, 0.215);
      tl.to(ch2Meta, { opacity: 1, y: 0, duration: 0.05, ease: 'power2.out' }, 0.235);
      tl.to(ch2Rules, { scaleX: 1, stagger: 0.015, duration: 0.05, ease: 'power2.out' }, 0.25);

      // Exit Chapter 02 cleanly into Visual Silence (0.43 -> 0.50)
      tl.to(ch2Lines, { yPercent: -yShift, opacity: 0, stagger: 0.01, duration: 0.05, ease: 'power2.in' }, 0.38);
      tl.to(ch2Meta, { opacity: 0, y: reducedMotion ? 0 : -10, duration: 0.04 }, 0.38);
      tl.to(ch2Rules, { scaleX: 0, duration: 0.035 }, 0.385);
      tl.set('.layer-ch2', { autoAlpha: 0 }, 0.435);

      // --- CHAPTER 03: AWAKENING (0.502 -> 0.655, synced to F51-F59) ---
      tl.set('.layer-ch3', { autoAlpha: 1 }, 0.502);
      tl.to('.ch3-status', { opacity: 1, y: 0, duration: 0.025, ease: 'power2.out' }, 0.505);
      tl.to(ch3Lines, { yPercent: 0, opacity: 1, stagger: 0.01, duration: 0.036, ease: 'power2.out' }, 0.508);
      tl.to('.ch3-body', { opacity: 1, y: 0, duration: 0.032, ease: 'power2.out' }, 0.522);

      tl.to(ch3Lines, { yPercent: -yShift, opacity: 0, stagger: 0.01, duration: 0.048, ease: 'power2.in' }, 0.612);
      tl.to(ch3Meta, { opacity: 0, y: reducedMotion ? 0 : -10, duration: 0.04 }, 0.612);
      tl.set('.layer-ch3', { autoAlpha: 0 }, 0.66);

      // --- CHAPTER 04: PRECISION (0.66 -> 0.855) ---
      tl.set('.layer-ch4', { autoAlpha: 1 }, 0.658);
      tl.to(ch4Lines, { yPercent: 0, opacity: 1, stagger: 0.012, duration: 0.05, ease: 'power2.out' }, 0.665);
      tl.to(ch4Meta, { opacity: 1, y: 0, stagger: 0.01, duration: 0.045, ease: 'power2.out' }, 0.682);
      tl.to(ch4Dividers, { scaleX: 1, stagger: 0.008, duration: 0.042, ease: 'power2.out' }, 0.685);

      tl.to(ch4Lines, { yPercent: -yShift, opacity: 0, stagger: 0.01, duration: 0.045, ease: 'power2.in' }, 0.805);
      tl.to(ch4Meta, { opacity: 0, y: reducedMotion ? 0 : -10, duration: 0.04 }, 0.805);
      tl.to(ch4Dividers, { scaleX: 0, duration: 0.035 }, 0.81);
      tl.set('.layer-ch4', { autoAlpha: 0 }, 0.855);

      // --- CHAPTER 05: TRANSCENDENCE (0.855 -> 1.00) ---
      tl.set('.layer-ch5', { autoAlpha: 1 }, 0.855);
      tl.to(ch5Lines, { yPercent: 0, opacity: 1, stagger: 0.016, duration: 0.065, ease: 'power2.out' }, 0.862);
      tl.to(ch5Meta, { opacity: 1, y: 0, stagger: 0.014, duration: 0.05, ease: 'power2.out' }, 0.89);
    }, track);

    return () => {
      ctx.revert();
    };
  }, [onProgressChange, reducedMotion]);

  return (
    <main id="main-content">
      <div ref={trackRef} className="scroll-story-track">
        <div className="pinned-narrative-stage">
          <div className="scrim-top" aria-hidden="true" />
          <div className="scrim-left" aria-hidden="true" />
          <div className="scrim-bottom" aria-hidden="true" />

          {/* CHAPTER 01 — SOVEREIGN */}
          <section
            className="chapter-layer layer-ch1"
            aria-label="Chapter 01: Sovereign"
            data-active={!isSilence && activeChapterId === 'chapter-sovereign' ? 'true' : 'false'}
          >
            <div className="ch1-block">
              <span className="chapter-tag ch1-meta">01 / THE ORIGIN</span>
              <h1 className="display-primary">
                <span className="line-mask">
                  <span className="line-inner ch1-line">Relentless.</span>
                </span>
                <span className="line-mask">
                  <span className="line-inner ch1-line">Sovereign.</span>
                </span>
                <span className="line-mask">
                  <span className="line-inner ch1-line">Unyielding.</span>
                </span>
              </h1>
              <p className="editorial-body ch1-meta">
                Born beyond the boundaries of biology.
              </p>
            </div>

            <div className="scroll-cue" aria-hidden="true">
              <span className="scroll-cue-line" />
              <span className="scroll-cue-text">SCROLL &darr;</span>
            </div>
          </section>

          {/* CHAPTER 02 — EVOLUTION */}
          <section
            className="chapter-layer layer-ch2"
            aria-label="Chapter 02: Evolution"
            data-active={!isSilence && activeChapterId === 'chapter-evolution' ? 'true' : 'false'}
          >
            <div className="ch2-block">
              <span className="chapter-tag ch2-meta">02 / THE EVOLUTION</span>
              <h2 className="display-secondary">
                <span className="line-mask">
                  <span className="line-inner ch2-line">Evolution is</span>
                </span>
                <span className="line-mask">
                  <span className="line-inner ch2-line">no longer</span>
                </span>
                <span className="line-mask">
                  <span className="line-inner ch2-line">accidental.</span>
                </span>
              </h2>
              <p className="editorial-body ch2-meta">
                Organic intelligence.
                <br />
                Engineered beyond instinct.
              </p>
            </div>

            <div className="annotation-layer" aria-hidden="true">
              <div className="editorial-callout editorial-callout-top">
                <span className="callout-node ch2-meta" />
                <span className="callout-rule" />
                <div className="callout-copy ch2-meta">
                  <span>CORTICAL FLORA</span>
                  <span className="callout-sub">SYMBIOTIC MATRIX</span>
                </div>
              </div>

              <div className="editorial-callout editorial-callout-bottom">
                <span className="callout-node ch2-meta" />
                <span className="callout-rule" />
                <div className="callout-copy ch2-meta">
                  <span>NEURAL FILAMENT</span>
                  <span className="callout-sub">AU-79 CONDUCTION</span>
                </div>
              </div>
            </div>
          </section>

          {/* CHAPTER 03 — AWAKENING */}
          <section
            className="chapter-layer layer-ch3"
            aria-label="Chapter 03: Awakening"
            data-active={!isSilence && activeChapterId === 'chapter-awakening' ? 'true' : 'false'}
          >
            <div className="ch3-block">
              <span className="chapter-tag chapter-tag-gold ch3-meta ch3-status">
                <span className="status-dot-gold" aria-hidden="true" />
                NEURAL STATE / ACTIVE
              </span>
              <h2 className="display-awakening">
                <span className="line-mask">
                  <span className="line-inner ch3-line">Consciousness,</span>
                </span>
                <span className="line-mask">
                  <span className="line-inner ch3-line">redefined.</span>
                </span>
              </h2>
              <p className="editorial-body ch3-meta ch3-body">
                The future is not artificial. It is alive.
              </p>
            </div>
          </section>

          {/* CHAPTER 04 — PRECISION */}
          <section
            className="chapter-layer layer-ch4"
            aria-label="Chapter 04: Precision"
            data-active={!isSilence && activeChapterId === 'chapter-precision' ? 'true' : 'false'}
          >
            <div className="ch4-block">
              <span className="chapter-tag ch4-meta">04 / THE ARCHITECTURE</span>
              <h2 className="display-secondary">
                <span className="line-mask">
                  <span className="line-inner ch4-line">Precision</span>
                </span>
                <span className="line-mask">
                  <span className="line-inner ch4-line">built into</span>
                </span>
                <span className="line-mask">
                  <span className="line-inner ch4-line">every line.</span>
                </span>
              </h2>

              <ul className="spec-list" aria-label="Architectural specifications">
                {DESIGN_SPECS.map((spec, idx) => (
                  <li key={spec.code} className="spec-row ch4-meta">
                    {idx === 0 && <span className="spec-divider-top" aria-hidden="true" />}
                    <span className="spec-index">{spec.code}</span>
                    <span>{spec.label}</span>
                    <span className="spec-divider" aria-hidden="true" />
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* CHAPTER 05 — TRANSCENDENCE */}
          <section
            className="chapter-layer layer-ch5"
            aria-label="Chapter 05: Transcendence"
            data-active={!isSilence && activeChapterId === 'chapter-transcendence' ? 'true' : 'false'}
          >
            <div className="ch5-block">
              <span className="chapter-tag chapter-tag-gold ch5-meta">
                05 / TRANSCENDENCE
              </span>
              <h2 className="display-primary">
                <span className="line-mask">
                  <span className="line-inner ch5-line">Beyond</span>
                </span>
                <span className="line-mask">
                  <span className="line-inner ch5-line">human.</span>
                </span>
              </h2>
              <p className="editorial-body ch5-meta">
                The next evolution has already begun.
              </p>
              <div className="ch5-actions ch5-meta">
                <button
                  type="button"
                  className="pill-cta pill-cta-awakened"
                  onClick={(e) => onOpenOverlay(e.currentTarget)}
                >
                  <span className="pill-cta-label">ENTER THE NEXT ERA</span>
                  <span className="pill-cta-glyph" aria-hidden="true">
                    &rarr;
                  </span>
                </button>
              </div>
            </div>

            <div className="ch5-signature ch5-meta">
              <span className="ch5-signature-title">APEX PULSE</span>
              <span className="ch5-signature-sub">
                BIOLOGICAL INTELLIGENCE / CONCEPT 01
              </span>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

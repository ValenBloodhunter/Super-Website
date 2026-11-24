import { useRef } from 'react';
import { CHAPTERS, type ChapterDefinition } from '../engine/cameraKeyframes';

interface NavigationChromeProps {
  activeChapter: ChapterDefinition;
  isSilence: boolean;
  onJumpProgress: (targetProgress: number) => void;
  onOpenOverlay: (triggerEl: HTMLElement | null) => void;
}

export function NavigationChrome({
  activeChapter,
  isSilence,
  onJumpProgress,
  onOpenOverlay,
}: NavigationChromeProps) {
  const pillRef = useRef<HTMLButtonElement | null>(null);

  const handleMagneticMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const el = pillRef.current;
    if (!el || window.innerWidth < 900) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = el.getBoundingClientRect();
    const dx = ((e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)) * 5;
    const dy = ((e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)) * 4;
    el.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0)`;
  };

  const resetMagnetic = () => {
    if (pillRef.current) {
      pillRef.current.style.transform = 'translate3d(0, 0, 0)';
    }
  };

  return (
    <>
      <header className="nav-chrome">
        <button
          type="button"
          className="brand-anchor"
          onClick={() => onJumpProgress(0)}
          aria-label="APEX PULSE — Return to origin"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 28 28"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="14" cy="14" r="12.5" stroke="#F2F1EC" strokeOpacity="0.4" strokeWidth="1" />
            <path
              d="M14 3.5C17 9 17 19 14 24.5M14 3.5C11 9 11 19 14 24.5"
              stroke="#F2F1EC"
              strokeWidth="1"
            />
            <circle
              cx="14"
              cy="14"
              r="2"
              fill={activeChapter.isAwakened ? '#E5B75B' : '#F2F1EC'}
            />
          </svg>
          <span className="brand-wordmark">APEX PULSE</span>
        </button>

        <div
          className="nav-chapter-readout"
          data-gold={activeChapter.isAwakened ? 'true' : 'false'}
          style={{ opacity: isSilence ? 0.25 : 0.9 }}
          aria-live="polite"
        >
          {activeChapter.code} / {activeChapter.label}
        </div>

        <button
          ref={pillRef}
          type="button"
          className={`pill-cta pill-cta-nav ${activeChapter.isAwakened ? 'pill-cta-awakened' : ''}`}
          onClick={(e) => onOpenOverlay(e.currentTarget)}
          onPointerMove={handleMagneticMove}
          onPointerLeave={resetMagnetic}
        >
          <span className="pill-cta-label">JOIN THE EVOLUTION</span>
          <span className="pill-cta-glyph" aria-hidden="true">
            &rarr;
          </span>
        </button>
      </header>

      <nav className="chapter-rail" aria-label="Chapter progression">
        {CHAPTERS.map((chapter) => {
          const isCurrent = chapter.id === activeChapter.id && !isSilence;
          return (
            <button
              key={chapter.id}
              type="button"
              className="chapter-rail-item"
              aria-current={isCurrent ? 'true' : undefined}
              aria-label={`Jump to chapter ${chapter.code}: ${chapter.label}`}
              data-gold={chapter.isAwakened ? 'true' : 'false'}
              onClick={() => onJumpProgress(chapter.targetProgress)}
            >
              <span className="chapter-rail-code">{chapter.code}</span>
              <span className="chapter-rail-tick" aria-hidden="true" />
            </button>
          );
        })}
      </nav>
    </>
  );
}

interface PrologueLoaderProps {
  progress: number;
  ready: boolean;
}

export function PrologueLoader({ progress, ready }: PrologueLoaderProps) {
  const pct = Math.min(100, Math.max(0, Math.round(progress * 100)));

  return (
    <div
      className="prologue-loader"
      data-ready={ready ? 'true' : 'false'}
      role="status"
      aria-live="polite"
      aria-label="System initialization progress"
    >
      <div className="prologue-inner">
        <svg
          width="28"
          height="28"
          viewBox="0 0 32 32"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="16" cy="16" r="14" stroke="#F2F1EC" strokeOpacity="0.28" strokeWidth="1" />
          <path
            d="M16 4C19.5 9.5 19.5 22.5 16 28M16 4C12.5 9.5 12.5 22.5 16 28M4 16H28"
            stroke="#F2F1EC"
            strokeOpacity="0.72"
            strokeWidth="1"
          />
          <circle cx="16" cy="16" r="2.2" fill="#E5B75B" />
        </svg>

        <div className="prologue-track" aria-hidden="true">
          <div
            className="prologue-fill"
            style={{ transform: `scaleX(${Math.max(0.04, progress)})` }}
          />
        </div>

        <div className="prologue-meta">
          <span>APEX / SYSTEM INITIALIZATION</span>
          <span>{String(pct).padStart(2, '0')}%</span>
        </div>
      </div>
    </div>
  );
}

import heroReelUrl from '../../wan22_output_2K_upscaled.mp4';
import type { ProjectStudy } from '../data/projects';

interface SpecimenPlateProps {
  variant: ProjectStudy['plateVariant'];
  title: string;
  compact?: boolean;
}

export function SpecimenPlate({ variant, title, compact = false }: SpecimenPlateProps) {
  if (variant === 'video-study') {
    return (
      <div className="relative h-full w-full overflow-hidden bg-black">
        <video
          src={`${heroReelUrl}#t=2.8`}
          muted
          loop
          playsInline
          preload="metadata"
          tabIndex={-1}
          aria-hidden="true"
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0) 42%, rgba(6,8,8,0.82) 100%)',
          }}
        />
        <span className="pointer-events-none absolute right-4 top-4 rounded-full border border-[#E8A656]/35 bg-black/70 px-2.5 py-1 font-mono text-[11px] tracking-[0.14em] text-[#E8A656]">
          2K REEL
        </span>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#080C0C]">
      {variant === 'amber-meridian' && (
        <svg
          viewBox="0 0 640 480"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          role="img"
          aria-label={`Geometric acoustic wave study for ${title}`}
        >
          <defs>
            <radialGradient id="amberMeridianGlow" cx="62%" cy="44%" r="55%">
              <stop offset="0%" stopColor="#E8A656" stopOpacity="0.34" />
              <stop offset="48%" stopColor="#1B5A55" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#070A0A" stopOpacity="1" />
            </radialGradient>
          </defs>
          <rect width="640" height="480" fill="url(#amberMeridianGlow)" />
          <g stroke="#F3EFE8" strokeOpacity="0.14" fill="none">
            <circle cx="380" cy="220" r="64" />
            <circle cx="380" cy="220" r="118" />
            <circle cx="380" cy="220" r="172" />
            <circle cx="380" cy="220" r="228" strokeDasharray="3 6" />
          </g>
          <g stroke="#E8A656" strokeOpacity="0.65" fill="none" strokeWidth="1.25">
            <path d="M40 310 C150 260, 240 120, 380 220 C480 290, 560 190, 620 150" />
            <path
              d="M40 338 C165 292, 260 165, 380 242 C480 308, 550 224, 620 184"
              strokeOpacity="0.34"
            />
          </g>
          <line x1="380" y1="36" x2="380" y2="444" stroke="#E8A656" strokeOpacity="0.24" />
          <circle cx="380" cy="220" r="5" fill="#E8A656" />
          {!compact && (
            <text
              x="36"
              y="442"
              fill="#A6B0AC"
              fontFamily="JetBrains Mono, monospace"
              fontSize="11"
              letterSpacing="2"
            >
              SPECIMEN // 44.1KHZ HARMONIC FIELD
            </text>
          )}
        </svg>
      )}

      {variant === 'glass-caustics' && (
        <svg
          viewBox="0 0 640 420"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          role="img"
          aria-label={`Orbital glass refraction study for ${title}`}
        >
          <defs>
            <radialGradient id="glassCausticsBg" cx="35%" cy="38%" r="65%">
              <stop offset="0%" stopColor="#2F8F86" stopOpacity="0.36" />
              <stop offset="55%" stopColor="#0E2527" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#060909" stopOpacity="1" />
            </radialGradient>
            <linearGradient id="glassLens" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#58C5BA" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#E8A656" stopOpacity="0.22" />
            </linearGradient>
          </defs>
          <rect width="640" height="420" fill="url(#glassCausticsBg)" />
          <g stroke="#DCE8E4" strokeOpacity="0.12" fill="none">
            <ellipse cx="320" cy="210" rx="250" ry="86" transform="rotate(-14 320 210)" />
            <ellipse cx="320" cy="210" rx="205" ry="62" transform="rotate(11 320 210)" />
            <ellipse cx="320" cy="210" rx="145" ry="145" strokeDasharray="2 7" />
          </g>
          <circle cx="320" cy="210" r="88" fill="url(#glassLens)" fillOpacity="0.2" stroke="#58C5BA" strokeOpacity="0.48" />
          <circle cx="364" cy="176" r="18" fill="#E8A656" fillOpacity="0.82" />
          <line x1="60" y1="210" x2="580" y2="210" stroke="#F3EFE8" strokeOpacity="0.1" />
          {!compact && (
            <text
              x="36"
              y="386"
              fill="#A6B0AC"
              fontFamily="JetBrains Mono, monospace"
              fontSize="11"
              letterSpacing="2"
            >
              SOLIS // ORBITAL REFRACTION PLATE
            </text>
          )}
        </svg>
      )}

      {variant === 'botanical-lattice' && (
        <svg
          viewBox="0 0 640 420"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          role="img"
          aria-label={`Botanical line monograph study for ${title}`}
        >
          <defs>
            <radialGradient id="orchidGlow" cx="68%" cy="32%" r="60%">
              <stop offset="0%" stopColor="#DFA1AE" stopOpacity="0.32" />
              <stop offset="48%" stopColor="#26181F" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#070909" stopOpacity="1" />
            </radialGradient>
          </defs>
          <rect width="640" height="420" fill="url(#orchidGlow)" />
          <g stroke="#DFA1AE" strokeOpacity="0.48" fill="none" strokeWidth="1.2">
            <path d="M180 390 C220 270, 310 190, 448 112" />
            <path d="M276 266 C340 250, 390 218, 434 166" strokeOpacity="0.34" />
            <path d="M244 304 C188 264, 152 222, 134 156" strokeOpacity="0.34" />
          </g>
          <g transform="translate(432 132)" fill="none" stroke="#F3EFE8" strokeOpacity="0.55">
            <ellipse cx="0" cy="-36" rx="22" ry="38" fill="#DFA1AE" fillOpacity="0.18" />
            <ellipse cx="34" cy="12" rx="22" ry="38" transform="rotate(72 34 12)" fill="#DFA1AE" fillOpacity="0.14" />
            <ellipse cx="-34" cy="12" rx="22" ry="38" transform="rotate(-72 -34 12)" fill="#DFA1AE" fillOpacity="0.14" />
            <circle cx="0" cy="0" r="8" fill="#E8A656" stroke="none" />
          </g>
          <rect x="44" y="42" width="150" height="196" fill="none" stroke="#F3EFE8" strokeOpacity="0.14" />
          <line x1="44" y1="140" x2="194" y2="140" stroke="#F3EFE8" strokeOpacity="0.12" />
          {!compact && (
            <text
              x="44"
              y="386"
              fill="#A6B0AC"
              fontFamily="JetBrains Mono, monospace"
              fontSize="11"
              letterSpacing="2"
            >
              FLORA // SPECIMEN INDEX 04
            </text>
          )}
        </svg>
      )}

      {variant === 'obsidian-grid' && (
        <svg
          viewBox="0 0 960 360"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          role="img"
          aria-label={`Spatial timeline and color suite interface study for ${title}`}
        >
          <defs>
            <linearGradient id="meridianSurface" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0E1C1D" />
              <stop offset="55%" stopColor="#080D0E" />
              <stop offset="100%" stopColor="#12120E" />
            </linearGradient>
          </defs>
          <rect width="960" height="360" fill="url(#meridianSurface)" />
          <g stroke="#DCE8E4" strokeOpacity="0.09">
            <line x1="0" y1="90" x2="960" y2="90" />
            <line x1="0" y1="180" x2="960" y2="180" />
            <line x1="0" y1="270" x2="960" y2="270" />
            <line x1="240" y1="0" x2="240" y2="360" />
            <line x1="480" y1="0" x2="480" y2="360" />
            <line x1="720" y1="0" x2="720" y2="360" />
          </g>
          {/* Timeline track bars */}
          <rect x="64" y="114" width="290" height="24" rx="4" fill="#2F8F86" fillOpacity="0.34" stroke="#2F8F86" strokeOpacity="0.7" />
          <rect x="372" y="114" width="212" height="24" rx="4" fill="#E8A656" fillOpacity="0.22" stroke="#E8A656" strokeOpacity="0.65" />
          <rect x="148" y="156" width="388" height="24" rx="4" fill="#F3EFE8" fillOpacity="0.08" stroke="#F3EFE8" strokeOpacity="0.24" />
          <rect x="556" y="156" width="286" height="24" rx="4" fill="#DFA1AE" fillOpacity="0.16" stroke="#DFA1AE" strokeOpacity="0.5" />
          <rect x="92" y="198" width="470" height="24" rx="4" fill="#2F8F86" fillOpacity="0.2" stroke="#2F8F86" strokeOpacity="0.45" />
          {/* Playhead */}
          <line x1="480" y1="48" x2="480" y2="312" stroke="#E8A656" strokeWidth="1.5" />
          <polygon points="472,48 488,48 480,60" fill="#E8A656" />
          {!compact && (
            <text
              x="64"
              y="324"
              fill="#A6B0AC"
              fontFamily="JetBrains Mono, monospace"
              fontSize="11"
              letterSpacing="2"
            >
              MERIDIAN // TIMELINE PRIMITIVES · TC 00:04:12:08
            </text>
          )}
        </svg>
      )}
    </div>
  );
}

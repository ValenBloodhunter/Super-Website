export type ProjectCategory = 'Direction' | 'Motion' | 'Interactive';

export interface ProjectStudy {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  category: ProjectCategory;
  year: string;
  role: string;
  duration: string;
  summary: string;
  challenge: string;
  approach: string;
  deliverables: string[];
  stack: string[];
  palette: [string, string, string];
  layoutSpan: 'featured' | 'tall' | 'wide' | 'standard';
  plateVariant: 'video-study' | 'botanical-lattice' | 'amber-meridian' | 'glass-caustics' | 'obsidian-grid';
}

export const CATEGORIES: Array<'All' | ProjectCategory> = [
  'All',
  'Direction',
  'Motion',
  'Interactive',
];

export const PROJECTS: ProjectStudy[] = [
  {
    id: 'vitreous-bloom',
    index: '01',
    title: 'Vitreous Bloom',
    subtitle: 'Biomechanical motion study & 2K hero reel',
    category: 'Motion',
    year: '2026',
    role: 'Creative Direction · Generative Motion',
    duration: 'Archive Specimen',
    summary:
      'An exploration of translucent emerald glass, internal amber filaments, and botanical stillness—built as the living centerpiece of this portfolio.',
    challenge:
      'Balance high-contrast synthetic anatomy with organic orchid delicacy while keeping web playback lightweight, seam-free against obsidian backgrounds, and accessible under reduced-motion settings.',
    approach:
      'Directed a 2K upscaled sequence framed on pure black void so directional scrims dissolve frame boundaries seamlessly. Paired live ambient playback with an explicit Pause/Play control and automatic reduced-motion gating.',
    deliverables: [
      '2K Hero Motion Sequence',
      'Color & Lighting Lookbook',
      'Adaptive Web Playback System',
      'Reduced-Motion Static Fallback',
    ],
    stack: ['Wan 2.2 Pipeline', 'Color Grading', 'HTML5 Video API', 'CSS Vignette Masking'],
    palette: ['#0F4C47', '#E8A656', '#DFA1AE'],
    layoutSpan: 'featured',
    plateVariant: 'video-study',
  },
  {
    id: 'kestrel-acoustics',
    index: '02',
    title: 'Kestrel Acoustics',
    subtitle: 'Spatial audio hardware flagship & identity system',
    category: 'Direction',
    year: '2026',
    role: 'Art Direction · Design System',
    duration: 'Archive Study',
    summary:
      'Editorial product language and tactile dark-surface specification system designed for precision studio monitors and acoustic instruments.',
    challenge:
      'Communicate sub-millimeter acoustic craftsmanship without relying on noisy technical clutter or generic neon hardware tropes.',
    approach:
      'Anchored the layout in Swiss-editorial typographic cadence, hairline mineral borders, and tabular acoustic telemetry paired with calm dark-room contrast.',
    deliverables: [
      'Brand Identity & Type Hierarchy',
      'Modular Product Spec Architecture',
      'Tokenized Dark Surface Palette',
    ],
    stack: ['Design Tokens', 'React', 'Tailwind CSS', 'SVG Acoustic Diagrams'],
    palette: ['#132E2C', '#E8A656', '#A6B0AC'],
    layoutSpan: 'tall',
    plateVariant: 'amber-meridian',
  },
  {
    id: 'solis-observatory',
    index: '03',
    title: 'Solis Observatory',
    subtitle: 'Interactive orbital archive & editorial microsite',
    category: 'Interactive',
    year: '2025',
    role: 'Lead Interface Architecture · Motion',
    duration: 'Archive Study',
    summary:
      'A keyboard-first digital exhibition translating long-exposure atmospheric recordings into an unhurried, chaptered reading experience.',
    challenge:
      'Preserve fluid responsiveness and crisp reading ergonomics across desktop and narrow viewports while presenting layered celestial data.',
    approach:
      'Engineered CSS-first transitions, IntersectionObserver chapter reveals, and accessible native dialogs so the experience stays responsive without heavy JS animation runtimes.',
    deliverables: [
      'Interactive Exhibition Prototype',
      'Fluid Clamp Typography System',
      'Keyboard & Screen-Reader Navigation',
    ],
    stack: ['Vite', 'TypeScript', 'CSS Grid', 'Native Dialog API'],
    palette: ['#0E2428', '#2F8F86', '#F3EFE8'],
    layoutSpan: 'standard',
    plateVariant: 'glass-caustics',
  },
  {
    id: 'flora-synthetica',
    index: '04',
    title: 'Flora Synthetica',
    subtitle: 'Generative print monographs & botanical index',
    category: 'Direction',
    year: '2025',
    role: 'Visual Direction · Editorial Layout',
    duration: 'Archive Study',
    summary:
      'A curated digital catalog pairing macro botanical silhouettes with algorithmic line systems for an independent design monograph.',
    challenge:
      'Give dense archival cataloging the quiet emotional resonance of a physical gallery book rather than a utilitarian database grid.',
    approach:
      'Established asymmetric plate pacing, restrained orchid-blush annotations, and generous negative space that foregrounds specimen silhouette over chrome.',
    deliverables: [
      'Monograph Grid Architecture',
      'Custom SVG Specimen Plates',
      'Digital Archive Filtering',
    ],
    stack: ['Editorial Grid', 'SVG Composition', 'Semantic HTML', 'Tailwind CSS'],
    palette: ['#1B1418', '#DFA1AE', '#E8A656'],
    layoutSpan: 'standard',
    plateVariant: 'botanical-lattice',
  },
  {
    id: 'meridian-os',
    index: '05',
    title: 'Meridian Spatial UI',
    subtitle: 'Calm interface primitives for creative cinema tools',
    category: 'Interactive',
    year: '2025',
    role: 'Design Systems · Frontend Engineering',
    duration: 'Archive Study',
    summary:
      'Low-glare color grading workspace primitives engineered for long studio sessions with strict WCAG contrast and keyboard-first shortcuts.',
    challenge:
      'Ensure dense timelines and color controls remain readable at 200% zoom and under dim color-suite lighting without color-only status cues.',
    approach:
      'Mapped every surface to stepped mineral elevation tokens, replaced heavy blurs with crisp 1px borders, and validated every interactive state for focus visibility.',
    deliverables: [
      'Component Primitive Library',
      'WCAG 2.2 AA Contrast Audit',
      'Keyboard Shortcut Matrix',
    ],
    stack: ['React 19', 'TypeScript', 'ARIA Patterns', 'CSS Custom Properties'],
    palette: ['#0C1618', '#2F8F86', '#E8A656'],
    layoutSpan: 'wide',
    plateVariant: 'obsidian-grid',
  },
];

export interface CapabilityItem {
  index: string;
  title: string;
  description: string;
  focus: string[];
}

export const CAPABILITIES: CapabilityItem[] = [
  {
    index: '01',
    title: 'Art Direction & Visual Systems',
    description:
      'Cohesive visual worlds shaped around real subject matter—from color science and editorial typography to tokenized design systems built to endure.',
    focus: ['Brand Direction', 'Design Tokens', 'Editorial Grids'],
  },
  {
    index: '02',
    title: 'Generative & Cinematic Motion',
    description:
      'Purpose-built moving imagery, title sequences, and tactile web choreography that heighten narrative pacing without sacrificing load speed or comfort.',
    focus: ['Hero Reels', 'Micro-Interactions', 'Reduced-Motion Parity'],
  },
  {
    index: '03',
    title: 'Interactive Web Flagships',
    description:
      'Fast, accessible React and TypeScript interfaces engineered with native browser primitives, lean bundles, and disciplined Core Web Vitals.',
    focus: ['React & Vite', 'Accessible Modals', 'Responsive Architecture'],
  },
  {
    index: '04',
    title: 'Design Engineering & Audits',
    description:
      'Hands-on refinement of existing products—tightening hierarchy, resolving keyboard and contrast gaps, and eliminating decorative bloat.',
    focus: ['WCAG 2.2 AA', 'Performance Tuning', 'Component Craft'],
  },
];

export const PROCESS_STEPS = [
  {
    step: '01',
    label: 'Frame',
    detail: 'Audit subject matter, audience goals, and visual constraints before drawing a single pixel.',
  },
  {
    step: '02',
    label: 'Direct',
    detail: 'Establish one unmistakable visual signature—palette, typography, surface tension, and rhythm.',
  },
  {
    step: '03',
    label: 'Engineer',
    detail: 'Build with semantic HTML, tokenized CSS, and lean React components that hold up across viewports.',
  },
  {
    step: '04',
    label: 'Refine',
    detail: 'Stress-test contrast, keyboard paths, motion comfort, and asset delivery prior to launch.',
  },
];

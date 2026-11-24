export const GITHUB_PROFILE = 'https://github.com/ValenBloodhunter';
export const LINKEDIN_PROFILE = 'https://www.linkedin.com/in/debashis-das-22a6a7432/';

export const FEATURED_PROJECTS = [
  {
    id: 'warranty',
    title: 'Warranty',
    category: 'Applied AI',
    summary: 'An LLM router that recommends a model tier based on task complexity and the user’s cost–accuracy preference. A separate benchmark simulator evaluates the trade-off offline.',
    stack: ['JavaScript', 'LLM routing', 'Benchmarking'],
    imageAlt: 'Warranty’s live routing interface showing its Low, Good, and Best model tiers.',
    source: `${GITHUB_PROFILE}/Warranty`,
    demo: 'https://warranty-liart.vercel.app',
  },
  {
    id: 'campusflow',
    title: 'CampusFlow',
    category: 'Realtime web app',
    summary: 'A campus prototype that combines live queue updates with walking time to help students decide when to leave for the library, cafeteria, or admin office.',
    stack: ['JavaScript', 'Flask', 'Firebase'],
    imageAlt: 'CampusFlow’s student dashboard showing the library, cafeteria, and admin office queue cards.',
    source: `${GITHUB_PROFILE}/CampusFlow`,
    demo: 'https://campus-flow-wine.vercel.app',
  },
];

export const OTHER_PROJECTS = [
  {
    title: 'SkillSetu',
    description: 'Career and livelihood guidance with skills assessments, adaptive roadmaps, and multilingual voice assistance.',
    stack: 'Python · Streamlit · RAG',
    source: `${GITHUB_PROFILE}/SkillSetu`,
  },
  {
    title: 'Veil',
    description: 'An SMS spam classifier using TF-IDF and Multinomial Naive Bayes.',
    stack: 'Python · scikit-learn',
    source: `${GITHUB_PROFILE}/Veil`,
  },
  {
    title: 'Titan-UX',
    description: 'A frontend engineering toolkit for coding agents, covering design research, accessibility, and browser QA.',
    stack: 'Python · Playwright',
    source: `${GITHUB_PROFILE}/titan-ux`,
  },
];

export interface ChapterDefinition {
  code: string;
  label: string;
  startProgress: number;
  targetProgress: number;
  eyebrow?: string;
  lines: string[];
  description?: string;
  href?: string;
  linkLabel?: string;
}

export const CHAPTERS: ChapterDefinition[] = [
  { code: '01', label: 'Introduction', startProgress: 0, targetProgress: 0, lines: [] },
  {
    code: '02', label: 'Warranty', startProgress: 0.205, targetProgress: 0.30,
    eyebrow: 'Warranty / Applied AI',
    lines: ['A model for', 'the task.'],
    description: 'Route a request by task complexity and the trade-off between cost and accuracy.',
    href: '#warranty', linkLabel: 'See Warranty',
  },
  {
    code: '03', label: 'CampusFlow', startProgress: 0.502, targetProgress: 0.58,
    eyebrow: 'CampusFlow / Realtime web',
    lines: ['Know when', 'to go.'],
    description: 'Use campus queues and walking time to decide when to leave.',
    href: '#campusflow', linkLabel: 'See CampusFlow',
  },
  {
    code: '04', label: 'About', startProgress: 0.658, targetProgress: 0.75,
    eyebrow: 'About me',
    lines: ['Software for', 'the next decision.'],
    description: 'I build software that helps people make decisions from data.',
    href: '#about', linkLabel: 'More about me',
  },
  {
    code: '05', label: 'Projects', startProgress: 0.855, targetProgress: 0.96,
    eyebrow: 'Project index',
    lines: ['Explore', 'the work.'],
    description: 'Project details, live demos, and source code.',
    href: '#work', linkLabel: 'Browse projects',
  },
];

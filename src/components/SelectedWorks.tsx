import { useState } from 'react';
import { CATEGORIES, PROJECTS, type ProjectCategory, type ProjectStudy } from '../data/projects';
import { useReveal } from '../hooks/useReveal';
import { ArrowUpRightIcon } from './Icons';
import { SpecimenPlate } from './SpecimenPlate';

interface SelectedWorksProps {
  onSelectProject: (project: ProjectStudy, triggerEl: HTMLElement | null) => void;
}

export function SelectedWorks({ onSelectProject }: SelectedWorksProps) {
  const [activeCategory, setActiveCategory] = useState<'All' | ProjectCategory>('All');
  const { ref, visible } = useReveal<HTMLElement>();

  const filtered =
    activeCategory === 'All'
      ? PROJECTS
      : PROJECTS.filter((project) => project.category === activeCategory);

  const getSpanClass = (project: ProjectStudy) => {
    if (activeCategory !== 'All') {
      return 'md:col-span-6';
    }
    switch (project.layoutSpan) {
      case 'featured':
        return 'lg:col-span-7';
      case 'tall':
        return 'lg:col-span-5';
      case 'wide':
        return 'lg:col-span-12';
      default:
        return 'lg:col-span-6';
    }
  };

  const getAspectClass = (project: ProjectStudy) => {
    if (activeCategory !== 'All') return 'aspect-[16/10]';
    if (project.layoutSpan === 'wide') return 'aspect-[16/9] lg:aspect-[21/8]';
    if (project.layoutSpan === 'tall') return 'aspect-[4/3] lg:aspect-[5/4]';
    return 'aspect-[16/10]';
  };

  return (
    <section
      id="works"
      ref={ref}
      data-visible={visible}
      aria-labelledby="works-heading"
      className="reveal mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32 lg:px-10"
    >
      <div className="flex flex-col justify-between gap-8 border-b border-[#DCE8E4]/10 pb-10 lg:flex-row lg:items-end">
        <div className="max-w-xl">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#E8A656]">
            01 // Selected Archive
          </p>
          <h2 id="works-heading" className="text-section-display mt-3 text-[#F3EFE8]">
            Curated studies &amp; digital specimens.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#A6B0AC] sm:text-base">
            Representative portfolio studies spanning motion direction, visual systems, and
            interactive engineering. Select any plate to inspect the brief and craft notes.
          </p>
        </div>

        <div
          role="group"
          aria-label="Filter projects by discipline"
          className="flex flex-wrap items-center gap-2"
        >
          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category;
            const count =
              category === 'All'
                ? PROJECTS.length
                : PROJECTS.filter((item) => item.category === category).length;

            return (
              <button
                key={category}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveCategory(category)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium tracking-[0.04em] transition-colors duration-150 ${
                  isActive
                    ? 'border-[#E8A656] bg-[#E8A656]/15 text-[#F3EFE8]'
                    : 'border-[#DCE8E4]/14 bg-[#0D1111] text-[#A6B0AC] hover:border-[#DCE8E4]/30 hover:text-[#F3EFE8]'
                }`}
              >
                <span>{category}</span>
                <span className="font-mono text-[10px] tabular-nums opacity-75">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-12 lg:gap-8">
        {filtered.map((project) => (
          <article key={project.id} className={`col-span-1 md:col-span-12 ${getSpanClass(project)}`}>
            <button
              type="button"
              onClick={(event) => onSelectProject(project, event.currentTarget)}
              className="surface-hairline-hover group flex h-full w-full flex-col overflow-hidden rounded-2xl bg-[#0D1111] text-left focus-visible:ring-2 focus-visible:ring-[#E8A656]"
            >
              <div className={`w-full overflow-hidden border-b border-[#DCE8E4]/10 ${getAspectClass(project)}`}>
                <SpecimenPlate variant={project.plateVariant} title={project.title} />
              </div>

              <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
                <div>
                  <div className="flex items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.15em] text-[#A6B0AC]">
                    <span>
                      {project.index} · {project.category}
                    </span>
                    <span className="tabular-nums text-[#7C8883]">{project.year}</span>
                  </div>

                  <div className="mt-3 flex items-start justify-between gap-4">
                    <h3 className="text-card-display text-[#F3EFE8] transition-colors duration-150 group-hover:text-[#E8A656]">
                      {project.title}
                    </h3>
                    <span
                      aria-hidden="true"
                      className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#DCE8E4]/14 text-[#A6B0AC] transition-colors duration-150 group-hover:border-[#E8A656]/55 group-hover:text-[#E8A656]"
                    >
                      <ArrowUpRightIcon className="h-4 w-4" />
                    </span>
                  </div>

                  <p className="mt-2.5 max-w-[58ch] text-sm leading-relaxed text-[#A6B0AC]">
                    {project.summary}
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#DCE8E4]/10 pt-4">
                  <span className="font-mono text-[11px] text-[#7C8883]">{project.role}</span>
                  <div className="flex items-center gap-1.5" aria-hidden="true">
                    {project.palette.map((hex) => (
                      <span
                        key={hex}
                        className="h-2.5 w-2.5 rounded-full border border-white/15"
                        style={{ backgroundColor: hex }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

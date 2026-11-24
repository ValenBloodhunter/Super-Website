import { useEffect, useRef } from 'react';
import type { ProjectStudy } from '../data/projects';
import { ArrowUpRightIcon, CloseIcon } from './Icons';
import { SpecimenPlate } from './SpecimenPlate';

interface ProjectDialogProps {
  project: ProjectStudy | null;
  onClose: () => void;
  onCommission: (category: string) => void;
}

export function ProjectDialog({ project, onClose, onCommission }: ProjectDialogProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (project) {
      if (!dialog.open) {
        dialog.showModal();
      }
      document.body.style.overflow = 'hidden';
      closeButtonRef.current?.focus();
    } else if (dialog.open) {
      dialog.close();
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [project]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={handleBackdropClick}
      aria-labelledby="case-dialog-title"
      aria-describedby="case-dialog-summary"
      className="case-dialog"
    >
      {project && (
        <div className="case-dialog-panel flex max-h-[88svh] flex-col overflow-hidden rounded-2xl border border-[#DCE8E4]/16 bg-[#0D1111] shadow-2xl">
          {/* Header bar */}
          <div className="flex items-center justify-between gap-4 border-b border-[#DCE8E4]/10 px-6 py-4 sm:px-8">
            <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-[#A6B0AC]">
              <span className="text-[#E8A656]">STUDY {project.index}</span>
              <span aria-hidden="true">·</span>
              <span>{project.category}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{project.year}</span>
            </div>

            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Close case study dialog"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#DCE8E4]/16 text-[#F3EFE8] transition-colors hover:border-[#E8A656]/60 hover:text-[#E8A656]"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>

          {/* Scrollable content */}
          <div className="overflow-y-auto px-6 py-6 sm:px-8 sm:py-8">
            <div className="aspect-[16/9] w-full overflow-hidden rounded-xl border border-[#DCE8E4]/12 bg-black">
              <SpecimenPlate variant={project.plateVariant} title={project.title} compact />
            </div>

            <div className="mt-7 grid grid-cols-1 gap-8 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <h2
                  id="case-dialog-title"
                  className="font-display text-3xl font-normal tracking-tight text-[#F3EFE8] sm:text-4xl"
                >
                  {project.title}
                </h2>
                <p className="mt-1.5 text-sm font-medium text-[#E8A656]">{project.subtitle}</p>
                <p id="case-dialog-summary" className="mt-4 text-sm leading-relaxed text-[#C9D1CE] sm:text-base">
                  {project.summary}
                </p>

                <div className="mt-7 space-y-5 border-t border-[#DCE8E4]/10 pt-6">
                  <div>
                    <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#A6B0AC]">
                      The Challenge
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#C9D1CE]">
                      {project.challenge}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#A6B0AC]">
                      Direction &amp; Craft
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#C9D1CE]">
                      {project.approach}
                    </p>
                  </div>
                </div>
              </div>

              <aside className="space-y-6 rounded-xl border border-[#DCE8E4]/10 bg-[#141A1A]/75 p-5 lg:col-span-5">
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between gap-4 border-b border-[#DCE8E4]/10 pb-2.5">
                    <dt className="text-[#7C8883]">Role</dt>
                    <dd className="text-right text-[#F3EFE8]">{project.role}</dd>
                  </div>
                  <div className="flex justify-between gap-4 border-b border-[#DCE8E4]/10 pb-2.5">
                    <dt className="text-[#7C8883]">Classification</dt>
                    <dd className="text-right text-[#F3EFE8]">{project.duration}</dd>
                  </div>
                  <div className="flex justify-between gap-4 border-b border-[#DCE8E4]/10 pb-2.5">
                    <dt className="text-[#7C8883]">Palette</dt>
                    <dd className="flex flex-wrap justify-end gap-2">
                      {project.palette.map((hex) => (
                        <span
                          key={hex}
                          className="inline-flex items-center gap-1.5 font-mono text-[10px] text-[#A6B0AC]"
                        >
                          <span
                            aria-hidden="true"
                            className="h-2.5 w-2.5 rounded-full border border-white/20"
                            style={{ backgroundColor: hex }}
                          />
                          <span>{hex}</span>
                        </span>
                      ))}
                    </dd>
                  </div>
                </dl>

                <div>
                  <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#A6B0AC]">
                    Deliverables
                  </h3>
                  <ul className="mt-2.5 space-y-1.5 text-sm text-[#C9D1CE]">
                    {project.deliverables.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span aria-hidden="true" className="h-1 w-1 rounded-full bg-[#E8A656]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#A6B0AC]">
                    Stack &amp; Methods
                  </h3>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-[#DCE8E4]/12 bg-[#0D1111] px-2.5 py-1 font-mono text-[11px] text-[#A6B0AC]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onCommission(project.category)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#E8A656] px-5 py-3 text-sm font-semibold text-[#060808] transition-opacity hover:opacity-90"
                >
                  <span>Discuss a similar piece</span>
                  <ArrowUpRightIcon className="h-4 w-4" />
                </button>
              </aside>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}

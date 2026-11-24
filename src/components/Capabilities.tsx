import { CAPABILITIES, PROCESS_STEPS } from '../data/projects';
import { useReveal } from '../hooks/useReveal';

export function Capabilities() {
  const { ref: practiceRef, visible: practiceVisible } = useReveal<HTMLElement>();
  const { ref: processRef, visible: processVisible } = useReveal<HTMLElement>();

  return (
    <>
      <section
        id="practice"
        ref={practiceRef}
        data-visible={practiceVisible}
        aria-labelledby="practice-heading"
        className="reveal border-t border-[#DCE8E4]/10 bg-[#080B0B]"
      >
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32 lg:px-10">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-12">
            <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#E8A656]">
                02 // Practice
              </p>
              <h2 id="practice-heading" className="text-section-display mt-3 text-[#F3EFE8]">
                Restraint, atmosphere, and engineering discipline.
              </h2>
              <p className="mt-5 max-w-[44ch] text-sm leading-relaxed text-[#A6B0AC] sm:text-base">
                Every interface is composed from its primary subject outward. Instead of layering
                ornamental chrome over generic layouts, we shape typography, lighting, and motion
                into a single quiet instrument.
              </p>
              <p className="mt-4 max-w-[44ch] text-sm leading-relaxed text-[#7C8883]">
                Built for founders, film and audio labs, and design-led product teams who care as
                deeply about accessibility and performance as visual distinction.
              </p>
            </div>

            <div className="lg:col-span-7">
              <ol className="divide-y divide-[#DCE8E4]/10 border-y border-[#DCE8E4]/10">
                {CAPABILITIES.map((item) => (
                  <li key={item.index} className="py-8 first:pt-2 sm:py-9">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-8">
                      <span className="font-mono text-xs tracking-[0.18em] text-[#E8A656]">
                        {item.index}
                      </span>
                      <div className="flex-1">
                        <h3 className="font-display text-2xl font-medium text-[#F3EFE8] sm:text-[1.75rem]">
                          {item.title}
                        </h3>
                        <p className="mt-2.5 max-w-[54ch] text-sm leading-relaxed text-[#A6B0AC]">
                          {item.description}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {item.focus.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-[#DCE8E4]/12 bg-[#0D1111] px-3 py-1 font-mono text-[11px] text-[#A6B0AC]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section
        id="process"
        ref={processRef}
        data-visible={processVisible}
        aria-labelledby="process-heading"
        className="reveal border-t border-[#DCE8E4]/10 bg-[#060808]"
      >
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#2F8F86]">
                03 // Working Cadence
              </p>
              <h2 id="process-heading" className="text-section-display mt-2 text-[#F3EFE8]">
                From frame to shipped flagship.
              </h2>
            </div>
            <p className="max-w-[38ch] text-sm text-[#A6B0AC]">
              Small senior engagements with direct collaboration—no handoff drift between art
              direction and production code.
            </p>
          </div>

          <ol className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[#DCE8E4]/10 bg-[#DCE8E4]/10 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((phase) => (
              <li key={phase.step} className="bg-[#0B0F0F] p-6 sm:p-7">
                <span className="font-mono text-xs tracking-[0.18em] text-[#E8A656]">
                  {phase.step}
                </span>
                <h3 className="mt-4 font-display text-2xl font-medium text-[#F3EFE8]">
                  {phase.label}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-[#A6B0AC]">{phase.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}

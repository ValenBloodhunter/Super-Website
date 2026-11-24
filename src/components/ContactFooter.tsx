import { useEffect, useState, type FormEvent } from 'react';
import { ArrowUpRightIcon, CheckIcon, CopyIcon } from './Icons';

interface ContactFooterProps {
  preselectedDiscipline: string;
}

const DISCIPLINES = ['Direction', 'Motion', 'Interactive', 'Full Flagship'];
const STUDIO_EMAIL = 'studio@super-archive.example';

interface FormErrors {
  name?: string;
  email?: string;
  brief?: string;
}

export function ContactFooter({ preselectedDiscipline }: ContactFooterProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [discipline, setDiscipline] = useState(preselectedDiscipline || 'Full Flagship');
  const [brief, setBrief] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (preselectedDiscipline) {
      setDiscipline(preselectedDiscipline);
    }
  }, [preselectedDiscipline]);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(STUDIO_EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: FormErrors = {};

    if (name.trim().length < 2) {
      nextErrors.name = 'Please enter your name or studio.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (brief.trim().length < 16) {
      nextErrors.brief = 'Share a short project note (at least 16 characters).';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitted(true);
  };

  return (
    <footer
      id="contact"
      aria-labelledby="contact-heading"
      className="border-t border-[#DCE8E4]/10 bg-[#050707]"
    >
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-28 lg:px-10">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-12">
          {/* Direct inquiry details */}
          <div className="lg:col-span-5">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#E8A656]">
              04 // Commission &amp; Contact
            </p>
            <h2 id="contact-heading" className="text-section-display mt-3 text-[#F3EFE8]">
              Let’s build something unmistakable.
            </h2>
            <p className="mt-4 max-w-[42ch] text-sm leading-relaxed text-[#A6B0AC] sm:text-base">
              Share your timeline, goals, or reference material. We respond within two business days
              with a clear scope and availability window.
            </p>

            <div className="mt-8 space-y-5 border-t border-[#DCE8E4]/10 pt-7">
              <div className="flex items-center gap-2.5 text-sm text-[#F3EFE8]">
                <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#2F8F86]" />
                <span>Booking select collaborations for 2026–2027</span>
              </div>

              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#7C8883]">
                  Direct desk
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <a
                    href={`mailto:${STUDIO_EMAIL}`}
                    className="font-display text-2xl text-[#F3EFE8] underline decoration-[#DCE8E4]/25 underline-offset-4 transition-colors hover:text-[#E8A656] hover:decoration-[#E8A656]"
                  >
                    {STUDIO_EMAIL}
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    aria-label="Copy studio email address"
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#DCE8E4]/16 bg-[#0D1111] px-3 py-1.5 font-mono text-[11px] text-[#A6B0AC] transition-colors hover:border-[#E8A656]/55 hover:text-[#F3EFE8]"
                  >
                    {copied ? (
                      <>
                        <CheckIcon className="h-3.5 w-3.5 text-[#2F8F86]" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <CopyIcon className="h-3.5 w-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <span className="sr-only" aria-live="polite">
                  {copied ? 'Studio email copied to clipboard.' : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Inquiry form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-[#DCE8E4]/12 bg-[#0D1111] p-6 sm:p-8">
              {submitted ? (
                <div role="status" className="space-y-4 py-6">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#2F8F86]/50 bg-[#2F8F86]/15 text-[#2F8F86]">
                    <CheckIcon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-3xl text-[#F3EFE8]">
                    Inquiry prepared for {name}.
                  </h3>
                  <p className="max-w-[50ch] text-sm leading-relaxed text-[#A6B0AC]">
                    Your <span className="text-[#F3EFE8]">{discipline}</span> brief has been
                    validated in local portfolio preview mode. Connect a form endpoint or mailto
                    handler when deploying to production.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setName('');
                      setEmail('');
                      setBrief('');
                      setErrors({});
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-[#DCE8E4]/20 px-4 py-2 text-xs font-medium text-[#F3EFE8] transition-colors hover:border-[#E8A656]/60 hover:text-[#E8A656]"
                  >
                    Send another note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="inquiry-name"
                        className="block font-mono text-[11px] uppercase tracking-[0.15em] text-[#A6B0AC]"
                      >
                        Name
                      </label>
                      <input
                        id="inquiry-name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                        }}
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? 'inquiry-name-error' : undefined}
                        placeholder="Maya Lin / Studio"
                        className="mt-2 w-full rounded-xl border border-[#DCE8E4]/14 bg-[#070A0A] px-4 py-3 text-sm text-[#F3EFE8] placeholder:text-[#66726D] transition-colors focus:border-[#E8A656] focus:outline-none"
                      />
                      {errors.name && (
                        <p id="inquiry-name-error" className="mt-1.5 text-xs text-[#DFA1AE]">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="inquiry-email"
                        className="block font-mono text-[11px] uppercase tracking-[0.15em] text-[#A6B0AC]"
                      >
                        Email
                      </label>
                      <input
                        id="inquiry-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                        }}
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? 'inquiry-email-error' : undefined}
                        placeholder="you@company.com"
                        className="mt-2 w-full rounded-xl border border-[#DCE8E4]/14 bg-[#070A0A] px-4 py-3 text-sm text-[#F3EFE8] placeholder:text-[#66726D] transition-colors focus:border-[#E8A656] focus:outline-none"
                      />
                      {errors.email && (
                        <p id="inquiry-email-error" className="mt-1.5 text-xs text-[#DFA1AE]">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <fieldset>
                    <legend className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#A6B0AC]">
                      Primary Focus
                    </legend>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {DISCIPLINES.map((option) => {
                        const selected = discipline === option;
                        return (
                          <button
                            key={option}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => setDiscipline(option)}
                            className={`rounded-full border px-3.5 py-2 text-xs font-medium transition-colors ${
                              selected
                                ? 'border-[#E8A656] bg-[#E8A656]/15 text-[#F3EFE8]'
                                : 'border-[#DCE8E4]/14 bg-[#070A0A] text-[#A6B0AC] hover:border-[#DCE8E4]/30 hover:text-[#F3EFE8]'
                            }`}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>

                  <div>
                    <label
                      htmlFor="inquiry-brief"
                      className="block font-mono text-[11px] uppercase tracking-[0.15em] text-[#A6B0AC]"
                    >
                      Project Brief
                    </label>
                    <textarea
                      id="inquiry-brief"
                      name="brief"
                      rows={4}
                      value={brief}
                      onChange={(e) => {
                        setBrief(e.target.value);
                        if (errors.brief) setErrors((prev) => ({ ...prev, brief: undefined }));
                      }}
                      aria-invalid={Boolean(errors.brief)}
                      aria-describedby={errors.brief ? 'inquiry-brief-error' : undefined}
                      placeholder="What are we building, what matters most, and when are you hoping to launch?"
                      className="mt-2 w-full resize-y rounded-xl border border-[#DCE8E4]/14 bg-[#070A0A] px-4 py-3 text-sm text-[#F3EFE8] placeholder:text-[#66726D] transition-colors focus:border-[#E8A656] focus:outline-none"
                    />
                    {errors.brief && (
                      <p id="inquiry-brief-error" className="mt-1.5 text-xs text-[#DFA1AE]">
                        {errors.brief}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                    <p className="font-mono text-[11px] text-[#7C8883]">
                      Local validation · No data sent externally
                    </p>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-full bg-[#F3EFE8] px-6 py-3 text-sm font-semibold text-[#060808] transition-colors duration-150 hover:bg-[#E8A656]"
                    >
                      <span>Send inquiry</span>
                      <ArrowUpRightIcon className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Colophon bar */}
        <div className="mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-[#DCE8E4]/10 pt-7 font-mono text-[11px] uppercase tracking-[0.14em] text-[#7C8883]">
          <span>© 2026 SUPER STUDIO · ARCHIVE EDITION</span>
          <a
            href="#top"
            className="text-[#A6B0AC] transition-colors hover:text-[#E8A656]"
          >
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}

import { useEffect, useRef, useState } from 'react';

interface GenesisOverlayProps {
  open: boolean;
  onClose: () => void;
}

export function GenesisOverlay({ open, onClose }: GenesisOverlayProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [interest, setInterest] = useState('Private Exhibition');
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      window.requestAnimationFrame(() => {
        nameInputRef.current?.focus();
      });
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setError('Please enter your name or studio designation.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Please enter a valid electronic mail address.');
      return;
    }

    setError(null);
    setSubmitted(true);
  };

  return (
    <dialog
      ref={dialogRef}
      className="genesis-dialog"
      aria-labelledby="genesis-title"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClose={() => {
        if (open) onClose();
      }}
      onClick={handleBackdropClick}
    >
      <div className="genesis-shell">
        <div className="genesis-header">
          <span className="chapter-tag chapter-tag-gold">
            APEX PULSE / CONCEPT 01 DOSSIER
          </span>
          <button
            type="button"
            className="genesis-close"
            onClick={onClose}
            aria-label="Close dossier overlay"
          >
            CLOSE &times;
          </button>
        </div>

        <div className="genesis-monograph">
          <h2 id="genesis-title" className="display-secondary">
            Biological intelligence, sovereign by design.
          </h2>
          <p className="editorial-body">
            Concept 01 investigates the threshold where living botanical structure
            merges with luminous neural engineering.
          </p>

          <div className="genesis-pillars">
            <div className="genesis-pillar">
              <span className="genesis-pillar-label">01 — BOTANICAL CYBERNETICS</span>
              <span className="genesis-pillar-text">
                Translucent emerald structural matrices paired with living Phalaenopsis flora.
              </span>
            </div>
            <div className="genesis-pillar">
              <span className="genesis-pillar-label">02 — SYNAPTIC CONDUCTION</span>
              <span className="genesis-pillar-text">
                Continuous golden neural filaments bridging organic intuition and synthetic precision.
              </span>
            </div>
            <div className="genesis-pillar">
              <span className="genesis-pillar-label">03 — SOVEREIGN AWAKENING</span>
              <span className="genesis-pillar-text">
                Designed not as an instrument of utility, but as an autonomous presence.
              </span>
            </div>
          </div>
        </div>

        <div>
          {submitted ? (
            <div className="genesis-form" role="status" aria-live="polite">
              <span className="chapter-tag chapter-tag-gold">
                TRANSMISSION RECORDED
              </span>
              <h3 className="display-secondary" style={{ fontSize: 'clamp(28px, 3vw, 40px)' }}>
                Initiation acknowledged.
              </h3>
              <p className="editorial-body">
                {name.trim()}, your request under <strong>{interest}</strong> has been logged for
                the next APEX PULSE Concept 01 private release.
              </p>
              <div>
                <button
                  type="button"
                  className="pill-cta pill-cta-awakened"
                  onClick={() => {
                    setSubmitted(false);
                    setName('');
                    setEmail('');
                    onClose();
                  }}
                >
                  <span className="pill-cta-label">RETURN TO FILM</span>
                  <span className="pill-cta-glyph" aria-hidden="true">
                    &rarr;
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <form className="genesis-form" onSubmit={handleSubmit} noValidate>
              <span className="chapter-tag">GENESIS REGISTRY</span>

              <div className="genesis-field">
                <label className="genesis-label" htmlFor="genesis-name">
                  DESIGNATION / NAME
                </label>
                <input
                  ref={nameInputRef}
                  id="genesis-name"
                  className="genesis-input"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Dr. Elena Vance"
                />
              </div>

              <div className="genesis-field">
                <label className="genesis-label" htmlFor="genesis-email">
                  ELECTRONIC ADDRESS
                </label>
                <input
                  id="genesis-email"
                  className="genesis-input"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="elena@atelier.org"
                />
              </div>

              <div className="genesis-field">
                <label className="genesis-label" htmlFor="genesis-interest">
                  INQUIRY CHANNEL
                </label>
                <select
                  id="genesis-interest"
                  className="genesis-input genesis-select"
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                >
                  <option value="Private Exhibition">Private Exhibition</option>
                  <option value="Architectural Commission">Architectural Commission</option>
                  <option value="Research Monograph">Research Monograph</option>
                </select>
              </div>

              {error && (
                <div className="genesis-error" role="alert">
                  {error}
                </div>
              )}

              <div style={{ marginTop: '0.5rem' }}>
                <button type="submit" className="pill-cta pill-cta-awakened">
                  <span className="pill-cta-label">REQUEST ACCESS</span>
                  <span className="pill-cta-glyph" aria-hidden="true">
                    &rarr;
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </dialog>
  );
}

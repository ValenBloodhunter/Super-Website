import { useEffect, useState } from 'react';
import { ArrowUpRightIcon, CloseIcon, MenuIcon } from './Icons';

const NAV_LINKS = [
  { href: '#works', label: 'Works' },
  { href: '#practice', label: 'Practice' },
  { href: '#process', label: 'Process' },
  { href: '#contact', label: 'Contact' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled || menuOpen
          ? 'border-b border-[#DCE8E4]/10 bg-[#060808]/88 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-[#E8A656] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[#060808]"
      >
        Skip to main content
      </a>

      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <a
          href="#top"
          className="group inline-flex items-center gap-3 text-[#F3EFE8] transition-opacity hover:opacity-90"
          aria-label="SUPER Studio home"
        >
          <span
            aria-hidden="true"
            className="h-2 w-2 rounded-full bg-[#E8A656] shadow-[0_0_12px_rgba(232,166,86,0.75)]"
          />
          <span className="font-display text-2xl font-medium tracking-[0.08em]">SUPER</span>
          <span className="hidden font-mono text-[11px] tracking-[0.18em] text-[#A6B0AC] sm:inline">
            / STUDIO
          </span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-[#A6B0AC] transition-colors duration-150 hover:text-[#F3EFE8]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <a
            href="#contact"
            className="inline-flex items-center gap-1.5 rounded-full border border-[#DCE8E4]/20 bg-[#0D1111]/70 px-4 py-2 text-xs font-medium tracking-[0.06em] text-[#F3EFE8] transition-colors duration-150 hover:border-[#E8A656]/60 hover:text-[#E8A656]"
          >
            <span>Start a project</span>
            <ArrowUpRightIcon className="h-3.5 w-3.5" />
          </a>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-drawer"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#DCE8E4]/15 text-[#F3EFE8] transition-colors hover:border-[#E8A656]/50 md:hidden"
        >
          {menuOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen && (
        <nav
          id="mobile-nav-drawer"
          aria-label="Mobile navigation"
          className="border-t border-[#DCE8E4]/10 bg-[#060808]/96 px-5 pb-6 pt-4 md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-3 py-3 text-base font-medium text-[#F3EFE8] transition-colors hover:bg-[#141A1A]"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#E8A656] px-5 py-3 text-sm font-semibold text-[#060808] transition-opacity hover:opacity-90"
          >
            <span>Start a project</span>
            <ArrowUpRightIcon className="h-4 w-4" />
          </a>
        </nav>
      )}
    </header>
  );
}

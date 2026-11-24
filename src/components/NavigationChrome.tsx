export function NavigationChrome() {
  return (
    <header className="nav-chrome">
      <nav aria-label="Main navigation">
        <a className="brand-anchor" href="#top" aria-label="Debashis Das, home">
          <span className="brand-mark" aria-hidden="true">D<span>.</span></span>
          <span className="brand-wordmark">Debashis Das</span>
        </a>
        <div className="nav-links">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a className="nav-contact" href="#contact">Contact</a>
        </div>
      </nav>
    </header>
  );
}

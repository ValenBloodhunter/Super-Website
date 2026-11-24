import { FEATURED_PROJECTS, GITHUB_PROFILE, LINKEDIN_PROFILE, OTHER_PROJECTS } from '../data/portfolio';
import { ArrowUpRightIcon } from './Icons';

export function Portfolio() {
  return (
    <div className="portfolio">
      <section className="portfolio-section shell" id="work" aria-labelledby="work-title" tabIndex={-1}>
        <div className="section-heading">
          <h2 id="work-title">Selected work<span>.</span></h2>
          <a className="text-link" href={GITHUB_PROFILE}>View GitHub <ArrowUpRightIcon /></a>
        </div>
        <div className="featured-grid">
          {FEATURED_PROJECTS.map((project) => (
            <article className={`project-card project-${project.id}`} id={project.id} key={project.id} tabIndex={-1}>
              <a className="project-image" href={project.demo} aria-label={`Open ${project.title} demo`}>
                <img
                  src={`${import.meta.env.BASE_URL}projects/${project.id}.jpg`}
                  alt={project.imageAlt}
                  width="1180"
                  height="800"
                  loading="lazy"
                  decoding="async"
                />
              </a>
              <div className="project-content">
                <p className="eyebrow">{project.category}</p>
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
                <ul className="tech-list" aria-label="Technologies">
                  {project.stack.map((tech) => <li key={tech}>{tech}</li>)}
                </ul>
                <div className="project-links">
                  <a className="text-link" href={project.demo} aria-label={`${project.title} live demo`}>
                    Live demo <ArrowUpRightIcon />
                  </a>
                  <a className="text-link" href={project.source} aria-label={`${project.title} source code`}>
                    Source code <ArrowUpRightIcon />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        <h3 className="more-title">More projects</h3>
        <ul className="project-list">
          {OTHER_PROJECTS.map((project) => (
            <li key={project.title}>
              <a href={project.source}>
                <span className="list-title">{project.title}</span>
                <span className="list-description">{project.description}</span>
                <span className="list-stack">{project.stack}</span>
                <ArrowUpRightIcon />
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="about-section" id="about" aria-labelledby="about-title" tabIndex={-1}>
        <div className="shell about-grid">
          <div>
            <p className="eyebrow">About</p>
            <h2 id="about-title">Hi, I’m<br />Debashis<span>.</span></h2>
          </div>
          <div className="about-copy">
            <p>I’m a software developer exploring applied AI, machine learning, and interactive web experiences.</p>
            <p>I like turning a system’s output into a decision someone can use, whether that means choosing an AI model or deciding when to head to the library.</p>
          </div>
        </div>
      </section>

      <footer className="contact-section shell" id="contact" aria-labelledby="contact-title" tabIndex={-1}>
        <div className="contact-main">
          <h2 id="contact-title">Let’s talk<span>.</span></h2>
          <div className="contact-links">
            <a className="primary-link" href={LINKEDIN_PROFILE}>Connect on LinkedIn <ArrowUpRightIcon /></a>
            <a className="text-link" href={GITHUB_PROFILE}>Find me on GitHub <ArrowUpRightIcon /></a>
          </div>
        </div>
        <div className="footer-note">
          <span>Debashis Das</span>
          <a href="#top">Back to top <span aria-hidden="true">↑</span></a>
        </div>
      </footer>
    </div>
  );
}

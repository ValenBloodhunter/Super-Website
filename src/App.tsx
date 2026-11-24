import { useRef, useState } from 'react';
import { Capabilities } from './components/Capabilities';
import { ContactFooter } from './components/ContactFooter';
import { Hero } from './components/Hero';
import { Navbar } from './components/Navbar';
import { ProjectDialog } from './components/ProjectDialog';
import { SelectedWorks } from './components/SelectedWorks';
import { PROJECTS, type ProjectStudy } from './data/projects';

export function App() {
  const [selectedProject, setSelectedProject] = useState<ProjectStudy | null>(null);
  const [preselectedDiscipline, setPreselectedDiscipline] = useState('Full Flagship');
  const lastTriggerRef = useRef<HTMLElement | null>(null);

  const openProject = (project: ProjectStudy, triggerEl: HTMLElement | null) => {
    lastTriggerRef.current = triggerEl;
    setSelectedProject(project);
  };

  const closeProject = () => {
    setSelectedProject(null);
    const trigger = lastTriggerRef.current;
    if (trigger) {
      window.requestAnimationFrame(() => trigger.focus());
    }
  };

  const handleCommissionFromDialog = (category: string) => {
    setPreselectedDiscipline(category);
    setSelectedProject(null);
    window.requestAnimationFrame(() => {
      document.getElementById('contact')?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : 'smooth',
      });
    });
  };

  return (
    <div className="min-h-screen bg-[#060808] text-[#F3EFE8]">
      <Navbar />

      <main id="main-content">
        <Hero
          onOpenFeaturedStudy={() => {
            openProject(PROJECTS[0], document.activeElement as HTMLElement | null);
          }}
        />
        <SelectedWorks onSelectProject={openProject} />
        <Capabilities />
      </main>

      <ContactFooter preselectedDiscipline={preselectedDiscipline} />

      <ProjectDialog
        project={selectedProject}
        onClose={closeProject}
        onCommission={handleCommissionFromDialog}
      />
    </div>
  );
}

export default App;

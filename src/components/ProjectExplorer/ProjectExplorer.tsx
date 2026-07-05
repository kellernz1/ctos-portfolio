import { useMemo, useState } from "react";
import { ExternalLink, Github } from "lucide-react";
import { projects } from "../../data/projects";

const statusLabel = {
  planned: "PLANNED",
  building: "BUILDING",
  completed: "COMPLETED",
};

export function ProjectExplorer() {
  const [filters, setFilters] = useState<string[]>([]);

  const stacks = useMemo(() => Array.from(new Set(projects.flatMap((project) => project.stack))).sort(), []);
  const visibleProjects = filters.length
    ? projects.filter((project) => filters.every((filter) => project.stack.includes(filter)))
    : projects;

  const toggleFilter = (stack: string) => {
    setFilters((current) => (current.includes(stack) ? current.filter((filter) => filter !== stack) : [...current, stack]));
  };

  return (
    <div className="project-explorer">
      <div className="filter-row" aria-label="Project stack filters">
        {stacks.map((stack) => (
          <button type="button" key={stack} className={filters.includes(stack) ? "chip active" : "chip"} onClick={() => toggleFilter(stack)}>
            {stack}
          </button>
        ))}
      </div>

      <div className="project-grid">
        {visibleProjects.map((project, index) => (
          <article className="project-card" key={project.id}>
            <div className="project-card-top">
              <span className="file-index">[{String(index + 1).padStart(2, "0")}]</span>
              <span className={`status ${project.status}`}>{statusLabel[project.status]}</span>
            </div>
            <h3>{project.name}</h3>
            <p className="codename">{project.codename}</p>
            <p>{project.description}</p>
            <div className="stack-list" aria-label="Tech stack">
              {project.stack.map((stack) => (
                <span key={stack}>{stack}</span>
              ))}
            </div>
            <div className="project-actions">
              <a href={project.githubUrl} target="_blank" rel="noreferrer">
                <Github size={16} aria-hidden="true" /> GitHub
              </a>
              {project.liveUrl ? (
                <a href={project.liveUrl} target="_blank" rel="noreferrer">
                  <ExternalLink size={16} aria-hidden="true" /> Demo
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

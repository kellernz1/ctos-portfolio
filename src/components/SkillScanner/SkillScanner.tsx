import { useEffect, useMemo, useState } from "react";
import { skills } from "../../data/skills";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const categories = ["frontend", "backend", "tooling", "soft"] as const;

export function SkillScanner() {
  const reducedMotion = useReducedMotion();
  const [progress, setProgress] = useState(reducedMotion ? 100 : 0);
  const grouped = useMemo(() => categories.map((category) => ({ category, skills: skills.filter((skill) => skill.category === category) })), []);

  useEffect(() => {
    if (reducedMotion) {
      setProgress(100);
      return undefined;
    }
    let frame = 0;
    const start = performance.now();
    const animate = (time: number) => {
      const next = Math.min(100, Math.round(((time - start) / 900) * 100));
      setProgress(next);
      if (next < 100) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [reducedMotion]);

  return (
    <div className="skill-scanner">
      <div className="scan-progress">
        <span>SCANNING SKILLS...</span>
        <div className="progress-shell" aria-label={`Scan progress ${progress}%`}>
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>

      {grouped.map(({ category, skills: categorySkills }) => (
        <section className="skill-group" key={category}>
          <h3>{category.toUpperCase()}</h3>
          {categorySkills.map((skill) => {
            const value = reducedMotion ? skill.proficiency : Math.round((skill.proficiency * progress) / 100);
            return (
              <div className="skill-row" key={skill.id}>
                <span>{skill.name}</span>
                <div className="skill-meter" aria-label={`${skill.name} ${skill.proficiency}%`}>
                  <span style={{ width: `${value}%` }} />
                </div>
                <strong>{skill.proficiency}%</strong>
                <em>{skill.yearsOfExperience ?? 1}y</em>
              </div>
            );
          })}
        </section>
      ))}
    </div>
  );
}

export interface Skill {
  id: string;
  name: string;
  category: "frontend" | "backend" | "tooling" | "soft";
  proficiency: number;
  yearsOfExperience?: number;
}

export const skills: Skill[] = [
  { id: "react", name: "React", category: "frontend", proficiency: 92, yearsOfExperience: 4 },
  { id: "typescript", name: "TypeScript", category: "frontend", proficiency: 88, yearsOfExperience: 3 },
  { id: "vite", name: "Vite", category: "frontend", proficiency: 86, yearsOfExperience: 3 },
  { id: "accessibility", name: "Accessibility", category: "frontend", proficiency: 78, yearsOfExperience: 2 },
  { id: "node", name: "Node.js", category: "backend", proficiency: 74, yearsOfExperience: 2 },
  { id: "fastapi", name: "FastAPI", category: "backend", proficiency: 68, yearsOfExperience: 1 },
  { id: "testing", name: "Vitest / Testing Library", category: "tooling", proficiency: 82, yearsOfExperience: 2 },
  { id: "ci", name: "GitHub Actions", category: "tooling", proficiency: 80, yearsOfExperience: 2 },
  { id: "deployment", name: "Static Deploys", category: "tooling", proficiency: 84, yearsOfExperience: 2 },
  { id: "product", name: "Product Sense", category: "soft", proficiency: 86, yearsOfExperience: 4 },
  { id: "communication", name: "Clear Communication", category: "soft", proficiency: 90, yearsOfExperience: 5 },
];

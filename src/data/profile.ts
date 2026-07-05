export interface Profile {
  handle: string;
  realName: string;
  role: string;
  location: string;
  bio: string;
  status: "online" | "away" | "in_mission";
  clearanceLevel: number;
  links: {
    github: string;
    linkedin: string;
    email: string;
    resumeUrl: string;
    instagram: string;
    twitch: string;
    youtube: string;
  };
}

export const profile: Profile = {
  handle: "operator_nz1",
  realName: "Keller",
  role: "Frontend Engineer",
  location: "Brazil / remote",
  bio: "Builder of polished web interfaces, game catalogs, dashboards, automation flows, and deployment-ready frontend systems.",
  status: "in_mission",
  clearanceLevel: 5,
  links: {
    github: "https://github.com/kellernz1",
    linkedin: "https://www.linkedin.com/in/keller-nascimento-166224357/",
    email: "mailto:keller.nasc@gmail.com",
    resumeUrl: "/resume.pdf",
    instagram: "https://www.instagram.com/keller.nz/",
    twitch: "https://www.twitch.tv/kellernz1",
    youtube: "https://www.youtube.com/@kellernz",
  },
};

import { Github, Instagram, Mail, Twitch, UserRound, Youtube } from "lucide-react";
import { profile } from "../../data/profile";
import { ProjectExplorer } from "../ProjectExplorer/ProjectExplorer";
import { SkillScanner } from "../SkillScanner/SkillScanner";
import { useWindowManagerStore } from "../../stores/windowManagerStore";
import { Window } from "./Window";

function AboutWindow() {
  return (
    <div className="about-module">
      <p className="module-kicker">OPERATOR PROFILE</p>
      <h2>{profile.realName}</h2>
      <p className="role">{profile.role}</p>
      <nav className="social-tabs" aria-label="Social links">
        <a href={profile.links.instagram} target="_blank" rel="noreferrer">
          <Instagram size={17} aria-hidden="true" /> Instagram
        </a>
        <a href={profile.links.twitch} target="_blank" rel="noreferrer">
          <Twitch size={17} aria-hidden="true" /> Twitch
        </a>
        <a href={profile.links.youtube} target="_blank" rel="noreferrer">
          <Youtube size={17} aria-hidden="true" /> YouTube
        </a>
        <a href={profile.links.github} target="_blank" rel="noreferrer">
          <Github size={17} aria-hidden="true" /> GitHub
        </a>
      </nav>
      <p>{profile.bio}</p>
      <dl className="profile-grid">
        <div>
          <dt>Handle</dt>
          <dd>{profile.handle}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>{profile.status}</dd>
        </div>
        <div>
          <dt>Location</dt>
          <dd>{profile.location}</dd>
        </div>
        <div>
          <dt>Clearance</dt>
          <dd>Level {profile.clearanceLevel}</dd>
        </div>
      </dl>
    </div>
  );
}

function ContactWindow() {
  return (
    <div className="contact-module">
      <p className="module-kicker">SECURE CHANNELS</p>
      <h2>Transmit mission brief</h2>
      <p>Use the direct channels below. The visual form opens a mailto draft and keeps this portfolio frontend-only.</p>
      <div className="contact-actions">
        <a href={profile.links.email}>
          <Mail size={18} aria-hidden="true" /> Email
        </a>
        <a href={profile.links.github} target="_blank" rel="noreferrer">
          <UserRound size={18} aria-hidden="true" /> GitHub
        </a>
        <a href={profile.links.linkedin} target="_blank" rel="noreferrer">
          LinkedIn
        </a>
        <a href={profile.links.resumeUrl} target="_blank" rel="noreferrer">
          Download resume
        </a>
      </div>
      <form
        className="fake-form"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          window.location.href = `${profile.links.email}?subject=${encodeURIComponent(String(data.get("subject") ?? "Mission brief"))}&body=${encodeURIComponent(String(data.get("message") ?? ""))}`;
        }}
      >
        <label>
          Subject
          <input name="subject" defaultValue="Mission brief" />
        </label>
        <label>
          Message
          <textarea name="message" defaultValue="MESSAGE ENCRYPTED AND SENT VIA SECURE CHANNEL." />
        </label>
        <button type="submit">Encrypt & send</button>
      </form>
    </div>
  );
}

export function WindowManager() {
  const windows = useWindowManagerStore((state) => state.windows);

  return (
    <>
      {windows.map((windowState) => {
        const content = {
          about: <AboutWindow />,
          projects: <ProjectExplorer />,
          skills: <SkillScanner />,
          contact: <ContactWindow />,
        }[windowState.component];
        return (
          <Window key={windowState.id} windowState={windowState}>
            {content}
          </Window>
        );
      })}
    </>
  );
}

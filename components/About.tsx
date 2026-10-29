import { founder, teamNote } from "@/lib/data";
import FounderAvatar from "./FounderAvatar";

const values = [
  { title: "You own everything", text: "Source code, data and accounts stay in your name." },
  { title: "Security from day one", text: "Every build is reviewed by our security team before launch." },
  { title: "Custom, never templated", text: "Every product is designed and coded for its purpose." },
];

export default function About() {
  return (
    <section className="section section-alt" id="about">
      <div className="wrap about-grid">
        <div className="about-copy">
          <h2>Built by engineers who ship.</h2>
          <p>
            Deventeck brings together AI engineers, security specialists, game developers and designers who believe great
            software should be smart, safe and enjoyable to use.
          </p>
          <p>We work as an extension of your team: clear scopes, honest timelines and a working demo at every milestone.</p>
          <ul className="values">
            {values.map((v) => (
              <li key={v.title}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <div>
                  <strong>{v.title}</strong>
                  <span>{v.text}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <article className="founder" aria-label="Founder">
          <div className="founder-top">
            <FounderAvatar photo={founder.photo} name={founder.name} initials={founder.initials} />
            <div>
              <h3>{founder.name}</h3>
              <p className="founder-role">{founder.role}</p>
            </div>
          </div>
          <blockquote className="founder-message">
            <p>{founder.message}</p>
          </blockquote>
          {founder.linkedin && (
            <a className="founder-link" href={founder.linkedin} target="_blank" rel="noopener noreferrer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" />
              </svg>
              Connect on LinkedIn
            </a>
          )}
          <p className="team-note">{teamNote}</p>
        </article>
      </div>
    </section>
  );
}
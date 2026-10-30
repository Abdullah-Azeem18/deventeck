import { projects, techGroups } from "@/lib/data";
import TiltOnScroll from "./TiltOnScroll";
import TechArt from "./TechArt";

export default function Work() {
  const groups = techGroups
    .map((g) => ({ ...g, count: projects.filter((p) => p.group === g.key).length }));

  return (
    <section className="section work-section" id="work">
      <div className="wrap">
        <div className="section-head">
          <h2>Selected work.</h2>
          <p>Pick a technology to see the projects we have built with it.</p>
        </div>
        <div className="tech-tiles">
          {groups.map((g, i) => (
            <TiltOnScroll key={g.key} direction={i % 2 === 0 ? 1 : -1} className="tech-tile">
              <div className="tech-tile-copy">
                <h3>{g.title}</h3>
                <p className="tech-tile-sub">{g.subtitle}</p>
                <p className="tech-tile-text">{g.text}</p>
                {g.count > 0 ? (
                  <a className="btn btn-ghost" href={`/work/${g.slug}`}>
                    View projects
                  </a>
                ) : (
                  <a className="btn btn-ghost" href="/#contact">
                    Discuss a project
                  </a>
                )}
              </div>
              <a className="tech-art-link" href={g.count > 0 ? `/work/${g.slug}` : "/#contact"} tabIndex={-1}>
                <TechArt group={g.key} title={g.title} tools={g.tools} />
              </a>
            </TiltOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
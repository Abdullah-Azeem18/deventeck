import { processSteps } from "@/lib/data";

export default function Process() {
  return (
    <section className="section section-alt" id="process">
      <div className="wrap">
        <div className="section-head">
          <h2>How a project moves.</h2>
          <p>Every engagement follows the same five steps, so you always know what is happening and what comes next.</p>
        </div>
        <ol className="process">
          {processSteps.map((s) => (
            <li key={s.title}>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

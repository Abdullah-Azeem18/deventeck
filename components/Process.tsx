import { processSteps } from "@/lib/data";
import ScrollReveal from "./ScrollReveal";
import ProcessSteps from "./ProcessSteps";

export default function Process() {
  return (
    <section className="section section-alt" id="process">
      <ScrollReveal className="wrap">
        <div className="section-head" data-reveal>
          <h2>How a project moves.</h2>
          <p>Every engagement follows the same five steps, so you always know what is happening and what comes next.</p>
        </div>
        <ProcessSteps steps={processSteps} />
      </ScrollReveal>
    </section>
  );
}
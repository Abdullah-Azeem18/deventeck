import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CareersForm from "@/components/CareersForm";
import JobCard from "@/components/JobCard";
import { applicationRoles, careersPerks, contact, jobs } from "@/lib/data";

export const metadata: Metadata = {
  title: "Careers | Deventeck",
  description: "Join Deventeck and work on AI, cybersecurity, games, software and design projects. See open roles and apply online.",
  alternates: { canonical: "/careers" },
};

export default function CareersPage() {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <section className="section careers-hero">
          <div className="wrap">
            <p className="eyebrow">Careers</p>
            <h1>Build what&apos;s next with us.</h1>
            <p className="careers-lede">
              We&apos;re a studio for AI, cybersecurity, games, software and design. If you like solving real problems and
              shipping work you&apos;re proud of, we&apos;d like to hear from you.
            </p>
            <ul className="perks">
              {careersPerks.map((p) => (
                <li key={p.title}>
                  <h2>{p.title}</h2>
                  <p>{p.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section careers-roles" aria-labelledby="roles-title">
          <div className="wrap">
            <div className="section-head">
              <h2 id="roles-title">Open positions.</h2>
              <p>
                {jobs.length
                  ? "Pick a role below, or send a general application if none fits yet."
                  : "We don't have open roles right now, but we're always glad to meet talented people."}
              </p>
            </div>

            {jobs.length > 0 ? (
              <>
                <p className="jobs-count">
                  <span className="jobs-pulse" aria-hidden="true" />
                  {jobs.length} open {jobs.length === 1 ? "role" : "roles"}
                </p>
                <ul className="jobs">
                  {jobs.map((j) => (
                    <JobCard job={j} key={j.slug} />
                  ))}
                </ul>
              </>
            ) : (
              <div className="jobs-empty">
                <p>
                  <strong>No open positions at the moment.</strong> Send us your CV with the form below and we&apos;ll reach
                  out when a role that fits you opens up.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="section" id="apply" aria-labelledby="apply-title">
          <div className="wrap">
            <div className="contact-panel apply-panel">
              <div className="contact-info">
                <p className="eyebrow">Apply</p>
                <h2 id="apply-title">Send your application.</h2>
                <p className="contact-lede">
                  Tell us a little about yourself and attach your CV. A real person reviews every application.
                </p>
                <ol className="next-steps" aria-label="What happens after you apply">
                  <li>
                    <span className="next-num">1</span>
                    <div>
                      <strong>We review your CV</strong>
                      <span>Every application is read by the team.</span>
                    </div>
                  </li>
                  <li>
                    <span className="next-num">2</span>
                    <div>
                      <strong>A short conversation</strong>
                      <span>If it&apos;s a fit, we set up a call.</span>
                    </div>
                  </li>
                  <li>
                    <span className="next-num">3</span>
                    <div>
                      <strong>Next steps</strong>
                      <span>We&apos;ll be clear about the process and timeline.</span>
                    </div>
                  </li>
                </ol>
                <p className="apply-alt">
                  Prefer email? Send your CV to <a href={`mailto:${contact.email}`}>{contact.email}</a>.
                </p>
              </div>
              <div className="contact-form-wrap">
                <CareersForm roles={applicationRoles()} />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
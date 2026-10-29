import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";
import ProjectCard from "@/components/ProjectCard";
import { projects, techGroups } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return techGroups.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const group = techGroups.find((g) => g.slug === slug);
  if (!group) return {};
  return {
    title: `${group.title} projects | Deventeck`,
    description: group.text,
  };
}

export default async function TechPage({ params }: Props) {
  const { slug } = await params;
  const group = techGroups.find((g) => g.slug === slug);
  if (!group) notFound();
  const items = projects.filter((p) => p.group === group.key);

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <section className="section tech-page">
          <div className="wrap">
            <a className="back-link" href="/#work">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              All work
            </a>
            <div className="tech-page-head">
              <h1>{group.title}</h1>
              <p>{group.text}</p>
            </div>
            {items.length > 0 ? (
              <ul className="work-grid">
                {items.map((p) => (
                  <ProjectCard p={p} key={p.name} />
                ))}
              </ul>
            ) : (
              <div className="tech-empty">
                <p>Have a project like this in mind? Tell us about it and we will reply within one business day.</p>
                <a className="btn btn-primary" href="#contact">
                  Start a project
                </a>
              </div>
            )}
          </div>
        </section>
        <Contact />
      </main>
      <Footer />
    </>
  );
}
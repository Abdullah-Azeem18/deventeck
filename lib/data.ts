export type ServiceKey = "ai" | "cyber" | "games" | "dev" | "ux";

export type Service = {
  key: ServiceKey;
  short: string;
  title: string;
  description: string;
  orbitNote: string;
  tags: string[];
};

export const services: Service[] = [
  {
    key: "ai",
    short: "AI",
    title: "Artificial intelligence",
    description:
      "AI agents, chatbots, recommendation engines and workflow automation, built on your own data and connected to the tools you already use.",
    orbitNote: "Artificial intelligence: agents, chatbots and automation.",
    tags: ["LLM apps", "AI agents", "Computer vision", "Automation"],
  },
  {
    key: "cyber",
    short: "Cybersecurity",
    title: "Cybersecurity",
    description:
      "Penetration testing, security audits and hardening, so your product, your users and your data stay protected before and after launch.",
    orbitNote: "Cybersecurity: audits, penetration testing and hardening.",
    tags: ["Penetration testing", "Security audits", "Secure architecture"],
  },
  {
    key: "games",
    short: "Games",
    title: "Game development",
    description:
      "2D, 3D and browser games, from playable prototype to published title, built in Unity, Unreal and WebGL.",
    orbitNote: "Game development: Unity, Unreal and WebGL games.",
    tags: ["Unity", "Unreal", "WebGL", "Mobile games"],
  },
  {
    key: "dev",
    short: "Development",
    title: "Software & web development",
    description:
      "Custom-coded web platforms, mobile apps, marketplaces and SaaS products, engineered to scale with your business.",
    orbitNote: "Software & web development: platforms, apps and SaaS.",
    tags: ["Web apps", "Mobile apps", "SaaS", "Payments"],
  },
  {
    key: "ux",
    short: "UI/UX",
    title: "UI/UX design",
    description:
      "Research, wireframes, prototypes and polished interfaces that make complex products feel simple to use.",
    orbitNote: "UI/UX design: research, prototypes and interfaces.",
    tags: ["User research", "Wireframes", "Prototypes", "Design systems"],
  },
];

export const processSteps = [
  { title: "Discover", text: "We learn your goals, users and constraints, and agree on a clear scope." },
  { title: "Design", text: "Wireframes and interfaces you can click through before any code is written." },
  { title: "Build", text: "Custom code shipped in milestones, with a working demo at every step." },
  { title: "Secure", text: "Security testing and hardening before anything goes live." },
  { title: "Launch & support", text: "Deployment, monitoring and ongoing improvements after release." },
];

export type ProjectKind = "ai" | "cyber" | "games" | "web";

export type TechGroupKey = "nextjs" | "wordpress" | "ai" | "cyber" | "games" | "ux";

export type TechGroup = {
  key: TechGroupKey;
  slug: string; // page address: /work/<slug>
  title: string;
  subtitle: string;
  text: string;
  tools: string[]; // shown on the artwork
};

// Each technology gets a tile on the homepage and its own page listing its projects, in this order.
export const techGroups: TechGroup[] = [
  {
    key: "nextjs",
    slug: "nextjs-react",
    title: "Next.js & React",
    subtitle: "Development",
    text: "Custom-coded websites and web apps, built for speed, interactivity and room to grow.",
    tools: ["Next.js", "React", "TypeScript", "Three.js"],
  },
  {
    key: "wordpress",
    slug: "wordpress",
    title: "WordPress",
    subtitle: "Websites",
    text: "Business websites your team can update on its own, without touching code.",
    tools: ["WordPress", "Elementor", "ElementsKit", "Site Kit"],
  },
  {
    key: "ai",
    slug: "ai-automation",
    title: "AI & Automation",
    subtitle: "Engineering",
    text: "Chatbots, AI agents and automated workflows built on your own data and tools.",
    tools: ["Python", "LLM APIs", "LangChain", "Computer vision"],
  },
  {
    key: "cyber",
    slug: "cybersecurity",
    title: "Cybersecurity",
    subtitle: "Testing & hardening",
    text: "Security audits, penetration testing and monitoring that keep your product and users safe.",
    tools: ["Penetration testing", "Burp Suite", "Kali Linux", "Wazuh"],
  },
  {
    key: "games",
    slug: "game-development",
    title: "Game development",
    subtitle: "2D, 3D & web",
    text: "Playable prototypes to published titles, for mobile, desktop and the browser.",
    tools: ["Unity", "Unreal Engine", "C#", "WebGL"],
  },
  {
    key: "ux",
    slug: "ui-ux-design",
    title: "UI/UX design",
    subtitle: "Product design",
    text: "Research, wireframes and polished interfaces that make complex products simple to use.",
    tools: ["Figma", "Prototyping", "Design systems", "User research"],
  },
];

export type Project = {
  name: string;
  group: TechGroupKey; // which technology panel it appears in
  kind: ProjectKind; // picks the icon
  category: string;
  year?: string; // leave out to hide
  summary: string;
  highlights: string[];
  stack: string[];
  link?: string; // live site or case study; leave out to hide the button
  logo?: string; // logo or screenshot in public/, e.g. "/work/soc-pulse.jpg"; shown at the top of the card (16:9)
  status?: string; // e.g. "In progress"; shown as a badge
};

export const projects: Project[] = [
  {
    name: "Deventeck website",
    group: "nextjs",
    kind: "web",
    category: "Web development & UI/UX",
    year: "2026",
    summary: "Our own company website, designed and built from scratch.",
    highlights: [
      "Interactive 3D scene you can drag to rotate",
      "Light and dark themes that remember your choice",
      "Contact form with server-side validation and email delivery",
    ],
    stack: ["Next.js 15", "React 19", "TypeScript", "Three.js", "Resend"],
  },
  {
    name: "BrandSocia",
    group: "nextjs",
    kind: "web",
    category: "Agency website",
    summary:
      "Website for a Karachi digital marketing and branding agency, presenting its services, portfolio and blog, with a separate ads landing page for lead generation.",
    highlights: [
      "Hero slider with video and animated service showcases",
      "Services, portfolio and blog, each with its own detail pages",
      "Dedicated ads funnel page for lead generation campaigns",
    ],
    stack: ["Next.js", "React", "Cloudflare"],
    link: "https://brandsocia.com",
  },
  {
    name: "Tax Filerz & Co.",
    group: "wordpress",
    kind: "web",
    category: "WordPress website",
    summary: "Website for a Karachi tax and accounting firm offering tax filing, registrations and accounting services.",
    highlights: [
      "Multi-level menu that organises dozens of service pages",
      "Tax calculator page and a blog for tax updates",
      "WhatsApp chat button and Google Site Kit analytics",
    ],
    stack: ["WordPress", "Elementor", "Google Site Kit", "WhatsApp chat"],
    link: "https://taxfilerz.com",
    logo: "/work/taxfilerz.jpg",
  },
  {
    name: "Rays Medical World",
    group: "wordpress",
    kind: "web",
    category: "WordPress website",
    summary: "Website for a Karachi supplier of new and refurbished medical imaging equipment.",
    highlights: [
      "Quick-contact popup and quote request form",
      "Book-a-visit page for facility consultations",
      "FAQ accordion and WhatsApp chat button",
    ],
    stack: ["WordPress", "Elementor", "ElementsKit"],
    link: "https://raysmedicalworld.com",
    logo: "/work/rays.jpg",
  },
  {
    name: "Al-Hamd Traders",
    group: "wordpress",
    kind: "web",
    category: "Engineering company website",
    summary:
      "Website for a Lahore HVAC and MEP engineering contractor serving restaurants, hotels, banks and commercial buildings across Pakistan.",
    highlights: [
      "Service pages for HVAC installation, AC repair, maintenance and complete MEP contracting",
      "Client logo showcase, project gallery and featured videos",
      "Step-by-step process, FAQ section, quote requests and cookie consent",
    ],
    stack: ["WordPress", "Elementor", "GS Logo Slider", "CookieAdmin"],
    link: "https://alhamdtraders.com",
    logo: "/work/alhamd.jpg",
  },
  {
    name: "AegisGuard",
    group: "cyber",
    kind: "cyber",
    category: "Cybersecurity SaaS",
    summary:
      "Attack surface management platform that lets teams see their network the way an attacker does, with a React front end and a Python Flask back end.",
    highlights: [
      "Presents continuous reconnaissance, automated vulnerability scanning and threat intelligence in one command center",
      "Pricing plans with sign-in and get-started flows",
      "Dark, security-focused interface with glowing accents",
    ],
    stack: ["React", "Python", "Flask", "Cloudflare Pages"],
    link: "https://main.aegisguard.pages.dev",
    logo: "/work/aegisguard.jpg",
  },
  {
    name: "SOC Pulse",
    group: "cyber",
    kind: "cyber",
    category: "Cybersecurity & AI",
    status: "In progress",
    summary:
      "An automated alert management system for Security Operations Center (L1) teams, turning raw SIEM alerts into triaged incidents.",
    highlights: [
      "Works with any SIEM: alerts are normalised into one schema and grouped into incidents",
      "A locally hosted LLM decides to escalate, auto-respond or dismiss, and sends uncertain cases to a human",
      "Reversible auto-response, prompt-injection defence and shift handover reports",
    ],
    stack: ["Python", "FastAPI", "Mistral 7B (Ollama)", "Wazuh", "Redis", "PostgreSQL", "React", "Docker"],
    logo: "/work/soc-pulse.jpg",
  },
];

export const founder = {
  name: "Abdullah Azeem",
  initials: "AA",
  role: "Founder & CEO",
  message:
    "I started Deventeck to give businesses a technology partner that cares about their product as much as they do. Every project starts with listening, moves on a clear plan with honest timelines, and doesn't end at launch. When you work with Deventeck, you work with me directly.",
  linkedin: "https://www.linkedin.com/in/abdullahazeem472",
  // To use a photo: put it in the public/ folder (e.g. public/abdullah.jpg) and set photo: "/abdullah.jpg"
  photo: "/abdullah.png",
};

export const teamNote =
  "Every client works directly with the people who plan, design and build their product. No middlemen, no handoffs, no lost details.";

export const contact = {
  email: "support@deventeck.site",
  phoneDisplay: "+92 316 8733356",
  phoneHref: "tel:+923168733356",
  socials: {
    linkedin: "https://www.linkedin.com/company/deventeck",
    github: "https://github.com/Deventeck",
    instagram: "#",
    x: "#",
  },
};

export const serviceOptions = [...services.map((s) => s.title), "Not sure yet"];
export const budgetOptions = ["Under $1,000", "$1,000 – $5,000", "$5,000 – $20,000", "$20,000+"];

// ----- Careers (/careers) -----

export type JobIcon = "bidding" | "sales" | "code" | "design" | "shield" | "ai" | "briefcase";

export type Job = {
  slug: string; // unique id, e.g. "frontend-developer"; the role's link is /careers#slug
  title: string;
  department: string; // e.g. "Business development", "Engineering"
  icon?: JobIcon;
  posted?: string; // date posted, "YYYY-MM-DD"; roles from the last 14 days get a "New" badge
  type: string; // e.g. "Full-time", "Part-time", "Internship"
  location: string; // e.g. "Remote", "Karachi (on-site)", "Hybrid"
  summary: string;
  responsibilities: string[];
  requirements: string[];
};

// Add a role here when you're hiring; remove it when the position is filled.
// With no roles listed, the page still accepts general applications (CVs).
export const jobs: Job[] = [
  {
    slug: "business-developer-bidding",
    title: "Business Developer (Bidding)",
    department: "Business development",
    icon: "bidding",
    posted: "2026-11-01",
    type: "Full-time",
    location: "Karachi or Remote",
    summary:
      "Find and win projects for Deventeck on Upwork, Freelancer, Fiverr and LinkedIn by writing proposals that clients actually reply to.",
    responsibilities: [
      "Search bidding platforms and LinkedIn every day for projects that match our services: web and software development, AI, cybersecurity, games and UI/UX design",
      "Write a tailored proposal for each project, built around the client's brief rather than a copy-paste template",
      "Read technical briefs, ask clients the right questions, and work with our developers on estimates and timelines",
      "Follow up with leads and keep conversations moving until the contract starts",
      "Keep our platform profiles, portfolio and case studies up to date",
      "Track bids, replies and wins, and share a short weekly report on what is working",
    ],
    requirements: [
      "At least 1 year of bidding on Upwork, Freelancer or Fiverr, with projects you have won",
      "Excellent written English: clear, professional and persuasive",
      "Enough technical understanding to read software briefs (website, web app, API, UI/UX)",
      "Organised and consistent, and comfortable working towards targets",
      "Bonus: experience bidding for an IT or software agency",
    ],
  },
  {
    slug: "sales-executive",
    title: "Sales Executive",
    department: "Sales",
    icon: "sales",
    posted: "2026-11-01",
    type: "Full-time",
    location: "Karachi or Remote",
    summary:
      "Bring in new clients for Deventeck: reach out to businesses, understand what they need, and turn conversations into signed projects.",
    responsibilities: [
      "Find and contact potential clients through LinkedIn, email and calls",
      "Run discovery calls to understand each client's goals and match them to the right service",
      "Prepare proposals, quotes and presentations together with the team",
      "Manage your pipeline from first contact to signed deal, with timely follow-ups",
      "Keep client records and deal notes up to date",
      "Build long-term relationships so clients return and refer others",
    ],
    requirements: [
      "1 to 2 years in sales or business development, ideally for an IT or software company",
      "Confident spoken and written English; Urdu is a plus for local clients",
      "Comfortable leading calls and video meetings with local and international clients",
      "Able to explain technical services in simple, non-technical terms",
      "Self-driven, target-oriented and strong at follow-up",
      "Bonus: experience with LinkedIn Sales Navigator or a CRM",
    ],
  },
  // {
  //   slug: "frontend-developer",
  //   title: "Frontend Developer (Next.js)",
  //   department: "Engineering",
  //   icon: "code",
  //   posted: "2026-12-01",
  //   type: "Full-time",
  //   location: "Remote",
  //   summary: "Build fast, polished websites and web apps for our clients with Next.js and React.",
  //   responsibilities: ["Build pages and components from designs", "Work with the team on client projects"],
  //   requirements: ["1+ year with React or Next.js", "Good eye for detail and design"],
  // },
];

export const careersPerks = [
  { title: "Real client projects", text: "Work on products that ship and get used, not practice exercises." },
  { title: "Many disciplines", text: "Learn alongside people working in AI, security, games, software and design." },
  { title: "Grow with us", text: "Take on more responsibility as you grow, with direct feedback along the way." },
];

export const applicationRoles = () => [...jobs.map((j) => j.title), "General application"];
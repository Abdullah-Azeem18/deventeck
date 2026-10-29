import type { Metadata, Viewport } from "next";
import { Unbounded, Manrope } from "next/font/google";
import "./globals.css";

const display = Unbounded({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const body = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Deventeck | AI, Cybersecurity, Games, Software & UI/UX",
  description:
    "Deventeck builds AI products, secures systems, develops games and custom software, and designs interfaces. One team from first sketch to launch.",
  openGraph: {
    title: "Deventeck",
    description: "AI, cybersecurity, game development, custom software and UI/UX design.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F3F4FA" },
    { media: "(prefers-color-scheme: dark)", color: "#080C1F" },
  ],
};

// Applies the saved theme before paint so there is no flash.
const themeScript = `try{var t=localStorage.getItem("dvt-theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

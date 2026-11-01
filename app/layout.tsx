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
  metadataBase: new URL("https://www.deventeck.site"),
  title: "Deventeck | AI, Cybersecurity, Games, Software & UI/UX",
  description:
    "Deventeck builds AI products, secures systems, develops games and custom software, and designs interfaces. One team from first sketch to launch.",
  openGraph: {
    title: "Deventeck",
    description: "AI, cybersecurity, game development, custom software and UI/UX design.",
    type: "website",
    url: "/",
    siteName: "Deventeck",
  },
  twitter: {
    card: "summary_large_image",
    title: "Deventeck",
    description: "AI, cybersecurity, game development, custom software and UI/UX design.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#080C1F", // dark by default
};

// The site opens in dark mode for everyone. If a visitor switched to light with the
// toggle, their choice is remembered and applied before paint, so there is no flash.
const themeScript = `try{var t=localStorage.getItem("dvt-theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
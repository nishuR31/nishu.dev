import { Outfit } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import GridPattern from "@/components/ui/grid-pattern";
import { cn } from "@/lib/utils";
import AppEnhancements from "@/components/Providers/AppEnhancements";
import SonnerToaster from "@/components/Providers/SonnerToaster";
import PageTopLoader from "@/components/Providers/PageTopLoader";
import Header from "@/components/layout/Header/ServerHeader";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/reduxProvider";
import ServerAssistant from "@/components/features/home/ServerAssistant";

import { getPortfolioData } from "@/lib/portfolio";
import MaintenanceOverlay from "@/components/ui/maintenance-overlay";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export async function generateMetadata() {
  let siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nishudevportfolio.vercel.app";
  let siteName = "Nishan Portfolio";
  try {
    const portfolio = await getPortfolioData();
    if (portfolio?.siteName && portfolio.siteName !== "nishudevportfolio") {
      siteUrl = portfolio.siteName.startsWith("http") ? portfolio.siteName : `https://${portfolio.siteName}`;
      siteName = portfolio.name + " Portfolio";
    }
  } catch (e) {}

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: "Nishan Rajak | Backend Engineer Portfolio",
      template: "%s | Nishan Rajak",
    },
    description: "Portfolio of Nishan Rajak — backend-focused software engineering student building scalable APIs, authentication systems, and modular backend architectures.",
    keywords: [
      "Nishan Rajak", "backend developer", "Node.js", "Express", "REST API", "JWT authentication", "MongoDB", "software engineering student",
    ],
    authors: [
      { name: "Nishan Rajak", url: siteUrl },
    ],
    creator: "Nishan Rajak",
    publisher: "Nishan Rajak",
    applicationName: siteName,
    category: "technology",
    referrer: "origin-when-cross-origin",
    formatDetection: {
      email: true,
      address: false,
      telephone: true,
    },
    openGraph: {
      title: "Nishan Rajak | Backend Engineer Portfolio",
      description: "Portfolio of Nishan Rajak — backend-focused software engineering student.",
      url: siteUrl,
      siteName: siteName,
      type: "website",
      images: [
        {
          url: "/homepage.avif",
          width: 1200,
          height: 630,
          alt: "Homepage preview - Nishan Rajak Portfolio",
        },
      ],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: "Nishan Rajak | Backend Developer",
      description: "Backend-focused software engineering student building scalable APIs.",
      images: ["/homepage.avif"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export const viewport = {
  themeColor: "#000000",
};

export default async function RootLayout({ children }) {
  let siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nishudevportfolio.vercel.app";
  try {
    const portfolio = await getPortfolioData();
    if (portfolio?.siteName && portfolio.siteName !== "nishudevportfolio") {
      siteUrl = portfolio.siteName.startsWith("http") ? portfolio.siteName : `https://${portfolio.siteName}`;
    }
  } catch(e) {}
  const result = await getPortfolioData();
  const maintenanceMode = result.ok ? result.data?.maintenanceMode : false;
  const developer = { name: "Nishan Rajak", email: "nishan.developer.dev@gmail.com" };
  const social = { github: "nishuR31", linkedin: "nishan-rajak" };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="google-site-verification"
          content="rSkqz8nCSpNx7J3ztnKib9-KKI6qcCWQzM0Suz2Qa2I"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Blocking theme script: sets dark/light class before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var resolved=t==='light'||t==='dark'?t:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.classList.add(resolved);}catch(e){}})();`,
          }}
        />
        <link rel="preconnect" href="https://api.github.com" crossOrigin="anonymous" />
        
        <style
          dangerouslySetInnerHTML={{
            __html:
              ".hero-title{font-size:28px;line-height:1.05;margin:0 0 8px}.hero-subtitle{font-size:16px;margin:0}.hero-portrait-wrap{min-height:200px}.container{padding-left:1.5rem;padding-right:1.5rem}@media(min-width:768px){.hero-title{font-size:56px}.hero-subtitle{font-size:24px}}",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Person",
                  "@id": `${siteUrl}/#person`,
                  name: developer.name,
                  url: siteUrl,
                  email: developer.email,
                  jobTitle: "Backend Developer",
                  image: `${siteUrl}/logo.avif`,
                  sameAs: [
                    `https://github.com/${social.github}`,
                    `https://linkedin.com/in/${social.linkedin}`,
                  ],
                },
                {
                  "@type": "WebSite",
                  "@id": `${siteUrl}/#website`,
                  name: developer.name + " Portfolio",
                  url: siteUrl,
                  publisher: {
                    "@id": `${siteUrl}/#person`,
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body className={`${geistSans.className} ${outfit.variable} antialiased`}>
        <Providers>
          {maintenanceMode ? (
            <MaintenanceOverlay active={true} />
          ) : (
            <>
              <AppEnhancements />
              <PageTopLoader />
              <Header />
              <main id="main">{children}</main>
              <ServerAssistant />
              <Footer />
              <SonnerToaster />
              <GridPattern
                width={200}
                height={200}
                x={-1}
                y={-1}
                className={cn(
                  "[mask-image:linear-gradient(to_bottom,white,transparent)]"
                )}
              />
            </>
          )}
        </Providers>
      </body>
    </html>
  );
}

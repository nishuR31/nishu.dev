import localFont from "next/font/local";
import "./globals.css";
import "./portfolio.css";
import SonnerToaster from "@/components/Providers/SonnerToaster";
import PageTopLoader from "@/components/Providers/PageTopLoader";
import Header from "@/components/layout/Header/ServerHeader";
import Footer from "@/components/layout/Footer";
import ThemeController from "@/components/Providers/ThemeController";
import Providers from "@/components/reduxProvider";
import ServerAssistant from "@/components/features/home/ServerAssistant";

import { getPortfolioData, PORTFOLIO_REVALIDATE_SECONDS } from "@/lib/portfolio";
import { withUsableImages } from "@/lib/project-images-server";
import MaintenanceOverlay from "@/components/ui/maintenance-overlay";

export const revalidate = PORTFOLIO_REVALIDATE_SECONDS;

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});

export async function generateMetadata() {
  let siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nishudevportfolio.vercel.app";
  let siteName = "Nishan Portfolio";
  try {
    const portfolio = await getPortfolioData();
    if (
      portfolio.ok &&
      portfolio.data?.siteName &&
      portfolio.data.siteName !== "nishudevportfolio"
    ) {
      siteUrl = portfolio.data.siteName.startsWith("http")
        ? portfolio.data.siteName
        : `https://${portfolio.data.siteName}`;
      siteName = portfolio.data.developer.name + " Portfolio";
    }
  } catch (e) {}

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: "Nishan Rajak | Backend Engineer Portfolio",
      template: "%s | Nishan Rajak",
    },
    description:
      "Portfolio of Nishan Rajak — backend-focused software engineering student building scalable APIs, authentication systems, and modular backend architectures.",
    keywords: [
      "Nishan Rajak",
      "backend developer",
      "Node.js",
      "Express",
      "REST API",
      "JWT authentication",
      "MongoDB",
      "software engineering student",
    ],
    authors: [{ name: "Nishan Rajak", url: siteUrl }],
    creator: "Nishan Rajak",
    publisher: "Nishan Rajak",
    applicationName: siteName,
    category: "technology",
    referrer: "origin-when-cross-origin",
    formatDetection: {
      email: true,
      address: true,
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
    alternates: {
      canonical: siteUrl,
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
  themeColor: "#111210",
};

export default async function RootLayout({ children }) {
  let siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nishudevportfolio.vercel.app";
  const result = await getPortfolioData();
  const portfolioData = result.ok ? result.data : {};
  if (
    portfolioData?.siteName &&
    portfolioData.siteName !== "nishudevportfolio"
  ) {
    siteUrl = portfolioData.siteName.startsWith("http")
      ? portfolioData.siteName
      : `https://${portfolioData.siteName}`;
  }

  const maintenanceMode = portfolioData?.maintenanceMode || false;
  // Never hydrate the client store with dead local image paths.
  const initialData = result.ok
    ? {
        ...portfolioData,
        projects: Array.isArray(portfolioData?.projects)
          ? portfolioData.projects.map((p) => withUsableImages(p))
          : portfolioData?.projects,
      }
    : undefined;
  const developer = portfolioData?.developer || {
    name: "Nishan Rajak",
    shortName: "Nishu",
    role: "Backend-Focused Software Engineering Student",
    bio: "Software engineering student focused on backend systems, scalable APIs, distributed systems, and production software engineering.",
    email: "nishan.developer.dev@gmail.com",
  };
  const rawSocial = portfolioData?.social || {};

  const formatUrl = (val, base) => {
    if (!val || val === "#") return null;
    return val.startsWith("http") ? val : `${base}${val}`;
  };

  const sameAsProfiles = [
    formatUrl(rawSocial.github || "nishuR31", "https://github.com/"),
    formatUrl(rawSocial.linkedin || "nishan-rajak-98b2ab3b8", "https://linkedin.com/in/"),
    formatUrl(rawSocial.leetcode || "nishanr_19", "https://leetcode.com/u/"),
    formatUrl(rawSocial.twitter || "nishuR31", "https://x.com/"),
    formatUrl(rawSocial.hackerone || "nishur", "https://hackerone.com/"),
  ].filter(Boolean);

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${siteUrl}/#profilepage`,
        url: siteUrl,
        name: `${developer.name || "Nishan Rajak"} | Backend Engineer Portfolio`,
        isPartOf: {
          "@id": `${siteUrl}/#website`,
        },
        mainEntity: {
          "@id": `${siteUrl}/#person`,
        },
      },
      {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: developer.name || "Nishan Rajak",
        alternateName: [developer.shortName || "Nishu", "nishuR31"].filter(Boolean),
        url: siteUrl,
        jobTitle: developer.role || "Backend-focused Software Engineer",
        description:
          developer.bio ||
          "Software engineering student focused on backend systems, scalable APIs, distributed systems, and production software engineering.",
        image: `${siteUrl}/logo.avif`,
        email: developer.email || "nishan.developer.dev@gmail.com",
        sameAs: sameAsProfiles,
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: `${developer.name || "Nishan Rajak"} Portfolio`,
        url: siteUrl,
        publisher: {
          "@id": `${siteUrl}/#person`,
        },
      },
    ],
  };

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t='dark';try{var s=localStorage.getItem('theme');if(s==='dark'||s==='light'||s==='system')t=s}catch(e){}var r=t==='system'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):t;document.documentElement.className=r;document.documentElement.style.colorScheme=r})()`,
          }}
        />
        <meta
          name="google-site-verification"
          content="rSkqz8nCSpNx7J3ztnKib9-KKI6qcCWQzM0Suz2Qa2I"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body className={`${geistSans.className} ${geistSans.variable} antialiased`}>
        <Providers initialData={initialData}>
          <ThemeController />
          {maintenanceMode ? (
            <MaintenanceOverlay active={true} />
          ) : (
            <>
              <PageTopLoader />
              <Header />
              <a className="skip-link" href="#main">
                Skip to content
              </a>
              <main id="main">{children}</main>
              <ServerAssistant />
              <Footer />
              <SonnerToaster />
            </>
          )}
        </Providers>
      </body>
    </html>
  );
}

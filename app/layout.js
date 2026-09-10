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

import { getPortfolioData } from "@/lib/portfolio";
import MaintenanceOverlay from "@/components/ui/maintenance-overlay";

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
  themeColor: "#111210",
};

export default async function RootLayout({ children }) {
  let siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nishudevportfolio.vercel.app";
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
    }
  } catch (e) {}
  const result = await getPortfolioData();
  const maintenanceMode = result.ok ? result.data?.maintenanceMode : false;
  const developer = result.ok
    ? result.data.developer
    : { name: "Nishan Rajak", email: "nishan.developer.dev@gmail.com" };
  const social = { github: "nishuR31", linkedin: "nishan-rajak-98b2ab3b8" };

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
            }).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body className={`${geistSans.className} ${geistSans.variable} antialiased`}>
        <Providers initialData={result.ok ? result.data : undefined}>
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

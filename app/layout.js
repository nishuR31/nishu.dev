

import localFont from "next/font/local";
import "./globals.css";
import GridPattern from "@/components/ui/grid-pattern";
import { cn } from "@/lib/utils";
import AppEnhancements from "@/components/Providers/AppEnhancements";
import SonnerToaster from "@/components/Providers/SonnerToaster";
import PageTopLoader from "@/components/Providers/PageTopLoader";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "@/components/reduxProvider";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_FRONTEND_URL || "https://nishudevportfolio.vercel.app"),
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
  authors: [
    { name: "Nishan Rajak", url: "https://nishudevportfolio.vercel.app" },
  ],
  creator: "Nishan Rajak",
  publisher: "Nishan Rajak",
  applicationName: "Nishan Portfolio",
  category: "technology",

  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: true,
    address: false,
    telephone: true,
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
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Nishan Rajak | Backend Engineer Portfolio",
    description:
      "Explore backend engineering projects, API architecture work, and software engineering experience by Nishan Rajak.",
    url: "https://nishudevportfolio.vercel.app",
    siteName: "Nishan Portfolio",
    type: "website",
    images: [
      {
        url: "/homepage.avif",
        width: 1200,
        height: 630,
        alt: "Homepage preview - Nishan Rajak Portfolio",
      },
      {
        url: "/logo.avif",
        width: 1200,
        height: 630,
        alt: "Nishan Rajak Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nishan Rajak | Backend Engineer Portfolio",
    description:
      "Backend-focused portfolio with projects, experience, and interactive UI by Nishan Rajak.",
    images: ["/homepage.avif", "/logo.avif"],
    creator: "@nishuR31",
  },
  icons: {
    icon: "/logo.avif",
    shortcut: "/logo.avif",
    apple: "/logo.avif",
  },
};

export const viewport = {
  themeColor: "#000000",
};

export default async function RootLayout({ children }) {
  let portfolioData = null;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/portfolio`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      portfolioData = data?.data || data;
    }
  } catch (error) {
    console.error("Failed to fetch portfolio data for layout", error);
  }

  const developer = portfolioData?.developer ?? {};
  const social = portfolioData?.social ?? {};
  return (
    <html lang="en" suppressHydrationWarning >
      <head>
        <meta
          name="google-site-verification"
          content="rSkqz8nCSpNx7J3ztnKib9-KKI6qcCWQzM0Suz2Qa2I"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Google Fonts — preconnect for faster load */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        {/* Blocking theme script: sets dark/light class before first paint to avoid FOUC */}

        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var resolved=t==='light'||t==='dark'?t:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.classList.add(resolved);}catch(e){}})();`,
          }}
        />
        <link rel="preconnect" href="https://api.github.com" crossOrigin="true" />
        <link rel="preload" as="image" href="/homepage.avif" />
        <link rel="preload" as="image" href="/logo.avif" />
        <link rel="canonical" href={`${process.env.NEXT_PUBLIC_FRONTEND_URL}`} />
        <style
          dangerouslySetInnerHTML={
            {
              __html:
                ".hero-title{font-size:28px;line-height:1.05;margin:0 0 8px}.hero-subtitle{font-size:16px;margin:0}.hero-portrait-wrap{min-height:200px}.container{padding-left:1.5rem;padding-right:1.5rem}@media(min-width:768px){.hero-title{font-size:56px}.hero-subtitle{font-size:24px}}",
            }
          }
        />
        < script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Person",
                  "@id": "https://nishudevportfolio.vercel.app/#person",
                  name: developer.name,
                  url: "https://nishudevportfolio.vercel.app",
                  mainEntityOfPage: "https://nishudevportfolio.vercel.app",
                  email: developer.email,
                  jobTitle: "Backend Developer",
                  image: "https://nishudevportfolio.vercel.app/logo.avif",
                  sameAs: [
                    `https://github.com/${social.github}`,
                    `https://linkedin.com/in/${social.linkedin}`
                  ]
                },
                {
                  "@type": "WebSite",
                  "@id": "https://nishudevportfolio.vercel.app/#website",
                  name: developer.name + " Portfolio",
                  url: "https://nishudevportfolio.vercel.app",
                  publisher: {
                    "@id": "https://nishudevportfolio.vercel.app/#person"
                  }
                }
              ]
            })
          }
          }
        />
      </head>
      < body className={`${geistSans.className} antialiased`}>
        <Providers>
          <AppEnhancements />
          < PageTopLoader />
          <Header />


          < main id="main" > {children} </main>
          < Footer />
          <SonnerToaster />
          < GridPattern
            width={200}
            height={200}
            x={- 1}
            y={- 1}
            className={
              cn(
                "[mask-image:linear-gradient(to_bottom,white,transparent)]",
              )
            }
          />
        </Providers>
      </body>
    </html>
  );
};

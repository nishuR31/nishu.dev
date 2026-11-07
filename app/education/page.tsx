import { getPortfolioData } from "@/lib/portfolio";
import BackgroundEffects from "@/components/ui/background-effects";
import EducationTimeline from "@/components/features/journey/EducationTimeline";
import Link from "next/link";
import { ArrowLeft, GraduationCap } from "lucide-react";
import JourneySwitcher from "@/components/features/journey/JourneySwitcher";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Education | Nishan Rajak",
  description: "Academic background and ongoing learning journey of Nishan Rajak.",
  robots: {
    index: false,
    follow: true,
  },
};

export default async function EducationPage() {
  const result = await getPortfolioData();
  const data = result.ok ? result.data : {};
  const education = data.education ?? [];

  return (
    <div className="journey-page min-h-screen relative overflow-hidden">
      <BackgroundEffects
        variant="diagonal"
        colors={{ first: "primary", second: "secondary" }}
        intensity="8"
        blurAmount="3xl"
      />
      <main className="site-width journey-page__content">
        <Link href="/" className="back-link">
          <ArrowLeft size={16} /> Back to home
        </Link>
        <div className="journey-page__split-header">
          <header className="journey-page__header">
            <div className="journey-page__kicker">
              <GraduationCap size={16} /> ACADEMIC FOUNDATION
            </div>
            <h1>Education<span className="orange-text">.</span></h1>
            <p>
              The formal foundation behind the systems I build and the engineering practice I keep
              developing.
            </p>
          </header>
          <JourneySwitcher current="education" />
        </div>
        {data.showEducation !== false && education.length > 0 ? (
          <EducationTimeline education={education} />
        ) : (
          <p className="journey-empty">Education details are currently being updated.</p>
        )}
      </main>
    </div>
  );
}

import { getPortfolioData } from "@/lib/portfolio";
import BackgroundEffects from "@/components/ui/background-effects";
import TestimonialsSection from "@/components/features/home/TestimonialsSection";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Testimonials | Nishan Rajak",
  description: "Feedback from people and teams who have collaborated with Nishan Rajak.",
  robots: {
    index: true,
    follow: true,
  },
};

export default async function TestimonialsPage() {
  const result = await getPortfolioData();
  const data = result.ok ? result.data : {};
  const testimonials = (data.testimonials ?? []).filter((item: any) => item.visible !== false);

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
        {testimonials.length > 0 ? (
          <TestimonialsSection testimonials={testimonials} />
        ) : (
          <div className="journey-page__header">
            <p className="journey-page__kicker">WORDS FROM COLLABORATORS</p>
            <h1>Testimonials<span className="orange-text">.</span></h1>
            <p>Testimonials are being added as the work continues.</p>
          </div>
        )}
      </main>
    </div>
  );
}

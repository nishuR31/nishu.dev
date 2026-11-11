import { getPortfolioData } from "@/lib/portfolio";
import BackgroundEffects from "@/components/ui/background-effects";
import TestimonialsSection from "@/components/features/home/TestimonialsSection";
import Link from "next/link";
import { ArrowLeft, MessageSquarePlus } from "lucide-react";
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <Link href="/" className="back-link" style={{ margin: 0 }}>
            <ArrowLeft size={16} /> Back to home
          </Link>
          <Link
            href="/testimonials/submit"
            className="button button-orange"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              fontSize: "13px",
              textDecoration: "none",
            }}
          >
            <MessageSquarePlus size={15} />
            Leave a Testimonial
          </Link>
        </div>

        <TestimonialsSection testimonials={testimonials} />
      </main>
    </div>
  );
}

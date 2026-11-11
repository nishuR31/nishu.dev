import { getPortfolioData } from "@/lib/portfolio";
import { withUsableImages } from "@/lib/project-images-server";
import HeroSection from "@/components/features/home/HeroSection";
import StackStrip from "@/components/features/home/StackStrip";
import StartPage from "@/components/features/home/StartPage";
import WorkSection from "@/components/features/home/WorkSection";
import AboutSection from "@/components/features/home/About";
import CapabilitiesSection from "@/components/features/home/CapabilitiesSection";
import ExperienceSection from "@/components/features/home/Experience";
import ServicesSection from "@/components/features/home/ServicesSection";
import TestimonialsSection from "@/components/features/home/TestimonialsSection";
import ContactSection from "@/components/features/home/ContactSection";

export default async function Home() {
  const result = await getPortfolioData();
  const data = result.ok ? result.data : {};
  const developer = data.developer || {};
  const projects = (data.projects || []).map((p) => withUsableImages(p));
  const github = data.social?.github?.startsWith("http")
    ? data.social.github
    : `https://github.com/${data.social?.github || "nishuR31"}`;
  const linkedin = data.social?.linkedin?.startsWith("http")
    ? data.social.linkedin
    : `https://linkedin.com/in/${data.social?.linkedin || ""}`;

  return (
    <div className="portfolio-home">
      <StartPage />
      <HeroSection developer={developer} github={github} linkedin={linkedin} />
      <StackStrip />
      {data.showProjects !== false && <WorkSection projects={projects} />}
      {data.showAbout !== false && <AboutSection developer={developer} github={github} />}
      {data.showSkills !== false && <CapabilitiesSection />}
      {data.showExperience !== false && (
        <ExperienceSection
          experiences={data.experiences}
          showExperience={data.showExperience !== false}
        />
      )}
      {data.showServices !== false && <ServicesSection services={data.services} />}
      {data.showTestimonials !== false && <TestimonialsSection testimonials={data.testimonials} />}
      <ContactSection email={developer.email || "nishan.developer.dev@gmail.com"} />
    </div>
  );
}

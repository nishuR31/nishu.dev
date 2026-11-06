import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import ProjectCollection from "@/components/features/projects/ProjectCollection";

interface WorkSectionProps {
  projects?: any[];
}

export default function WorkSection({ projects = [] }: WorkSectionProps) {
  return (
    <section className="work-section site-width" id="work">
      <div className="section-heading">
        <div>
          <p className="eyebrow section-index">01 / SELECTED WORK</p>
          <h2>
            Built with purpose<span className="orange-text">.</span>
          </h2>
        </div>
        <Link className="text-link" href="/projects">
          All projects <ArrowUpRight size={17} />
        </Link>
      </div>
      <p className="section-description">
        Real problems, considered solutions. A selection of tools and products I’ve designed and
        developed.
      </p>
      <ProjectCollection projects={projects} compact />
    </section>
  );
}

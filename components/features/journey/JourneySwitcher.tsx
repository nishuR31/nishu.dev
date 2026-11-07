import Link from "next/link";
import { ArrowUpRight, GraduationCap, BriefcaseBusiness } from "lucide-react";

export default function JourneySwitcher({ current }: { current: "experience" | "education" }) {
  const isExperience = current === "experience";

  return (
    <aside className="journey-switcher" aria-label="Journey pages">
      <Link href={isExperience ? "/education" : "/experience"} className="journey-switcher__link">
        {isExperience ? <GraduationCap size={17} /> : <BriefcaseBusiness size={17} />}
        {isExperience ? "View education" : "View experience"}
        <ArrowUpRight size={15} />
      </Link>
    </aside>
  );
}

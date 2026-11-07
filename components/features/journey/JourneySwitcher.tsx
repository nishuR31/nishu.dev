import Link from "next/link";
import { ArrowUpRight, GraduationCap, BriefcaseBusiness } from "lucide-react";

export default function JourneySwitcher({ current }: { current: "experience" | "education" }) {
  const isExperience = current === "experience";

  return (
    <aside className="journey-switcher" aria-label="Journey pages">
      <span className="journey-switcher__label">CONTINUE THE STORY</span>
      <p>{isExperience ? "See the academic foundation behind the work." : "See where the practice is applied."}</p>
      <Link href={isExperience ? "/education" : "/experience"} className="journey-switcher__link">
        {isExperience ? <GraduationCap size={17} /> : <BriefcaseBusiness size={17} />}
        {isExperience ? "View education" : "View experience"}
        <ArrowUpRight size={15} />
      </Link>
      <Link href="/" className="journey-switcher__home">
        Back to home
      </Link>
    </aside>
  );
}

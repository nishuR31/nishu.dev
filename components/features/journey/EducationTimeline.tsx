import { Calendar, GraduationCap } from "lucide-react";

interface EducationItem {
  institution?: string;
  degree?: string;
  field?: string;
  startDate?: string | null;
  endDate?: string | null;
  grade?: string | null;
  visible?: boolean;
}

function formatYear(date?: string | null) {
  if (!date) return "";
  const year = new Date(date).getFullYear();
  return Number.isNaN(year) ? "" : String(year);
}

export default function EducationTimeline({
  education = [],
  compact = false,
}: {
  education?: EducationItem[];
  compact?: boolean;
}) {
  const visibleEducation = education.filter((item) => item.visible !== false);
  const entries = compact ? visibleEducation.slice(0, 3) : visibleEducation;

  if (entries.length === 0) return null;

  return (
    <div className={`education-timeline ${compact ? "education-timeline--compact" : ""}`}>
      {entries.map((item, index) => {
        const start = formatYear(item.startDate);
        const end = formatYear(item.endDate);
        const period = start || end ? `${start || "Earlier"} — ${end || "Present"}` : "Academic track";

        return (
          <article className="education-card" key={`${item.institution}-${item.degree}-${index}`}>
            <div className="education-card__icon" aria-hidden="true">
              <GraduationCap size={18} />
            </div>
            <div className="education-card__content">
              <div className="education-card__period">
                <Calendar size={13} />
                {period}
              </div>
              <h3>{item.degree || "Education"}</h3>
              {item.field && <p className="education-card__field">{item.field}</p>}
              <p className="education-card__institution">{item.institution}</p>
              {item.grade && <span className="education-card__grade">Grade {item.grade}</span>}
            </div>
          </article>
        );
      })}
    </div>
  );
}

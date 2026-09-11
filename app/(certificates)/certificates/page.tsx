import { ArrowUpRight, FileText, Award } from "lucide-react";
import { getPortfolioData } from "@/lib/portfolio";
export const metadata = {
  title: "Certificates",
  description: "Courses, workshops, and continued learning by Nishan Rajak.",
};
export default async function CertificatesPage() {
  const result = await getPortfolioData();
  const showCertificates = result.ok ? result.data.showCertificates !== false : true;

  if (!showCertificates) {
    return (
      <section className="site-width collection-page">
        <p className="eyebrow section-index">LEARNING IS PART OF THE WORK</p>
        <h1>
          Currently <span className="hero-serif">unavailable.</span>
        </h1>
        <p className="section-description">
          This section is currently hidden by the developer.
        </p>
      </section>
    );
  }

  const certificates = result.ok
    ? (result.data.certificates || []).filter(
      (certificate: any) => certificate.visible !== false && certificate.url,
    )
    : [];
  return (
    <section className="site-width collection-page">
      <p className="eyebrow section-index">LEARNING IS PART OF THE WORK</p>
      <h1>
        Always a <span className="hero-serif">student.</span>
      </h1>
      <p className="section-description">
        Courses, workshops, and milestones along the way. Each one is another starting point.
      </p>
      <div className="certificate-grid">
        {certificates.map((certificate: any, index: number) => (
          <article className="certificate-card" key={certificate.id || certificate.url}>
            <div className="certificate-top">
              <Award size={22} />
              <span>{String(index + 1).padStart(2, "0")}</span>
            </div>
            <h2>{certificate.title || "Certificate of completion"}</h2>
            <p>{certificate.issuer || "Course & learning credential"}</p>
            <a href={certificate.url} target="_blank" rel="noopener noreferrer">
              <FileText size={15} />
              View credential
              <ArrowUpRight size={16} />
            </a>
          </article>
        ))}
      </div>
      {!certificates.length && (
        <p className="empty-projects">New learning milestones will appear here.</p>
      )}
    </section>
  );
}

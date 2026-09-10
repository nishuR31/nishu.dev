import { Github, Linkedin, ArrowUpRight, MapPin } from "lucide-react";
import ContactActions from "@/components/features/home/ContactActions";
import { getPortfolioData } from "@/lib/portfolio";
export const metadata = {
  title: "Contact",
  description:
    "Get in touch with Nishan Rajak about projects and software engineering opportunities.",
};
export default async function ContactPage() {
  const result = await getPortfolioData();
  const data = result.ok ? result.data : {};
  const social = data.social || {};
  const url = (value: string, base: string) =>
    value?.startsWith("http") ? value : `${base}${value || ""}`;
  return (
    <section className="site-width contact-page">
      <p className="eyebrow section-index">GOOD THINGS START WITH A CONVERSATION</p>
      <h1>
        Got an idea?
        <br />
        Let’s <span className="orange-text">talk.</span>
      </h1>
      <p className="section-description">
        I’m open to software engineering opportunities, interesting collaborations, and
        conversations about building better things.
      </p>
      <ContactActions email={data.developer?.email || "nishan.developer.dev@gmail.com"} />
      <div className="contact-social-links">
        <a
          href={url(social.github || "nishuR31", "https://github.com/")}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github size={19} />
          GitHub
          <ArrowUpRight size={17} />
        </a>
        {social.linkedin && (
          <a
            href={url(social.linkedin, "https://linkedin.com/in/")}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin size={19} />
            LinkedIn
            <ArrowUpRight size={17} />
          </a>
        )}
        <span>
          <MapPin size={18} />
          {data.developer?.location || "West Bengal, India"}
        </span>
      </div>
    </section>
  );
}

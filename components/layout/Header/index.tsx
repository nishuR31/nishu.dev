"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ui/theme-toggle";
import { ArrowUpRight, Menu, X } from "lucide-react";

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState("");
  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection("");
      return;
    }
    const ids = ["work", "about", "experience", "contact"];
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    const visibleSections = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleSections.set(entry.target.id, entry.intersectionRatio);
          } else {
            visibleSections.delete(entry.target.id);
          }
        });

        const active = ids.find((id) => visibleSections.has(id));
        if (active) {
          setActiveSection(active);
        } else if (window.scrollY < 200) {
          setActiveSection("");
        }
      },
      { rootMargin: "-10% 0px -60% 0px", threshold: [0, 0.2] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
        document.getElementById("nav-toggle")?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);
  const links = [
    { href: "/#work", label: "Work" },
    { href: "/#about", label: "About" },
    { href: "/experience", label: "Experience" },
    { href: "/education", label: "Education" },
    { href: "/techstack", label: "Tech Stack" },
    { href: "/certificates", label: "Certificates" },
    { href: "/socials", label: "Socials" },
    { href: "/contact", label: "Contact" },
  ];
  return (
    <header className="site-header">
      <div className="site-width header-inner">
        <Link href="/" className="wordmark" aria-label="Nishu home">
          nishu<span>.</span>
          <span className="wordmark-dev"> / BACKEND DEVELOPER</span>
        </Link>
        <nav
          aria-label="Main navigation"
          className={`main-nav ${open ? "is-open" : ""}`}
          id="main-navigation"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              aria-current={
                pathname === link.href ||
                (pathname.startsWith("/projects") && link.label === "Work")
                  ? "page"
                  : pathname === "/" && link.label.toLowerCase() === activeSection
                    ? "location"
                    : undefined
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <ThemeToggle />
          <Link className="header-contact" href="/contact">
            Let’s talk <ArrowUpRight size={16} />
          </Link>
        </div>
        <button
          id="nav-toggle"
          className="menu-toggle"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="main-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}

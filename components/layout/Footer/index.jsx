import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
export default function Footer() {
  return (
    <footer className="site-footer site-width">
      <Link href="/" className="wordmark">
        nishu<span>.</span>
      </Link>
      <p>Thoughtfully built. Always evolving.</p>
      <div>
        <Link href="/certificates">
          Certificates <ArrowUpRight size={13} />
        </Link>
        <span>© {new Date().getFullYear()} Nishan Rajak</span>
        <a href="#main" aria-label="Back to top">
          ↑ Back to top
        </a>
      </div>
    </footer>
  );
}

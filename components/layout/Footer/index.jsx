import Link from "next/link";
import { ArrowUpRight, Settings } from "lucide-react";
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
        <Link href="/settings" aria-label="Settings">
          <Settings size={15} />
        </Link>
        <span>© {new Date().getFullYear()} Nishan Rajak</span>
        <a href="#main" aria-label="Back to top">
          ↑ Back to top
        </a>
      </div>
    </footer>
  );
}

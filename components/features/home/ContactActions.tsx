

"use client";

import { useState, useEffect } from "react";
import { ArrowUpRight, Copy, Check } from "lucide-react";

export default function ContactActions({ email }: { email: string }) {
  const [status, setStatus] = useState("");
  const isCopied = status === "Email copied!";

  // Automatically reset status back to default after 3 seconds
  useEffect(() => {
    if (!isCopied) return;

    const timer = setTimeout(() => {
      setStatus("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [isCopied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setStatus("Email copied!");
    } catch {
      setStatus("Please select and copy the email address below.");
    }
  }

  return (
    <div className="contact-actions">
      <div className="contact-buttons">
        <a className="button button-orange" href={`mailto:${email}`}>
          Let’s talk <ArrowUpRight size={18} />
        </a>
        <button 
          type="button" 
          className="button button-outline" 
          onClick={copy}
          aria-label={isCopied ? "Email copied to clipboard" : "Copy email address"}
        >
          <div className="flex items-center gap-2" aria-hidden="true">
            {isCopied ? <Check size={16} /> : <Copy size={16} />} 
            {isCopied ? "Email copied!" : "Copy email"}
          </div>
        </button>
      </div>
      <a className="email-address" href={`mailto:${email}`}>
        {email}
      </a>
      {/* aria-live ensures screen readers immediately announce status updates */}
      <p className="copy-status" role="status" aria-live="polite">
        {status}
      </p>
    </div>
  );
}

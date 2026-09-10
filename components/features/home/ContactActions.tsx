"use client";
import { useState } from "react";
import { ArrowUpRight, Copy, Check } from "lucide-react";
export default function ContactActions({ email }: { email: string }) {
  const [status, setStatus] = useState("");
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
        <button className="button button-outline" onClick={copy}>
          {status === "Email copied!" ? <Check size={16} /> : <Copy size={16} />} Copy email
        </button>
      </div>
      <a className="email-address" href={`mailto:${email}`}>
        {email}
      </a>
      <p className="copy-status" role="status">
        {status}
      </p>
    </div>
  );
}

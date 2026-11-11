"use client";

import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useState } from "react";

export default function StartPage() {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <section
      className={`startup-intro ${imageLoaded ? "is-loaded" : ""}`}
      aria-label="Portfolio introduction"
      aria-live="polite"
    >
      <div className="startup-intro__grain" aria-hidden="true" />
      <div className="startup-intro__content">
        <div className="startup-intro__meta">
          <span className="startup-intro__index">00 / NISHU.DEV</span>
          <span className="startup-intro__line" aria-hidden="true" />
          <span>BACKEND / SYSTEMS</span>
        </div>

        <div className="startup-intro__side-note">
          <span className="startup-intro__side-mark" aria-hidden="true">
            +
          </span>
          <p>Thoughtful architecture for real-world applications.</p>
          <span className="startup-intro__side-rule" aria-hidden="true" />
          <span>WEST BENGAL / INDIA</span>
        </div>

        <div className="startup-intro__portrait-wrap">
          <div className="startup-intro__portrait-glow" aria-hidden="true" />
          <div className="startup-intro__portrait">
            <Image
              src="/iitSitting-intro.avif"
              alt="Portrait of Nishan Rajak"
              fill
              priority
              sizes="(max-width: 700px) 72vw, 390px"
              className="startup-intro__image"
              onLoad={() => setImageLoaded(true)}
            />
            <span className="startup-intro__loading" aria-hidden="true">
              <span />
            </span>
            <span className="startup-intro__portrait-label">N / 31</span>
          </div>
          <span className="startup-intro__orbit startup-intro__orbit--one" aria-hidden="true" />
          <span className="startup-intro__orbit startup-intro__orbit--two" aria-hidden="true" />
        </div>

        <div className="startup-intro__copy">
          <p className="startup-intro__kicker">HELLO, I&apos;M NISHAN RAJAK</p>
          <h1>
            Building the
            <br />
            <em>invisible</em> well.
          </h1>
          <p className="startup-intro__summary">
            A backend-focused engineer turning complex systems into calm, useful experiences.
          </p>
          <div className="startup-intro__tags" aria-label="Areas of focus">
            <span>APIs</span>
            <span>AUTHENTICATION</span>
            <span>DATA SYSTEMS</span>
          </div>
        </div>

        <div className="startup-intro__footer">
          <a className="startup-intro__enter" href="#work">
            Explore selected work <ArrowUpRight size={16} aria-hidden="true" />
          </a>
          <a className="startup-intro__scroll" href="#about">
            <ArrowDown size={14} aria-hidden="true" /> Scroll to explore
          </a>
        </div>
      </div>
    </section>
  );
}

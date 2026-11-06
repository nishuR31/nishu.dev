"use client";

import dynamic from "next/dynamic";
import ContactActions from "./ContactActions";

// Dynamically load 3D Lanyard component for client-side WebGL rendering
const Lanyard = dynamic(() => import("./Lanyard"), {
  ssr: false,
  loading: () => (
    <div
      style={{ width: "100%", height: "560px" }}
      className="flex items-center justify-center opacity-1 text-sm font-mono"
    >
      Loading interactive badge...
    </div>
  ),
});

interface ContactSectionProps {
  email?: string;
}

export default function ContactSection({
  email = "nishan.developer.dev@gmail.com",
}: ContactSectionProps) {
  return (
    <section className="contact-section site-width" id="contact">
      <div className="contact-inner">
        <div className="contact-content">
          <div className="contact-star" aria-hidden="true">
            ✳
          </div>
          <p className="eyebrow">YOUR NEXT IDEA STARTS HERE</p>
          <h2>
            Have a good problem?
            <br />
            Let’s <span>solve it.</span>
          </h2>
          <p>
            A project, an opportunity, or just a good conversation.
            <br />
            My inbox is open.
          </p>
          <ContactActions email={email} />
        </div>

        {/* 3D Interactive Lanyard Badge: Scaled and responsive on all viewports */}
        <div className="contact-lanyard-wrapper" aria-label="Interactive Developer Badge">
          <div className="contact-lanyard-box">
            <Lanyard
              frontImage="/card-front.png"
              backImage="/card-back.png"
              strapImage="/band.png"
              imageFit="cover"
              cardColor="#0d0f12"
              orientation="portrait"
              finish="glossy"
              cornerRadius={0.3}
              size={0.72}
              anchor="center"
              strapLength={0.44}
              strapColor="#111111"
              strapWidth={0.65}
              metal="silver"
              gravity={1}
              damping={0.5}
              elasticity={0.5}
              breeze={0.45}
              interactive
              intro
            />
          </div>
          <p className="contact-lanyard-hint">
            <span>● 3D BADGE</span> Drag to swing • Click to flip • Scan QR to connect
          </p>
        </div>
      </div>
    </section>
  );
}

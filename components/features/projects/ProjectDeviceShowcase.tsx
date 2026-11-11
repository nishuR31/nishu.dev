"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { PROJECT_IMAGE_FALLBACK } from "@/lib/project-images";

type ProjectDeviceShowcaseProps = {
  desktopSrc: string;
  mobileSrc?: string;
  title: string;
};

/**
 * Large laptop screenshot with the phone screenshot overlapping the
 * bottom-right corner. On narrow screens only the phone is shown when a
 * dedicated phone screenshot exists.
 */
export default function ProjectDeviceShowcase({
  desktopSrc,
  mobileSrc,
  title,
}: ProjectDeviceShowcaseProps) {
  const [desktopFailed, setDesktopFailed] = useState(false);
  const [desktopLoaded, setDesktopLoaded] = useState(false);

  // Cached images can finish before React hydrates, in which case `onLoad`
  // never fires. The ref check clears the skeleton in that situation.
  const handleDesktopRef = useCallback((image: HTMLImageElement | null) => {
    if (image?.complete && image.naturalWidth > 0) setDesktopLoaded(true);
  }, []);
  // Pending until the phone screenshot proves it is actually portrait, so a
  // landscape (or duplicate) shot never flashes inside the phone frame.
  const [mobileStatus, setMobileStatus] = useState<"pending" | "valid" | "invalid">(
    mobileSrc ? "pending" : "invalid",
  );

  const desktop = desktopFailed ? PROJECT_IMAGE_FALLBACK : desktopSrc;
  const showPhone = Boolean(mobileSrc) && mobileStatus === "valid";

  return (
    <div className={`project-showcase ${showPhone ? "project-showcase--with-phone" : ""}`}>
      <div className="showcase-laptop">
        <div className="showcase-laptop-screen">
          <div className="showcase-laptop-display">
            {!desktopLoaded && (
              <span className="showcase-skeleton skeleton-shimmer" aria-hidden="true" />
            )}
            <Image
              src={desktop}
              alt={`${title} desktop interface`}
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="showcase-shot"
              priority
              ref={handleDesktopRef}
              onLoad={() => setDesktopLoaded(true)}
              onError={() => setDesktopFailed(true)}
            />
          </div>
          <span className="showcase-camera" aria-hidden="true" />
        </div>
        <div className="showcase-laptop-base" aria-hidden="true" />
      </div>

      {mobileSrc && mobileStatus !== "invalid" && (
        <div
          className={`showcase-phone ${mobileStatus === "pending" ? "showcase-phone--pending" : ""}`}
        >
          <span className="showcase-phone-notch" aria-hidden="true" />
          <div className="showcase-phone-display">
            <Image
              src={mobileSrc}
              alt={`${title} mobile interface`}
              fill
              sizes="(max-width: 640px) 70vw, 180px"
              className="showcase-shot"
              priority
              onLoad={(event) => {
                const image = event.currentTarget;
                setMobileStatus(image.naturalWidth < image.naturalHeight ? "valid" : "invalid");
              }}
              onError={() => setMobileStatus("invalid")}
            />
          </div>
        </div>
      )}
    </div>
  );
}

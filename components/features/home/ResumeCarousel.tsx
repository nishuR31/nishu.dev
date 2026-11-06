"use client";

import { useState } from "react";
import { Download, ChevronLeft, ChevronRight, Eye, FileText } from "lucide-react";
import Image from "next/image";

type CV = {
  id: string;
  cvId: string;
  title: string;
  url: string;
  description: string;
  lastUpdated: string;
};

export default function ResumeCarousel({ cvs = [] }: { cvs?: CV[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // If no resumes are provided, return null or a placeholder
  if (!cvs || cvs.length === 0) {
    return null;
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === cvs.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? cvs.length - 1 : prev - 1));
  };

  const currentResume = cvs[currentIndex];
  // Alternate logos for visual distinction if no thumbnail is provided
  const getThumbnail = (index: number) => {
    return index % 2 === 0 ? "/logo.avif" : "/logo-180.avif";
  };

  return (
    <div className="flex flex-col items-center md:items-end w-full mt-10 md:mt-0">
      <div className="w-full max-w-sm glass-panel p-4 rounded-3xl relative overflow-hidden group">
        <h3 className="text-xl font-bold mb-4 gradient-heading flex items-center justify-between">
          Resumes
          <span className="text-xs font-normal text-muted-foreground bg-white/5 px-2 py-1 rounded-full border border-white/10">
            {currentIndex + 1} / {cvs.length}
          </span>
        </h3>

        {/* Carousel Window */}
        <div className="relative w-full aspect-[1/1.4] bg-white/5 rounded-2xl border border-white/10 overflow-hidden mb-4 group-hover:border-purple-500/30 transition-colors duration-300">
          <div
            className="w-full h-full flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {cvs.map((resume, index) => (
              <div key={resume.id} className="min-w-full h-full flex items-center justify-center p-8 relative">
                <Image
                  src={getThumbnail(index)}
                  alt={resume.title}
                  className="w-full h-full object-contain filter drop-shadow-2xl floating-gravity"
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
                  <a
                    href={resume.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-purple-500 text-white px-5 py-2.5 rounded-full font-medium hover:bg-purple-600 transition-colors btn-shimmer"
                  >
                    <Eye size={18} /> Preview
                  </a>
                  <a
                    href={resume.url}
                    download
                    className="flex items-center gap-2 bg-white/10 text-white px-5 py-2.5 rounded-full font-medium hover:bg-white/20 transition-colors border border-white/10"
                  >
                    <Download size={18} /> Download
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Controls */}
          {cvs.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous resume"
                onClick={prevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 text-white border border-white/10 hover:bg-black/60 transition-colors backdrop-blur-md z-10"
              >
                <ChevronLeft size={18} aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Next resume"
                onClick={nextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 text-white border border-white/10 hover:bg-black/60 transition-colors backdrop-blur-md z-10"
              >
                <ChevronRight size={18} aria-hidden="true" />
              </button>
            </>
          )}
        </div>

        <p className="text-sm text-center text-muted-foreground mt-2 font-medium">
          {currentResume.title}
        </p>
        <p className="text-xs text-center text-muted-foreground/60 mt-1">
          Last Updated: {currentResume.lastUpdated}
        </p>
      </div>
    </div>
  );
}

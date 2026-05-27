"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, ExternalLink, FileText, Image as ImageIcon, X } from "lucide-react";
import Carousel from "@/components/ui/carousel";
import { config } from "@/config";

// helper to clean and extract certificate details from URL
const getCertificateInfo = (url) => {
  try {
    const decoded = decodeURIComponent(url);
    const fileName = decoded.substring(decoded.lastIndexOf("/") + 1);
    const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "");
    const cleanTitle = nameWithoutExt
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const isImage =
      url.toLowerCase().endsWith(".png") ||
      url.toLowerCase().endsWith(".jpg") ||
      url.toLowerCase().endsWith(".jpeg");
    const isPdf = url.toLowerCase().endsWith(".pdf");

    return {
      title: cleanTitle,
      isImage,
      isPdf,
      url,
    };
  } catch (e) {
    return { title: "Certificate", isImage: false, isPdf: true, url };
  }
};

const CertificatesSection = () => {
  const [width, setWidth] = useState(600);
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    const updateWidth = () => {
      if (window.innerWidth < 640) {
        setWidth(350);
      } else if (window.innerWidth < 1024) {
        setWidth(550);
      } else {
        setWidth(750);
      }
    };

    updateWidth();

    window.addEventListener("resize", updateWidth);

    return () => window.removeEventListener("resize", updateWidth);
  }, []);
  const rawCertificates = config.certificates || [];
  const certificates = rawCertificates.map(c => getCertificateInfo(c.url));

  return (
    <section className="py-24" id="certificates">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center space-y-6 mb-12">
          <div className="inline-flex items-center space-x-2 bg-secondary/10 border-[1.8px] border-zinc-900/70 px-4 py-2 rounded-full text-primary backdrop-blur-sm">
            <Award className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">
              Certifications
            </span>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              Certifications
            </h2>
            <p className="text-lg text-muted-foreground">
              A curated collection of my professional achievements, course completions, and technical credentials.
            </p>
          </div>
        </div>

        <div className="flex justify-center items-center">
          <div className="w-full min-w-screen flex justify-center">
            <div className="relative w-full flex justify-center" style={{ height: `${Math.max(300, Math.round((width * 2) / 3))}px` }}>
              <Carousel
                items={certificates}
                baseWidth={width}
                autoplay
                autoplayDelay={3000}
                pauseOnHover
                loop
                round={false}
                renderItem={(item, index) => {
                  return (
                    <div
                      onClick={() => setSelectedCert(item)}
                      className="w-full h-full flex flex-col justify-between p-4 bg-zinc-950/80 border border-zinc-800/80 rounded-2xl hover:border-zinc-700/80 transition-all duration-300 backdrop-blur-md cursor-pointer group"
                    >
                      {/* Card Top: Certificate Type & Icon */}
                      <div className="flex justify-between items-start">
                        <div className="p-2 rounded-xl bg-zinc-900/50 border border-zinc-800 text-amber-500">
                          {item.isPdf ? (
                            <FileText className="w-6 h-6" />
                          ) : (
                            <ImageIcon className="w-6 h-6" />
                          )}
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800/50 text-muted-foreground uppercase tracking-wider">
                          {item.isPdf ? "PDF Cert" : "Image Cert"}
                        </span>
                      </div>

                      {/* Card Middle: Image Preview or File Info */}
                      <div className="flex-1 my-4 flex items-center justify-center overflow-hidden rounded-xl border border-zinc-900 bg-zinc-900/30 relative">
                        {item.isImage ? (
                          <img
                            src={item.url}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : item.isPdf ? (
                          <div className="w-full h-full relative">
                            <iframe
                              src={`${item.url}#toolbar=0&navpanes=0&scrollbar=0`}
                              className="w-full h-full border-none pointer-events-none select-none"
                              title={item.title}
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-transparent" />
                          </div>
                        ) : (
                          <div className="flex flex-col items-center text-center p-4">
                            <Award className="w-12 h-12 text-zinc-750 mb-2 group-hover:text-amber-500/50 transition-colors duration-300" />
                            <span className="text-[10px] text-zinc-500 font-mono break-all line-clamp-1 px-4">
                              {item.url.substring(item.url.lastIndexOf("/") + 1)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Card Bottom: Title & Action Link */}
                      <div className="space-y-4">
                        <h3 className="text-base font-semibold text-primary/90 line-clamp-2 min-h-[3rem] flex items-center leading-snug">
                          {item.title}
                        </h3>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCert(item);
                            }}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-sm font-medium text-primary border border-zinc-800 transition-all duration-300 hover:border-zinc-700 active:scale-95 cursor-pointer"
                          >
                            <span>Preview</span>
                          </button>
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center justify-center p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-primary border border-zinc-800 transition-all duration-300 hover:border-zinc-700 active:scale-95"
                            title="Open in new tab"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal for Certificate Previews */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCert(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-zinc-950/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl h-[85vh] flex flex-col bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 md:px-6 border-b border-zinc-800/80 bg-zinc-950/50 backdrop-blur-sm z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-zinc-900/50 border border-zinc-800 text-amber-500">
                    {selectedCert.isPdf ? (
                      <FileText className="w-5 h-5" />
                    ) : (
                      <ImageIcon className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm md:text-base font-semibold text-primary line-clamp-1">
                      {selectedCert.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {selectedCert.isPdf ? "PDF Document" : "Image Certificate"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={selectedCert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs font-medium text-primary border border-zinc-800 transition-all duration-200"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Open Original</span>
                  </a>
                  <button
                    onClick={() => setSelectedCert(null)}
                    className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-muted-foreground hover:text-primary border border-zinc-800 transition-all duration-200"
                    aria-label="Close Preview"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="flex-1 bg-zinc-950/30 flex items-center justify-center p-4 overflow-hidden relative">
                {selectedCert.isImage ? (
                  <img
                    src={selectedCert.url}
                    alt={selectedCert.title}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-lg border border-zinc-900"
                  />
                ) : selectedCert.isPdf ? (
                  <iframe
                    src={selectedCert.url}
                    className="w-full h-full rounded-lg border border-zinc-900 bg-white"
                    title={selectedCert.title}
                  />
                ) : (
                  <div className="flex flex-col items-center text-center p-6 text-muted-foreground">
                    <Award className="w-16 h-16 text-zinc-700 mb-4" />
                    <p>No preview available for this document format.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default CertificatesSection;

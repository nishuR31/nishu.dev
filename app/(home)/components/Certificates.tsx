"use client";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Award, ExternalLink, FileText, Image as ImageIcon, X } from "lucide-react";
import Carousel from "@/components/ui/carousel";
import { usePortfolio } from "@/store";
import { prefersReducedMotion } from "@/lib/anime-utils";
import { CertificatesSkeleton } from "@/components/ui/skeletons";

interface CertInfo {
  title: string;
  isImage: boolean;
  isPdf: boolean;
  url: string;
}

const getCertificateInfo = (url: string): CertInfo => {
  try {
    const decoded = decodeURIComponent(url);
    const fileName = decoded.substring(decoded.lastIndexOf("/") + 1);
    const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "");
    const cleanTitle = nameWithoutExt.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
    const isImage = /\.(png|jpg|jpeg)$/i.test(url);
    const isPdf = /\.pdf$/i.test(url);
    return { title: cleanTitle, isImage, isPdf, url };
  } catch {
    return { title: "Certificate", isImage: false, isPdf: true, url };
  }
};

const CertificatesSection: React.FC = () => {
  const { portfolioData, loading } = usePortfolio();
  const [width, setWidth] = useState(600);
  const [selectedCert, setSelectedCert] = useState<CertInfo | null>(null);

  useEffect(() => {
    const updateWidth = () => {
      if (window.innerWidth < 640) setWidth(280);
      else if (window.innerWidth < 1024) setWidth(550);
      else setWidth(750);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const rawCertificates = portfolioData?.certificates ?? [];
  const certificates: CertInfo[] = rawCertificates.map((c: { url: string }) => getCertificateInfo(c.url));

  if (loading) return <CertificatesSkeleton />;

  const modalEnter = prefersReducedMotion()
    ? { opacity: 1, scale: 1, y: 0 }
    : { scale: 1, opacity: 1, y: 0 };
  const modalExit = prefersReducedMotion()
    ? { opacity: 0 }
    : { scale: 0.95, opacity: 0, y: 20 };

  return (
    <section className="py-24 cv-auto" id="certificates">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center space-y-6 mb-12">
          <div className="inline-flex items-center space-x-2 glass-premium px-4 py-2 rounded-full text-foreground backdrop-blur-sm">
            <Award className="w-5 h-5" />
            <span className="text-sm font-medium">Certifications</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold font-['Outfit',sans-serif] gradient-heading">
              Certifications
            </h2>
            <p className="text-lg text-muted-foreground">
              A curated collection of my professional achievements, course completions, and technical credentials.
            </p>
          </div>
        </div>

        <div className="flex justify-center items-center">
          <div className="w-full min-w-screen flex justify-center">
            <div
              className="relative w-full flex justify-center"
              style={{ height: `${Math.max(300, Math.round((width * 2) / 3))}px` }}
            >
              <Carousel
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                items={certificates as any}
                baseWidth={width}
                autoplay
                autoplayDelay={3000}
                pauseOnHover
                loop
                round={false}
                renderItem={(item: unknown) => {
                  const cert = item as CertInfo;
                  return (
                    <div
                      onClick={() => setSelectedCert(cert)}
                      className="w-full h-full flex flex-col justify-between p-4 glass-premium border border-zinc-500/15 rounded-2xl hover:border-zinc-500/30 transition-all duration-300 cursor-pointer group"
                    >
                      {/* Top */}
                      <div className="flex justify-between items-start">
                        <div className="p-2 rounded-xl bg-zinc-500/10 border border-zinc-500/20 text-zinc-400">
                          {cert.isPdf ? <FileText className="w-6 h-6" /> : <ImageIcon className="w-6 h-6" />}
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800/50 text-muted-foreground uppercase tracking-wider">
                          {cert.isPdf ? "PDF" : "Image"}
                        </span>
                      </div>

                      {/* Preview */}
                      <div
                        className="my-3 rounded-xl border border-zinc-800 bg-zinc-900/30 relative"
                        style={{ aspectRatio: "3 / 2", overflow: "hidden" }}
                      >
                        {cert.isImage ? (
                          <img src={cert.url} alt={cert.title} className="w-full h-auto min-h-full object-contain" />
                        ) : cert.isPdf ? (
                          <embed src={cert.url} type="application/pdf" className="w-full" style={{ minHeight: "100%", height: "500px" }} />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-center p-4 h-full">
                            <Award className="w-12 h-12 text-zinc-600 mb-2 group-hover:text-zinc-500/50 transition-colors duration-300" />
                            <span className="text-[10px] text-zinc-500 font-mono break-all line-clamp-1 px-4">
                              {cert.url.substring(cert.url.lastIndexOf("/") + 1)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="space-y-4">
                        <h3 className="text-base font-semibold text-foreground line-clamp-2 min-h-[3rem] flex items-center leading-snug font-['Outfit',sans-serif]">
                          {cert.title}
                        </h3>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedCert(cert); }}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl glass-premium hover:border-zinc-500/30 text-sm font-medium text-foreground border border-zinc-500/20 transition-all duration-300 active:scale-95 cursor-pointer"
                          >
                            Preview
                          </button>
                          <a
                            href={cert.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center justify-center p-2.5 rounded-xl glass-premium hover:border-zinc-500/30 text-foreground border border-zinc-500/20 transition-all duration-300 active:scale-95"
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

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCert(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-zinc-950/85 backdrop-blur-lg"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={modalEnter}
              exit={modalExit}
              transition={{ type: "spring", duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl h-[85vh] flex flex-col glass-premium border border-zinc-500/20 rounded-2xl overflow-hidden shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 md:px-6 border-b border-purple-500/10 backdrop-blur-sm z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-zinc-500/10 border border-zinc-500/20 text-zinc-400">
                    {selectedCert.isPdf ? <FileText className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-sm md:text-base font-semibold text-foreground line-clamp-1 font-['Outfit',sans-serif]">
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
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-premium hover:border-zinc-500/30 text-xs font-medium text-foreground border border-zinc-500/20 transition-all duration-200"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Open Original</span>
                  </a>
                  <button
                    onClick={() => setSelectedCert(null)}
                    className="p-1.5 rounded-lg glass-premium hover:border-red-500/30 text-muted-foreground hover:text-red-400 border border-zinc-700/50 transition-all duration-200"
                    aria-label="Close Preview"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="flex-1 bg-zinc-950/30 flex items-center justify-center p-4 overflow-hidden">
                {selectedCert.isImage ? (
                  <img
                    src={selectedCert.url}
                    alt={selectedCert.title}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-lg border border-zinc-800"
                  />
                ) : selectedCert.isPdf ? (
                  <iframe
                    src={selectedCert.url}
                    className="w-full h-full rounded-lg border border-zinc-800 bg-white"
                    title={selectedCert.title}
                  />
                ) : (
                  <div className="flex flex-col items-center text-center p-6 text-muted-foreground">
                    <Award className="w-16 h-16 text-zinc-600 mb-4" />
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

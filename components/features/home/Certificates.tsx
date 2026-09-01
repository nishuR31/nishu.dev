"use client";
import React, { useEffect, useState } from "react";
import { Award, ExternalLink, FileText, Image as ImageIcon, X } from "lucide-react";
import Image from "next/image";
import Carousel from "@/components/ui/carousel";

interface CertInfo {
  id?: string;
  title: string;
  issuer?: string;
  category?: string;
  issuedAt?: string;
  featured?: boolean;
  isImage: boolean;
  isPdf: boolean;
  url: string;
}

const getCertificateInfo = (cert: any): CertInfo => {
  return {
    ...cert,
    title: cert.title || "Certificate",
    isImage: cert.type === "image",
    isPdf: cert.type === "pdf",
    url: cert.url || ""
  };
};

interface CertificatesSectionProps {
  portfolioData: any;
}

const CertificatesSection: React.FC<CertificatesSectionProps> = ({ portfolioData }) => {
  const [width, setWidth] = useState(600);
  const [selectedCert, setSelectedCert] = useState<CertInfo | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");

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
  const certificates: CertInfo[] = rawCertificates.map(getCertificateInfo);

  if (certificates.length === 0) {
    return (
      <section className="py-24 cv-auto" id="certificates">
        <div className="container mx-auto px-6 text-center">
          <p className="text-muted-foreground">No certifications data configured.</p>
        </div>
      </section>
    );
  }

  const categories = ["All", ...Array.from(new Set(certificates.map((c) => c.category || "Other")))];
  const filteredCerts = activeCategory === "All" ? certificates : certificates.filter((c) => (c.category || "Other") === activeCategory);

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
            <h2 className="text-3xl md:text-4xl font-bold font-outfit gradient-heading">
              Certifications
            </h2>
            <p className="text-lg text-muted-foreground">
              A curated collection of my professional achievements, course completions, and technical credentials.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-card border border-border text-muted-foreground hover:bg-primary/10 hover:text-foreground"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="flex justify-center items-center">
          <div className="w-full min-w-screen flex justify-center">
            <div
              className="relative w-full flex justify-center"
              style={{ height: `${Math.max(300, Math.round((width * 2) / 3))}px` }}
            >
              <Carousel
                key={activeCategory} // Force re-render of carousel when category changes
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                items={filteredCerts as any}
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
                        <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-muted-foreground">
                          {cert.isPdf ? <FileText className="w-6 h-6" /> : <ImageIcon className="w-6 h-6" />}
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-card border border-border text-muted-foreground uppercase tracking-wider">
                          {cert.isPdf ? "PDF" : "Image"}
                        </span>
                      </div>

                      {/* Preview */}
                      <div
                        className="my-3 rounded-xl border border-border bg-card/30 relative"
                        style={{ aspectRatio: "3 / 2", overflow: "hidden" }}
                      >
                        {cert.isImage ? (
                          <Image src={cert.url} alt={cert.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-contain" />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-center p-4 h-full">
                            <FileText className="w-12 h-12 text-muted-foreground mb-2 group-hover:text-muted-foreground/50 transition-colors duration-300" />
                            <span className="text-sm font-medium text-muted-foreground break-all line-clamp-2 px-4">
                              {cert.title}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="space-y-4">
                        <h3 className="text-base font-semibold text-foreground line-clamp-2 min-h-[3rem] flex items-center leading-snug font-outfit">
                          {cert.title}
                        </h3>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedCert(cert); }}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl glass-premium hover:border-zinc-500/30 text-sm font-medium text-foreground border border-border transition-all duration-300 active:scale-95 cursor-pointer"
                          >
                            Preview
                          </button>
                          <a
                            href={cert.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center justify-center p-2.5 rounded-xl glass-premium hover:border-zinc-500/30 text-foreground border border-border transition-all duration-300 active:scale-95"
                            title={`Open ${cert.title} in new tab`}
                            aria-label={`Open ${cert.title} in new tab`}
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
      {selectedCert && (
        <div
          onClick={() => setSelectedCert(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-background/85 backdrop-blur-lg animate-in fade-in duration-300"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl h-[85vh] flex flex-col glass-premium border border-zinc-500/20 rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
          >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 md:px-6 border-b border-purple-500/10 backdrop-blur-sm z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-muted-foreground">
                    {selectedCert.isPdf ? <FileText className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-sm md:text-base font-semibold text-foreground line-clamp-1 font-outfit">
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
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-premium hover:border-zinc-500/30 text-xs font-medium text-foreground border border-border transition-all duration-200"
                    aria-label={`Open original ${selectedCert.title} in new tab`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Open Original</span>
                  </a>
                  <button
                    onClick={() => setSelectedCert(null)}
                    className="p-1.5 rounded-lg glass-premium hover:border-red-500/30 text-muted-foreground hover:text-red-400 border border-border transition-all duration-200"
                    aria-label="Close Preview"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="flex-1 bg-card/30 relative flex items-center justify-center p-4 overflow-hidden">
                {selectedCert.isImage ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={selectedCert.url}
                      alt={selectedCert.title}
                      fill
                      sizes="100vw"
                      className="object-contain drop-shadow-lg"
                    />
                  </div>
                ) : selectedCert.isPdf ? (
                  <iframe
                    src={selectedCert.url}
                    className="w-full h-full rounded-lg border border-border bg-white"
                    title={selectedCert.title}
                  />
                ) : (
                  <div className="flex flex-col items-center text-center p-6 text-muted-foreground">
                    <Award className="w-16 h-16 text-muted-foreground mb-4" />
                    <p>No preview available for this document format.</p>
                  </div>
                )}
              </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CertificatesSection;

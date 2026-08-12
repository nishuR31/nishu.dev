// app/(certificates)/certificates/page.jsx
"use client";
import React from "react";

import { FileText, Image as ImageIcon, ExternalLink } from "lucide-react";
import Image from "next/image";
import { usePortfolio } from "@/store";
import { CertificatesGridSkeleton } from "@/components/ui/skeletons";

import { toast } from "sonner";

// Utility to extract information from certificate URL
const getCertificateInfo = (url) => {
    try {
        const decoded = decodeURIComponent(url);
        const fileName = decoded.substring(decoded.lastIndexOf("/") + 1);
        const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "");
        const cleanTitle = nameWithoutExt.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
        const isImage = /\.(png|jpe?g|webp|avif)$/i.test(url);
        const isPdf = /\.pdf$/i.test(url);
        return { title: cleanTitle, url, isImage, isPdf };
    } catch {
        return { title: "Certificate", url, isImage: false, isPdf: true };
    }
};



const CertificatesGrid = () => {

    const { portfolioData, loading, error } = usePortfolio();

    const rawCertificates = portfolioData?.certificates ?? [];
    const certificates = rawCertificates.map((c) => getCertificateInfo(c.url));

    if (loading) {
        return <CertificatesGridSkeleton />;
    }

    if (error) {
        return toast.error(error)
    }

    return (
        <section className="py-24" id="certificates-grid">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-8">
                    All Certifications
                </h2>
                <div
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-in fade-in duration-500 fill-mode-both"
                >
                    {certificates.map((item, idx) => (
                        <article
                            key={idx}
                            style={{ animationDelay: `${idx * 100}ms` }}
                            className="relative flex flex-col p-4 bg-card/80 border border-border rounded-2xl hover:border-primary/50 transition-all duration-300 backdrop-blur-md animate-in slide-in-from-bottom-4 fade-in duration-300 fill-mode-both"
                        >
                            {/* Icon */}
                            <div className="flex items-center justify-between mb-2">
                                <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-amber-500">
                                    {item.isPdf ? <FileText className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
                                </div>
                                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-card border border-border text-muted-foreground uppercase tracking-wider">
                                    {item.isPdf ? "PDF Cert" : "Image Cert"}
                                </span>
                            </div>

                            {/* Preview */}
                            <div className="flex-1 my-4 flex items-center justify-center overflow-hidden rounded-xl bg-card/30 relative">
                                {item.isImage ? (
                                    <Image
                                        src={item.url}
                                        alt={item.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-center p-4 h-full">
                                        <FileText className="w-12 h-12 text-zinc-600 mb-2" />
                                        <span className="text-sm font-medium text-muted-foreground break-all line-clamp-2 px-4">
                                            {item.title}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Title & Action */}
                            <div className="mt-4 space-y-3 text-center">
                                <h3 className="text-base font-semibold text-primary/90 line-clamp-2 min-h-[3rem] flex items-center justify-center">
                                    {item.title}
                                </h3>
                                <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-card hover:bg-accent text-sm font-medium text-primary border border-border transition-all duration-300 hover:border-primary/50 active:scale-95"
                                    aria-label={`View Certificate: ${item.title}`}
                                >
                                    <span>View Certificate</span>
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default function CertificatesPage() {
    return <CertificatesGrid />;
}

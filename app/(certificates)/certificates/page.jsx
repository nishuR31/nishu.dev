// app/(certificates)/certificates/page.jsx
"use client";
import React from "react";
import { motion } from "framer-motion";
import { FileText, Image as ImageIcon, ExternalLink } from "lucide-react";
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

const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
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
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                >
                    {certificates.map((item, idx) => (
                        <motion.article
                            key={idx}
                            variants={itemVariants}
                            className="relative flex flex-col p-4 bg-card/80 border border-border rounded-2xl hover:border-primary/50 transition-all duration-300 backdrop-blur-md"
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
                                    <img
                                        src={item.url}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : item.isPdf ? (
                                    <div className="w-full h-full relative">
                                        <embed
                                            src={item.url}
                                            type="application/pdf"
                                            className="w-full h-full"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center text-center p-4">
                                        <FileText className="w-8 h-8 text-zinc-600 mb-2" />
                                        <span className="text-sm text-muted-foreground break-all line-clamp-1">
                                            {item.url.substring(item.url.lastIndexOf('/') + 1)}
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
                                >
                                    <span>View Certificate</span>
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                        </motion.article>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default function CertificatesPage() {
    return <CertificatesGrid />;
}

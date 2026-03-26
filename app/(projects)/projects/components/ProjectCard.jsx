"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { itemAnimation } from "./Animations";

export const ProjectCard = ({ project, index }) => (
  <motion.div
    variants={itemAnimation}
    className="flex flex-col items-stretch gap-6 p-4 transition-colors duration-300 group sm:flex-row lg:flex-row bg-secondary/5 hover:bg-secondary/10 rounded-xl"
  >
    <div className="md:w-1/3 lg:w-1/2">
      <div className="relative aspect-[4/3] md:aspect-[16/9] lg:aspect-[3/2] rounded-lg overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
          className="object-cover w-full h-full transition-transform duration-300 transform group-hover:scale-105"
        />
        <div className="absolute inset-0 transition-colors duration-300 bg-black/40 group-hover:bg-black/20" />
      </div>
    </div>

    <div className="flex flex-col justify-between py-2 md:w-2/3 lg:w-1/2">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-primary">
            {project.title}
          </h3>
          <span className="text-xs text-muted-foreground">
            #{String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {project.technologies.map((tech, idx) => (
            <span
              key={idx}
              className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4">
        <Button size="sm" className="h-8 px-4 text-xs rounded-full" asChild>
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
            onClick={(e) => {
              // prefer window.open for mobile browsers — keep href as fallback
              try {
                window.open(project.demo, "_blank", "noopener,noreferrer");
              } catch (err) {
                // let the anchor fallback navigate
              }
            }}
          >
            Live Demo
            <ExternalLink className="w-3 h-3" />
          </a>
        </Button>
      </div>
    </div>
  </motion.div>
);

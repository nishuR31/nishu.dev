"use client"
import React from 'react';
import { ProjectCard } from './ProjectCard';
import { ProjectsListSkeleton } from '@/components/ui/skeletons';

export const ProjectsList = ({ projects, loading }) => {
    if (loading) return <ProjectsListSkeleton count={4} />;

    return (
        <div
            className="space-y-4 animate-in fade-in duration-500 fill-mode-both"
        >
            {projects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
            ))}
        </div>
    );
};
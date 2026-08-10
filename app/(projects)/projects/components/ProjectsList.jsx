"use client"
import React from 'react';
import { motion } from 'framer-motion';
import { ProjectCard } from './ProjectCard';
import { containerAnimation } from './Animations';
import { ProjectsListSkeleton } from '@/components/ui/skeletons';

export const ProjectsList = ({ projects, loading }) => {
    if (loading) return <ProjectsListSkeleton count={4} />;

    return (
        <motion.div
            variants={containerAnimation}
            initial="hidden"
            animate="show"
            className="space-y-4"
        >
            {projects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
            ))}
        </motion.div>
    );
};
"use client";
import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';

const BackgroundEffects = ({
    className,
    variant = 'default',
    colors = {
        first: 'secondary',
        second: 'secondary',
    },
    intensity = '10',
    blurAmount = '3xl',
}) => {
    const positions = {
        default: {
            first: 'top-1/4 -translate-y-1/2 left-1/4',
            second: 'bottom-1/4 translate-y-1/2 right-1/4',
        },
        centered: {
            first: 'top-1/2 -translate-y-1/2 left-1/3 -translate-x-1/2',
            second: 'top-1/2 -translate-y-1/2 right-1/3 translate-x-1/2',
        },
        diagonal: {
            first: 'top-0 left-0',
            second: 'bottom-0 right-0',
        },
        corners: {
            first: 'top-0 right-0',
            second: 'bottom-0 left-0',
        },
    };

    return (
        <div
            className={cn(
                'absolute inset-0 overflow-hidden pointer-events-none animate-in fade-in duration-700',
                className
            )}
        >
            <div
                className={cn(
                    'absolute w-96 h-96 rounded-full animate-in fade-in zoom-in-75 duration-1000 fill-mode-both',
                    `bg-${colors.first}/${intensity}`,
                    `blur-${blurAmount}`,
                    positions[variant].first
                )}
                key={`blob-1-${colors.first}-${variant}`}
            />
            <div
                className={cn(
                    'absolute w-96 h-96 rounded-full animate-in fade-in zoom-in-75 duration-1000 delay-200 fill-mode-both',
                    `bg-${colors.second}/${intensity}`,
                    `blur-${blurAmount}`,
                    positions[variant].second
                )}
                key={`blob-2-${colors.second}-${variant}`}
            />
        </div>
    );
};

export const BackgroundPresets = {
    Subtle: () => (
        <BackgroundEffects
            variant="centered"
            colors={{ first: 'primary', second: 'secondary' }}
            intensity="5"
            blurAmount="3xl"
        />
    ),

    Vibrant: () => (
        <BackgroundEffects
            variant="diagonal"
            colors={{ first: 'primary', second: 'primary' }}
            intensity="20"
            blurAmount="3xl"
        />
    ),

    Corner: () => (
        <BackgroundEffects
            variant="corners"
            colors={{ first: 'secondary', second: 'secondary' }}
            intensity="10"
            blurAmount="3xl"
        />
    ),

    Minimal: () => (
        <BackgroundEffects
            variant="default"
            colors={{ first: 'secondary', second: 'secondary' }}
            intensity="5"
            blurAmount="3xl"
        />
    ),
};

export default BackgroundEffects;

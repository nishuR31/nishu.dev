import React from "react";
import Image from "next/image";

export default function ContributionGraph({ mode, theme = "dark" }: { mode: "github" | "leetcode", theme?: "dark" | "light" }) {
    return (
        <div className="flex items-center justify-center">

            {mode === "github" ? githubContributionGraph({ theme }) : leetcodeContributionGraph({ theme })}
        </div>
    )
}


export function githubContributionGraph({ theme }: { theme: "dark" | "light" }) {
    return (
        <>
            <Image
                src={`https://raw.githubusercontent.com/nishur31/nishur31/output/github-contribution-grid-snake${theme === "dark" ? "-dark" : ""}.svg`}
                alt="github contribution graph"
                width={850}
                height={200}
                unoptimized
                className="max-w-full h-auto"
            />
        </>
    )
}
export function leetcodeContributionGraph({ theme }: { theme: "dark" | "light" }) {
    return (
        <>
            <Image
                src={`https://leetcard.jacobin.cool/nishanr_19?theme=${theme === "dark" ? "dark" : "light"}&ext=heatmap`}
                alt="leetcode contribution graph"
                width={850}
                height={200}
                unoptimized
                className="max-w-full h-auto"
            />
        </>
    )
} 
import { Github, Linkedin, ArrowUpRight, Mail, Code, BarChart2 } from "lucide-react";
import { getPortfolioData } from "@/lib/portfolio";
import { getGithubContributions, getLeetCodeContributions } from "@/lib/contributions";
import CustomHeatmap from "@/components/features/home/CustomHeatmap";
import Link from "next/link";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Social Profiles | Nishan Rajak",
  description: "Social links and coding platform statistics for Nishan Rajak.",
  robots: {
    index: false,
    follow: true,
  },
};

export default async function SocialsPage() {
  const [result, githubContribs, leetcodeContribs] = await Promise.all([
    getPortfolioData(),
    getGithubContributions(),
    getLeetCodeContributions(),
  ]);
  const data = result.ok ? result.data : {};
  const social = data.social || {};
  const url = (value: string, base: string) =>
    value?.startsWith("http") ? value : `${base}${value || ""}`;

  return (
    <section
      className="site-width contact-page"
      style={{ paddingBlock: "90px 115px", minHeight: "75vh" }}
    >
      <p className="eyebrow section-index">STAY CONNECTED</p>
      <h1>
        My <span className="orange-text">Socials</span>
        <br />& Stats.
      </h1>
      <p className="section-description" style={{ marginBottom: "45px", maxWidth: "530px" }}>
        Find me across the web on various platforms, from code repositories to professional networks
        and bug bounty programs.
      </p>

      <div className="social-grid">
        {social.email && (
          <a href={`mailto:${social.email}`} className="social-card">
            <div className="social-top">
              <Mail size={24} />
              <ArrowUpRight size={18} className="social-arrow" />
            </div>
            <h2>Email</h2>
            <p>{social.email}</p>
          </a>
        )}

        {social.github && (
          <a
            href={url(social.github, "https://github.com/")}
            target="_blank"
            rel="noopener noreferrer"
            className="social-card has-heatmap group"
          >
            <CustomHeatmap days={githubContribs} mode="github" />
            <div className="social-top">
              <Github size={24} />
              <ArrowUpRight size={18} className="social-arrow" />
            </div>
            <h2>GitHub</h2>
            <p>
              <span>{social.githubRepos || 0} Repos</span>
              <span>{social.githubFollowers || 0} Followers</span>
            </p>
          </a>
        )}

        {social.linkedin && (
          <a
            href={url(social.linkedin, "https://linkedin.com/in/")}
            target="_blank"
            rel="noopener noreferrer"
            className="social-card"
          >
            <div className="social-top">
              <Linkedin size={24} />
              <ArrowUpRight size={18} className="social-arrow" />
            </div>
            <h2>LinkedIn</h2>
            <p>Professional Network</p>
          </a>
        )}

        {social.hackerrank && (
          <a
            href={url(social.hackerrank, "https://www.hackerrank.com/profile/")}
            target="_blank"
            rel="noopener noreferrer"
            className="social-card"
          >
            <div className="social-top">
              <BarChart2 size={24} />
              <ArrowUpRight size={18} className="social-arrow" />
            </div>
            <h2>HackerRank</h2>
            <p>Coding Challenges</p>
          </a>
        )}

        {social.leetcode && (
          <a
            href={url(social.leetcode, "https://leetcode.com/u/")}
            target="_blank"
            rel="noopener noreferrer"
            className="social-card has-heatmap group"
          >
            <CustomHeatmap days={leetcodeContribs} mode="leetcode" />
            <div className="social-top">
              <Code size={24} />
              <ArrowUpRight size={18} className="social-arrow" />
            </div>
            <h2>LeetCode</h2>
            <p>
              <span>{social.leetcodeSolved || 0} Solved</span>
              <span>Rank: {social.leetcodeRanking || "N/A"}</span>
            </p>
          </a>
        )}

        {social.hackerone && (
          <a
            href={url(social.hackerone, "https://hackerone.com/")}
            target="_blank"
            rel="noopener noreferrer"
            className="social-card"
          >
            <div className="social-top">
              <BarChart2 size={24} />
              <ArrowUpRight size={18} className="social-arrow" />
            </div>
            <h2>HackerOne</h2>
            <p>Bug Bounty Platform</p>
          </a>
        )}

        {social.twitter && (
          <a
            href={url(social.twitter, "https://x.com/")}
            target="_blank"
            rel="noopener noreferrer"
            className="social-card"
          >
            <div className="social-top">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
              </svg>
              <ArrowUpRight size={18} className="social-arrow" />
            </div>
            <h2>X (Twitter)</h2>
            <p>Thoughts & Updates</p>
          </a>
        )}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .social-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        .social-card {
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          padding: 27px;
          background-color: var(--surface);
          border-radius: 8px;
          text-decoration: none;
          color: var(--ink);
          border: 1px solid var(--line);
          transition: border-color 0.25s, transform 0.25s;
        }
        .social-card.has-heatmap {
          background-color: var(--surface);
        }
        .social-card > * {
          position: relative;
          z-index: 2;
        }
        .social-card:hover {
          border-color: var(--strong-line);
          transform: translateY(-3px);
        }
        .social-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 25px;
          color: var(--orange);
        }
        .social-arrow {
          color: var(--quiet);
          transition: transform 0.2s, color 0.2s;
        }
        .social-card:hover .social-arrow {
          transform: translate(2px, -2px);
          color: var(--orange);
        }
        .social-card h2 {
          font-size: 20px;
          letter-spacing: -0.3px;
          font-weight: 500;
          margin: 0;
        }
        .social-card p {
          font-size: 13px;
          color: var(--subtle);
          margin: 15px 0 0;
          display: flex;
          gap: 15px;
        }
      `,
        }}
      />
    </section>
  );
}

import React from "react";
import GithubProjects from "./GithubProjects";
import { getGithubRepos } from "@/lib/github";

interface GithubProjectsWrapperProps {
  username?: string;
  portfolioData: any;
}

export default async function GithubProjectsWrapper({ username, portfolioData }: GithubProjectsWrapperProps) {
  const githubRepos = username ? await getGithubRepos(username) : [];
  
  return <GithubProjects initialRepos={githubRepos} portfolioData={portfolioData} />;
}

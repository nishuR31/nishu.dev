import React from "react";
import dynamic from "next/dynamic";
import { getPortfolioData } from "@/lib/portfolio";
import { withUsableImages } from "@/lib/project-images-server";

const AssistantWidget = dynamic(() => import("./Assistant"), {
  ssr: false,
});

export default async function ServerAssistant() {
  const result = await getPortfolioData();
  // Strip dead local image paths before the data is serialized to the client.
  const data = result.ok
    ? {
        ...result.data,
        projects: Array.isArray(result.data?.projects)
          ? result.data.projects.map((p: any) => withUsableImages(p))
          : result.data?.projects,
      }
    : null;
  return <AssistantWidget portfolioData={data} />;
}

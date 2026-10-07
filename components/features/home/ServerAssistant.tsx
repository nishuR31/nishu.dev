import React from "react";
import dynamic from "next/dynamic";
import { getPortfolioData } from "@/lib/portfolio";

const AssistantWidget = dynamic(() => import("./Assistant"), {
  ssr: false,
});

export default async function ServerAssistant() {
  const result = await getPortfolioData();
  const data = result.ok ? result.data : null;
  return <AssistantWidget portfolioData={data} />;
}

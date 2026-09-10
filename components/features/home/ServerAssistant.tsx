import React from "react";
import AssistantWidget from "./Assistant";
import { getPortfolioData } from "@/lib/portfolio";

export default async function ServerAssistant() {
  const result = await getPortfolioData();
  const data = result.ok ? result.data : null;
  return <AssistantWidget portfolioData={data} />;
}

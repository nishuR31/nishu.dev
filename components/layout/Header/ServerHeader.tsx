import React from "react";
import Header from "./index";
import { getPortfolioData } from "@/lib/portfolio";

export default async function ServerHeader() {
  const data = await getPortfolioData();
  const navItems = data?.NAV_ITEMS || [
    { href: "/", label: "Home" },
    { href: "/experience", label: "Experience" },
    { href: "/projects", label: "Projects" },
    { href: "/certificates", label: "Certificates" },
    { href: "/contact", label: "Contact" },
  ];

  return <Header navItems={navItems} />;
}

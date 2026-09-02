"use client";
import React from "react";
import { Layers, Zap, Code, Terminal, Database, Server, Smartphone, Monitor } from "lucide-react";

interface Service {
  id: string;
  title: string;
  description: string;
  pricing?: string;
  icon?: string;
}

interface ServicesSectionProps {
  portfolioData: any;
}

// Map string icon names to actual Lucide components
const IconMap: Record<string, React.ElementType> = {
  Layers, Zap, Code, Terminal, Database, Server, Smartphone, Monitor
};

const ServicesSection: React.FC<ServicesSectionProps> = ({ portfolioData }) => {
  const services: Service[] = (portfolioData?.services ?? []).filter((s: any) => s.visible !== false);

  if (!services || services.length === 0) return null;

  return (
    <section className="py-24 cv-auto relative" id="services">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center space-y-6 mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full text-primary backdrop-blur-sm">
            <Layers className="w-5 h-5" />
            <span className="text-sm font-medium">What I Do</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold font-outfit gradient-heading">
              Services & Expertise
            </h2>
            <p className="text-lg text-muted-foreground">
              Delivering high-quality solutions tailored to your business needs
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {services.map((service, index) => {
            const IconComponent = service.icon && IconMap[service.icon] ? IconMap[service.icon] : Layers;
            
            return (
              <div 
                key={service.id || index}
                className="group relative bg-card/40 border border-border/50 hover:border-primary/50 backdrop-blur-xl p-8 rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1"
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
                </div>
                
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.2)]">
                    <IconComponent className="w-7 h-7 text-primary" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-foreground mb-3 font-outfit group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {service.description}
                  </p>
                  
                  {service.pricing && (
                    <div className="inline-block mt-auto">
                      <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-secondary border border-border text-foreground shadow-sm group-hover:border-primary/30 transition-colors">
                        {service.pricing}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;

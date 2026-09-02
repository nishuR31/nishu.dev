"use client";
import React from "react";
import { MessageSquareQuote, Star } from "lucide-react";

interface Testimonial {
  id: string;
  authorName: string;
  authorRole: string;
  authorCompany?: string;
  content: string;
  avatarUrl?: string;
}

interface TestimonialsSectionProps {
  portfolioData: any;
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ portfolioData }) => {
  const testimonials: Testimonial[] = (portfolioData?.testimonials ?? []).filter((t: any) => t.visible !== false);

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-24 cv-auto bg-secondary/5 border-y border-border/50" id="testimonials">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center space-y-6 mb-16">
          <div className="inline-flex items-center space-x-2 bg-pink-500/10 border border-pink-500/20 px-4 py-2 rounded-full text-pink-500 backdrop-blur-sm">
            <MessageSquareQuote className="w-5 h-5" />
            <span className="text-sm font-medium">Client Feedback</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold font-outfit gradient-heading">
              What People Say
            </h2>
            <p className="text-lg text-muted-foreground">
              Testimonials from clients and colleagues I've had the pleasure of working with
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id || index}
              className="bg-card border border-border/60 hover:border-pink-500/30 p-8 rounded-3xl transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] flex flex-col group relative overflow-hidden"
            >
              <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none">
                <MessageSquareQuote className="w-32 h-32 text-pink-500" />
              </div>
              
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              
              <p className="text-muted-foreground italic leading-relaxed mb-8 flex-1 relative z-10">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center gap-4 pt-6 border-t border-border/50 relative z-10">
                {testimonial.avatarUrl ? (
                  <img 
                    src={testimonial.avatarUrl} 
                    alt={testimonial.authorName} 
                    className="w-12 h-12 rounded-full object-cover border-2 border-background ring-2 ring-pink-500/20"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-500 font-bold border-2 border-background ring-2 ring-pink-500/20">
                    {testimonial.authorName.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-foreground">{testimonial.authorName}</h4>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.authorRole} {testimonial.authorCompany && <span className="opacity-70">@ {testimonial.authorCompany}</span>}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

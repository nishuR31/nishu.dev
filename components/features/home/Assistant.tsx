"use client";
import React, { useState } from "react";
import { MessageSquare, X, Send, Bot, User } from "lucide-react";
import { usePortfolio } from "@/store";

export default function AssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: 'Hi! I am the portfolio assistant. Feel free to ask me about Nishan\'s projects, skills, or experience!' }
  ]);
  const [input, setInput] = useState("");
  const { portfolioData, loading } = usePortfolio();

  if (loading) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput("");

    // Deterministic answering logic
    setTimeout(() => {
      let response = "I'm not sure about that. Try asking about 'projects', 'skills', 'experience', or 'contact'.";
      const q = userMsg.toLowerCase();
      
      if (q.includes("project")) {
        const count = portfolioData?.projects?.length || 0;
        response = `Nishan has built over ${count} projects! Some of the top ones include RanchiKart and Devclip Hub. Check out the Projects page for more!`;
      } else if (q.includes("skill") || q.includes("tech")) {
        response = "Nishan specializes in Backend Development, primarily using Node.js, Express, Fastify, MongoDB, and PostgreSQL.";
      } else if (q.includes("experience") || q.includes("work")) {
        response = "Nishan is actively building production-grade backend systems and has practical experience structuring scalable architectures.";
      } else if (q.includes("contact") || q.includes("email") || q.includes("hire")) {
        const email = portfolioData?.developer?.email || "nishan.developer.dev@gmail.com";
        response = `You can reach out to Nishan at ${email} or via the Contact page!`;
      }

      setMessages(prev => [...prev, { role: 'bot', text: response }]);
    }, 500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {isOpen && (
        <div className="w-80 sm:w-96 mb-4 glass-premium border border-border/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="flex items-center justify-between p-4 border-b border-border/50 bg-primary/5">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              <span className="font-semibold text-sm">Portfolio Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="h-80 overflow-y-auto p-4 space-y-4 bg-card/20">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-primary/20 text-primary' : 'bg-secondary/50 text-foreground'}`}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`p-3 rounded-2xl max-w-[80%] text-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-card border border-border/50 text-foreground rounded-tl-sm'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className="p-3 border-t border-border/50 bg-card/40 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me something..."
              className="flex-1 bg-background border border-border rounded-full px-4 py-2 text-sm focus:outline-none focus:border-primary/50"
            />
            <button type="submit" className="bg-primary text-primary-foreground p-2 rounded-full hover:opacity-90 transition-opacity">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-300"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>
    </div>
  );
}

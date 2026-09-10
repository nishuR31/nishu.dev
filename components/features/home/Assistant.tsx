"use client";
import React, { useState, useEffect } from "react";
import { X, Send, Bot, User, ChevronLeft, ChevronRight } from "lucide-react";

interface AssistantWidgetProps {
  portfolioData: any;
}

export default function AssistantWidget({ portfolioData }: AssistantWidgetProps) {
  // isOpen handles the actual chat window visibility
  const [isOpen, setIsOpen] = useState(false);
  // isPeeking handles the small handle tab visibility
  const [isPeeking, setIsPeeking] = useState(false);

  const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string }[]>([
    {
      role: "bot",
      text: "Hello! I am Nishan's virtual assistant. How can I help you learn more about his background, projects, or technical expertise today?",
    },
  ]);
  const [input, setInput] = useState("");

  // Delay the initial peek so it doesn't immediately show on page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPeeking(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!portfolioData?.developer?.name) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");

    // Faster, deterministic answering logic with HTML support
    setTimeout(() => {
      let response =
        "I'm currently unable to process that request. Could you please specify if you'd like to know about Nishan's **projects**, **skills**, **experience**, **education**, or **contact** details?";
      const q = userMsg.toLowerCase();

      const dev = portfolioData?.developer || {};

      const badWords = [
        "fuck",
        "shit",
        "bitch",
        "asshole",
        "cunt",
        "dick",
        "idiot",
        "stupid",
        "bastard",
      ];
      const containsBadWord = badWords.some((word) => q.includes(word));

      if (containsBadWord) {
        response =
          "Please keep the conversation professional. I am here to help you learn more about Nishan's work and background.";
      } else if (
        q.includes("who") ||
        q.includes("about") ||
        q.includes("hello") ||
        q.includes("hi") ||
        q.includes("hey") ||
        q.includes("greetings") ||
        q.includes("morning") ||
        q.includes("evening")
      ) {
        response = `Hello! I am Nishan Rajak's virtual assistant. Nishan is a Backend-Focused Software Engineer specializing in scalable REST API architecture, authentication systems, and modular backend design. How can I assist you today?`;
      } else if (
        q.includes("how are you") ||
        q.includes("how do you do") ||
        q.includes("your day")
      ) {
        response =
          "I'm just a virtual assistant, but I'm doing great! Ready to help you explore Nishan's portfolio. What would you like to see?";
      } else if (
        q.includes("who made you") ||
        q.includes("creator") ||
        q.includes("real person") ||
        q.includes("are you human")
      ) {
        response =
          "I am an AI assistant integrated into this portfolio, developed by Nishan Rajak to help you navigate his work and experience!";
      } else if (q.includes("age") || q.includes("old is he") || q.includes("old are you")) {
        response =
          "I don't age, but Nishan is an enthusiastic software engineering student, always learning and building new things.";
      } else if (
        q.includes("weather") ||
        q.includes("time") ||
        q.includes("date") ||
        q.includes("day is it")
      ) {
        response =
          "I don't have access to real-time weather or clocks, but it's always a good time to write some code! Want to see some of Nishan's projects?";
      } else if (q.includes("joke") || q.includes("meaning of life") || q.includes("funny")) {
        response =
          "Why do programmers prefer dark mode? Because light attracts bugs! Anyway, if you're looking for serious code, check out the Projects section.";
      } else if (q.includes("project")) {
        const count = portfolioData?.projects?.length || 0;
        response = `Nishan has architected and delivered over ${count} projects, focusing on scalable multi-database systems and real-time architectures. Notable works include RanchiKart, FocusMode, Devclip Hub, and GH Control. You can explore these in detail on the <a href="/projects" class="text-blue-400 hover:underline">Projects page</a>.`;
      } else if (q.includes("skill") || q.includes("tech") || q.includes("stack")) {
        const skillCats =
          portfolioData?.skills?.map((c: any) => c.title).join(", ") ||
          "Backend, Database, and DevOps";
        response = `Nishan's technical expertise spans across ${skillCats}. He is highly proficient in modern backend technologies including Node.js, Express, Fastify, TypeScript, MongoDB, MySQL, and Redis caching.`;
      } else if (
        q.includes("experience") ||
        q.includes("work") ||
        q.includes("internship") ||
        q.includes("hackathon")
      ) {
        const expCount = portfolioData?.experiences?.length || 0;
        response = `Nishan has ${expCount} professional experiences, including building production-grade backend systems, participating in global hackathons, and developing scalable architectures. Please review the <a href="/#experience" class="text-blue-400 hover:underline">Experience section</a> for a comprehensive breakdown.`;
      } else if (
        q.includes("education") ||
        q.includes("study") ||
        q.includes("studied") ||
        q.includes("degree") ||
        q.includes("university")
      ) {
        response = `Nishan is pursuing a B.Tech in Computer Science and Engineering, maintaining a strong academic foundation in software engineering principles, algorithms, and system design.`;
      } else if (q.includes("certificate") || q.includes("cert") || q.includes("achievement")) {
        const certCount = portfolioData?.certificates?.length || 0;
        response = `Nishan holds ${certCount} professional certifications across various technical domains. You can view the credentials on the <a href="/certificates" class="text-blue-400 hover:underline">Certificates page</a>.`;
      } else if (
        q.includes("contact") ||
        q.includes("email") ||
        q.includes("hire") ||
        q.includes("number") ||
        q.includes("freelance")
      ) {
        response = `For professional inquiries or collaboration opportunities, you can reach Nishan directly at <a href="mailto:${dev.email || "nishan.developer.dev@gmail.com"}" class="text-blue-400 hover:underline">${dev.email || "nishan.developer.dev@gmail.com"}</a>, or use the form on the <a href="/contact" class="text-blue-400 hover:underline">Contact page</a>.`;
      } else if (
        q.includes("social") ||
        q.includes("github") ||
        q.includes("linkedin") ||
        q.includes("twitter") ||
        q.includes("x.com")
      ) {
        response = `You can connect with Nishan professionally on <a href="${dev.linkedin || "#"}" target="_blank" class="text-blue-400 hover:underline">LinkedIn</a>, review his open-source contributions on <a href="https://github.com/${dev.github || "nishuR31"}" target="_blank" class="text-blue-400 hover:underline">GitHub</a>, or follow his updates on <a href="${dev.twitter || "#"}" target="_blank" class="text-blue-400 hover:underline">Twitter/X</a>.`;
      } else if (q.includes("cv") || q.includes("resume")) {
        response = `Nishan's professional CV is available upon request. Please feel free to reach out via the <a href="/contact" class="text-blue-400 hover:underline">Contact page</a> or via email to request a copy.`;
      } else if (q.includes("thank")) {
        response = `You're very welcome! Feel free to ask if there's anything else you'd like to know about Nishan's background or work.`;
      }

      setMessages((prev) => [...prev, { role: "bot", text: response }]);
    }, 250);
  };

  return (
    <>
      {/* The Peeking Handle */}
      <div
        className={`fixed top-1/2 -translate-y-1/2 right-0 z-[100] transition-transform duration-500 ease-in-out ${isOpen ? "translate-x-full" : isPeeking ? "translate-x-0" : "translate-x-full"}`}
      >
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center p-2 bg-primary/90 text-primary-foreground rounded-l-2xl shadow-xl hover:bg-primary transition-colors border border-r-0 border-primary/20 backdrop-blur-md group"
          aria-label="Open Assistant"
        >
          <ChevronLeft className="w-4 h-4 mr-1 opacity-70 group-hover:opacity-100 transition-opacity" />
          <Bot className="w-6 h-6 animate-pulse" />
        </button>
      </div>

      {/* The Chat Window (Sliding in from Right) */}
      <div
        className={`fixed top-0 right-0 h-full w-80 sm:w-96 z-[110] bg-background/60 backdrop-blur-3xl border-l border-border/50 shadow-2xl transition-transform duration-500 ease-in-out flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50 bg-primary/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full border border-primary/20">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span className="font-semibold text-sm text-foreground block">AI Assistant</span>
              <span className="text-[10px] text-emerald-500 font-medium">● Online</span>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-muted-foreground hover:text-foreground p-2 rounded-full hover:bg-secondary/50 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm ${msg.role === "user" ? "bg-primary/20 text-primary" : "bg-secondary/80 text-foreground border border-border/50"}`}
              >
                {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div
                className={`p-3 rounded-2xl max-w-[80%] text-sm leading-relaxed shadow-sm ${msg.role === "user" ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-card border border-border/50 text-foreground rounded-tl-sm"}`}
                dangerouslySetInnerHTML={{ __html: msg.text }}
              />
            </div>
          ))}
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSend}
          className="p-4 border-t border-border/50 bg-background/80 flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me about Nishan..."
            className="flex-1 bg-secondary/50 border border-border/50 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="bg-primary text-primary-foreground p-2.5 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Overlay for mobile to close when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/20 backdrop-blur-sm z-[105] md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

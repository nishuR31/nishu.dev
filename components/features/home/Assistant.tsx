"use client";
import React, { useState, useEffect } from "react";
import { X, Send, Bot, User, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";

interface AssistantWidgetProps {
  portfolioData: any;
}

export default function AssistantWidget({ portfolioData }: AssistantWidgetProps) {
  // isOpen handles the actual chat window visibility
  const [isOpen, setIsOpen] = useState(false);
  // isPeeking handles the small handle tab visibility
  const [isPeeking, setIsPeeking] = useState(false);

  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

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

  // Ping the backend to check if the AI is online
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const res = await fetch(`${backendUrl}/api/llm/hello`);
        const data = await res.json();
        if (data.success) {
          setIsOnline(true);
        } else {
          setIsOnline(false);
        }
      } catch (error) {
        setIsOnline(false);
      } finally {
        setIsChecking(false);
      }
    };
    checkStatus();
  }, []);

  if (!portfolioData?.developer?.name) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !isOnline) return;

    const userMsg = input.trim();
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setIsTyping(true);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

      // Wait for the backend LLM response
      const response = await fetch(`${backendUrl}/api/llm/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: userMsg }),
      });

      const data = await response.json();
      setIsTyping(false);

      if (data.success && data.data && data.data.answer) {
        setMessages((prev) => [...prev, { role: "bot", text: data.data.answer }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "bot", text: "Sorry, I had trouble finding an answer to that." },
        ]);
      }
    } catch (error) {
      console.error("LLM fetch error:", error);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "I'm having trouble connecting to my brain right now. Please try again later!" },
      ]);
    }
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
              {isOnline ? (
                <span className="text-[10px] text-emerald-500 font-medium flex items-center gap-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  Online
                </span>
              ) : (
                <span className="text-[10px] text-red-500 font-medium flex items-center gap-1">
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  {isChecking ? "Checking..." : "Offline"}
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            aria-label="Close Assistant"
            onClick={() => setIsOpen(false)}
            className="text-muted-foreground hover:text-foreground p-2 rounded-full hover:bg-secondary/50 transition-colors"
          >
            <ChevronRight className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Relative container for chat area so we can overlay it */}
        <div className="relative flex-1 flex flex-col overflow-hidden">
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
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm bg-secondary/80 text-foreground border border-border/50">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3 rounded-2xl max-w-[80%] text-sm leading-relaxed shadow-sm bg-card border border-border/50 text-foreground rounded-tl-sm flex space-x-1.5 items-center">
                  <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
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
              disabled={isTyping || !isOnline}
              placeholder={!isOnline ? "Chat unavailable" : isTyping ? "AI is typing..." : "Ask me about Nishan..."}
              className="flex-1 bg-secondary/50 border border-border/50 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground disabled:opacity-50"
            />
            <button
              type="submit"
              aria-label="Send message"
              disabled={!input.trim() || isTyping || !isOnline}
              className="bg-primary text-primary-foreground p-2.5 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center"
            >
              <Send className="w-4 h-4" aria-hidden="true" />
            </button>
          </form>

          {/* Offline Overlay Screen */}
          {!isChecking && !isOnline && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/40 backdrop-blur-md p-6 text-center animate-in fade-in duration-300">
              <div className="bg-secondary/80 p-4 rounded-full border border-border/50 shadow-sm mb-4">
                <AlertCircle className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-foreground font-semibold mb-2">Chat Unavailable</h3>
              <p className="text-muted-foreground text-sm">
                The AI assistant is currently offline. Please check back later.
              </p>
            </div>
          )}
        </div>
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

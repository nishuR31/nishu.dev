"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";

export default function SocketProvider() {
  const router = useRouter();

  useEffect(() => {
    const api = process.env.NEXT_PUBLIC_API_URL || "https://nishu-dev-api.onrender.com";
    
    // Connect to the Socket.io server
    const socket = io(api, {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      withCredentials: true
    });

    socket.on("connect", () => {
      console.log("Connected to real-time portfolio updates");
      // Demonstrate bidirectional connection
      socket.emit("client:ping", { timestamp: Date.now() });
    });
    
    socket.on("server:pong", (data) => {
      console.log("Server pong received:", data);
    });

    socket.on("portfolio:updated", (data) => {
      console.log("Portfolio data updated, refreshing...", data);
      // Re-fetch the page data by calling router.refresh()
      router.refresh();
    });

    return () => {
      socket.disconnect();
    };
  }, [router]);

  return null;
}

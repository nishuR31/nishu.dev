"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Bot,
  CheckCircle2,
  Clock3,
  Database,
  Mail,
  RefreshCcw,
  Server,
} from "lucide-react";

function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${days}d ${hours}h ${minutes}m ${secs}s`;
}

const StatusChip = ({ ok, label }) => (
  <div
    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium border ${
      ok ?
        "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
      : "bg-red-500/10 border-red-500/30 text-red-400"
    }`}
  >
    {ok ?
      <CheckCircle2 className="w-3.5 h-3.5" />
    : <AlertTriangle className="w-3.5 h-3.5" />}
    <span>{label}</span>
  </div>
);

export default function SystemStatusPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHealth = async () => {
    try {
      setLoading(true);
      setError("");
      const healthUrl =
        process.env.NEXT_PUBLIC_BACKEND + "/health" ||
        `http://localhost:${process.env.PORT}/health`;
      const response = await fetch(healthUrl, { cache: "no-store" });
      const json = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(
          json?.error || `Health check failed (${response.status})`,
        );
      }
      setData(json || null);
    } catch (err) {
      setData(null);
      setError(err?.message || String(err) || "Failed to fetch health status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  const cards = useMemo(() => {
    if (!data?.systems) return [];
    const apiOk = Boolean(data?.systems?.api?.ok);
    const redisOk = Boolean(data?.systems?.redis?.ok);
    const queueOk = Boolean(data?.systems?.queue?.ok);
    const workerOk = Boolean(data?.systems?.workerHeartbeat?.ok);
    const mailOk = Boolean(data?.systems?.mailConfig?.ok);

    return [
      {
        title: "API",
        icon: Server,
        ok: apiOk,
        details: data?.systems?.api?.message || "Core API route is reachable",
      },
      {
        title: "Redis",
        icon: Database,
        ok: redisOk,
        details:
          data?.systems?.redis?.message ||
          data?.systems?.redis?.status ||
          "Unavailable",
      },
      {
        title: "Queue",
        icon: Activity,
        ok: queueOk,
        details:
          queueOk ?
            `waiting ${data?.systems?.queue?.counts?.waiting || 0}, active ${data?.systems?.queue?.counts?.active || 0}, failed ${data?.systems?.queue?.counts?.failed || 0}`
          : data?.systems?.queue?.message || "Unavailable",
      },
      {
        title: "Mail Worker",
        icon: Bot,
        ok: workerOk,
        details:
          data?.systems?.workerHeartbeat?.online ?
            `online • pid ${data?.systems?.workerHeartbeat?.pid || "?"} • last seen ${Math.floor((data?.systems?.workerHeartbeat?.lastSeenMs || 0) / 1000)}s ago`
          : data?.systems?.workerHeartbeat?.message || "offline",
      },
      {
        title: "Mail Config",
        icon: Mail,
        ok: mailOk,
        details:
          mailOk ?
            "All required env vars are present"
          : `Missing: ${(data?.systems?.mailConfig?.missing || []).join(", ")}`,
      },
    ];
  }, [data]);

  return (
    <section className="py-20 min-h-[calc(100vh-160px)]">
      <div className="container mx-auto px-6 max-w-5xl space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary">
              System Status
            </h1>
            <p className="text-muted-foreground mt-2">
              Live health checks for API, Redis, queue, and mail setup.
            </p>
          </div>
          <button
            onClick={fetchHealth}
            className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-4 py-2 text-sm hover:border-primary/40 transition-colors"
          >
            <RefreshCcw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {loading && (
          <p className="text-muted-foreground">Checking systems...</p>
        )}
        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400 text-sm">
            {error}
          </div>
        )}

        {data && (
          <>
            <div className="flex flex-wrap gap-3 items-center">
              <StatusChip
                ok={data.ok}
                label={data.ok ? "All Systems Operational" : "Issues Detected"}
              />
              <StatusChip
                ok={true}
                label={`Uptime: ${formatUptime(data.uptimeSeconds || 0)}`}
              />
              <StatusChip
                ok={true}
                label={`Response: ${data.responseTimeMs}ms`}
              />
              <StatusChip
                ok={true}
                label={`Checked: ${new Date(data.timestamp).toLocaleTimeString()}`}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cards.map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.title}
                    className="rounded-2xl border border-border/70 bg-card/70 p-5 backdrop-blur-sm"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Icon className="w-5 h-5 text-primary" />
                        <h2 className="font-semibold">{card.title}</h2>
                      </div>
                      {card.ok ?
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      : <AlertTriangle className="w-5 h-5 text-red-400" />}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {card.details}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="rounded-2xl border border-border/70 bg-card/70 p-5 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 mb-2">
                <Clock3 className="w-4 h-4" />
                <span className="font-medium text-foreground">
                  Live Monitoring
                </span>
              </div>
              Auto-refresh runs every 10 seconds while this page is open.
            </div>
          </>
        )}
      </div>
    </section>
  );
}

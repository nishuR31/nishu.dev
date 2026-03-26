"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Database,
  RefreshCcw,
  Server,
  Settings2,
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
  const startRef = useRef(null);
  const [uptimeSeconds, setUptimeSeconds] = useState(0);

  const fetchHealth = async () => {
    try {
      setLoading(true);
      setError("");
      // Choose backend base URL based on environment.
      // If NEXT_PUBLIC_NODE_ENV (or NODE_ENV) indicates development, prefer local backend.
      const envNode =
        process.env.NEXT_PUBLIC_NODE_ENV ||
        process.env.NODE_ENV ||
        "production";
      const isDev = /dev(elopment)?/i.test(envNode);
      const defaultLocal = "http://localhost:4000";
      const healthBase =
        isDev ?
          process.env.NEXT_PUBLIC_BACKEND_DEV || defaultLocal
        : process.env.NEXT_PUBLIC_BACKEND || defaultLocal;
      const start = Date.now();

      const backendResp = await fetch(`${healthBase}/health`, {
        cache: "no-store",
      });
      const backendJson =
        backendResp.ok ? await backendResp.json().catch(() => null) : null;

      const configResp = await fetch(`${healthBase}/config`, {
        cache: "no-store",
      }).catch(() => null);
      const configJson =
        configResp && configResp.ok ?
          await configResp.json().catch(() => null)
        : null;

      const responseTimeMs = Date.now() - start;

      if (!backendResp || !backendResp.ok) {
        throw new Error(
          `Health endpoint returned ${backendResp ? backendResp.status : "no-response"}`,
        );
      } else if (!configResp || !configResp.ok) {
        throw new Error(
          `Health endpoint returned ${configResp ? configResp.status : "no-response"}`,
        );
      }

      setData({
        backendJson,
        configJson,
        responseTimeMs,
        timestamp: Date.now(),
        uptimeSeconds: uptimeSeconds,
      });
    } catch (err) {
      setData(null);
      setError(err?.message || String(err) || "Failed to fetch health status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // run immediately, then poll every 10 min
    fetchHealth();
    const interval = setInterval(fetchHealth, 1000 * 10 * 60);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // initialize start timestamp in localStorage if missing
    try {
      const stored = Number(localStorage.getItem("uptime"));
      if (!stored || Number.isNaN(stored)) {
        const now = Date.now();
        localStorage.setItem("uptime", String(now));
        startRef.current = now;
      } else {
        startRef.current = stored;
      }
    } catch (e) {
      // localStorage may be unavailable; fallback to now
      startRef.current = Date.now();
    }

    // update uptime every second
    const tick = () => {
      const start = startRef.current || Date.now();
      setUptimeSeconds(Math.floor((Date.now() - start) / 1000));
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const cards = useMemo(() => {
    if (!data) return [];
    const backendOK = Boolean(data?.backendJson?.success);
    const configOk = Boolean(data?.configJson?.success);

    return [
      {
        title: "Backend",
        icon: Server,
        ok: backendOK,
        details:
          data?.backendJson?.message ||
          data?.backendJson?.status ||
          "Core Mail API route is reachable",
        raw: data?.backendJson,
      },
      {
        title: "Configurations",
        icon: Settings2,
        ok: configOk,
        details:
          configOk ?
            "All required env vars are present"
          : `Missing: ${(data?.systems?.mailConfig?.missing || []).join(", ")}`,
        raw: data?.configJson,
      },
    ];
  }, [data]);

  const allOk = Boolean(
    data?.backendJson?.success && data?.configJson?.success,
  );

  return (
    <section className="py-20 min-h-[calc(100vh-160px)]">
      <div className="container max-w-5xl px-6 mx-auto space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold md:text-4xl text-primary">
              System Status
            </h1>
            <p className="mt-2 text-muted-foreground">
              Live health checks for API, Redis, and configuration setup.
            </p>
          </div>
          <button
            onClick={fetchHealth}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm text-center transition-colors border rounded-full border-border/70 bg-card hover:border-primary/40"
          >
            <RefreshCcw className="w-4 h-4 hover:animate-spin" />
            Refresh
          </button>
        </div>

        {loading && (
          <p className="p-5 text-center rounded-md text-muted-foreground bg-green-500/10">
            Checking systems...
          </p>
        )}
        {error && (
          <div className="p-4 text-sm text-red-400 border rounded-xl border-red-500/30 bg-red-500/10">
            {error}
          </div>
        )}

        {data && (
          <>
            <div className="flex flex-wrap items-center gap-3">
              <StatusChip
                ok={allOk}
                label={data.ok ? "All Systems Operational" : "Issues Detected"}
              />
              <StatusChip
                ok={allOk}
                label={`Uptime: ${formatUptime(uptimeSeconds)}`}
              />
              <StatusChip
                ok={allOk}
                label={`Response: ${data.responseTimeMs}ms`}
              />
              <StatusChip
                ok={allOk}
                label={`Checked: ${new Date(data.timestamp).toLocaleTimeString()}`}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {cards.map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.title}
                    className="p-5 border rounded-2xl border-border/70 bg-card/70 backdrop-blur-sm"
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
                    {/* show error/debug details when not ok; otherwise show brief success note */}
                    {!card.ok ?
                      <pre className="p-3 mt-3 overflow-auto text-xs text-red-400 rounded bg-red-500/5">
                        {JSON.stringify(card.raw || {}, null, 2)}
                      </pre>
                    : <div className="mt-3 text-xs text-emerald-400">
                        No issues detected — operational.
                      </div>
                    }
                  </div>
                );
              })}
            </div>

            <div className="p-5 text-sm border rounded-2xl border-border/70 bg-card/70 text-muted-foreground">
              <div className="flex items-center gap-2 mb-2">
                <Clock3 className="w-4 h-4" />
                <span className="font-medium text-foreground">
                  Live Monitoring
                </span>
              </div>
              Auto-refresh runs every 10 minutes while this page is open.
            </div>
          </>
        )}
      </div>
    </section>
  );
}

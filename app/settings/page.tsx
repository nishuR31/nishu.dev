"use client";
import React, { useState } from "react";
import { Settings, Trash2, RefreshCw, HardDrive, Database, AlertCircle, ArrowDown, Settings2 } from "lucide-react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { clear } from "../../slices/portfolioSlice";

export default function SettingsPage() {
  const dispatch = useDispatch();
  const [isClearing, setIsClearing] = useState(false);

  const handleClearCache = async () => {
    setIsClearing(true);
    try {
      localStorage.clear();
      localStorage.setItem("theme", "dark");
      sessionStorage.clear();
      dispatch(clear());

      toast.success("Cache cleared successfully!", {
        description: "Your application state has been reset.",
      });

      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (error) {
      toast.error("Failed to clear cache", {
        description: "Something went wrong while resetting the state.",
      });
      setIsClearing(false);
    }
  };

  return (
    <div className="portfolio-home">
      <section className="hero-section site-width" style={{ paddingBottom: '40px' }}>
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="status-dot" /> SYSTEM PREFERENCES
          </div>
          <p className="hero-intro">
            Application Settings <span className="wave"><Settings2 /></span>
          </p>
          <h1>
            Resolve
            <br />
            stale <span className="hero-serif">data.</span>
            <span className="hero-period" aria-hidden="true">
              *
            </span>
          </h1>
          <p className="hero-description">
            If the portfolio appears buggy, is not loading new projects, or shows inconsistent information, you can perform a hard reset to clear all local cache and session data.
          </p>
        </div>

        <div className="architecture-demo" style={{ padding: '30px', transform: 'none' }}>
          <div className="demo-topline" style={{ marginBottom: '20px' }}>
            <span>
              <i />
              <i />
              <i />
            </span>
            <p>STORAGE.SYS</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="project-tile" style={{ padding: '20px', transform: 'none' }}>
              <div className="project-meta" style={{ marginBottom: '10px' }}>
                <span><HardDrive size={14} style={{ display: 'inline', marginRight: '5px' }} /> Local Storage</span>
                <span style={{ color: 'var(--orange)' }}>Active</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--subtle)' }}>Theme & preferences cache</p>
            </div>

            <div className="project-tile" style={{ padding: '20px', transform: 'none' }}>
              <div className="project-meta" style={{ marginBottom: '10px' }}>
                <span><Database size={14} style={{ display: 'inline', marginRight: '5px' }} /> Application State</span>
                <span style={{ color: 'var(--orange)' }}>Active</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--subtle)' }}>Redux store & API response cache</p>
            </div>

            <button
              onClick={handleClearCache}
              disabled={isClearing}
              className="button button-orange"
              style={{ width: '100%', marginTop: '10px', border: 'none', cursor: isClearing ? 'not-allowed' : 'pointer', opacity: isClearing ? 0.7 : 1 }}
            >
              {isClearing ? <RefreshCw className="animate-spin" size={17} /> : <Trash2 size={17} />}
              {isClearing ? "Clearing Cache..." : "Clear Cache & Reload"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

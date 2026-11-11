"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Send,
  Star,
  ShieldCheck,
  Mail,
  Building,
  User,
  Briefcase,
  Link as LinkIcon,
} from "lucide-react";
import BackgroundEffects from "@/components/ui/background-effects";

export default function TestimonialSubmitPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [organization, setOrganization] = useState("");
  const [relationship, setRelationship] = useState("Collaborator");
  const [rating, setRating] = useState(5);
  const [testimonial, setTestimonial] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [invitationToken, setInvitationToken] = useState("");

  const [genuineConfirmed, setGenuineConfirmed] = useState(false);
  const [consentConfirmed, setConsentConfirmed] = useState(false);

  // Email verification states
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verificationToken, setVerificationToken] = useState("");
  const [previewCode, setPreviewCode] = useState<string | null>(null);

  // Form submission states
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Read invite query param if present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const invite = params.get("invite");
      if (invite) {
        setInvitationToken(invite);
      }
    }
  }, []);

  const getApiBase = () => {
    if (typeof window !== "undefined") {
      if (process.env.NEXT_PUBLIC_API_URL)
        return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
      return window.location.hostname === "localhost"
        ? "http://localhost:4000"
        : "https://nishu-dev.onrender.com";
    }
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  };

  const handleSendVerificationCode = async () => {
    if (!email || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address first.");
      return;
    }
    setErrorMessage(null);
    setSendingCode(true);

    try {
      const api = getApiBase();
      const res = await fetch(`${api}/api/portfolio/testimonials/verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to send verification code");
      }

      setVerificationSent(true);
      if (data.data?.previewCode) {
        setPreviewCode(data.data.previewCode);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Could not start email verification.");
    } finally {
      setSendingCode(false);
    }
  };

  const handleConfirmVerification = async () => {
    if (!verificationCode || verificationCode.trim().length !== 6) {
      setErrorMessage("Please enter the 6-digit code.");
      return;
    }
    setErrorMessage(null);
    setVerifyingCode(true);

    try {
      const api = getApiBase();
      const res = await fetch(`${api}/api/portfolio/testimonials/verification/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), code: verificationCode.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Invalid or expired verification code");
      }

      setIsEmailVerified(true);
      setVerificationToken(data.data?.verificationToken || "verified");
    } catch (err: any) {
      setErrorMessage(err.message || "Verification code failed.");
    } finally {
      setVerifyingCode(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim()) {
      setErrorMessage("Full name is required.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("A valid email address is required.");
      return;
    }
    if (!isEmailVerified && !invitationToken) {
      setErrorMessage("Please verify your email address before submitting.");
      return;
    }
    if (!testimonial.trim() || testimonial.trim().length < 20) {
      setErrorMessage("Testimonial content must be at least 20 characters.");
      return;
    }
    if (!genuineConfirmed) {
      setErrorMessage("You must confirm this reflects your genuine experience.");
      return;
    }
    if (!consentConfirmed) {
      setErrorMessage("You must consent to public display if approved.");
      return;
    }

    setSubmitting(true);
    try {
      const api = getApiBase();
      const payload: any = {
        fullName: fullName.trim(),
        email: email.trim(),
        role: role.trim() || null,
        organization: organization.trim() || null,
        relationship,
        rating: Number(rating),
        testimonial: testimonial.trim(),
        profileUrl: profileUrl.trim() || null,
        genuineExperienceConfirmed: true,
        publicDisplayConsent: true,
      };

      if (invitationToken) {
        payload.invitationToken = invitationToken.trim();
      }
      if (verificationToken) {
        payload.verificationToken = verificationToken;
      }

      const res = await fetch(`${api}/api/portfolio/testimonials/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to submit testimonial.");
      }

      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to submit testimonial. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="journey-page min-h-screen relative overflow-hidden"
      style={{ minHeight: "100vh", padding: "40px 0" }}
    >
      <BackgroundEffects
        variant="diagonal"
        colors={{ first: "primary", second: "secondary" }}
        intensity="8"
        blurAmount="3xl"
      />

      <main
        className="site-width journey-page__content"
        style={{ maxWidth: "680px", margin: "0 auto" }}
      >
        <Link href="/testimonials" className="back-link" style={{ marginBottom: "24px" }}>
          <ArrowLeft size={16} /> Back to testimonials
        </Link>

        {isSuccess ? (
          <div
            className="project-tile"
            style={{
              padding: "48px 32px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "18px",
            }}
          >
            <CheckCircle2 size={52} style={{ color: "var(--orange, #f59e0b)" }} />
            <h1 style={{ fontSize: "28px", margin: 0, fontWeight: 800 }}>
              Thank You for Sharing<span className="orange-text">!</span>
            </h1>
            <p
              style={{
                fontSize: "15px",
                lineHeight: "1.6",
                color: "var(--subtle)",
                maxWidth: "480px",
              }}
            >
              Your testimonial has been securely received and entered into the moderation queue.
              Every submission is reviewed before being published to protect privacy and integrity.
            </p>
            <div style={{ marginTop: "16px" }}>
              <Link href="/" className="button button-orange" style={{ textDecoration: "none" }}>
                Return to Portfolio
              </Link>
            </div>
          </div>
        ) : (
          <div className="project-tile" style={{ padding: "36px 28px", transform: "none" }}>
            <div style={{ marginBottom: "28px" }}>
              <p
                className="eyebrow"
                style={{ color: "var(--orange)", fontWeight: 700, fontSize: "12px" }}
              >
                COLLABORATION & FEEDBACK
              </p>
              <h1 style={{ fontSize: "30px", fontWeight: 800, margin: "8px 0" }}>
                Share your experience<span className="orange-text">.</span>
              </h1>
              <p style={{ fontSize: "14px", color: "var(--subtle)", margin: 0 }}>
                Your feedback helps others understand our engineering collaboration and impact.
                Submissions are reviewed before publication.
              </p>
            </div>

            {errorMessage && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "12px 16px",
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  borderRadius: "12px",
                  color: "#ef4444",
                  fontSize: "13px",
                  marginBottom: "24px",
                }}
              >
                <AlertCircle size={18} shrink-0="true" />
                <span>{errorMessage}</span>
              </div>
            )}

            {invitationToken && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 14px",
                  background: "rgba(16, 185, 129, 0.1)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  borderRadius: "12px",
                  color: "#10b981",
                  fontSize: "12px",
                  marginBottom: "24px",
                }}
              >
                <ShieldCheck size={16} />
                <span>Direct Invitation Token Attached ({invitationToken.slice(0, 8)}...)</span>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "22px" }}
            >
              {/* Personal Details */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <h3
                  style={{
                    fontSize: "14px",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    margin: 0,
                    opacity: 0.7,
                  }}
                >
                  Your Details
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "12px",
                        fontWeight: 700,
                        marginBottom: "6px",
                      }}
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Maya Patel"
                      className="w-full"
                      style={{
                        padding: "11px 14px",
                        background: "rgba(255, 255, 255, 0.03)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        borderRadius: "10px",
                        fontSize: "14px",
                        color: "inherit",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "12px",
                        fontWeight: 700,
                        marginBottom: "6px",
                      }}
                    >
                      Email Address *{" "}
                      <span style={{ opacity: 0.6, fontWeight: 400 }}>(Private)</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      disabled={isEmailVerified}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="maya@company.com"
                      className="w-full"
                      style={{
                        padding: "11px 14px",
                        background: "rgba(255, 255, 255, 0.03)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        borderRadius: "10px",
                        fontSize: "14px",
                        color: "inherit",
                        outline: "none",
                        opacity: isEmailVerified ? 0.7 : 1,
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "12px",
                        fontWeight: 700,
                        marginBottom: "6px",
                      }}
                    >
                      Professional Role
                    </label>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g. Lead Architect"
                      className="w-full"
                      style={{
                        padding: "11px 14px",
                        background: "rgba(255, 255, 255, 0.03)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        borderRadius: "10px",
                        fontSize: "14px",
                        color: "inherit",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "12px",
                        fontWeight: 700,
                        marginBottom: "6px",
                      }}
                    >
                      Organization
                    </label>
                    <input
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="e.g. Nova Systems"
                      className="w-full"
                      style={{
                        padding: "11px 14px",
                        background: "rgba(255, 255, 255, 0.03)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        borderRadius: "10px",
                        fontSize: "14px",
                        color: "inherit",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Experience Details */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  paddingTop: "10px",
                }}
              >
                <h3
                  style={{
                    fontSize: "14px",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    margin: 0,
                    opacity: 0.7,
                  }}
                >
                  Your Experience
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "12px",
                        fontWeight: 700,
                        marginBottom: "6px",
                      }}
                    >
                      Relationship *
                    </label>
                    <select
                      value={relationship}
                      onChange={(e) => setRelationship(e.target.value)}
                      className="w-full"
                      style={{
                        padding: "11px 14px",
                        background: "#161616",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        borderRadius: "10px",
                        fontSize: "14px",
                        color: "inherit",
                        outline: "none",
                      }}
                    >
                      <option value="Client">Client</option>
                      <option value="Collaborator">Collaborator</option>
                      <option value="Colleague">Colleague</option>
                      <option value="Mentor">Mentor</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "12px",
                        fontWeight: 700,
                        marginBottom: "6px",
                      }}
                    >
                      Rating *
                    </label>
                    <div
                      style={{
                        display: "flex",
                        gap: "6px",
                        alignItems: "center",
                        paddingTop: "6px",
                      }}
                    >
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={22}
                          onClick={() => setRating(star)}
                          style={{
                            cursor: "pointer",
                            fill: star <= rating ? "var(--orange, #f59e0b)" : "none",
                            color:
                              star <= rating ? "var(--orange, #f59e0b)" : "rgba(255,255,255,0.2)",
                            transition: "all 0.2s ease",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: 700,
                      marginBottom: "6px",
                    }}
                  >
                    Testimonial *{" "}
                    <span style={{ opacity: 0.6, fontWeight: 400 }}>(Min 20 characters)</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={testimonial}
                    onChange={(e) => setTestimonial(e.target.value)}
                    placeholder="Describe how working with Nishu went, the technical results achieved, and the collaboration experience..."
                    className="w-full"
                    style={{
                      padding: "12px 14px",
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "10px",
                      fontSize: "14px",
                      color: "inherit",
                      outline: "none",
                      lineHeight: "1.5",
                      resize: "vertical",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: 700,
                      marginBottom: "6px",
                    }}
                  >
                    LinkedIn or Portfolio URL{" "}
                    <span style={{ opacity: 0.6, fontWeight: 400 }}>(Optional)</span>
                  </label>
                  <input
                    type="url"
                    value={profileUrl}
                    onChange={(e) => setProfileUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="w-full"
                    style={{
                      padding: "11px 14px",
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "10px",
                      fontSize: "14px",
                      color: "inherit",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              {/* Email Verification Section */}
              <div
                style={{
                  padding: "16px",
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                    }}
                  >
                    Email Verification
                  </span>
                  {isEmailVerified ? (
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        color: "#10b981",
                        fontSize: "12px",
                        fontWeight: 700,
                      }}
                    >
                      <CheckCircle2 size={14} /> Verified
                    </span>
                  ) : (
                    <span style={{ fontSize: "11px", color: "var(--subtle)" }}>
                      Required before submit
                    </span>
                  )}
                </div>

                {!isEmailVerified && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {!verificationSent ? (
                      <button
                        type="button"
                        onClick={handleSendVerificationCode}
                        disabled={sendingCode || !email}
                        className="button"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                          width: "100%",
                          padding: "10px",
                          fontSize: "13px",
                        }}
                      >
                        {sendingCode ? (
                          <Loader2 className="animate-spin" size={14} />
                        ) : (
                          <Mail size={14} />
                        )}
                        Send Verification Code
                      </button>
                    ) : (
                      <div style={{ display: "flex", gap: "8px" }}>
                        <input
                          type="text"
                          maxLength={6}
                          placeholder="6-digit code"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          style={{
                            flex: 1,
                            padding: "10px 14px",
                            background: "rgba(255, 255, 255, 0.05)",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            borderRadius: "10px",
                            fontSize: "14px",
                            color: "inherit",
                            textAlign: "center",
                            letterSpacing: "4px",
                            fontWeight: 700,
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleConfirmVerification}
                          disabled={verifyingCode || verificationCode.length !== 6}
                          className="button button-orange"
                          style={{ padding: "10px 18px", fontSize: "13px" }}
                        >
                          {verifyingCode ? (
                            <Loader2 className="animate-spin" size={14} />
                          ) : (
                            "Verify"
                          )}
                        </button>
                      </div>
                    )}

                    {previewCode && (
                      <div
                        style={{
                          fontSize: "11px",
                          color: "var(--orange)",
                          background: "rgba(245, 158, 11, 0.1)",
                          padding: "6px 10px",
                          borderRadius: "8px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span>
                          Dev code: <strong>{previewCode}</strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => setVerificationCode(previewCode)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "inherit",
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                        >
                          Auto-fill
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Consent Checkboxes */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: "10px", paddingTop: "6px" }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                    cursor: "pointer",
                    fontSize: "13px",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={genuineConfirmed}
                    onChange={(e) => setGenuineConfirmed(e.target.checked)}
                    style={{ marginTop: "3px" }}
                  />
                  <span>
                    This submission reflects my genuine experience working with Nishan Rajak.
                  </span>
                </label>

                <label
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                    cursor: "pointer",
                    fontSize: "13px",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={consentConfirmed}
                    onChange={(e) => setConsentConfirmed(e.target.checked)}
                    style={{ marginTop: "3px" }}
                  />
                  <span>
                    I consent to public display of my name, role, organization, rating, and feedback
                    if approved.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="button button-orange"
                style={{
                  width: "100%",
                  padding: "14px",
                  fontSize: "15px",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  marginTop: "8px",
                  cursor: submitting ? "not-allowed" : "pointer",
                  opacity: submitting ? 0.7 : 1,
                }}
              >
                {submitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                {submitting ? "Submitting for Moderation..." : "Submit Testimonial"}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

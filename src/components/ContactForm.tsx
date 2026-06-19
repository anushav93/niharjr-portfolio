"use client";

import React, { useState, useRef } from "react";
import { cn } from "@/functions/cn";
import CornerFrameButton from "./CornerFrameButton";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_CLOUDFLARE_SITE_KEY!;

const ContactForm: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [error, setError] = useState("");
  
  // Reference to store timeouts
  const timeoutRef = React.useRef<{
    success?: NodeJS.Timeout;
    error?: NodeJS.Timeout;
  }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !message) {
      setError("Please fill in all fields");
      timeoutRef.current.error = setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }

    // Bot detection: If honeypot is filled, silently fail (pretend success)
    if (honeypot) {
      setStatus("success");
      timeoutRef.current.success = setTimeout(() => {
        setName("");
        setEmail("");
        setMessage("");
        setStatus("idle");
      }, 3000);
      return;
    }

    // Turnstile verification
    if (!turnstileToken) {
      setError("Please complete the security check");
      timeoutRef.current.error = setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      timeoutRef.current.error = setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }

    try {
      setStatus("loading");
      setError("");

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          message,
          turnstileToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setStatus("success");

      // Clear any existing timeouts
      if (timeoutRef.current.success) clearTimeout(timeoutRef.current.success);
      if (timeoutRef.current.error) clearTimeout(timeoutRef.current.error);

      // Set new success timeout
      timeoutRef.current.success = setTimeout(() => {
        setName("");
        setEmail("");
        setMessage("");
        setTurnstileToken(null);
        turnstileRef.current?.reset();
        setStatus("idle");
      }, 3000);
    } catch (err) {
      setStatus("error");
      setTurnstileToken(null);
      turnstileRef.current?.reset();

      // Clear any existing timeouts
      if (timeoutRef.current.success) clearTimeout(timeoutRef.current.success);
      if (timeoutRef.current.error) clearTimeout(timeoutRef.current.error);

      // Set new error timeout
      setError(err instanceof Error ? err.message : 'Failed to send message. Please try again.');
      timeoutRef.current.error = setTimeout(() => {
        setError("");
        setStatus("idle");
      }, 3000);
    }
  };

  // Cleanup timeouts on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current.success) clearTimeout(timeoutRef.current.success);
      if (timeoutRef.current.error) clearTimeout(timeoutRef.current.error);
    };
  }, []);

  return (
    <section className="w-full" aria-labelledby="contact-form-heading">
      <div className="flex items-center gap-4 mb-12">
        <div className="h-px flex-1 bg-border-default" aria-hidden="true" />
        <h2 id="contact-form-heading" className="text-2xl font-light tracking-tight text-foreground">
          Send a Message
        </h2>
        <div className="h-px flex-1 bg-border-default" aria-hidden="true" />
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Name Field */}
        <div className="relative group">
          <label 
            htmlFor="name" 
            className="block text-xs tracking-[0.2em] uppercase text-primary-600 mb-3 font-medium"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={status === "loading"}
            aria-invalid={!!error && !name}
            className={cn(
              "w-full px-4 py-4 bg-page border border-stone-500 text-foreground",
              "focus:outline-none focus:border-primary-500 focus:bg-surface transition-all",
              "text-sm disabled:opacity-50 disabled:cursor-not-allowed",
              "group-hover:border-primary-300"
            )}
            placeholder="Your name"
          />
        </div>

        {/* Email Field */}
        <div className="relative group">
          <label 
            htmlFor="email" 
            className="block text-xs tracking-[0.2em] uppercase text-primary-600 mb-3 font-medium"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading"}
            aria-invalid={!!error && !email}
            className={cn(
              "w-full px-4 py-4 bg-page border border-stone-500 text-foreground",
              "focus:outline-none focus:border-primary-500 focus:bg-surface transition-all",
              "text-sm disabled:opacity-50 disabled:cursor-not-allowed",
              "group-hover:border-primary-300"
            )}
            placeholder="your.email@example.com"
          />
        </div>

        {/* Message Field */}
        <div className="relative group">
          <label 
            htmlFor="message" 
            className="block text-xs tracking-[0.2em] uppercase text-primary-600 mb-3 font-medium"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={status === "loading"}
            aria-invalid={!!error && !message}
            rows={6}
            className={cn(
              "w-full px-4 py-4 bg-page border border-stone-500 text-foreground resize-none",
              "focus:outline-none focus:border-primary-500 focus:bg-surface transition-all",
              "text-sm disabled:opacity-50 disabled:cursor-not-allowed",
              "group-hover:border-primary-300"
            )}
            placeholder="Tell me about your project..."
          />
        </div>

        {/* Cloudflare Turnstile Widget */}
        <div className="flex justify-start">
          <Turnstile
            ref={turnstileRef}
            siteKey={TURNSTILE_SITE_KEY}
            onSuccess={(token) => setTurnstileToken(token)}
            onExpire={() => {
              setTurnstileToken(null);
              turnstileRef.current?.reset();
            }}
            onError={() => {
              setTurnstileToken(null);
              setError("Security check failed. Please try again.");
            }}
            options={{ theme: "light" }}
          />
        </div>

        {/* Success Message */}
        {status === "success" && (
          <div role="alert" className="p-4 border-l-2 border-success-500 bg-success-50 text-sm text-success-700">
            Message sent successfully! I&apos;ll get back to you soon.
          </div>
        )}

        {/* Honeypot Field for Bot Detection */}
        <div style={{ display: 'none' }}>
          <label htmlFor="website">Website</label>
          <input
            type="text"
            id="website"
            name="website"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

       

        <CornerFrameButton
        type="submit"
        variant="primary"
        disabled={status === "loading" || status === "success" || !turnstileToken}>  <span className="relative z-10">
            {status === "loading" ? "Sending..." : status === "success" ? "Sent!" : "Send Message"}
          </span></CornerFrameButton>
             {/* Error Message */}
             {error && (
          <div role="alert" className="p-4 border-l-2 border-error-500 bg-error-50 text-sm text-error-700">
            {error}
          </div>
        )}
      </form>
    </section>
  );
};

export default ContactForm;

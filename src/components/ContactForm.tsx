"use client";

import React, { useState } from "react";
import { cn } from "@/functions/cn";
import CornerFrameButton from "./CornerFrameButton";

const ContactForm: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState(""); // Bot detection
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
        setStatus("idle");
      }, 3000);
    } catch (err) {
      setStatus("error");
      
      // Clear any existing timeouts
      if (timeoutRef.current.success) clearTimeout(timeoutRef.current.success);
      if (timeoutRef.current.error) clearTimeout(timeoutRef.current.error);

      // Set new error timeout
      setError(err instanceof Error ? err.message : 'Failed to send message. Please try again.');
      timeoutRef.current.error = setTimeout(() => {
        setError("");
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
    <div className="w-full">
      {/* Section divider */}
      <div className="flex items-center gap-4 mb-12">
        <div className="h-px flex-1 bg-border-default" />
        <h2 className="text-2xl font-light tracking-tight text-text-primary">
          Send a Message
        </h2>
        <div className="h-px flex-1 bg-border-default" />
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
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
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={status === "loading"}
            className={cn(
              "w-full px-4 py-4 bg-[#f5e9df] border border-stone-500 text-text-primary",
              "focus:outline-none focus:border-primary-500 focus:bg-bg-primary transition-all",
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading"}
            className={cn(
              "w-full px-4 py-4 bg-[#f5e9df] border border-stone-500 text-text-primary",
              "focus:outline-none focus:border-primary-500 focus:bg-bg-primary transition-all",
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
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={status === "loading"}
            rows={6}
            className={cn(
              "w-full px-4 py-4 bg-[#f5e9df] border border-stone-500 text-text-primary resize-none",
              "focus:outline-none focus:border-primary-500 focus:bg-bg-primary transition-all",
              "text-sm disabled:opacity-50 disabled:cursor-not-allowed",
              "group-hover:border-primary-300"
            )}
            placeholder="Tell me about your project..."
          />
        </div>

     

        {/* Success Message */}
        {status === "success" && (
          <div className="p-4 border-l-2 border-success-500 bg-success-50 text-sm text-success-700">
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
        
        type="submit" disabled={status === "loading" || status === "success"}>  <span className="relative z-10">
            {status === "loading" ? "Sending..." : status === "success" ? "Sent!" : "Send Message"}
          </span></CornerFrameButton>
             {/* Error Message */}
        {error && (
          <div className="p-4 border-l-2 border-error-500 bg-error-50 text-sm text-error-700">
            {error}
          </div>
        )}
      </form>
    </div>
  );
};

export default ContactForm;

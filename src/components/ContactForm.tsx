"use client";

import React, { useState } from "react";
import Button from "./Button";
import Typography from "./Typography";
import { motion } from "framer-motion";
import { cn } from "@/functions/cn";

const ContactForm: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
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
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.0 }}
          >
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Your name"
            />
          </motion.div>
        </div>

        <div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="your@email.com"
            />
          </motion.div>
        </div>

        <div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Your message..."
            />
          </motion.div>
        </div>

        <div>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-r"
              role="alert"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg 
                    className="h-5 w-5 text-red-500"
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    {error}
                  </p>
                </div>
              </div>
            </motion.div>
          )}



          <motion.div
            className="pt-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <button
              type="submit"
              disabled={status === "loading"}
              className={cn(
                "group",
                "border border-neutral-900 hover:bg-neutral-900 hover:text-white px-4 py-2 text-base transition-all duration-300 ease-in-out flex items-center justify-center relative group disabled:opacity-50 disabled:cursor-not-allowed",
                status === "success" && "bg-green-600 hover:bg-green-700 border-green-600",
                status === "error" && "bg-red-600 hover:bg-red-700 border-red-600"
              )}
            >
              <span className="flex items-center justify-center space-x-2">
                {status === "loading" ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Sending...</span>
                  </>
                ) : status === "success" ? (
                  <>
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </motion.svg>
                    <span>Message Sent!</span>
                  </>
                ) : status === "error" ? (
                  <>
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </motion.svg>
                    <span>Failed to Send</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"
                      />
                    </svg>
                    <span>Send Message</span>
                  </>
                )}
              </span>
            </button>
          </motion.div>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
"use client";

import React, { useState } from "react";
import { Phone, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/context/ProfileContext";
import { ThemeToggle } from "./ThemeToggle";

export const LoginScreen: React.FC = () => {
  const { login } = useAuth();
  const { data } = useProfile();
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!mobile.trim()) {
      setError("অনুগ্রহ করে মোবাইল নম্বর লিখুন");
      return;
    }
    if (!password.trim()) {
      setError("অনুগ্রহ করে পাসওয়ার্ড লিখুন");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = login(mobile, password);
      if (!res.success) {
        setError(res.message || "ভুল মোবাইল নম্বর বা পাসওয়ার্ড! সঠিক তথ্য দিন।");
      }
      setIsLoading(false);
    }, 250);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-zinc-50 dark:bg-[#09090b] relative transition-colors duration-200">
      
      {/* Top right theme toggle */}
      <div className="absolute top-5 right-5">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        
        {/* Card */}
        <div className="glass-panel rounded-lg p-5 sm:p-8 border border-zinc-200/90 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/80 shadow-xl space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="w-20 h-20 rounded-lg mx-auto overflow-hidden border-2 border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.photoUrl}
                alt={data.fullName}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                {data.fullName}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-500 font-medium mt-0.5">
                Personal Dashboard & Security Portal
              </p>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs sm:text-sm font-semibold flex items-center gap-2.5 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form with empty initial inputs (manual typing required) */}
          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
            
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                মোবাইল নম্বর (Mobile Number)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  name="mobile_number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="মোবাইল নম্বর লিখুন..."
                  autoComplete="off"
                  autoFocus
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm font-medium rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/70 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                পাসওয়ার্ড (Password)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="user_password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="পাসওয়ার্ড লিখুন..."
                  autoComplete="new-password"
                  required
                  className="w-full pl-10 pr-10 py-2.5 text-sm font-medium rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/70 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-0.5"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-lg text-sm font-bold bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm flex items-center justify-center gap-2 transition-all transform active:scale-[0.99] mt-2"
            >
              <span>{isLoading ? "যাচাই করা হচ্ছে..." : "লগইন করুন (Enter Dashboard)"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>

    </div>
  );
};

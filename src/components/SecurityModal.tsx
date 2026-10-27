"use client";

import React, { useState } from "react";
import { X, Key, Phone, Lock, Check, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface SecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityModal: React.FC<SecurityModalProps> = ({ isOpen, onClose }) => {
  const { credentials, updateCredentials } = useAuth();
  const [mobile, setMobile] = useState(credentials.mobile);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile.trim()) {
      setMessage({ text: "মোবাইল নম্বর খালি রাখা যাবে না!", type: "error" });
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setMessage({ text: "পাসওয়ার্ড দুটি মিলছে না! পুনরায় চেক করুন।", type: "error" });
      return;
    }

    updateCredentials(mobile.trim(), newPassword.trim() || credentials.password);
    setMessage({ text: "লগইন তথ্য সফলভাবে আপডেট হয়েছে!", type: "success" });
    setTimeout(() => {
      setMessage(null);
      onClose();
    }, 1500);
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 space-y-4"
      >
        <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-cyan-400 flex items-center justify-center">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                Security & Login Credentials
              </h3>
              <p className="text-xs text-zinc-500">
                ডায়নামিকভাবে আপনার মোবাইল নম্বর ও পাসওয়ার্ড পরিবর্তন করুন
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {message && (
          <div
            className={`p-3 rounded-lg text-xs font-semibold flex items-center gap-2 ${
              message.type === "success"
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
            }`}
          >
            {message.type === "success" ? <Check className="w-4 h-4" /> : null}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              লগইন মোবাইল নম্বর
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="01719052334"
                required
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-zinc-400 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              নতুন পাসওয়ার্ড (পরিবর্তন না করতে চাইলে খালি রাখুন)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="নতুন পাসওয়ার্ড দিন..."
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-zinc-400 font-mono"
              />
            </div>
          </div>

          {newPassword && (
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                নতুন পাসওয়ার্ড নিশ্চিত করুন
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="পুনরায় পাসওয়ার্ড লিখুন..."
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-zinc-400 font-mono"
                />
              </div>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-sm hover:opacity-90"
            >
              আপডেট করুন
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

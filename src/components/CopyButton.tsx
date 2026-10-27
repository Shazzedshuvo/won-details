"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CopyButtonProps {
  textToCopy: string;
  label?: string;
  showText?: boolean;
  className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  textToCopy,
  label = "Copy",
  showText = false,
  className = "",
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = textToCopy;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      type="button"
      title={`Copy "${textToCopy}"`}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-all duration-150 border ${
        copied
          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
          : "bg-white hover:bg-zinc-50 text-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 shadow-sm"
      } ${className}`}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-500 transition-transform scale-105" />
          {showText && <span className="font-medium text-[11px]">Copied</span>}
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-200" />
          {showText && <span className="text-[11px]">{label}</span>}
        </>
      )}
    </button>
  );
};

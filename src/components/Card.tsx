import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  headerBorder?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  title,
  subtitle,
  icon,
  action,
  headerBorder = true,
}) => {
  return (
    <div
      className={`glass-panel rounded-lg p-4 sm:p-6 transition-all duration-200 hover:border-slate-300 dark:hover:border-zinc-700 bg-white/80 dark:bg-zinc-900/60 border border-slate-200/90 dark:border-zinc-800 shadow-sm ${className}`}
    >
      {(title || icon || action) && (
        <div
          className={`flex items-start justify-between gap-3 ${
            headerBorder ? "pb-3.5 mb-4 border-b border-slate-200/80 dark:border-zinc-800" : "mb-3"
          }`}
        >
          <div className="flex items-center gap-3">
            {icon && (
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-cyan-400 border border-blue-200/60 dark:border-blue-900/50 flex items-center justify-center shrink-0">
                {icon}
              </div>
            )}
            <div>
              {title && (
                <h3 className="font-semibold text-sm sm:text-base text-zinc-900 dark:text-zinc-100 tracking-tight">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-normal">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

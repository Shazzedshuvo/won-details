"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ShieldCheck, Key, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { LoginScreen } from "./LoginScreen";
import { Sidebar } from "./Sidebar";
import { ThemeToggle } from "./ThemeToggle";
import { personalData } from "@/data/personalData";

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isReady, logout } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const pathname = usePathname();

  // If loading session
  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-[#09090b]">
        <div className="w-8 h-8 rounded-full border-2 border-zinc-900 dark:border-white border-t-transparent animate-spin" />
      </div>
    );
  }

  // If not logged in -> Show Login Page!
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  const getPageTitle = () => {
    if (pathname === "/cv-builder") return "ATS-Friendly CV Builder";
    if (pathname === "/showcase") return "Official Documents & Project Showcase";
    if (pathname === "/vault") return "Custom Vault & Project Records";
    if (pathname === "/settings") return "Profile & Site Settings";
    return "Personal Dashboard & Civil Registry";
  };

  return (
    <div className="min-h-screen flex bg-zinc-50/70 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      
      {/* Desktop Left Sidebar (Fixed from Top to Bottom) */}
      <div className="hidden md:block shrink-0 sticky top-0 h-screen z-30 no-print">
        <Sidebar />
      </div>

      {/* Mobile Drawer Sidebar */}
      {mobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex animate-fade-in no-print">
          <div 
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div className="relative z-10 w-72 max-w-[85vw] h-full bg-white dark:bg-[#0c0c0e] shadow-2xl flex flex-col">
            <div className="absolute top-3 right-3 z-20">
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <Sidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Right Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 h-16 shrink-0 flex items-center justify-between px-3 sm:px-6 lg:px-8 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md border-b border-zinc-200/90 dark:border-zinc-800 no-print">
          
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              type="button"
              className="md:hidden p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 shrink-0"
              aria-label="Open sidebar menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="min-w-0 truncate">
              <h1 className="text-sm sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight truncate">
                {getPageTitle()}
              </h1>
              <span className="text-[11px] sm:text-xs text-zinc-500 hidden sm:block truncate">
                MD. SAZZAD HOSEN SHUVO • Verified Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <span className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              01719052334
            </span>

            <ThemeToggle />

            <button
              onClick={logout}
              type="button"
              className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-zinc-500 hover:text-rose-600 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </header>

        {/* Main Body */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-x-hidden">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-zinc-200/90 dark:border-zinc-800 py-5 px-4 sm:px-6 lg:px-8 text-xs text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-2 no-print bg-white/40 dark:bg-zinc-950/40">
          <div>
            MD. SAZZAD HOSEN SHUVO • Personal & Professional Dashboard
          </div>
          <div>
            Tentulia, Panchagarh - 5030, Bangladesh
          </div>
        </footer>

      </div>

    </div>
  );
};

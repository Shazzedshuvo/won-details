"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  FolderKanban, 
  Menu, 
  X, 
  ExternalLink,
  Code2
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    {
      name: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
      badge: null
    },
    {
      name: "CV Builder",
      href: "/cv-builder",
      icon: FileText,
      badge: "ATS"
    },
    {
      name: "Showcase",
      href: "/showcase",
      icon: FolderKanban,
      badge: "Gallery"
    }
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-nav transition-colors duration-200 no-print border-b border-zinc-200/80 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Identity */}
          <Link 
            href="/"
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-bold shadow-sm transition-transform group-hover:scale-105">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base tracking-tight text-zinc-900 dark:text-zinc-100">
                  SAZZAD HOSEN SHUVO
                </span>
                <span className="hidden xl:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                  Available
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-normal leading-none hidden sm:block">
                Web Developer & Specialist
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-lg border border-zinc-200/90 dark:border-zinc-800">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm border border-zinc-200/80 dark:border-zinc-700/80"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-blue-600 dark:text-blue-400" : ""}`} />
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold uppercase ${
                      isActive 
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300" 
                        : "bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                    }`}>
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            <a
              href="mailto:shazzedshuvo@gmail.com"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm transition-all"
            >
              <span>Get in Touch</span>
            </a>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="md:hidden p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 text-zinc-700 dark:text-zinc-200"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-3 pb-5 space-y-1.5 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 animate-fade-in shadow-lg">
          <div className="flex items-center justify-between px-2 py-1 text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
            <span>Navigation</span>
            <span className="flex items-center gap-1 text-emerald-500 lowercase font-normal">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              open for work
            </span>
          </div>

          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? "bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/60"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </div>
                {link.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-2">
            <a
              href="mailto:shazzedshuvo@gmail.com"
              className="flex items-center justify-center gap-2 w-full py-2 text-xs font-medium rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>shazzedshuvo@gmail.com</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

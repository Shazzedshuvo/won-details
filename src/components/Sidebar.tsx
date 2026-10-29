"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  FolderKanban, 
  Key, 
  LogOut, 
  ShieldCheck, 
  Phone, 
  Mail, 
  ExternalLink,
  ChevronRight,
  Code2,
  FolderOpen,
  Settings2,
  Wallet
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/context/ProfileContext";
import { ThemeToggle } from "./ThemeToggle";
import { SecurityModal } from "./SecurityModal";

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const pathname = usePathname();
  const { logout, credentials } = useAuth();
  const { data } = useProfile();
  const [securityOpen, setSecurityOpen] = useState(false);

  const navLinks = [
    {
      name: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
      badge: "Overview"
    },
    {
      name: "দৈনন্দিন খরচ ও বাজেট",
      href: "/expenses",
      icon: Wallet,
      badge: "Auto হিসাব"
    },
    {
      name: "ATS CV Builder",
      href: "/cv-builder",
      icon: FileText,
      badge: "7 Styles"
    },
    {
      name: "Files & Showcase",
      href: "/showcase",
      icon: FolderKanban,
      badge: "Files"
    },
    {
      name: "Vault & Custom Folders",
      href: "/vault",
      icon: FolderOpen,
      badge: "Records"
    },
    {
      name: "Profile & Settings",
      href: "/settings",
      icon: Settings2,
      badge: "Edit"
    }
  ];

  return (
    <>
      <aside className="w-full h-full flex flex-col justify-between p-4 sm:p-5 bg-white dark:bg-[#0c0c0e] border-r border-zinc-200/90 dark:border-zinc-800 transition-colors duration-200 select-none overflow-y-auto">
        
        {/* Top: Brand & User Identity */}
        <div className="space-y-6">
          
          {/* User Profile Card */}
          <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/90 dark:border-zinc-800 space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-lg overflow-hidden border border-zinc-300 dark:border-zinc-700 bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={data.photoUrl}
                    alt={data.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-900" />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                  {data.fullName}
                </h2>
                <p className="text-xs text-blue-600 dark:text-cyan-400 font-medium truncate">
                  {data.fullNameBn}
                </p>
                <span className="text-[11px] text-zinc-500 truncate block mt-0.5">
                  {data.profession}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Active Session
              </span>
              <span className="font-mono text-[10px] text-zinc-400">
                Panchagarh - 5030
              </span>
            </div>
          </div>

          {/* Navigation Links (Larger font, Left vertical menu) */}
          <div className="space-y-1">
            <span className="px-3 text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-2">
              Main Menu
            </span>

            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={onCloseMobile}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-sm"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{link.name}</span>
                  </div>
                  {link.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        isActive
                          ? "bg-zinc-800 text-zinc-200 dark:bg-zinc-200 dark:text-zinc-800"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                      }`}
                    >
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Quick Security & Tools */}
          <div className="space-y-1 pt-2">
            <span className="px-3 text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-2">
              System Settings
            </span>

            <button
              onClick={() => setSecurityOpen(true)}
              type="button"
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Key className="w-4 h-4 text-blue-500" />
                <span>Change Password</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            </button>
          </div>

        </div>

        {/* Bottom: Contact info, Theme Toggle & Logout */}
        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <span className="text-xs text-zinc-500 font-medium">Theme Mode</span>
            </div>

            <button
              onClick={logout}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              title="Logout from dashboard"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>

          <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800 text-[11px] text-zinc-500 space-y-1">
            <div className="flex items-center gap-1.5 truncate">
              <Phone className="w-3 h-3 text-zinc-400 shrink-0" />
              <span className="font-mono text-zinc-700 dark:text-zinc-300 font-medium">{credentials.mobile}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <Mail className="w-3 h-3 text-zinc-400 shrink-0" />
              <span className="truncate">{data.email}</span>
            </div>
          </div>

        </div>

      </aside>

      {/* Security Modal */}
      <SecurityModal isOpen={securityOpen} onClose={() => setSecurityOpen(false)} />
    </>
  );
};

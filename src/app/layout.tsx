import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { ShowcaseProvider } from "@/context/ShowcaseContext";
import { AuthProvider } from "@/context/AuthContext";
import { VaultProvider } from "@/context/VaultContext";
import { ProfileProvider } from "@/context/ProfileContext";
import { ExpenseProvider } from "@/context/ExpenseContext";
import { DashboardLayout } from "@/components/DashboardLayout";

export const metadata: Metadata = {
  title: "MD. SAZZAD HOSEN SHUVO | Personal Dashboard & Security Portal",
  description: "Secure Personal Dashboard, ATS-Friendly CV Builder, Custom Vault, and Project Showcase for MD. SAZZAD HOSEN SHUVO.",
  keywords: [
    "Sazzad Hosen Shuvo",
    "Web Developer",
    "MERN Stack",
    "Next.js",
    "React",
    "Dashboard",
    "Panchagarh"
  ],
  authors: [{ name: "MD. SAZZAD HOSEN SHUVO" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="antialiased selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-900 min-h-screen"
      >
        <ThemeProvider>
          <AuthProvider>
            <ProfileProvider>
              <ExpenseProvider>
                <ShowcaseProvider>
                  <VaultProvider>
                    <DashboardLayout>
                      {children}
                    </DashboardLayout>
                  </VaultProvider>
                </ShowcaseProvider>
              </ExpenseProvider>
            </ProfileProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

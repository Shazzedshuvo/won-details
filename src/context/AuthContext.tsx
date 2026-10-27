"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthCredentials {
  mobile: string;
  password: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  credentials: AuthCredentials;
  login: (mobile: string, pass: string) => { success: boolean; message?: string };
  logout: () => void;
  updateCredentials: (newMobile: string, newPass: string) => void;
  isReady: boolean;
}

const DEFAULT_CREDENTIALS: AuthCredentials = {
  mobile: "01719052334",
  password: "017190",
};

const CREDENTIALS_KEY = "shuvo_auth_credentials_v1";
const SESSION_KEY = "shuvo_is_authenticated_v1";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [credentials, setCredentials] = useState<AuthCredentials>(DEFAULT_CREDENTIALS);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    try {
      // Load saved credentials if any
      const savedCreds = localStorage.getItem(CREDENTIALS_KEY);
      if (savedCreds) {
        setCredentials(JSON.parse(savedCreds));
      } else {
        localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(DEFAULT_CREDENTIALS));
      }

      // Check session
      const session = localStorage.getItem(SESSION_KEY);
      if (session === "true") {
        setIsAuthenticated(true);
      }
    } catch (e) {
      console.error("Auth init error:", e);
    }
    setIsReady(true);
  }, []);

  const login = (mobile: string, pass: string) => {
    const cleanMobile = mobile.trim();
    const cleanPass = pass.trim();

    if (cleanMobile === credentials.mobile && cleanPass === credentials.password) {
      setIsAuthenticated(true);
      try {
        localStorage.setItem(SESSION_KEY, "true");
      } catch (e) {
        console.error(e);
      }
      return { success: true };
    }

    return {
      success: false,
      message: "ভুল মোবাইল নম্বর বা পাসওয়ার্ড! সঠিক তথ্য দিন।",
    };
  };

  const logout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  const updateCredentials = (newMobile: string, newPass: string) => {
    const updated: AuthCredentials = {
      mobile: newMobile.trim() || credentials.mobile,
      password: newPass.trim() || credentials.password,
    };
    setCredentials(updated);
    try {
      localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        credentials,
        login,
        logout,
        updateCredentials,
        isReady,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

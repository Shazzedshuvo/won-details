"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface ShowcaseItem {
  id: string;
  title: string;
  category: "certificate" | "project" | "document" | "govt";
  fileType: "image" | "pdf";
  fileUrl: string;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  description?: string;
  tags?: string[];
  dimensions?: string;
}

interface ShowcaseContextType {
  items: ShowcaseItem[];
  addItem: (item: Omit<ShowcaseItem, "id" | "uploadDate">) => void;
  deleteItem: (id: string) => void;
  resetToDefaults: () => void;
}

const defaultShowcaseItems: ShowcaseItem[] = [
  {
    id: "showcase-photo",
    title: "Official Applicant Photo (300×300)",
    category: "govt",
    fileType: "image",
    fileUrl: "/uploads/applicant-photo.jpg",
    fileName: "applicant-photo.jpg",
    fileSize: "21.9 KB",
    dimensions: "300 × 300 px",
    uploadDate: "Oct 27, 2026",
    description: "Official 300x300 px photo formatted specifically for Bangladesh Government Job applications (Teletalk/BPSC standard, under 100 KB).",
    tags: ["Govt Photo", "300x300", "Official", "MD. SAZZAD HOSEN SHUVO"]
  },
  {
    id: "showcase-sig",
    title: "Official Applicant Signature (300×80)",
    category: "govt",
    fileType: "image",
    fileUrl: "/uploads/applicant-signature.jpg",
    fileName: "applicant-signature.jpg",
    fileSize: "5.08 KB",
    dimensions: "300 × 80 px",
    uploadDate: "Oct 27, 2026",
    description: "Official 300x80 px digital signature formatted for Bangladesh Government Job portal submission (under 60 KB).",
    tags: ["Signature", "300x80", "Official", "BPSC/Teletalk"]
  },
  {
    id: "showcase-cert-1",
    title: "Diploma in Computer Science & Technology Certificate",
    category: "certificate",
    fileType: "image",
    fileUrl: "/uploads/03db379c-63a8-4451-bb06-afe796dda382.png",
    fileName: "BTEB_Diploma_Engineering_Certificate.png",
    fileSize: "2.18 MB",
    dimensions: "1086 × 1448 px",
    uploadDate: "2024",
    description: "Bangladesh Technical Education Board (BTEB) Diploma-in-Engineering Official Certificate. Roll: 500412, GPA: 3.24.",
    tags: ["BTEB", "Diploma", "Computer Science", "Roll: 500412", "GPA: 3.24"]
  },
  {
    id: "showcase-cert-2",
    title: "S.S.C Vocational Certificate in Computer & IT",
    category: "certificate",
    fileType: "image",
    fileUrl: "/uploads/628f2aa6-a658-43db-a7e2-b799f67b24ad.png",
    fileName: "SSC_Vocational_BTEB_Certificate.png",
    fileSize: "2.12 MB",
    dimensions: "1122 × 1402 px",
    uploadDate: "2020",
    description: "Bangladesh Technical Education Board (BTEB) SSC Vocational Official Certificate. Roll: 200840, GPA: 4.50.",
    tags: ["SSC Vocational", "BTEB", "Roll: 200840", "GPA: 4.50"]
  },
  {
    id: "showcase-doc-1",
    title: "Academic Grade Sheet & Verification Transcript",
    category: "document",
    fileType: "image",
    fileUrl: "/uploads/0490fcc5-d3f6-4e70-8b28-677ff51ff53d.png",
    fileName: "BTEB_Official_Academic_Transcript.png",
    fileSize: "2.06 MB",
    dimensions: "1086 × 1448 px",
    uploadDate: "2024",
    description: "Complete institutional semester grade sheet & verification transcript from Bangladesh Technical Education Board.",
    tags: ["Grade Sheet", "Transcript", "BTEB", "Academic Record"]
  },
  {
    id: "showcase-doc-2",
    title: "BTEB Board Registration & Verification Document",
    category: "document",
    fileType: "image",
    fileUrl: "/uploads/bb7748c0-b9da-4435-a94a-72008d8f718e.png",
    fileName: "BTEB_Board_Registration_Verification.png",
    fileSize: "2.05 MB",
    dimensions: "1122 × 1402 px",
    uploadDate: "Official",
    description: "Official institutional verification and board registration credential record.",
    tags: ["Registration", "BTEB", "Official Record", "Verification"]
  },
  {
    id: "showcase-doc-3",
    title: "Govt Job Application Summary Record",
    category: "govt",
    fileType: "image",
    fileUrl: "/uploads/Screenshot_22.png",
    fileName: "Govt_Job_Application_Summary.png",
    fileSize: "92.7 KB",
    dimensions: "557 × 269 px",
    uploadDate: "Oct 27, 2026",
    description: "Standard Bangladesh Government Job Application Record showing NID 9581214047, Tentulia, Panchagarh, and age calculation.",
    tags: ["Govt Application", "Teletalk", "Summary", "Verified Record"]
  }
];

const ShowcaseContext = createContext<ShowcaseContextType | undefined>(undefined);

const STORAGE_KEY = "shuvo_portfolio_showcase_items_v3";

export function ShowcaseProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ShowcaseItem[]>(defaultShowcaseItems);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed);
          return;
        }
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultShowcaseItems));
    } catch (e) {
      console.error("Failed to load showcase items from localStorage:", e);
    }
  }, []);

  const saveToStorage = (newItems: ShowcaseItem[]) => {
    setItems(newItems);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
    } catch (e) {
      console.error("Failed to save showcase items:", e);
    }
  };

  const addItem = (item: Omit<ShowcaseItem, "id" | "uploadDate">) => {
    const newItem: ShowcaseItem = {
      ...item,
      id: "item-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
      uploadDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      })
    };
    saveToStorage([newItem, ...items]);
  };

  const deleteItem = (id: string) => {
    saveToStorage(items.filter((it) => it.id !== id));
  };

  const resetToDefaults = () => {
    saveToStorage(defaultShowcaseItems);
  };

  return (
    <ShowcaseContext.Provider value={{ items, addItem, deleteItem, resetToDefaults }}>
      {children}
    </ShowcaseContext.Provider>
  );
}

export function useShowcase() {
  const context = useContext(ShowcaseContext);
  if (!context) {
    throw new Error("useShowcase must be used within a ShowcaseProvider");
  }
  return context;
}

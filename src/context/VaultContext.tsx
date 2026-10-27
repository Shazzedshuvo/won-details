"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface RecordField {
  label: string;
  value: string;
}

export interface VaultRecord {
  id: string;
  categoryId: string;
  title: string;
  note?: string;
  fields: RecordField[];
  fileUrl?: string;
  fileName?: string;
  fileType?: "image" | "pdf";
  fileSize?: string;
  createdAt: string;
}

export interface VaultCategory {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  createdAt: string;
}

interface VaultContextType {
  categories: VaultCategory[];
  records: VaultRecord[];
  addCategory: (name: string, description?: string, color?: string) => string;
  updateCategory: (id: string, name: string, description?: string) => void;
  deleteCategory: (id: string) => void;
  addRecord: (record: Omit<VaultRecord, "id" | "createdAt">) => void;
  updateRecord: (id: string, updated: Partial<Omit<VaultRecord, "id" | "createdAt">>) => void;
  deleteRecord: (id: string) => void;
  resetToDefaults: () => void;
}

const defaultCategories: VaultCategory[] = [
  {
    id: "cat-parents",
    name: "বাবা-মার তথ্যাবলী (Parents Details)",
    description: "পিতা-মাতার ব্যক্তিগত তথ্য, জাতীয় পরিচয়পত্র নম্বর, পেশা ও জরুরি বিবরণী।",
    color: "from-blue-500 to-indigo-600",
    createdAt: "2026-10-27"
  },
  {
    id: "cat-land",
    name: "জমির দলিল ও কাগজপত্র (Land & Property)",
    description: "খতিয়ান নম্বর, দাগ নম্বর, মৌজা, দলিলের বিবরণ ও পরিমাপ সংক্রান্ত তথ্য।",
    color: "from-emerald-500 to-teal-600",
    createdAt: "2026-10-27"
  },
  {
    id: "cat-projects",
    name: "প্রজেক্ট ও পোর্টফোলিও (Web Projects)",
    description: "ফুলস্ট্যাক ওয়েব প্রজেক্ট, গিটহাব রিপোজিটরি, ক্লায়েন্ট ডেলিভারি ও লাইভ লিংক।",
    color: "from-violet-500 to-purple-600",
    createdAt: "2026-10-27"
  },
  {
    id: "cat-bank",
    name: "ব্যাংক অ্যাকাউন্ট ও ট্যাক্স (Bank & Tax)",
    description: "ব্যাংক হিসাব নম্বর, রাউটিং নম্বর, ব্রাঞ্চ এবং ই-টিন (TIN) সার্টিফিকেট তথ্য।",
    color: "from-amber-500 to-orange-600",
    createdAt: "2026-10-27"
  }
];

const defaultRecords: VaultRecord[] = [
  {
    id: "rec-father",
    categoryId: "cat-parents",
    title: "পিতা: মোঃ আশরাফুল হক (MD. ASRAFUL HAQUE)",
    note: "পিতার সরকারি ও পারিবারিক কাগজপত্রের বিবরণী।",
    fields: [
      { label: "পিতার নাম (বাংলা)", value: "মোঃ আশরাফুল হক" },
      { label: "Father's Name (EN)", value: "MD. ASRAFUL HAQUE" },
      { label: "পেশা / Profession", value: "ব্যবসা ও কৃষি" },
      { label: "জাতীয়তা", value: "Bangladeshi" },
      { label: "ধর্ম", value: "Islam" },
      { label: "গ্রাম / রাস্তা", value: "NIJBARI, DEBENGARH" },
      { label: "ডাকঘর ও থানা", value: "DEBENGARH (5030), Tentulia" },
      { label: "জেলা", value: "Panchagarh (পঞ্চগড়)" }
    ],
    createdAt: "Oct 27, 2026"
  },
  {
    id: "rec-mother",
    categoryId: "cat-parents",
    title: "মাতা: মোছাঃ সেলিনা ইয়াসমিন (MOST. SALINA EASMIN)",
    note: "মাতার প্রয়োজনীয় নাগরিক তথ্যাবলী।",
    fields: [
      { label: "মাতার নাম (বাংলা)", value: "মোছাঃ সেলিনা ইয়াসমিন" },
      { label: "Mother's Name (EN)", value: "MOST. SALINA EASMIN" },
      { label: "পেশা / Profession", value: "গৃহিণী (Housewife)" },
      { label: "জাতীয়তা", value: "Bangladeshi" },
      { label: "গ্রাম / রাস্তা", value: "NIJBARI, DEBENGARH" },
      { label: "ডাকঘর ও থানা", value: "DEBENGARH (5030), Tentulia" },
      { label: "জেলা", value: "Panchagarh (পঞ্চগড়)" }
    ],
    createdAt: "Oct 27, 2026"
  },
  {
    id: "rec-land-1",
    categoryId: "cat-land",
    title: "নিজবাড়ী দেবনগর মৌজার জোত ও খতিয়ান বিবরণী",
    note: "তেঁতুলিয়া সাব-রেজিস্ট্রি অফিসের আওতাধীন দেবনগর মৌজার খতিয়ান ও দাগ রেকর্ড।",
    fields: [
      { label: "জেলা", value: "পঞ্চগড় (Panchagarh)" },
      { label: "উপজেলা / থানা", value: "তেঁতুলিয়া (Tentulia)" },
      { label: "ইউনিয়ন ও মৌজা", value: "দেবনগর (Debengarh)" },
      { label: "জে.এল নম্বর", value: "সংরক্ষিত" },
      { label: "খতিয়ান নম্বর (R.S / B.S)", value: "এন্ট্রি করুন (ক্লিক করে এডিট)" },
      { label: "দাগ নম্বর", value: "এন্ট্রি করুন" },
      { label: "জমির পরিমাণ", value: "পৈত্রিক জোত" },
      { label: "সাব-রেজিস্ট্রি অফিস", value: "তেঁতুলিয়া উপজেলা সাব-রেজিস্ট্রার কার্যালয়" }
    ],
    createdAt: "Oct 27, 2026"
  },
  {
    id: "rec-project-1",
    categoryId: "cat-projects",
    title: "Personal Dashboard & ATS CV Portfolio Web App",
    note: "Complete full-stack personal management dashboard built with Next.js 15, Tailwind, and React 19.",
    fields: [
      { label: "Developer", value: "MD. SAZZAD HOSEN SHUVO" },
      { label: "Technology Stack", value: "Next.js 15 App Router, React 19, Tailwind CSS, Lucide Icons" },
      { label: "Core Modules", value: "Govt Civil Registry, BTEB Diploma Records, 7-Format CV Generator, Dynamic Vault" },
      { label: "Security", value: "Custom Credentials Guard (Mobile: 01719052334), Session Persistence" },
      { label: "Standard Features", value: "Bangladesh 300x300 Photo, 300x80 Signature, Strict 8px Modern Radius" }
    ],
    createdAt: "Oct 27, 2026"
  }
];

const STORAGE_CAT_KEY = "shuvo_portfolio_vault_categories_v1";
const STORAGE_REC_KEY = "shuvo_portfolio_vault_records_v1";

const VaultContext = createContext<VaultContextType | undefined>(undefined);

export function VaultProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<VaultCategory[]>(defaultCategories);
  const [records, setRecords] = useState<VaultRecord[]>(defaultRecords);

  useEffect(() => {
    try {
      const storedCats = localStorage.getItem(STORAGE_CAT_KEY);
      if (storedCats) {
        const parsed = JSON.parse(storedCats);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCategories(parsed);
        }
      } else {
        localStorage.setItem(STORAGE_CAT_KEY, JSON.stringify(defaultCategories));
      }

      const storedRecs = localStorage.getItem(STORAGE_REC_KEY);
      if (storedRecs) {
        const parsedRecs = JSON.parse(storedRecs);
        if (Array.isArray(parsedRecs)) {
          setRecords(parsedRecs);
        }
      } else {
        localStorage.setItem(STORAGE_REC_KEY, JSON.stringify(defaultRecords));
      }
    } catch (e) {
      console.error("Failed to load vault items from localStorage:", e);
    }
  }, []);

  const saveCategories = (newCats: VaultCategory[]) => {
    setCategories(newCats);
    try {
      localStorage.setItem(STORAGE_CAT_KEY, JSON.stringify(newCats));
    } catch (e) {
      console.error("Failed to save categories:", e);
    }
  };

  const saveRecords = (newRecs: VaultRecord[]) => {
    setRecords(newRecs);
    try {
      localStorage.setItem(STORAGE_REC_KEY, JSON.stringify(newRecs));
    } catch (e) {
      console.error("Failed to save records:", e);
    }
  };

  const addCategory = (name: string, description?: string, color?: string): string => {
    const id = "cat-" + Date.now();
    const newCat: VaultCategory = {
      id,
      name: name.trim(),
      description: description?.trim(),
      color: color || "from-blue-500 to-indigo-600",
      createdAt: new Date().toISOString().split("T")[0]
    };
    saveCategories([...categories, newCat]);
    return id;
  };

  const updateCategory = (id: string, name: string, description?: string) => {
    saveCategories(
      categories.map((c) =>
        c.id === id ? { ...c, name: name.trim(), description: description?.trim() } : c
      )
    );
  };

  const deleteCategory = (id: string) => {
    saveCategories(categories.filter((c) => c.id !== id));
    // also delete or orphan its records
    saveRecords(records.filter((r) => r.categoryId !== id));
  };

  const addRecord = (record: Omit<VaultRecord, "id" | "createdAt">) => {
    const newRec: VaultRecord = {
      ...record,
      id: "rec-" + Date.now(),
      createdAt: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      })
    };
    saveRecords([newRec, ...records]);
  };

  const updateRecord = (id: string, updated: Partial<Omit<VaultRecord, "id" | "createdAt">>) => {
    saveRecords(
      records.map((r) => (r.id === id ? { ...r, ...updated } : r))
    );
  };

  const deleteRecord = (id: string) => {
    saveRecords(records.filter((r) => r.id !== id));
  };

  const resetToDefaults = () => {
    saveCategories(defaultCategories);
    saveRecords(defaultRecords);
  };

  return (
    <VaultContext.Provider
      value={{
        categories,
        records,
        addCategory,
        updateCategory,
        deleteCategory,
        addRecord,
        updateRecord,
        deleteRecord,
        resetToDefaults
      }}
    >
      {children}
    </VaultContext.Provider>
  );
}

export function useVault() {
  const context = useContext(VaultContext);
  if (!context) {
    throw new Error("useVault must be used within a VaultProvider");
  }
  return context;
}

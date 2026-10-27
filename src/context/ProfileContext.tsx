"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { personalData as defaultPersonalData, PersonalData, EducationItem } from "@/data/personalData";

interface ProfileContextType {
  data: PersonalData;
  faviconUrl: string;
  updatePersonalData: (updated: Partial<PersonalData>) => void;
  updateGovtDetails: (updated: Partial<PersonalData["govtDetails"]>) => void;
  updatePhoto: (photoUrl: string) => void;
  updateSignature: (signatureUrl: string) => void;
  updateFavicon: (faviconUrl: string) => void;
  addEducation: (item: EducationItem) => void;
  updateEducation: (index: number, item: EducationItem) => void;
  deleteEducation: (index: number) => void;
  resetToDefaults: () => void;
}

const STORAGE_PROFILE_KEY = "shuvo_portfolio_profile_data_v2";
const STORAGE_FAVICON_KEY = "shuvo_portfolio_favicon_v2";
const DEFAULT_FAVICON = "/uploads/applicant-photo.jpg";

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<PersonalData>(defaultPersonalData);
  const [faviconUrl, setFaviconUrl] = useState<string>(DEFAULT_FAVICON);

  // Initialize from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_PROFILE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === "object") {
          setData({
            ...defaultPersonalData,
            ...parsed,
            govtDetails: {
              ...defaultPersonalData.govtDetails,
              ...(parsed.govtDetails || {})
            },
            skills: {
              ...defaultPersonalData.skills,
              ...(parsed.skills || {})
            },
            education: Array.isArray(parsed.education) ? parsed.education : defaultPersonalData.education
          });
        }
      }

      const storedFav = localStorage.getItem(STORAGE_FAVICON_KEY);
      if (storedFav) {
        setFaviconUrl(storedFav);
        applyFavicon(storedFav);
      } else {
        applyFavicon(DEFAULT_FAVICON);
      }
    } catch (e) {
      console.error("Failed to load profile from localStorage:", e);
    }
  }, []);

  const applyFavicon = (url: string) => {
    if (typeof document === "undefined") return;
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = url;
  };

  const persistData = (newData: PersonalData) => {
    setData(newData);
    try {
      localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(newData));
    } catch (e) {
      console.error("Failed to persist profile:", e);
    }
  };

  const updatePersonalData = (updated: Partial<PersonalData>) => {
    const merged = { ...data, ...updated };
    persistData(merged);
  };

  const updateGovtDetails = (updated: Partial<PersonalData["govtDetails"]>) => {
    const merged = {
      ...data,
      govtDetails: {
        ...data.govtDetails,
        ...updated
      }
    };
    persistData(merged);
  };

  const updatePhoto = (newPhotoUrl: string) => {
    const merged = { ...data, photoUrl: newPhotoUrl };
    persistData(merged);
  };

  const updateSignature = (newSignatureUrl: string) => {
    const merged = { ...data, signatureUrl: newSignatureUrl };
    persistData(merged);
  };

  const updateFavicon = (newFaviconUrl: string) => {
    setFaviconUrl(newFaviconUrl);
    applyFavicon(newFaviconUrl);
    try {
      localStorage.setItem(STORAGE_FAVICON_KEY, newFaviconUrl);
    } catch (e) {
      console.error("Failed to persist favicon:", e);
    }
  };

  const addEducation = (item: EducationItem) => {
    const updatedEdu = [item, ...data.education];
    persistData({ ...data, education: updatedEdu });
  };

  const updateEducation = (index: number, item: EducationItem) => {
    const updatedEdu = [...data.education];
    updatedEdu[index] = item;
    persistData({ ...data, education: updatedEdu });
  };

  const deleteEducation = (index: number) => {
    const updatedEdu = data.education.filter((_, idx) => idx !== index);
    persistData({ ...data, education: updatedEdu });
  };

  const resetToDefaults = () => {
    persistData(defaultPersonalData);
    setFaviconUrl(DEFAULT_FAVICON);
    applyFavicon(DEFAULT_FAVICON);
    try {
      localStorage.removeItem(STORAGE_PROFILE_KEY);
      localStorage.removeItem(STORAGE_FAVICON_KEY);
    } catch (e) {
      console.error("Failed to clear localStorage:", e);
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        data,
        faviconUrl,
        updatePersonalData,
        updateGovtDetails,
        updatePhoto,
        updateSignature,
        updateFavicon,
        addEducation,
        updateEducation,
        deleteEducation,
        resetToDefaults
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}

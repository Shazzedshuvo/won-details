"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  User,
  GraduationCap,
  Sparkles,
  Upload,
  Check,
  Plus,
  Trash2,
  Edit2,
  Camera,
  Globe,
  ArrowLeft,
  RotateCcw,
  Shield,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Layers,
  Code,
  Save,
  CheckCircle2,
  FileSignature
} from "lucide-react";
import { useProfile } from "@/context/ProfileContext";
import { EducationItem } from "@/data/personalData";

export default function SettingsPage() {
  const {
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
  } = useProfile();

  // Active Tab
  const [activeTab, setActiveTab] = useState<"profile" | "education" | "civil" | "skills">("profile");

  // Save Success indicator
  const [savedSuccess, setSavedSuccess] = useState(false);

  // File Inputs
  const photoInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  // Education Modal / Form State
  const [isEduModalOpen, setIsEduModalOpen] = useState(false);
  const [editingEduIndex, setEditingEduIndex] = useState<number | null>(null);
  const [eduForm, setEduForm] = useState<EducationItem>({
    degree: "",
    institution: "",
    boardOrBatch: "",
    roll: "",
    group: "",
    passingYear: "",
    result: "",
    description: ""
  });

  // Local Form States for basic info
  const [fullName, setFullName] = useState(data.fullName);
  const [fullNameBn, setFullNameBn] = useState(data.fullNameBn);
  const [profession, setProfession] = useState(data.profession);
  const [summary, setSummary] = useState(data.summary);
  const [mobile, setMobile] = useState(data.mobile);
  const [email, setEmail] = useState(data.email);
  const [bloodGroup, setBloodGroup] = useState(data.bloodGroup);
  const [nid, setNid] = useState(data.nid);

  // Civil info
  const [fathersName, setFathersName] = useState(data.fathersName);
  const [fathersNameBn, setFathersNameBn] = useState(data.fathersNameBn);
  const [mothersName, setMothersName] = useState(data.mothersName);
  const [mothersNameBn, setMothersNameBn] = useState(data.mothersNameBn);
  const [dob, setDob] = useState(data.dob);
  const [village, setVillage] = useState(data.govtDetails.presentAddress.village);
  const [postOffice, setPostOffice] = useState(data.govtDetails.presentAddress.postOffice);
  const [postCode, setPostCode] = useState(data.govtDetails.presentAddress.postCode);
  const [upazila, setUpazila] = useState(data.govtDetails.presentAddress.upazila);
  const [district, setDistrict] = useState(data.govtDetails.presentAddress.district);

  // Skills
  const [frontendSkills, setFrontendSkills] = useState(data.skills.frontend.join(", "));
  const [backendSkills, setBackendSkills] = useState(data.skills.backend.join(", "));
  const [cmsSkills, setCmsSkills] = useState(data.skills.cms.join(", "));
  const [toolSkills, setToolSkills] = useState(data.skills.tools.join(", "));

  // Trigger Save Notification
  const notifySuccess = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // Uploading states
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isUploadingFavicon, setIsUploadingFavicon] = useState(false);
  const [isUploadingSignature, setIsUploadingSignature] = useState(false);

  // Profile Photo Upload (Cloudinary)
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const json = await res.json();
      
      if (res.ok && json.success && json.url) {
        updatePhoto(json.url);
        notifySuccess();
      } else {
        alert("Upload error: " + (json.error || "Failed to upload to Cloudinary"));
      }
    } catch (err: any) {
      console.error("Cloudinary photo upload error:", err);
      alert("Upload failed: " + err.message);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Favicon Upload (Cloudinary)
  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingFavicon(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const json = await res.json();
      
      if (res.ok && json.success && json.url) {
        updateFavicon(json.url);
        notifySuccess();
      } else {
        alert("Upload error: " + (json.error || "Failed to upload to Cloudinary"));
      }
    } catch (err: any) {
      console.error("Cloudinary favicon error:", err);
      alert("Upload failed: " + err.message);
    } finally {
      setIsUploadingFavicon(false);
    }
  };

  // Signature Upload (Cloudinary)
  const handleSignatureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingSignature(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const json = await res.json();
      
      if (res.ok && json.success && json.url) {
        updateSignature(json.url);
        notifySuccess();
      } else {
        alert("Upload error: " + (json.error || "Failed to upload to Cloudinary"));
      }
    } catch (err: any) {
      console.error("Cloudinary signature error:", err);
      alert("Upload failed: " + err.message);
    } finally {
      setIsUploadingSignature(false);
    }
  };

  // Save General Profile
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updatePersonalData({
      fullName,
      fullNameBn,
      profession,
      summary,
      mobile,
      email,
      bloodGroup,
      nid
    });
    updateGovtDetails({
      applicantName: fullName,
      applicantNameBn: fullNameBn,
      mobile,
      email,
      nid
    });
    notifySuccess();
  };

  // Save Civil Registry
  const handleSaveCivil = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedAddress = {
      careOf: fathersName,
      village,
      district,
      upazila,
      postOffice,
      postCode,
      fullAddress: `${village}, ${postOffice} - ${postCode}, ${upazila}, ${district}`
    };

    updatePersonalData({
      fathersName,
      fathersNameBn,
      mothersName,
      mothersNameBn,
      dob,
      address: updatedAddress.fullAddress
    });

    updateGovtDetails({
      fathersName,
      fathersNameBn,
      mothersName,
      mothersNameBn,
      dob,
      presentAddress: updatedAddress,
      permanentAddress: updatedAddress
    });
    notifySuccess();
  };

  // Save Skills
  const handleSaveSkills = (e: React.FormEvent) => {
    e.preventDefault();
    updatePersonalData({
      skills: {
        frontend: frontendSkills.split(",").map((s) => s.trim()).filter(Boolean),
        backend: backendSkills.split(",").map((s) => s.trim()).filter(Boolean),
        cms: cmsSkills.split(",").map((s) => s.trim()).filter(Boolean),
        tools: toolSkills.split(",").map((s) => s.trim()).filter(Boolean)
      }
    });
    notifySuccess();
  };

  // Open New Education Modal
  const openNewEduModal = () => {
    setEditingEduIndex(null);
    setEduForm({
      degree: "",
      institution: "",
      boardOrBatch: "",
      roll: "",
      group: "",
      passingYear: "",
      result: "",
      description: ""
    });
    setIsEduModalOpen(true);
  };

  // Open Edit Education Modal
  const openEditEduModal = (index: number) => {
    setEditingEduIndex(index);
    setEduForm({ ...data.education[index] });
    setIsEduModalOpen(true);
  };

  // Save Education Form
  const handleSaveEducation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eduForm.degree.trim() || !eduForm.institution.trim()) return;

    if (editingEduIndex !== null) {
      updateEducation(editingEduIndex, eduForm);
    } else {
      addEducation(eduForm);
    }

    setIsEduModalOpen(false);
    notifySuccess();
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Top Header (8px radius) */}
      <div className="p-4 sm:p-6 rounded-lg bg-white/70 dark:bg-zinc-900/60 border border-zinc-200/90 dark:border-zinc-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors"
            title="Return to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                Profile & Site Settings
              </h1>
              {savedSuccess && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 animate-fade-in">
                  <Check className="w-3.5 h-3.5" />
                  Saved
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              প্রোফাইল ছবি পরিবর্তন, নতুন শিক্ষাগত যোগ্যতা যোগ, ফেভিকন (Favicon) পরিবর্তন এবং যাবতীয় ডাটা এডিট ও সংরক্ষণ করুন।
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (confirm("Reset all profile data, photos, and education to defaults?")) {
              resetToDefaults();
              notifySuccess();
            }
          }}
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors self-start sm:self-auto shadow-sm"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-zinc-200 dark:border-zinc-800">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 border ${
            activeTab === "profile"
              ? "bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-900 dark:border-white shadow-sm"
              : "bg-white/80 dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-400 border-transparent hover:border-zinc-200 dark:hover:border-zinc-800"
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile Photo & Favicon</span>
        </button>

        <button
          onClick={() => setActiveTab("education")}
          className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 border ${
            activeTab === "education"
              ? "bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-900 dark:border-white shadow-sm"
              : "bg-white/80 dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-400 border-transparent hover:border-zinc-200 dark:hover:border-zinc-800"
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Education (শিক্ষাগত যোগ্যতা)</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10 dark:bg-white/20 font-mono">
            {data.education.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("civil")}
          className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 border ${
            activeTab === "civil"
              ? "bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-900 dark:border-white shadow-sm"
              : "bg-white/80 dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-400 border-transparent hover:border-zinc-200 dark:hover:border-zinc-800"
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Govt Registry & Address</span>
        </button>

        <button
          onClick={() => setActiveTab("skills")}
          className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 border ${
            activeTab === "skills"
              ? "bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-900 dark:border-white shadow-sm"
              : "bg-white/80 dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-400 border-transparent hover:border-zinc-200 dark:hover:border-zinc-800"
          }`}
        >
          <Code className="w-4 h-4" />
          <span>Skills & Technical Stack</span>
        </button>
      </div>

      {/* TAB 1: PROFILE PHOTO, FAVICON & BASIC INFO */}
      {activeTab === "profile" && (
        <div className="space-y-6">
          {/* Photo & Favicon Upload Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Profile Picture Card */}
            <div className="rounded-lg border border-zinc-200/90 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/60 p-5 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                  Profile Picture (300×300)
                </span>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden border border-zinc-300 dark:border-zinc-700 bg-zinc-100 shrink-0 shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={data.photoUrl}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-xs space-y-1">
                    <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                      Applicant Photo
                    </p>
                    <p className="text-zinc-500">
                      Standard: 300×300 px
                    </p>
                    <span className="inline-block text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-medium">
                      Active Everywhere
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  disabled={isUploadingPhoto}
                  onClick={() => photoInputRef.current?.click()}
                  className="w-full py-2 px-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-xs font-semibold text-zinc-800 dark:text-zinc-200 flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50"
                >
                  {isUploadingPhoto ? (
                    <>
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                      <span>Uploading to Cloud...</span>
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4 text-blue-500" />
                      <span>Change Profile Photo</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Favicon Card (User Requested!) */}
            <div className="rounded-lg border border-zinc-200/90 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/60 p-5 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                  Browser Favicon (ট্যাব আইকন)
                </span>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden border border-zinc-300 dark:border-zinc-700 bg-zinc-100 flex items-center justify-center shrink-0 p-2 shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={faviconUrl}
                      alt="Favicon Preview"
                      className="w-12 h-12 object-contain rounded"
                    />
                  </div>
                  <div className="text-xs space-y-1">
                    <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                      Active Tab Icon
                    </p>
                    <p className="text-zinc-500">
                      PNG, ICO, or SVG
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        updateFavicon(data.photoUrl);
                        notifySuccess();
                      }}
                      className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline block font-medium"
                    >
                      Use Profile Photo as Favicon
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <input
                  ref={faviconInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFaviconUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  disabled={isUploadingFavicon}
                  onClick={() => faviconInputRef.current?.click()}
                  className="w-full py-2 px-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-xs font-semibold text-zinc-800 dark:text-zinc-200 flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50"
                >
                  {isUploadingFavicon ? (
                    <>
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
                      <span>Uploading to Cloud...</span>
                    </>
                  ) : (
                    <>
                      <Globe className="w-4 h-4 text-emerald-500" />
                      <span>Change Favicon</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Signature Card */}
            <div className="rounded-lg border border-zinc-200/90 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/60 p-5 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                  Digital Signature (300×80)
                </span>
                <div className="h-20 rounded-lg overflow-hidden border border-zinc-300 dark:border-zinc-700 bg-white flex items-center justify-center p-2 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={data.signatureUrl}
                    alt="Signature Preview"
                    className="max-h-full w-auto object-contain"
                  />
                </div>
              </div>

              <div>
                <input
                  ref={signatureInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleSignatureUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  disabled={isUploadingSignature}
                  onClick={() => signatureInputRef.current?.click()}
                  className="w-full py-2 px-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-xs font-semibold text-zinc-800 dark:text-zinc-200 flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50"
                >
                  {isUploadingSignature ? (
                    <>
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
                      <span>Uploading to Cloud...</span>
                    </>
                  ) : (
                    <>
                      <FileSignature className="w-4 h-4 text-violet-500" />
                      <span>Change Signature</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>

          {/* Basic Personal Details Form */}
          <div className="rounded-lg border border-zinc-200/90 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/60 p-5 sm:p-6 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-500" />
              <span>Identity & Contact Details</span>
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Full Name (English)
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Full Name (বাংলা)
                  </label>
                  <input
                    type="text"
                    value={fullNameBn}
                    onChange={(e) => setFullNameBn(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Profession / Title
                  </label>
                  <input
                    type="text"
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    National ID (NID)
                  </label>
                  <input
                    type="text"
                    value={nid}
                    onChange={(e) => setNid(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Mobile Phone
                  </label>
                  <input
                    type="text"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Blood Group
                  </label>
                  <input
                    type="text"
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Professional Summary
                </label>
                <textarea
                  rows={3}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400 resize-none leading-relaxed"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 transition-colors shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Profile Info</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: EDUCATION MANAGEMENT (USER REQUESTED!) */}
      {activeTab === "education" && (
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-blue-500" />
                <span>Educational Qualifications ({data.education.length})</span>
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                নতুন ডিগ্রি বা সার্টিফিকেট যুক্ত করুন, এডিট করুন বা মুছে ফেলুন। এটি ড্যাশবোর্ড ও সিভি বিল্ডারে তাৎক্ষণিক আপডেট হবে।
              </p>
            </div>

            <button
              onClick={openNewEduModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 transition-colors shadow-sm self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Education (শিক্ষা যোগ করুন)</span>
            </button>
          </div>

          {/* Education List Cards */}
          <div className="space-y-3">
            {data.education.map((edu, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-lg border border-zinc-200/90 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/60 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100">
                      {edu.degree}
                    </h3>
                    {edu.passingYear && (
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-mono">
                        {edu.passingYear}
                      </span>
                    )}
                    {edu.result && (
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-mono">
                        {edu.result}
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    {edu.institution}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-zinc-500 flex-wrap">
                    {edu.boardOrBatch && <span>{edu.boardOrBatch}</span>}
                    {edu.roll && <span className="font-mono">Roll: {edu.roll}</span>}
                    {edu.group && <span>Group: {edu.group}</span>}
                  </div>

                  {edu.description && (
                    <p className="text-xs text-zinc-500 pt-1 leading-relaxed">
                      {edu.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <button
                    onClick={() => openEditEduModal(idx)}
                    className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Delete "${edu.degree}"?`)) {
                        deleteEducation(idx);
                        notifySuccess();
                      }
                    }}
                    className="p-2 rounded-lg border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: GOVT CIVIL REGISTRY & ADDRESS */}
      {activeTab === "civil" && (
        <div className="rounded-lg border border-zinc-200/90 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/60 p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>Parents Information & Civil Addresses</span>
            </h3>
            <span className="text-xs text-zinc-500">Government Job Standard</span>
          </div>

          <form onSubmit={handleSaveCivil} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Father&apos;s Name (English)
                </label>
                <input
                  type="text"
                  value={fathersName}
                  onChange={(e) => setFathersName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  পিতার নাম (বাংলা)
                </label>
                <input
                  type="text"
                  value={fathersNameBn}
                  onChange={(e) => setFathersNameBn(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Mother&apos;s Name (English)
                </label>
                <input
                  type="text"
                  value={mothersName}
                  onChange={(e) => setMothersName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  মাতার নাম (বাংলা)
                </label>
                <input
                  type="text"
                  value={mothersNameBn}
                  onChange={(e) => setMothersNameBn(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Date of Birth (DOB)
                </label>
                <input
                  type="text"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400 font-mono"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
                Permanent & Present Address (ঠিকানা)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Village / Road / House
                  </label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Post Office
                  </label>
                  <input
                    type="text"
                    value={postOffice}
                    onChange={(e) => setPostOffice(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Post Code
                  </label>
                  <input
                    type="text"
                    value={postCode}
                    onChange={(e) => setPostCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Upazila / P.S.
                  </label>
                  <input
                    type="text"
                    value={upazila}
                    onChange={(e) => setUpazila(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    District
                  </label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 transition-colors shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Civil Data</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: SKILLS & TECHNICAL STACK */}
      {activeTab === "skills" && (
        <div className="rounded-lg border border-zinc-200/90 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/60 p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Code className="w-4 h-4 text-violet-500" />
              <span>Technical Skills (Comma separated)</span>
            </h3>
          </div>

          <form onSubmit={handleSaveSkills} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Frontend Technologies
              </label>
              <input
                type="text"
                value={frontendSkills}
                onChange={(e) => setFrontendSkills(e.target.value)}
                placeholder="React 19, Next.js 15, TypeScript, Tailwind CSS, Redux..."
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Backend & Databases
              </label>
              <input
                type="text"
                value={backendSkills}
                onChange={(e) => setBackendSkills(e.target.value)}
                placeholder="Node.js, Express.js, MongoDB, RESTful APIs, JWT..."
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                CMS & E-Commerce
              </label>
              <input
                type="text"
                value={cmsSkills}
                onChange={(e) => setCmsSkills(e.target.value)}
                placeholder="WordPress, WooCommerce, Elementor Pro, Custom Themes..."
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Tools & Platforms
              </label>
              <input
                type="text"
                value={toolSkills}
                onChange={(e) => setToolSkills(e.target.value)}
                placeholder="Git, GitHub, Cloudinary, Vercel, VS Code..."
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 transition-colors shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Skills</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* EDUCATION MODAL */}
      {isEduModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-500" />
                <span>
                  {editingEduIndex !== null ? "Edit Education" : "Add Education Qualification"}
                </span>
              </h3>
              <button
                onClick={() => setIsEduModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEducation} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Degree / Certificate Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. B.Sc. in Computer Science & Engineering"
                  value={eduForm.degree}
                  onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Institution / University *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Uttara University, Dhaka"
                  value={eduForm.institution}
                  onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Board / Batch
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. BTEB or Batch 66"
                    value={eduForm.boardOrBatch || ""}
                    onChange={(e) => setEduForm({ ...eduForm, boardOrBatch: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Board Roll / ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 500412"
                    value={eduForm.roll || ""}
                    onChange={(e) => setEduForm({ ...eduForm, roll: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Passing Year
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2024 or 2026 (Enrolled)"
                    value={eduForm.passingYear || ""}
                    onChange={(e) => setEduForm({ ...eduForm, passingYear: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Result / CGPA
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CGPA: 3.24 / 4.00"
                    value={eduForm.result || ""}
                    onChange={(e) => setEduForm({ ...eduForm, result: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Department / Major Group
                </label>
                <input
                  type="text"
                  placeholder="e.g. Computer Science & Engineering"
                  value={eduForm.group || ""}
                  onChange={(e) => setEduForm({ ...eduForm, group: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Additional Details / Projects (ঐচ্ছিক)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Core focus on Algorithms, Web Systems & Database Architecture."
                  value={eduForm.description || ""}
                  onChange={(e) => setEduForm({ ...eduForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsEduModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 transition-colors shadow-sm"
                >
                  {editingEduIndex !== null ? "Update Education" : "Add Education"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  Download, 
  ArrowLeft, 
  ShieldCheck, 
  FileText, 
  Check, 
  Edit3, 
  RotateCcw, 
  Code2, 
  FileCode, 
  Palette, 
  Layers, 
  Sliders, 
  Eye, 
  Sparkles,
  Printer,
  Copy,
  Plus,
  Trash2
} from "lucide-react";
import { personalData, PersonalData, EducationItem, ExperienceItem, ProjectItem } from "@/data/personalData";
import { useProfile } from "@/context/ProfileContext";

type TemplateType = 
  | "modern-ats"      // 1. Modern Executive ATS (Single Column)
  | "harvard"         // 2. Classic Harvard Academic
  | "tech-developer"  // 3. Tech & Full-Stack Developer
  | "creative"        // 4. Creative Professional (Accent Bar)
  | "compact"         // 5. Compact 1-Page Dense
  | "govt-bd"         // 6. Bangladesh Government / Civil Service Official
  | "swiss-minimal";  // 7. Swiss Minimalist Grid

const TEMPLATES: { id: TemplateType; name: string; tag: string; desc: string }[] = [
  { id: "modern-ats", name: "1. Modern Executive ATS", tag: "100% ATS Safe", desc: "Clean single-column standard for Fortune 500 & MNC corporate portals" },
  { id: "harvard", name: "2. Harvard Academic", tag: "Academic", desc: "Prestigious serif hierarchy favored by universities, researchers & fellowships" },
  { id: "tech-developer", name: "3. Tech Developer", tag: "MERN / Next.js", desc: "Two-column developer architecture with prominent stack & live projects" },
  { id: "creative", name: "4. Creative Professional", tag: "Modern Accent", desc: "Refined navy/cyan accent header with photo and sleek skills pill badges" },
  { id: "compact", name: "5. Compact 1-Page", tag: "Dense", desc: "Space-optimized single-page layout for recruiters reviewing in 10 seconds" },
  { id: "govt-bd", name: "6. Bangladesh Civil Service", tag: "Govt Official", desc: "Formatted for BD Government jobs with NID, father/mother name, BTEB rolls" },
  { id: "swiss-minimal", name: "7. Swiss Minimal Grid", tag: "Minimalist", desc: "Ultra-sharp typographic grid inspired by European modernism" },
];

const CV_STORAGE_KEY = "shuvo_customized_cv_data_v1";

export default function CVBuilderPage() {
  const { data: profileData } = useProfile();
  const [template, setTemplate] = useState<TemplateType>("modern-ats");
  const [isEditing, setIsEditing] = useState(false);
  const [showPhoto, setShowPhoto] = useState(true);
  const [showSignature, setShowSignature] = useState(true);
  const [accentColor, setAccentColor] = useState<string>("#18181b"); // default black/zinc

  // Editable CV Data State
  const [cvData, setCvData] = useState<PersonalData>(profileData || personalData);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const cvPrintRef = useRef<HTMLDivElement>(null);

  // Load custom saved data or sync with profileData and server
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CV_STORAGE_KEY);
      if (saved) {
        setCvData(JSON.parse(saved));
      } else if (profileData) {
        setCvData(profileData);
      }
    } catch (e) {
      console.error(e);
    }

    // Server sync
    fetch("/api/data")
      .then((res) => res.json())
      .then((serverData) => {
        if (serverData && serverData.cvData) {
          setCvData(serverData.cvData);
          localStorage.setItem(CV_STORAGE_KEY, JSON.stringify(serverData.cvData));
        }
      })
      .catch((err) => console.warn("Backend cv sync notice:", err));
  }, [profileData]);

  const handleSaveData = () => {
    try {
      localStorage.setItem(CV_STORAGE_KEY, JSON.stringify(cvData));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
      setIsEditing(false);
    } catch (e) {
      console.error(e);
    }

    fetch("/api/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cvData })
    }).catch((err) => console.warn("Backend cv sync notice:", err));
  };

  const handleResetData = () => {
    if (confirm("আপনি কি সিভি পুনরায় পূর্বের ডিফল্ট তথ্যে ফিরিয়ে আনতে চান?")) {
      const resetData = profileData || personalData;
      setCvData(resetData);
      try {
        localStorage.removeItem(CV_STORAGE_KEY);
      } catch (e) {
        console.error(e);
      }
      fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvData: resetData })
      }).catch((err) => console.warn("Backend cv sync notice:", err));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 1500);
    }
  };

  // PDF Print Action
  const handlePrint = () => {
    window.print();
  };

  // Dynamic Standalone HTML + CSS Download
  const handleDownloadHTML = () => {
    if (!cvPrintRef.current) return;
    const cvHTML = cvPrintRef.current.innerHTML;

    const fullHTMLDocument = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${cvData.fullName} - Curriculum Vitae</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #f4f4f5;
      color: #18181b;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.5;
      padding: 30px 15px;
    }
    .cv-container {
      max-width: 840px;
      margin: 0 auto;
      background: #ffffff;
      padding: 40px;
      border: 1px solid #e4e4e7;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    }
    @media print {
      body { background: #fff; padding: 0; }
      .cv-container { box-shadow: none; border: none; padding: 0.4in; width: 100%; max-width: 100%; }
    }
    a { color: #2563eb; text-decoration: none; }
    a:hover { text-decoration: underline; }
    h1 { font-size: 26px; font-weight: 800; text-transform: uppercase; margin-bottom: 4px; }
    h2 { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1.5px solid #27272a; padding-bottom: 3px; margin: 18px 0 10px 0; }
    h3 { font-size: 14px; font-weight: 700; margin-bottom: 2px; }
    p, li { font-size: 13px; color: #3f3f46; }
    ul { margin-left: 20px; margin-top: 4px; }
    li { margin-bottom: 3px; }
    .meta-tag { display: inline-block; background: #f4f4f5; border: 1px solid #e4e4e7; border-radius: 4px; padding: 2px 8px; font-size: 11px; font-weight: 600; margin: 2px; }
  </style>
</head>
<body>
  <div class="cv-container">
    ${cvHTML}
  </div>
</body>
</html>`;

    const blob = new Blob([fullHTMLDocument], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${cvData.fullName.replace(/\s+/g, "_")}_CV_${template}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      
      {/* Top Header & Template Switcher Controls (no-print) */}
      <div className="no-print glass-panel rounded-lg p-5 sm:p-6 border border-zinc-200/90 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/70 shadow-sm space-y-5">
        
        {/* Title and Action Buttons */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors"
              title="Return to Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  Dynamic CV Builder & Multi-Format Exporter
                </h1>
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  7 Templates Ready
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                সিভি এডিট করুন, ৭টি ফরম্যাট থেকে বেছে নিন এবং সরাসরি PDF বা Standalone HTML ফরম্যাটে ডাউনলোড করুন।
              </p>
            </div>
          </div>

          {/* Action Download Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsEditing(!isEditing)}
              type="button"
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold border transition-all ${
                isEditing
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-800"
              }`}
            >
              <Edit3 className="w-4 h-4" />
              <span>{isEditing ? "Close Editor" : "Edit CV Data (তথ্য সম্পাদনা)"}</span>
            </button>

            <button
              onClick={handlePrint}
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={handleDownloadHTML}
              type="button"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all"
              title="Download standalone HTML and CSS web file"
            >
              <FileCode className="w-4 h-4" />
              <span>Download Web Format (.html)</span>
            </button>

            <button
              onClick={handleResetData}
              type="button"
              className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              title="Reset to default data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 7 Format Picker (Tabs) */}
        <div className="pt-3 border-t border-zinc-200/90 dark:border-zinc-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5" />
              Choose Template Format (৭টি প্রফেশনাল ফরম্যাট):
            </span>
            <div className="flex items-center gap-3 text-xs">
              <label className="inline-flex items-center gap-1.5 cursor-pointer text-zinc-600 dark:text-zinc-300">
                <input
                  type="checkbox"
                  checked={showPhoto}
                  onChange={(e) => setShowPhoto(e.target.checked)}
                  className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500 w-3.5 h-3.5"
                />
                <span>Photo (ছবি)</span>
              </label>

              <label className="inline-flex items-center gap-1.5 cursor-pointer text-zinc-600 dark:text-zinc-300">
                <input
                  type="checkbox"
                  checked={showSignature}
                  onChange={(e) => setShowSignature(e.target.checked)}
                  className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500 w-3.5 h-3.5"
                />
                <span>Signature (স্বাক্ষর)</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
            {TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => setTemplate(tmpl.id)}
                type="button"
                className={`p-2.5 rounded-lg text-left transition-all border flex flex-col justify-between ${
                  template === tmpl.id
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-sm"
                    : "bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800"
                }`}
              >
                <div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider block ${
                    template === tmpl.id ? "text-blue-300 dark:text-blue-600" : "text-zinc-400"
                  }`}>
                    {tmpl.tag}
                  </span>
                  <div className="font-bold text-xs mt-0.5 line-clamp-1">
                    {tmpl.name}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Interactive CV Data Editor (Visible when isEditing = true) */}
      {isEditing && (
        <div className="no-print glass-panel rounded-lg p-5 sm:p-6 border border-blue-500/40 bg-blue-50/20 dark:bg-blue-950/20 shadow-md space-y-4 animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                Live Data Editor (সিভির তথ্য পরিবর্তন করুন)
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveData}
                type="button"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              >
                <Check className="w-4 h-4" />
                <span>Save Changes (সংরক্ষণ করুন)</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Full Name (English)
              </label>
              <input
                type="text"
                value={cvData.fullName}
                onChange={(e) => setCvData({ ...cvData, fullName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Full Name (বাংলা)
              </label>
              <input
                type="text"
                value={cvData.fullNameBn}
                onChange={(e) => setCvData({ ...cvData, fullNameBn: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Professional Title
              </label>
              <input
                type="text"
                value={cvData.profession}
                onChange={(e) => setCvData({ ...cvData, profession: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Mobile Number
              </label>
              <input
                type="text"
                value={cvData.mobile}
                onChange={(e) => setCvData({ ...cvData, mobile: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={cvData.email}
                onChange={(e) => setCvData({ ...cvData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                National ID (NID)
              </label>
              <input
                type="text"
                value={cvData.nid}
                onChange={(e) => setCvData({ ...cvData, nid: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-mono"
              />
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Professional Summary
              </label>
              <textarea
                rows={3}
                value={cvData.summary}
                onChange={(e) => setCvData({ ...cvData, summary: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* CV Paper Container (Rendered on screen & printed to PDF) */}
      <div className="w-full flex justify-center overflow-x-auto pb-6">
        <div
          ref={cvPrintRef}
          id="cv-render-paper"
          className="ats-cv-sheet w-full max-w-[850px] bg-white text-zinc-900 shadow-xl rounded-lg p-4 sm:p-8 md:p-12 border border-zinc-200 transition-all leading-relaxed"
          style={{ backgroundColor: "#ffffff", color: "#18181b" }}
        >
          {/* ======================================================== */}
          {/* TEMPLATE 1: MODERN EXECUTIVE ATS (SINGLE COLUMN) */}
          {/* ======================================================== */}
          {template === "modern-ats" && (
            <div className="space-y-5 font-sans text-sm">
              {/* Header */}
              <div className="border-b-2 border-zinc-900 pb-4 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-zinc-950">
                    {cvData.fullName}
                  </h1>
                  <p className="text-sm font-bold text-zinc-700">
                    {cvData.profession}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-600 font-medium">
                    <span>{cvData.mobile}</span>
                    <span>•</span>
                    <a href={`mailto:${cvData.email}`} className="text-blue-700 hover:underline">{cvData.email}</a>
                    <span>•</span>
                    <span>NID: {cvData.nid}</span>
                    <span>•</span>
                    <span>Panchagarh - 5030, Bangladesh</span>
                  </div>
                </div>

                {showPhoto && (
                  <div className="w-24 h-24 rounded border border-zinc-300 overflow-hidden shrink-0 bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={cvData.photoUrl} alt="Photo" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Summary */}
              <section className="space-y-1">
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-950 border-b border-zinc-300 pb-1">
                  Professional Summary
                </h2>
                <p className="text-justify leading-relaxed text-zinc-700 text-xs sm:text-sm">
                  {cvData.summary}
                </p>
              </section>

              {/* Technical Skills */}
              <section className="space-y-1">
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-950 border-b border-zinc-300 pb-1">
                  Technical Skills & Competencies
                </h2>
                <div className="space-y-1 text-xs sm:text-sm text-zinc-700">
                  <p><strong className="text-zinc-950">Frontend:</strong> {cvData.skills.frontend.join(", ")}</p>
                  <p><strong className="text-zinc-950">Backend & DB:</strong> {cvData.skills.backend.join(", ")}</p>
                  <p><strong className="text-zinc-950">CMS Platforms:</strong> {cvData.skills.cms.join(", ")}</p>
                  <p><strong className="text-zinc-950">Tools:</strong> {cvData.skills.tools.join(", ")}</p>
                </div>
              </section>

              {/* Experience */}
              <section className="space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-950 border-b border-zinc-300 pb-1">
                  Work Experience
                </h2>
                {cvData.experience.map((exp, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between font-bold text-zinc-950 text-xs sm:text-sm">
                      <span>{exp.role} — <span className="font-normal text-zinc-700">{exp.company}</span></span>
                      <span className="text-xs font-semibold text-zinc-600">{exp.period}</span>
                    </div>
                    <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-zinc-700">
                      {exp.description.map((b, bIdx) => (
                        <li key={bIdx} className="leading-snug">{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </section>

              {/* Projects */}
              <section className="space-y-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-950 border-b border-zinc-300 pb-1">
                  Key Projects & Technical Implementations
                </h2>
                {cvData.projects.map((p, i) => (
                  <div key={i} className="space-y-0.5">
                    <div className="flex justify-between font-bold text-zinc-950 text-xs sm:text-sm">
                      <span>{p.title}</span>
                      <span className="text-xs text-zinc-600 italic font-normal">{p.technologies.slice(0, 4).join(" • ")}</span>
                    </div>
                    <p className="text-xs text-zinc-700 leading-snug">{p.description}</p>
                  </div>
                ))}
              </section>

              {/* Education */}
              <section className="space-y-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-950 border-b border-zinc-300 pb-1">
                  Education & Academic Qualifications
                </h2>
                {cvData.education.map((edu, i) => (
                  <div key={i} className="space-y-0.5">
                    <div className="flex justify-between font-bold text-zinc-950 text-xs sm:text-sm">
                      <span>{edu.degree} — <span className="font-normal text-zinc-700">{edu.institution}</span></span>
                      <span className="text-xs text-zinc-600">{edu.passingYear}</span>
                    </div>
                    <div className="flex justify-between text-xs text-zinc-600">
                      <span>{edu.boardOrBatch && `Board: ${edu.boardOrBatch}`} {edu.roll && `(Roll: ${edu.roll})`}</span>
                      {edu.result && <span className="font-bold text-zinc-800">{edu.result}</span>}
                    </div>
                  </div>
                ))}
              </section>

              {/* Signature */}
              {showSignature && (
                <div className="pt-4 flex justify-end">
                  <div className="text-center">
                    <div className="w-36 h-12 border-b border-zinc-400 p-1 flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={cvData.signatureUrl} alt="Signature" className="max-h-full object-contain" />
                    </div>
                    <span className="text-xs font-bold text-zinc-900 block mt-1">{cvData.fullName}</span>
                    <span className="text-[10px] text-zinc-500 block">Applicant Signature</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TEMPLATE 2: CLASSIC HARVARD ACADEMIC (SERIF & ELEGANT) */}
          {/* ======================================================== */}
          {template === "harvard" && (
            <div className="space-y-5 text-sm" style={{ fontFamily: "Georgia, Cambria, 'Times New Roman', serif" }}>
              <div className="text-center border-b border-zinc-800 pb-4">
                <h1 className="text-2xl sm:text-3xl font-normal uppercase tracking-wider text-zinc-950">
                  {cvData.fullName}
                </h1>
                <p className="text-xs text-zinc-700 tracking-wide mt-1">
                  {cvData.address} • {cvData.mobile} • {cvData.email} • NID: {cvData.nid}
                </p>
              </div>

              <section className="space-y-1">
                <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-900 border-b border-zinc-400 pb-0.5">
                  Education & Qualifications
                </h2>
                {cvData.education.map((edu, i) => (
                  <div key={i} className="space-y-0.5">
                    <div className="flex justify-between font-bold text-zinc-950 text-xs sm:text-sm">
                      <span>{edu.institution}</span>
                      <span className="font-normal italic">{edu.passingYear}</span>
                    </div>
                    <div className="flex justify-between text-xs text-zinc-800">
                      <span className="italic">{edu.degree} {edu.roll && `(Roll: ${edu.roll})`}</span>
                      <span>{edu.result}</span>
                    </div>
                  </div>
                ))}
              </section>

              <section className="space-y-2">
                <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-900 border-b border-zinc-400 pb-0.5">
                  Professional Experience
                </h2>
                {cvData.experience.map((exp, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between font-bold text-zinc-950 text-xs sm:text-sm">
                      <span>{exp.company} — <span className="font-normal italic">{exp.role}</span></span>
                      <span className="font-normal italic text-xs">{exp.period}</span>
                    </div>
                    <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-zinc-800">
                      {exp.description.map((b, bIdx) => (
                        <li key={bIdx} className="leading-snug">{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </section>

              <section className="space-y-1">
                <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-900 border-b border-zinc-400 pb-0.5">
                  Technical Expertise & Tools
                </h2>
                <p className="text-xs text-zinc-800 leading-relaxed">
                  <strong>Languages & Frameworks:</strong> {cvData.skills.frontend.join(", ")}, {cvData.skills.backend.join(", ")}
                </p>
                <p className="text-xs text-zinc-800 leading-relaxed">
                  <strong>Platforms & Architecture:</strong> {cvData.skills.cms.join(", ")}, {cvData.skills.tools.join(", ")}
                </p>
              </section>

              {showSignature && (
                <div className="pt-4 flex justify-end">
                  <div className="text-center">
                    <div className="w-36 h-12 border-b border-zinc-400 p-1 flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={cvData.signatureUrl} alt="Signature" className="max-h-full object-contain" />
                    </div>
                    <span className="text-xs italic text-zinc-900 block mt-1">{cvData.fullName}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TEMPLATE 3: TECH DEVELOPER (TWO-COLUMN ARCHITECTURE) */}
          {/* ======================================================== */}
          {template === "tech-developer" && (
            <div className="space-y-5 font-sans">
              <div className="flex items-center justify-between border-b-2 border-zinc-900 pb-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-zinc-950">
                    {cvData.fullName}
                  </h1>
                  <p className="text-sm font-bold text-blue-600">
                    {cvData.profession}
                  </p>
                  <p className="text-xs text-zinc-600 mt-1">
                    {cvData.email} • {cvData.mobile} • NID: {cvData.nid} • Panchagarh, BD
                  </p>
                </div>
                {showPhoto && (
                  <div className="w-20 h-20 rounded border border-zinc-300 overflow-hidden bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={cvData.photoUrl} alt="Photo" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm">
                {/* Left Column: Skills & Education */}
                <div className="space-y-4">
                  <section className="space-y-1">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 border-b border-zinc-300 pb-1">
                      Technical Skills
                    </h2>
                    <div className="space-y-2 text-xs">
                      <div>
                        <strong className="block text-zinc-900">Frontend:</strong>
                        <p className="text-zinc-600">{cvData.skills.frontend.join(", ")}</p>
                      </div>
                      <div>
                        <strong className="block text-zinc-900">Backend:</strong>
                        <p className="text-zinc-600">{cvData.skills.backend.join(", ")}</p>
                      </div>
                      <div>
                        <strong className="block text-zinc-900">CMS Platforms:</strong>
                        <p className="text-zinc-600">{cvData.skills.cms.join(", ")}</p>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-2">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 border-b border-zinc-300 pb-1">
                      Education & Rolls
                    </h2>
                    {cvData.education.map((e, idx) => (
                      <div key={idx} className="space-y-0.5 text-xs">
                        <div className="font-bold text-zinc-900">{e.degree}</div>
                        <div className="text-zinc-600">{e.institution}</div>
                        {e.roll && <div className="text-blue-900 font-mono font-semibold">Roll: {e.roll}</div>}
                        <div className="text-zinc-500 font-medium">{e.passingYear} • {e.result}</div>
                      </div>
                    ))}
                  </section>
                </div>

                {/* Right Column: Experience & Projects */}
                <div className="md:col-span-2 space-y-4">
                  <section className="space-y-1">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 border-b border-zinc-300 pb-1">
                      Professional Profile
                    </h2>
                    <p className="text-xs text-zinc-700 leading-relaxed text-justify">
                      {cvData.summary}
                    </p>
                  </section>

                  <section className="space-y-2.5">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 border-b border-zinc-300 pb-1">
                      Work Experience
                    </h2>
                    {cvData.experience.map((exp, i) => (
                      <div key={i} className="space-y-1 text-xs">
                        <div className="flex justify-between font-bold text-zinc-900">
                          <span>{exp.role} — {exp.company}</span>
                          <span className="text-zinc-500 font-normal">{exp.period}</span>
                        </div>
                        <ul className="list-disc list-outside ml-3.5 space-y-1 text-zinc-700">
                          {exp.description.map((b, bIdx) => (
                            <li key={bIdx}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </section>

                  <section className="space-y-2">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 border-b border-zinc-300 pb-1">
                      Featured Projects
                    </h2>
                    {cvData.projects.map((p, i) => (
                      <div key={i} className="space-y-0.5 text-xs">
                        <div className="flex justify-between font-bold text-zinc-900">
                          <span>{p.title}</span>
                          <span className="italic text-zinc-500 font-normal">{p.technologies.slice(0, 3).join(", ")}</span>
                        </div>
                        <p className="text-zinc-700">{p.description}</p>
                      </div>
                    ))}
                  </section>
                </div>
              </div>

              {showSignature && (
                <div className="pt-3 flex justify-end">
                  <div className="text-center">
                    <div className="w-32 h-10 border-b border-zinc-400 flex items-center justify-center p-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={cvData.signatureUrl} alt="Signature" className="max-h-full object-contain" />
                    </div>
                    <span className="text-[11px] font-bold text-zinc-900 block mt-1">{cvData.fullName}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TEMPLATE 4: CREATIVE PROFESSIONAL (ACCENT BAR) */}
          {/* ======================================================== */}
          {template === "creative" && (
            <div className="space-y-5 font-sans">
              <div className="p-6 rounded-lg bg-zinc-900 text-white flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white">
                    {cvData.fullName}
                  </h1>
                  <p className="text-sm font-semibold text-blue-300">
                    {cvData.profession}
                  </p>
                  <p className="text-xs text-zinc-300">
                    {cvData.email} • {cvData.mobile} • NID: {cvData.nid}
                  </p>
                </div>
                {showPhoto && (
                  <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-white/80 bg-zinc-800 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={cvData.photoUrl} alt="Photo" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <section className="space-y-1">
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b-2 border-blue-600 pb-1">
                  Professional Profile
                </h2>
                <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed text-justify">
                  {cvData.summary}
                </p>
              </section>

              <section className="space-y-1.5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b-2 border-blue-600 pb-1">
                  Core Technical Skills
                </h2>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[...cvData.skills.frontend, ...cvData.skills.backend, ...cvData.skills.cms].map((s) => (
                    <span key={s} className="px-2.5 py-0.5 rounded text-xs font-semibold bg-zinc-100 text-zinc-800 border border-zinc-200">
                      {s}
                    </span>
                  ))}
                </div>
              </section>

              <section className="space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b-2 border-blue-600 pb-1">
                  Work Experience
                </h2>
                {cvData.experience.map((exp, i) => (
                  <div key={i} className="space-y-1 text-xs sm:text-sm">
                    <div className="flex justify-between font-bold text-zinc-950">
                      <span>{exp.role} <span className="text-blue-600">— {exp.company}</span></span>
                      <span className="text-xs font-medium text-zinc-500">{exp.period}</span>
                    </div>
                    <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-zinc-700">
                      {exp.description.map((b, idx) => (
                        <li key={idx}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </section>

              <section className="space-y-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b-2 border-blue-600 pb-1">
                  Education & Results
                </h2>
                {cvData.education.map((edu, i) => (
                  <div key={i} className="flex justify-between text-xs sm:text-sm text-zinc-800 pb-1 border-b border-zinc-100">
                    <div>
                      <div className="font-bold">{edu.degree}</div>
                      <div className="text-xs text-zinc-600">{edu.institution} {edu.roll && `(Roll: ${edu.roll})`}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-blue-700">{edu.result}</div>
                      <div className="text-xs text-zinc-500">{edu.passingYear}</div>
                    </div>
                  </div>
                ))}
              </section>

              {showSignature && (
                <div className="pt-4 flex justify-end">
                  <div className="text-center">
                    <div className="w-36 h-12 border-b border-zinc-400 p-1 flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={cvData.signatureUrl} alt="Signature" className="max-h-full object-contain" />
                    </div>
                    <span className="text-xs font-bold text-zinc-900 block mt-1">{cvData.fullName}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TEMPLATE 5: COMPACT 1-PAGE DENSE */}
          {/* ======================================================== */}
          {template === "compact" && (
            <div className="space-y-3 font-sans text-xs">
              <div className="border-b border-zinc-900 pb-2 text-center">
                <h1 className="text-xl font-bold uppercase tracking-tight text-zinc-950">
                  {cvData.fullName}
                </h1>
                <p className="text-xs font-semibold text-zinc-700">
                  {cvData.profession} • {cvData.mobile} • {cvData.email} • NID: {cvData.nid}
                </p>
              </div>

              <section>
                <h2 className="text-[11px] font-bold uppercase text-zinc-950 border-b border-zinc-400 pb-0.5 mb-1">
                  Summary
                </h2>
                <p className="text-justify text-zinc-700 leading-snug">{cvData.summary}</p>
              </section>

              <section>
                <h2 className="text-[11px] font-bold uppercase text-zinc-950 border-b border-zinc-400 pb-0.5 mb-1">
                  Skills
                </h2>
                <p className="text-zinc-700 leading-snug">
                  <strong>Tech:</strong> {cvData.skills.frontend.join(", ")}, {cvData.skills.backend.join(", ")}, {cvData.skills.cms.join(", ")}
                </p>
              </section>

              <section className="space-y-1.5">
                <h2 className="text-[11px] font-bold uppercase text-zinc-950 border-b border-zinc-400 pb-0.5 mb-1">
                  Experience
                </h2>
                {cvData.experience.map((e, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="flex justify-between font-bold text-zinc-900">
                      <span>{e.role} — {e.company}</span>
                      <span className="text-zinc-500 font-normal">{e.period}</span>
                    </div>
                    <ul className="list-disc ml-3.5 space-y-0.5 text-zinc-700 text-[11px]">
                      {e.description.map((b, bIdx) => <li key={bIdx}>{b}</li>)}
                    </ul>
                  </div>
                ))}
              </section>

              <section className="space-y-1">
                <h2 className="text-[11px] font-bold uppercase text-zinc-950 border-b border-zinc-400 pb-0.5 mb-1">
                  Education & Board Rolls
                </h2>
                {cvData.education.map((edu, idx) => (
                  <div key={idx} className="flex justify-between text-zinc-800">
                    <span><strong>{edu.degree}</strong>, {edu.institution} {edu.roll && `(Roll: ${edu.roll})`}</span>
                    <span>{edu.passingYear} • {edu.result}</span>
                  </div>
                ))}
              </section>

              {showSignature && (
                <div className="pt-2 flex justify-end">
                  <div className="text-center">
                    <div className="w-28 h-8 border-b border-zinc-400 flex items-center justify-center p-0.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={cvData.signatureUrl} alt="Signature" className="max-h-full object-contain" />
                    </div>
                    <span className="text-[10px] text-zinc-800 font-bold block">{cvData.fullName}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TEMPLATE 6: BANGLADESH GOVERNMENT / CIVIL SERVICE OFFICIAL */}
          {/* ======================================================== */}
          {template === "govt-bd" && (
            <div className="space-y-4 font-sans text-xs sm:text-sm">
              <div className="border-b-2 border-zinc-900 pb-3 flex items-start justify-between">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold uppercase text-zinc-950">
                    CURRICULUM VITAE (জীবনবৃত্তান্ত)
                  </h1>
                  <p className="text-xs font-semibold text-zinc-700 mt-0.5">
                    {cvData.fullName} ({cvData.fullNameBn})
                  </p>
                  <p className="text-xs text-zinc-600 mt-1">
                    Contact: {cvData.mobile} • {cvData.email} • NID: {cvData.nid}
                  </p>
                </div>
                {showPhoto && (
                  <div className="w-24 h-24 rounded border border-zinc-400 overflow-hidden shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={cvData.photoUrl} alt="Govt Photo" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Civil Records Table */}
              <section className="space-y-1">
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-950 border-b border-zinc-400 pb-1">
                  1. Personal & Civil Details (ব্যক্তিগত তথ্যাবলী)
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-zinc-800 pt-1">
                  <p><strong>Applicant&apos;s Name:</strong> {cvData.fullName}</p>
                  <p><strong>আবেদনকারীর নাম:</strong> {cvData.fullNameBn}</p>
                  <p><strong>Father&apos;s Name:</strong> {cvData.fathersName} ({cvData.fathersNameBn})</p>
                  <p><strong>Mother&apos;s Name:</strong> {cvData.mothersName} ({cvData.mothersNameBn})</p>
                  <p><strong>Date of Birth:</strong> {cvData.dob} (Age: 23Y 0M 2D)</p>
                  <p><strong>National ID (NID):</strong> {cvData.nid}</p>
                  <p><strong>Nationality & Religion:</strong> Bangladeshi • Islam</p>
                  <p><strong>Marital Status & Gender:</strong> Single • Male</p>
                  <p className="sm:col-span-2">
                    <strong>Permanent & Present Address:</strong> Care Of: {cvData.govtDetails.presentAddress.careOf}, Vill: {cvData.govtDetails.presentAddress.village}, Post: {cvData.govtDetails.presentAddress.postOffice} - {cvData.govtDetails.presentAddress.postCode}, Upazila: {cvData.govtDetails.presentAddress.upazila}, District: {cvData.govtDetails.presentAddress.district}
                  </p>
                </div>
              </section>

              {/* Education with Official Roll Numbers */}
              <section className="space-y-1.5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-950 border-b border-zinc-400 pb-1">
                  2. Educational Qualifications (শিক্ষাগত যোগ্যতা)
                </h2>
                <div className="border border-zinc-300 rounded overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-zinc-100 border-b border-zinc-300 text-zinc-900 font-bold">
                      <tr>
                        <th className="p-2 border-r border-zinc-300">Exam / Degree</th>
                        <th className="p-2 border-r border-zinc-300">Board / University</th>
                        <th className="p-2 border-r border-zinc-300">Roll No</th>
                        <th className="p-2 border-r border-zinc-300">Passing Year</th>
                        <th className="p-2">Result</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200">
                      {cvData.education.map((edu, idx) => (
                        <tr key={idx} className="hover:bg-zinc-50">
                          <td className="p-2 border-r border-zinc-200 font-semibold">{edu.degree}</td>
                          <td className="p-2 border-r border-zinc-200">{edu.institution}</td>
                          <td className="p-2 border-r border-zinc-200 font-mono font-bold text-blue-900">{edu.roll || "N/A"}</td>
                          <td className="p-2 border-r border-zinc-200">{edu.passingYear}</td>
                          <td className="p-2 font-bold text-zinc-900">{edu.result}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Professional Experience */}
              <section className="space-y-1.5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-950 border-b border-zinc-400 pb-1">
                  3. Professional Experience (কাজের অভিজ্ঞতা)
                </h2>
                {cvData.experience.map((exp, idx) => (
                  <div key={idx} className="space-y-0.5 text-xs">
                    <div className="flex justify-between font-bold text-zinc-900">
                      <span>{exp.role} — {exp.company}</span>
                      <span className="text-zinc-600">{exp.period}</span>
                    </div>
                    <ul className="list-disc ml-4 space-y-0.5 text-zinc-700">
                      {exp.description.map((d, dIdx) => <li key={dIdx}>{d}</li>)}
                    </ul>
                  </div>
                ))}
              </section>

              {/* Declaration & Signature */}
              <div className="pt-6 flex justify-between items-end border-t border-zinc-300">
                <div className="text-xs text-zinc-500">
                  Date: {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}<br />
                  Place: Panchagarh, Bangladesh
                </div>
                {showSignature && (
                  <div className="text-center">
                    <div className="w-36 h-12 border-b border-zinc-400 flex items-center justify-center p-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={cvData.signatureUrl} alt="Signature" className="max-h-full object-contain" />
                    </div>
                    <span className="text-xs font-bold text-zinc-900 block mt-1">{cvData.fullName}</span>
                    <span className="text-[10px] text-zinc-500 block">Applicant&apos;s Signature</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TEMPLATE 7: SWISS MINIMAL GRID */}
          {/* ======================================================== */}
          {template === "swiss-minimal" && (
            <div className="space-y-6 font-sans text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-zinc-900 pb-4">
                <div className="sm:col-span-2">
                  <h1 className="text-3xl font-black uppercase tracking-tighter text-zinc-950">
                    {cvData.fullName}
                  </h1>
                  <p className="text-sm font-medium text-zinc-500 mt-1">
                    {cvData.profession}
                  </p>
                </div>
                <div className="text-xs text-zinc-600 sm:text-right space-y-0.5">
                  <p>{cvData.mobile}</p>
                  <p>{cvData.email}</p>
                  <p>NID: {cvData.nid}</p>
                  <p>Panchagarh - 5030</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <span className="font-bold text-xs uppercase text-zinc-400">Profile</span>
                  <p className="sm:col-span-3 text-xs sm:text-sm text-zinc-700 text-justify leading-relaxed">
                    {cvData.summary}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2 border-t border-zinc-200">
                  <span className="font-bold text-xs uppercase text-zinc-400">Expertise</span>
                  <div className="sm:col-span-3 text-xs sm:text-sm text-zinc-800 space-y-1">
                    <p><strong>Frontend:</strong> {cvData.skills.frontend.join(", ")}</p>
                    <p><strong>Backend:</strong> {cvData.skills.backend.join(", ")}</p>
                    <p><strong>CMS & Tools:</strong> {cvData.skills.cms.join(", ")}, {cvData.skills.tools.join(", ")}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2 border-t border-zinc-200">
                  <span className="font-bold text-xs uppercase text-zinc-400">Experience</span>
                  <div className="sm:col-span-3 space-y-3">
                    {cvData.experience.map((exp, i) => (
                      <div key={i} className="space-y-1 text-xs sm:text-sm">
                        <div className="font-bold text-zinc-900">{exp.role} — {exp.company} <span className="font-normal text-zinc-500">({exp.period})</span></div>
                        <ul className="list-disc ml-4 text-xs text-zinc-700 space-y-0.5">
                          {exp.description.map((b, bIdx) => <li key={bIdx}>{b}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2 border-t border-zinc-200">
                  <span className="font-bold text-xs uppercase text-zinc-400">Education</span>
                  <div className="sm:col-span-3 space-y-2 text-xs sm:text-sm">
                    {cvData.education.map((edu, i) => (
                      <div key={i} className="flex justify-between">
                        <div>
                          <strong className="text-zinc-900">{edu.degree}</strong>, {edu.institution} {edu.roll && `(Roll: ${edu.roll})`}
                        </div>
                        <span className="text-zinc-600 font-semibold">{edu.passingYear} • {edu.result}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {showSignature && (
                <div className="pt-4 flex justify-end">
                  <div className="text-center">
                    <div className="w-32 h-10 border-b border-zinc-400 flex items-center justify-center p-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={cvData.signatureUrl} alt="Signature" className="max-h-full object-contain" />
                    </div>
                    <span className="text-xs font-bold text-zinc-900 block mt-1">{cvData.fullName}</span>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

    </div>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard, 
  Calendar, 
  Heart, 
  GraduationCap, 
  Briefcase, 
  Layers, 
  FileText, 
  FolderKanban, 
  ShieldCheck, 
  Terminal, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  Landmark, 
  Fingerprint, 
  Home, 
  ExternalLink,
  KeyRound,
  Wallet
} from "lucide-react";
import { useProfile } from "@/context/ProfileContext";
import { useExpense } from "@/context/ExpenseContext";
import { Card } from "@/components/Card";
import { CopyButton } from "@/components/CopyButton";

export default function DashboardPage() {
  const { data: personalData } = useProfile();
  const { expenses, incomes, budgetConfig } = useExpense();

  const currentMonth = new Date().toISOString().slice(0, 7);
  const totalAllExp = expenses.reduce((s, c) => s + c.amount, 0);
  const totalAllInc = incomes.reduce((s, c) => s + c.amount, 0);
  const netRemaining = budgetConfig.initialCapital + totalAllInc - totalAllExp;
  const monthSpent = expenses.filter((e) => e.date.startsWith(currentMonth)).reduce((s, c) => s + c.amount, 0);
  const todaySpent = expenses.filter((e) => e.date === new Date().toISOString().slice(0, 10)).reduce((s, c) => s + c.amount, 0);
  return (
    <div className="space-y-7 animate-fade-in">
      
      {/* Hero Profile Banner (8px radius, Larger Typography) */}
      <section className="glass-panel rounded-lg p-4 sm:p-6 lg:p-8 border border-zinc-200/90 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/70 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
            {/* Real Applicant Photo with 8px radius */}
            <div className="relative shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden border-2 border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={personalData.photoUrl}
                  alt={personalData.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-md p-1 border-2 border-white dark:border-zinc-900 shadow-sm" title="Verified Govt Job Ready Photo (300x300)">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>

            {/* Profile Meta (Larger, bold typography) */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
                  {personalData.fullName}
                </h1>
                <CopyButton textToCopy={personalData.fullName} showText label="Copy Name" />
              </div>

              <div className="text-base sm:text-lg font-semibold text-blue-600 dark:text-cyan-400">
                {personalData.fullNameBn}
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1 text-sm text-zinc-600 dark:text-zinc-400">
                <span className="inline-flex items-center gap-1.5 font-semibold text-zinc-800 dark:text-zinc-200">
                  <Briefcase className="w-4 h-4 text-blue-500" />
                  {personalData.profession}
                </span>
                <span className="text-zinc-300 dark:text-zinc-700">•</span>
                <span className="inline-flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  Tentulia, Panchagarh - 5030
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions (Larger buttons, 8px radius) */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto pt-2 lg:pt-0">
            <a
              href={personalData.photoUrl}
              download="MD_SAZZAD_HOSEN_SHUVO_Photo_300x300.jpg"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all"
              title="Download 300x300 Photo"
            >
              <Download className="w-4 h-4 text-zinc-500" />
              <span>Photo (300×300)</span>
            </a>

            <a
              href={personalData.signatureUrl}
              download="MD_SAZZAD_HOSEN_SHUVO_Signature_300x80.jpg"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all"
              title="Download 300x80 Signature"
            >
              <Download className="w-4 h-4 text-zinc-500" />
              <span>Signature (300×80)</span>
            </a>

            <Link
              href="/cv-builder"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>ATS CV Builder</span>
            </Link>
          </div>
        </div>

        {/* Quick Identity Strips (Larger font, bold labels) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-6 border-t border-zinc-200/90 dark:border-zinc-800">
          
          <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800">
            <div className="flex items-center gap-3 min-w-0">
              <Mail className="w-5 h-5 text-blue-600 dark:text-cyan-400 shrink-0" />
              <div className="truncate text-xs sm:text-sm">
                <span className="text-zinc-400 block text-[11px] uppercase font-bold">Email Address</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200 truncate">{personalData.email}</span>
              </div>
            </div>
            <CopyButton textToCopy={personalData.email} />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800">
            <div className="flex items-center gap-3 min-w-0">
              <Phone className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div className="truncate text-xs sm:text-sm">
                <span className="text-zinc-400 block text-[11px] uppercase font-bold">Mobile Phone</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">{personalData.mobile}</span>
              </div>
            </div>
            <CopyButton textToCopy={personalData.mobile} />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800">
            <div className="flex items-center gap-3 min-w-0">
              <CreditCard className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <div className="truncate text-xs sm:text-sm">
                <span className="text-zinc-400 block text-[11px] uppercase font-bold">National ID (NID)</span>
                <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200 tracking-wider">{personalData.nid}</span>
              </div>
            </div>
            <CopyButton textToCopy={personalData.nid} />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800">
            <div className="flex items-center gap-3 min-w-0">
              <Heart className="w-5 h-5 text-rose-500 shrink-0" />
              <div className="truncate text-xs sm:text-sm">
                <span className="text-zinc-400 block text-[11px] uppercase font-bold">Blood Group</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-200">{personalData.bloodGroup}</span>
              </div>
            </div>
            <CopyButton textToCopy={personalData.bloodGroup} />
          </div>

        </div>
      </section>

      {/* Daily Expense & Money Tracker Quick Widget */}
      <section className="glass-panel rounded-2xl p-5 sm:p-6 border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-white dark:via-zinc-900 to-blue-500/10 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                দৈনন্দিন খরচ ও বাজেট হিসাব
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Auto হিসাব
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500">
                আজকের খরচ, চলতি মাসের হিসাব এবং অবশিষ্ট মূল ব্যালেন্স
              </p>
            </div>
          </div>

          <Link
            href="/expenses"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90 transition-all shadow-sm self-start sm:self-auto"
          >
            <span>সম্পূর্ণ হিসাব ও পরিকল্পনা খুলুন</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-4">
          <div className="p-3.5 rounded-xl bg-white/80 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
            <span className="text-xs text-zinc-500 block font-bold uppercase">হাতে মোট অবশিষ্ট টাকা</span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              ৳{netRemaining.toLocaleString("bn-BD")}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/80 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
            <span className="text-xs text-zinc-500 block font-bold uppercase">আজকের খরচ (Today)</span>
            <span className="text-2xl font-black text-rose-600 dark:text-rose-400">
              ৳{todaySpent.toLocaleString("bn-BD")}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/80 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
            <span className="text-xs text-zinc-500 block font-bold uppercase">চলতি মাসের খরচ ({currentMonth})</span>
            <span className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
              ৳{monthSpent.toLocaleString("bn-BD")}
            </span>
          </div>
        </div>
      </section>

      {/* Official Government Job / Civil Service Registry */}
      <section className="glass-panel rounded-lg p-6 sm:p-7 border border-blue-500/30 bg-blue-50/15 dark:bg-blue-950/10 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-blue-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-600 dark:text-cyan-400 border border-blue-500/20 flex items-center justify-center">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  Government Job Application Profile (বাংলাদেশ সরকারি চাকুরীর পূর্ণ বিবরণ)
                </h2>
                <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-cyan-400 border border-blue-500/20">
                  Govt Format
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-500">
                Official civil service & Teletalk online job application specifications
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <CopyButton
              textToCopy={`Applicant's Name: ${personalData.govtDetails.applicantName} (${personalData.govtDetails.applicantNameBn})
Father's Name: ${personalData.govtDetails.fathersName} (${personalData.govtDetails.fathersNameBn})
Mother's Name: ${personalData.govtDetails.mothersName} (${personalData.govtDetails.mothersNameBn})
Date of Birth: ${personalData.govtDetails.dob}
Age: ${personalData.govtDetails.ageTillGovtCutoff}
Nationality: ${personalData.govtDetails.nationality}
Religion: ${personalData.govtDetails.religion}
Gender: ${personalData.govtDetails.gender}
National ID: ${personalData.govtDetails.nid}
Marital Status: ${personalData.govtDetails.maritalStatus}
Mobile: ${personalData.govtDetails.mobile}
Email: ${personalData.govtDetails.email}
Address: Care Of: ${personalData.govtDetails.presentAddress.careOf}, Vill: ${personalData.govtDetails.presentAddress.village}, Post: ${personalData.govtDetails.presentAddress.postOffice} - ${personalData.govtDetails.presentAddress.postCode}, Upazila: ${personalData.govtDetails.presentAddress.upazila}, District: ${personalData.govtDetails.presentAddress.district}
Education:
- Diploma in Engineering: Board: BTEB, Roll: 500412, GPA: 3.24, Year: 2024, Subject: Computer Science Technology
- SSC Vocational: Board: BTEB, Roll: 200840, GPA: 4.50, Year: 2020, Subject: Computer and Information Technology`}
              showText
              label="Copy All Govt Data"
            />
          </div>
        </div>

        {/* Govt Form Grid (Larger font, bold labels) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-sm">
          
          <div className="p-4 rounded-lg bg-white/90 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800 space-y-1.5">
            <div className="flex justify-between items-center text-zinc-400 text-xs uppercase font-bold">
              <span>Date of Birth & Age</span>
              <CopyButton textToCopy={personalData.govtDetails.dob} />
            </div>
            <div className="font-bold text-zinc-800 dark:text-zinc-200 text-base">
              {personalData.govtDetails.dob}
            </div>
            <div className="text-xs text-blue-600 dark:text-cyan-400 font-semibold">
              {personalData.govtDetails.ageTillGovtCutoff}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-white/90 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800 space-y-1.5">
            <div className="flex justify-between items-center text-zinc-400 text-xs uppercase font-bold">
              <span>Nationality & Religion</span>
              <CopyButton textToCopy={`${personalData.govtDetails.nationality}, ${personalData.govtDetails.religion}`} />
            </div>
            <div className="font-bold text-zinc-800 dark:text-zinc-200 text-base">
              {personalData.govtDetails.nationality} • {personalData.govtDetails.religion}
            </div>
            <div className="text-xs text-zinc-500 font-medium">
              Gender: {personalData.govtDetails.gender} • Marital: {personalData.govtDetails.maritalStatus}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-white/90 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800 space-y-1.5">
            <div className="flex justify-between items-center text-zinc-400 text-xs uppercase font-bold">
              <span>Departmental Status</span>
              <CopyButton textToCopy={personalData.govtDetails.departmentalStatus} />
            </div>
            <div className="font-bold text-zinc-800 dark:text-zinc-200 text-base">
              {personalData.govtDetails.departmentalStatus}
            </div>
            <div className="text-xs text-zinc-500 font-medium">
              Passport / Birth Reg: N/A
            </div>
          </div>

        </div>

        {/* Detailed Address Grid */}
        <div className="p-4 sm:p-5 rounded-lg bg-white/90 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800 space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-zinc-200/80 dark:border-zinc-800">
            <span className="text-sm sm:text-base font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
              <Home className="w-4 h-4 text-zinc-500" />
              Present & Permanent Address (বর্তমান ও স্থায়ী ঠিকানা)
            </span>
            <CopyButton textToCopy={personalData.govtDetails.presentAddress.fullAddress} showText label="Copy Address" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs sm:text-sm">
            <div>
              <span className="text-[11px] text-zinc-400 uppercase font-bold block">Care Of</span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">{personalData.govtDetails.presentAddress.careOf}</span>
            </div>
            <div className="col-span-2">
              <span className="text-[11px] text-zinc-400 uppercase font-bold block">Village / Road / House</span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">{personalData.govtDetails.presentAddress.village}</span>
            </div>
            <div>
              <span className="text-[11px] text-zinc-400 uppercase font-bold block">Upazila / P.S.</span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">{personalData.govtDetails.presentAddress.upazila}</span>
            </div>
            <div>
              <span className="text-[11px] text-zinc-400 uppercase font-bold block">Post Office</span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">{personalData.govtDetails.presentAddress.postOffice}</span>
            </div>
            <div>
              <span className="text-[11px] text-zinc-400 uppercase font-bold block">Post Code & Dist</span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">{personalData.govtDetails.presentAddress.postCode}, {personalData.govtDetails.presentAddress.district}</span>
            </div>
          </div>
        </div>

      </section>

      {/* Official Photo & Signature Card */}
      <Card
        title="Official Photo & Digital Signature (ছবি ও স্বাক্ষর)"
        subtitle="Standard sizes formatted for Bangladesh Government Job / Teletalk online submission"
        icon={<Fingerprint className="w-5 h-5 text-emerald-500" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Photo Box */}
          <div className="p-4 sm:p-5 rounded-lg bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800 flex flex-col sm:flex-row items-center gap-5">
            <div className="w-32 h-32 shrink-0 rounded-lg overflow-hidden border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 flex items-center justify-center shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={personalData.photoUrl}
                alt="300x300 Applicant Photo"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-2 text-center sm:text-left flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h4 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100">
                  Applicant Photo
                </h4>
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-cyan-400 border border-blue-200/60 dark:border-blue-900">
                  300 × 300 px
                </span>
              </div>
              <p className="text-xs text-zinc-500 leading-normal">
                Size: <strong>21.9 KB</strong> (Official Requirement: Max 100 KB, 300x300 pixel JPG format).
              </p>
              <div className="pt-1">
                <a
                  href={personalData.photoUrl}
                  download="MD_SAZZAD_HOSEN_SHUVO_Photo_300x300.jpg"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Photo</span>
                </a>
              </div>
            </div>
          </div>

          {/* Signature Box */}
          <div className="p-4 sm:p-5 rounded-lg bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800 flex flex-col sm:flex-row items-center gap-5">
            <div className="w-40 h-20 shrink-0 rounded-lg overflow-hidden border border-zinc-300 dark:border-zinc-700 bg-white p-2 flex items-center justify-center shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={personalData.signatureUrl}
                alt="300x80 Applicant Signature"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="space-y-2 text-center sm:text-left flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h4 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100">
                  Applicant Signature
                </h4>
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-cyan-400 border border-blue-200/60 dark:border-blue-900">
                  300 × 80 px
                </span>
              </div>
              <p className="text-xs text-zinc-500 leading-normal">
                Size: <strong>5.08 KB</strong> (Official Requirement: Max 60 KB, 300x80 pixel JPG format).
              </p>
              <div className="pt-1">
                <a
                  href={personalData.signatureUrl}
                  download="MD_SAZZAD_HOSEN_SHUVO_Signature_300x80.jpg"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Signature</span>
                </a>
              </div>
            </div>
          </div>

        </div>
      </Card>

      {/* Main Grid: Details, Education with Rolls, & Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column (2 cols): Personal & Academic Records with Rolls */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Personal & Family Details */}
          <Card
            title="Personal & Civil Records"
            subtitle="Verified identity, parents' information & civil registry data"
            icon={<User className="w-5 h-5 text-blue-500" />}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">

              {/* Full Name */}
              <div className="p-3.5 rounded-lg bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Applicant&apos;s Name
                  </span>
                  <CopyButton textToCopy={personalData.fullName} />
                </div>
                <div>
                  <div className="font-bold text-zinc-900 dark:text-zinc-100 text-base">
                    {personalData.fullName}
                  </div>
                  <div className="text-xs sm:text-sm text-blue-600 dark:text-cyan-400 font-medium">
                    {personalData.fullNameBn}
                  </div>
                </div>
              </div>

              {/* Father's Name */}
              <div className="p-3.5 rounded-lg bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Father&apos;s Name (পিতার নাম)
                  </span>
                  <CopyButton textToCopy={personalData.fathersName} />
                </div>
                <div>
                  <div className="font-bold text-zinc-900 dark:text-zinc-100 text-base">
                    {personalData.fathersName}
                  </div>
                  <div className="text-xs sm:text-sm text-blue-600 dark:text-cyan-400 font-medium">
                    {personalData.fathersNameBn}
                  </div>
                </div>
              </div>

              {/* Mother's Name */}
              <div className="p-3.5 rounded-lg bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Mother&apos;s Name (মাতার নাম)
                  </span>
                  <CopyButton textToCopy={personalData.mothersName} />
                </div>
                <div>
                  <div className="font-bold text-zinc-900 dark:text-zinc-100 text-base">
                    {personalData.mothersName}
                  </div>
                  <div className="text-xs sm:text-sm text-blue-600 dark:text-cyan-400 font-medium">
                    {personalData.mothersNameBn}
                  </div>
                </div>
              </div>

              {/* Date of Birth */}
              <div className="p-3.5 rounded-lg bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Date of Birth & Age
                  </span>
                  <CopyButton textToCopy={personalData.dob} />
                </div>
                <div>
                  <div className="font-bold text-zinc-900 dark:text-zinc-100 text-base flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-zinc-500" />
                    {personalData.dob}
                  </div>
                  <div className="text-xs text-zinc-500">
                    {personalData.govtDetails.ageTillGovtCutoff}
                  </div>
                </div>
              </div>

              {/* NID */}
              <div className="p-3.5 rounded-lg bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    National ID (NID No)
                  </span>
                  <CopyButton textToCopy={personalData.nid} />
                </div>
                <div>
                  <div className="font-mono font-bold text-lg tracking-wider text-blue-600 dark:text-cyan-300">
                    {personalData.nid}
                  </div>
                  <div className="text-xs text-zinc-500">
                    Official 10-Digit Smart NID
                  </div>
                </div>
              </div>

              {/* Blood Group */}
              <div className="p-3.5 rounded-lg bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Blood Group
                  </span>
                  <CopyButton textToCopy={personalData.bloodGroup} />
                </div>
                <div>
                  <div className="font-bold text-rose-600 dark:text-rose-400 text-base flex items-center gap-1.5">
                    <Heart className="w-4 h-4 fill-rose-500/20" />
                    {personalData.bloodGroup}
                  </div>
                  <div className="text-xs text-zinc-500">
                    Universal Donor / Healthy
                  </div>
                </div>
              </div>

            </div>
          </Card>

          {/* Educational Qualifications with BTEB Rolls & Details */}
          <Card
            title="Educational Qualifications (শিক্ষাগত যোগ্যতা)"
            subtitle="Government job verified board results with Roll numbers and passing year"
            icon={<GraduationCap className="w-5 h-5 text-indigo-500" />}
          >
            <div className="space-y-3.5">
              {personalData.education.map((edu, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-base sm:text-lg">
                          {edu.degree}
                        </h4>
                        {edu.roll && (
                          <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-900">
                            Roll: {edu.roll}
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-cyan-400 mt-0.5">
                        {edu.institution} {edu.boardOrBatch && `• ${edu.boardOrBatch}`}
                      </p>
                      {edu.group && (
                        <p className="text-xs text-zinc-500 mt-0.5">
                          Group / Subject: <strong className="text-zinc-800 dark:text-zinc-200 font-semibold">{edu.group}</strong>
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {edu.roll && <CopyButton textToCopy={edu.roll} label="Copy Roll" />}
                      {edu.result && (
                        <span className="px-2.5 py-1 rounded text-xs sm:text-sm font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          {edu.result}
                        </span>
                      )}
                      {edu.passingYear && (
                        <span className="px-2.5 py-1 rounded text-xs sm:text-sm font-medium bg-zinc-200/70 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                          {edu.passingYear}
                        </span>
                      )}
                    </div>
                  </div>

                  {edu.description && (
                    <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Work Experience */}
          <Card
            title="Professional Experience"
            subtitle="Full-stack engineering & web specialist project track"
            icon={<Briefcase className="w-5 h-5 text-emerald-500" />}
          >
            <div className="space-y-4">
              {personalData.experience.map((exp, idx) => (
                <div
                  key={idx}
                  className="p-4 sm:p-5 rounded-lg bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800 space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <div>
                      <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-base sm:text-lg">
                        {exp.role}
                      </h4>
                      <p className="text-xs sm:text-sm font-medium text-zinc-500">
                        {exp.company} • {exp.location}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded text-xs font-semibold bg-zinc-200/70 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 self-start sm:self-auto">
                      {exp.period}
                    </span>
                  </div>

                  <ul className="space-y-1.5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 list-disc list-inside">
                    {exp.description.map((item, itemIdx) => (
                      <li key={itemIdx} className="leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Card>

        </div>

        {/* Right Column (1 col): Copy Center, Skills, and Security */}
        <div className="space-y-6">
          
          {/* Quick Copy Cheat-Sheet */}
          <Card
            title="Instant Copy Center"
            subtitle="One-click copy for job forms"
            icon={<Terminal className="w-5 h-5 text-indigo-500" />}
          >
            <div className="space-y-2 text-xs sm:text-sm">
              
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800">
                <span className="text-zinc-400 font-medium">Diploma Roll</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">500412</span>
                  <CopyButton textToCopy="500412" />
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800">
                <span className="text-zinc-400 font-medium">SSC Roll</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">200840</span>
                  <CopyButton textToCopy="200840" />
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800">
                <span className="text-zinc-400 font-medium">NID Number</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">9581214047</span>
                  <CopyButton textToCopy="9581214047" />
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800">
                <span className="text-zinc-400 font-medium">Mobile Phone</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">01719052334</span>
                  <CopyButton textToCopy="01719052334" />
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800">
                <span className="text-zinc-400 font-medium">Post Code</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">5030</span>
                  <CopyButton textToCopy="5030" />
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800">
                <span className="text-zinc-400 font-medium">Upazila</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">Tentulia</span>
                  <CopyButton textToCopy="Tentulia" />
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800">
                <span className="text-zinc-400 font-medium">Care Of</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-zinc-800 dark:text-zinc-200 truncate max-w-[130px]">MD ASRAFUL HAQUE</span>
                  <CopyButton textToCopy="MD ASRAFUL HAQUE" />
                </div>
              </div>

            </div>
          </Card>

          {/* Technical Skills Breakdown */}
          <Card
            title="Technical Competencies"
            subtitle="Full-stack engineering & CMS"
            icon={<Layers className="w-5 h-5 text-cyan-500" />}
          >
            <div className="space-y-3.5">
              <div>
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
                  Frontend
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {personalData.skills.frontend.map((s) => (
                    <span key={s} className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
                  Backend & Database
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {personalData.skills.backend.map((s) => (
                    <span key={s} className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
                  CMS Platforms
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {personalData.skills.cms.map((s) => (
                    <span key={s} className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Portfolio Links */}
          <div className="p-5 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-md space-y-3">
            <h4 className="font-bold text-base">
              Verified Documents & Certificates
            </h4>
            <p className="text-xs sm:text-sm text-zinc-400 dark:text-zinc-600 leading-relaxed">
              BTEB Diploma, SSC Vocational certificate, and transcripts are available in the showcase.
            </p>
            <div className="pt-1 flex flex-col gap-2">
              <Link
                href="/showcase"
                className="w-full py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold text-center block bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white shadow-sm hover:opacity-90 transition-opacity"
              >
                Inspect Official Documents
              </Link>
              <Link
                href="/cv-builder"
                className="w-full py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold text-center block border border-zinc-700 dark:border-zinc-300 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
              >
                Open ATS CV Builder
              </Link>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

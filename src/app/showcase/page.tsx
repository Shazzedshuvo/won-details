"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { 
  UploadCloud, 
  FileText, 
  ImageIcon, 
  Trash2, 
  Eye, 
  FolderKanban, 
  Check, 
  X, 
  ArrowLeft, 
  RotateCcw, 
  Download,
  FileCheck2,
  ExternalLink,
  Landmark,
  ShieldCheck
} from "lucide-react";
import { useShowcase, ShowcaseItem } from "@/context/ShowcaseContext";

export default function ShowcasePage() {
  const { items, addItem, deleteItem, resetToDefaults } = useShowcase();

  // Filter & Search states
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Drag and drop states
  const [isDragging, setIsDragging] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadCategory, setUploadCategory] = useState<"certificate" | "project" | "document" | "govt">("certificate");
  const [pendingFile, setPendingFile] = useState<{
    name: string;
    size: string;
    type: "image" | "pdf";
    url: string;
  } | null>(null);

  // Modal preview state
  const [activePreview, setActivePreview] = useState<ShowcaseItem | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const file = fileList[0];
    
    const isPdf = file.type.includes("pdf") || file.name.endsWith(".pdf");
    const isImg = file.type.startsWith("image/");

    if (!isPdf && !isImg) {
      alert("Please upload an image file (JPG, PNG, WebP) or a PDF document.");
      return;
    }

    const fileSizeStr = (file.size / (1024 * 1024)).toFixed(2) + " MB";
    const defaultTitle = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");

    const reader = new FileReader();
    reader.onload = (e) => {
      setPendingFile({
        name: file.name,
        size: fileSizeStr,
        type: isPdf ? "pdf" : "image",
        url: e.target?.result as string,
      });
      if (!uploadTitle) setUploadTitle(defaultTitle);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleSaveUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingFile) return;

    addItem({
      title: uploadTitle.trim() || pendingFile.name,
      category: uploadCategory,
      fileType: pendingFile.type,
      fileUrl: pendingFile.url,
      fileName: pendingFile.name,
      fileSize: pendingFile.size,
      description: `Uploaded on ${new Date().toLocaleDateString()}`,
      tags: [uploadCategory.toUpperCase(), pendingFile.type.toUpperCase()]
    });

    setPendingFile(null);
    setUploadTitle("");
  };

  const filteredItems = items.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesQuery = searchQuery === "" || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.tags && item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      
      {/* Top Header (8px radius) */}
      <div className="glass-panel rounded-lg p-4 sm:p-6 border border-zinc-200/90 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/60 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
                Official Documents & Project Showcase
              </h1>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                {items.length} Files
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Verified certificates, government application photos (300×300), digital signatures (300×80), transcripts & documents.
            </p>
          </div>
        </div>

        <button
          onClick={resetToDefaults}
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors self-start sm:self-auto shadow-sm"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Files to Default</span>
        </button>
      </div>

      {/* Drag & Drop Upload Zone (8px radius) */}
      <div className="glass-panel rounded-lg p-5 sm:p-6 border border-zinc-200/90 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/60 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UploadCloud className="w-4 h-4 text-zinc-500" />
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Upload Certificate, Photo or Document
            </h2>
          </div>
          <span className="text-[11px] text-zinc-400">
            JPG, PNG, WebP, PDF (Cloud & Local Storage)
          </span>
        </div>

        {/* Drop Zone (8px radius) */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-150 ${
            isDragging
              ? "border-blue-500 bg-blue-500/5"
              : "border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600 bg-zinc-50/50 dark:bg-zinc-900/40"
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFiles(e.target.files)}
            accept="image/*,application/pdf"
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-zinc-800 dark:text-zinc-200">
                <span className="text-blue-600 dark:text-cyan-400 hover:underline">Click to browse</span> or drag and drop files
              </p>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                BTEB Certificates, Academic Transcripts, or Project Proofs
              </p>
            </div>
          </div>
        </div>

        {/* Pending File Configuration Form (8px radius) */}
        {pendingFile && (
          <form
            onSubmit={handleSaveUpload}
            className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 animate-fade-in space-y-3"
          >
            <div className="flex items-center justify-between pb-2.5 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-md bg-zinc-900 dark:bg-white text-white dark:text-zinc-900">
                  {pendingFile.type === "image" ? <ImageIcon className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
                </div>
                <div>
                  <div className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">
                    {pendingFile.name}
                  </div>
                  <span className="text-[10px] text-zinc-400">
                    {pendingFile.size} • {pendingFile.type.toUpperCase()}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPendingFile(null)}
                className="text-zinc-400 hover:text-zinc-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                  Document / File Title
                </label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g. BTEB 4-Year Diploma Certificate"
                  required
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-zinc-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                  Category
                </label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value as any)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-zinc-400"
                >
                  <option value="govt">Govt / Civil Job Records</option>
                  <option value="certificate">Academic Certificates</option>
                  <option value="document">Transcripts & Official Documents</option>
                  <option value="project">Project Artifacts</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setPendingFile(null)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save File</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        {/* Category Pills (8px radius) */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: "all", label: "All Records" },
            { id: "govt", label: "Govt / Photo / Sign" },
            { id: "certificate", label: "Certificates" },
            { id: "document", label: "Documents" },
            { id: "project", label: "Projects" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              type="button"
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat.id
                  ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-sm"
                  : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input (8px radius) */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search BTEB, Roll, Photo, Certificate..."
            className="w-full px-3 py-1.5 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-2 text-zinc-400 hover:text-zinc-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>

      {/* Gallery Grid (8px radius) */}
      {filteredItems.length === 0 ? (
        <div className="glass-panel rounded-lg p-10 text-center space-y-2 border border-zinc-200/90 dark:border-zinc-800">
          <FolderKanban className="w-10 h-10 text-zinc-400 mx-auto" />
          <h3 className="font-semibold text-sm text-zinc-800 dark:text-zinc-200">
            No files found
          </h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Try adjusting your search criteria or drag and drop a new file above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group glass-panel rounded-lg overflow-hidden border border-zinc-200/90 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md transition-all duration-200 flex flex-col bg-white/70 dark:bg-zinc-900/60"
            >
              {/* Media Preview Box */}
              <div 
                onClick={() => setActivePreview(item)}
                className="relative h-48 bg-zinc-100 dark:bg-zinc-950 overflow-hidden cursor-pointer flex items-center justify-center border-b border-zinc-200/80 dark:border-zinc-800 p-2"
              >
                {item.fileType === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.fileUrl}
                    alt={item.title}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-1.5 p-6">
                    <div className="w-12 h-12 rounded-lg bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700">
                      <FileText className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                      PDF Document
                    </span>
                  </div>
                )}

                {/* Category Badge (8px radius) */}
                <div className="absolute top-2.5 left-2.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md ${
                    item.category === "govt"
                      ? "bg-emerald-600 text-white"
                      : item.category === "certificate"
                      ? "bg-blue-600 text-white"
                      : "bg-zinc-900/80 dark:bg-white/80 text-white dark:text-zinc-900"
                  }`}>
                    {item.category === "govt" ? "Govt Job Ready" : item.category}
                  </span>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-zinc-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white text-zinc-900 text-xs font-medium shadow-md">
                    <Eye className="w-3.5 h-3.5" />
                    Inspect File
                  </span>
                </div>
              </div>

              {/* Details Content */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <h3 
                    onClick={() => setActivePreview(item)}
                    className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 line-clamp-1 cursor-pointer hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
                  >
                    {item.title}
                  </h3>

                  {item.description && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Bottom Meta & Actions */}
                <div className="pt-2.5 border-t border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400">
                  <span>
                    {item.dimensions ? `${item.dimensions} • ` : ""}
                    {item.fileSize}
                  </span>

                  <div className="flex items-center gap-1">
                    <a
                      href={item.fileUrl}
                      download={item.fileName}
                      className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors"
                      title="Download File"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>

                    <button
                      onClick={() => setActivePreview(item)}
                      type="button"
                      className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => deleteItem(item.id)}
                      type="button"
                      className="p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40 text-zinc-400 hover:text-rose-500 transition-colors"
                      title="Delete Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal (8px radius) */}
      {activePreview && (
        <div 
          onClick={() => setActivePreview(null)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl max-h-[90vh] bg-white dark:bg-zinc-900 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col"
          >
            {/* Modal Header */}
            <div className="px-5 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm sm:text-base text-zinc-900 dark:text-zinc-100">
                  {activePreview.title}
                </h3>
                <span className="text-[11px] text-zinc-400">
                  {activePreview.fileName} • {activePreview.dimensions ? `${activePreview.dimensions} • ` : ""}{activePreview.fileSize}
                </span>
              </div>
              <button
                onClick={() => setActivePreview(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body Preview */}
            <div className="flex-1 overflow-auto p-5 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center min-h-[300px]">
              {activePreview.fileType === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={activePreview.fileUrl}
                  alt={activePreview.title}
                  className="max-h-[65vh] max-w-full rounded-md object-contain shadow-sm"
                />
              ) : (
                <div className="text-center space-y-3 p-6">
                  <div className="w-16 h-16 rounded-lg bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300 mx-auto border border-zinc-300 dark:border-zinc-700">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-zinc-800 dark:text-zinc-200">
                      PDF Document Record
                    </h4>
                    <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-0.5">
                      {activePreview.description || "Official verified PDF record."}
                    </p>
                  </div>
                  <a
                    href={activePreview.fileUrl}
                    download={activePreview.fileName}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Document</span>
                  </a>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
              <span className="text-[11px]">
                Category: <strong className="uppercase text-zinc-800 dark:text-zinc-200">{activePreview.category}</strong>
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={activePreview.fileUrl}
                  download={activePreview.fileName}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold text-xs shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
                <button
                  onClick={() => setActivePreview(null)}
                  className="px-3 py-1.5 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium text-xs"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

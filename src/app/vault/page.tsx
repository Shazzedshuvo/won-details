"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  FolderPlus,
  Plus,
  Search,
  Copy,
  Check,
  Trash2,
  Edit2,
  FileText,
  ImageIcon,
  Download,
  Eye,
  X,
  ArrowLeft,
  Folder,
  Layers,
  Sparkles,
  ExternalLink,
  RotateCcw,
  Tag,
  Paperclip,
  CheckCircle2
} from "lucide-react";
import { useVault, VaultCategory, VaultRecord, RecordField } from "@/context/VaultContext";

export default function VaultPage() {
  const {
    categories,
    records,
    addCategory,
    updateCategory,
    deleteCategory,
    addRecord,
    updateRecord,
    deleteRecord,
    resetToDefaults
  } = useVault();

  // Filter & Search states
  const [selectedCatId, setSelectedCatId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modals
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<VaultRecord | null>(null);
  const [activePreviewFile, setActivePreviewFile] = useState<{
    title: string;
    url: string;
    type: "image" | "pdf";
  } | null>(null);

  // New Category Form State
  const [newCatName, setNewCatName] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [newCatColor, setNewCatColor] = useState("from-blue-500 to-indigo-600");

  // New/Edit Record Form State
  const [recCategoryId, setRecCategoryId] = useState("");
  const [recTitle, setRecTitle] = useState("");
  const [recNote, setRecNote] = useState("");
  const [recFields, setRecFields] = useState<RecordField[]>([
    { label: "", value: "" }
  ]);
  const [rawVaultFile, setRawVaultFile] = useState<File | null>(null);
  const [isVaultUploading, setIsVaultUploading] = useState(false);
  const [recFile, setRecFile] = useState<{
    name: string;
    size: string;
    type: "image" | "pdf";
    url: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Quick Copy Handler
  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAllRecord = (record: VaultRecord) => {
    const lines = [
      `=== ${record.title} ===`,
      ...record.fields.map((f) => `${f.label}: ${f.value}`),
      record.note ? `\nবিবরণী/নোট: ${record.note}` : ""
    ].filter(Boolean);

    handleCopyText(lines.join("\n"), `all-${record.id}`);
  };

  // Open Record Modal (New or Edit)
  const openNewRecordModal = (catId?: string) => {
    setEditingRecord(null);
    setRecCategoryId(catId || (selectedCatId !== "all" ? selectedCatId : categories[0]?.id || ""));
    setRecTitle("");
    setRecNote("");
    setRecFields([{ label: "", value: "" }]);
    setRecFile(null);
    setRawVaultFile(null);
    setIsRecordModalOpen(true);
  };

  const openEditRecordModal = (record: VaultRecord) => {
    setEditingRecord(record);
    setRecCategoryId(record.categoryId);
    setRecTitle(record.title);
    setRecNote(record.note || "");
    setRecFields(
      record.fields && record.fields.length > 0
        ? [...record.fields]
        : [{ label: "", value: "" }]
    );
    if (record.fileUrl && record.fileName && record.fileType) {
      setRecFile({
        name: record.fileName,
        size: record.fileSize || "",
        type: record.fileType,
        url: record.fileUrl
      });
    } else {
      setRecFile(null);
    }
    setRawVaultFile(null);
    setIsRecordModalOpen(true);
  };

  // Field Array Handlers
  const handleAddField = () => {
    setRecFields([...recFields, { label: "", value: "" }]);
  };

  const handleFieldChange = (index: number, key: "label" | "value", val: string) => {
    const updated = [...recFields];
    updated[index][key] = val;
    setRecFields(updated);
  };

  const handleRemoveField = (index: number) => {
    setRecFields(recFields.filter((_, idx) => idx !== index));
  };

  // File Upload inside Modal
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setRawVaultFile(file);

    const isPdf = file.type.includes("pdf") || file.name.endsWith(".pdf");
    const isImg = file.type.startsWith("image/");

    if (!isPdf && !isImg) {
      alert("Please upload an image (JPG, PNG) or a PDF file.");
      return;
    }

    const fileSizeStr = (file.size / (1024 * 1024)).toFixed(2) + " MB";
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      setRecFile({
        name: file.name,
        size: fileSizeStr,
        type: isPdf ? "pdf" : "image",
        url: loadEvent.target?.result as string
      });
    };
    reader.readAsDataURL(file);
  };

  // Submit Category
  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const newId = addCategory(newCatName, newCatDesc, newCatColor);
    setSelectedCatId(newId);
    setNewCatName("");
    setNewCatDesc("");
    setIsCategoryModalOpen(false);
  };

  // Submit Record
  const handleSaveRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recTitle.trim() || !recCategoryId) return;

    const cleanFields = recFields.filter(
      (f) => f.label.trim() !== "" || f.value.trim() !== ""
    );

    let finalFileUrl = recFile?.url;

    if (rawVaultFile) {
      setIsVaultUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", rawVaultFile);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const json = await res.json();
        if (res.ok && json.success && json.url) {
          finalFileUrl = json.url;
        }
      } catch (err) {
        console.warn("Vault Cloudinary fallback:", err);
      } finally {
        setIsVaultUploading(false);
      }
    }

    if (editingRecord) {
      updateRecord(editingRecord.id, {
        categoryId: recCategoryId,
        title: recTitle.trim(),
        note: recNote.trim(),
        fields: cleanFields,
        fileUrl: finalFileUrl,
        fileName: recFile?.name,
        fileType: recFile?.type,
        fileSize: recFile?.size
      });
    } else {
      addRecord({
        categoryId: recCategoryId,
        title: recTitle.trim(),
        note: recNote.trim(),
        fields: cleanFields,
        fileUrl: finalFileUrl,
        fileName: recFile?.name,
        fileType: recFile?.type,
        fileSize: recFile?.size
      });
    }

    setIsRecordModalOpen(false);
    setRawVaultFile(null);
  };

  // Filtered list
  const filteredRecords = records.filter((rec) => {
    const matchesCategory =
      selectedCatId === "all" || rec.categoryId === selectedCatId;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCategory;

    const matchesTitle = rec.title.toLowerCase().includes(query);
    const matchesNote = rec.note?.toLowerCase().includes(query) || false;
    const matchesFields = rec.fields.some(
      (f) =>
        f.label.toLowerCase().includes(query) ||
        f.value.toLowerCase().includes(query)
    );

    return matchesCategory && (matchesTitle || matchesNote || matchesFields);
  });

  const activeCategory = categories.find((c) => c.id === selectedCatId);

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      {/* Top Banner (8px radius) */}
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
                Custom Categories & Record Vault
              </h1>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                {records.length} Records
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              বাবা-মার তথ্যাবলী, জমির দলিল ও খতিয়ান, প্রজেক্ট পোর্টফোলিও এবং প্রয়োজনীয় যেকোনো ক্যাটাগরি তৈরি করে তথ্য ও ফাইল সংরক্ষণ করুন।
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 shadow-sm transition-colors"
          >
            <FolderPlus className="w-3.5 h-3.5 text-blue-500" />
            <span>+ New Category</span>
          </button>

          <button
            onClick={() => openNewRecordModal()}
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Record / File</span>
          </button>

          <button
            onClick={resetToDefaults}
            type="button"
            title="Reset vault to default sample items"
            className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Category Folders Carousel / Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Categories & Project Folders ({categories.length})
          </span>
          {activeCategory && selectedCatId !== "all" && (
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => {
                  if (confirm(`Delete category "${activeCategory.name}" and its records?`)) {
                    deleteCategory(activeCategory.id);
                    setSelectedCatId("all");
                  }
                }}
                className="text-rose-500 hover:text-rose-600 font-medium inline-flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete Folder</span>
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCatId("all")}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border flex items-center gap-2 ${
              selectedCatId === "all"
                ? "bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-900 dark:border-white shadow-sm"
                : "bg-white/80 dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Records</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10 dark:bg-white/20">
              {records.length}
            </span>
          </button>

          {categories.map((cat) => {
            const count = records.filter((r) => r.categoryId === cat.id).length;
            const isSelected = selectedCatId === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCatId(cat.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border flex items-center gap-2 ${
                  isSelected
                    ? "bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-900 dark:border-white shadow-sm"
                    : "bg-white/80 dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300"
                }`}
              >
                <Folder className="w-3.5 h-3.5 text-blue-500" />
                <span>{cat.name}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10 dark:bg-white/20 font-mono">
                  {count}
                </span>
              </button>
            );
          })}

          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap border border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:border-zinc-400 transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Folder</span>
          </button>
        </div>
      </div>

      {/* Active Folder Header Banner (if a category is selected) */}
      {activeCategory && selectedCatId !== "all" && (
        <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Folder className="w-4 h-4 text-blue-500" />
              <span>{activeCategory.name}</span>
            </h2>
            {activeCategory.description && (
              <p className="text-xs text-zinc-500 mt-0.5">{activeCategory.description}</p>
            )}
          </div>
          <button
            onClick={() => openNewRecordModal(activeCategory.id)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white self-start sm:self-auto transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Record Here</span>
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search records, fields, NID, Khatian, Dag, or text details..."
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/60 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-600"
          >
            Clear
          </button>
        )}
      </div>

      {/* Records Grid */}
      {filteredRecords.length === 0 ? (
        <div className="text-center py-12 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/20 space-y-3">
          <Folder className="w-10 h-10 text-zinc-300 dark:text-zinc-600 mx-auto" />
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            No records found in this category
          </h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Click the button below to add your first record, text details, or document file.
          </p>
          <button
            onClick={() => openNewRecordModal()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add New Record</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredRecords.map((rec) => {
            const cat = categories.find((c) => c.id === rec.categoryId);

            return (
              <div
                key={rec.id}
                className="rounded-lg border border-zinc-200/90 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/60 p-4 sm:p-5 shadow-sm space-y-4 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col justify-between"
              >
                {/* Card Top: Category Badge & Actions */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                      <Folder className="w-3 h-3 text-blue-500" />
                      {cat?.name || "Uncategorized"}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopyAllRecord(rec)}
                        title="Copy entire record details to clipboard"
                        className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        {copiedId === `all-${rec.id}` ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-[11px] text-emerald-500 font-semibold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span className="text-[11px]">Copy All</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => openEditRecordModal(rec)}
                        title="Edit record"
                        className="p-1 rounded text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Delete record "${rec.title}"?`)) {
                            deleteRecord(rec.id);
                          }
                        }}
                        title="Delete record"
                        className="p-1 rounded text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                    {rec.title}
                  </h3>
                </div>

                {/* Card Fields List (Key-Value) */}
                {rec.fields && rec.fields.length > 0 && (
                  <div className="rounded-lg bg-zinc-50/80 dark:bg-zinc-950/40 border border-zinc-200/70 dark:border-zinc-800/80 divide-y divide-zinc-200/60 dark:divide-zinc-800/60 overflow-hidden text-xs">
                    {rec.fields.map((field, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 flex items-center justify-between gap-3 group hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50 transition-colors"
                      >
                        <span className="font-semibold text-zinc-500 dark:text-zinc-400 shrink-0">
                          {field.label}:
                        </span>

                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-medium text-zinc-800 dark:text-zinc-200 text-right truncate">
                            {field.value}
                          </span>
                          <button
                            onClick={() => handleCopyText(field.value, `f-${rec.id}-${idx}`)}
                            title="Copy field value"
                            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-all shrink-0"
                          >
                            {copiedId === `f-${rec.id}-${idx}` ? (
                              <Check className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Note/Description */}
                {rec.note && (
                  <div className="p-3 rounded-lg bg-zinc-100/70 dark:bg-zinc-800/40 text-xs text-zinc-600 dark:text-zinc-400 border border-zinc-200/60 dark:border-zinc-800/60">
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-0.5">
                      Note / বিবরণী:
                    </span>
                    <p className="whitespace-pre-line leading-relaxed">{rec.note}</p>
                  </div>
                )}

                {/* Attached File (if any) */}
                {rec.fileUrl && (
                  <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                        {rec.fileType === "pdf" ? (
                          <FileText className="w-4 h-4" />
                        ) : (
                          <ImageIcon className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate block">
                          {rec.fileName || "Attached Document"}
                        </span>
                        {rec.fileSize && (
                          <span className="text-[10px] text-zinc-400 block font-mono">
                            {rec.fileSize}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() =>
                          setActivePreviewFile({
                            title: rec.title,
                            url: rec.fileUrl!,
                            type: rec.fileType || "image"
                          })
                        }
                        className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs font-semibold flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </button>

                      <a
                        href={rec.fileUrl}
                        download={rec.fileName || "document"}
                        className="p-1.5 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:opacity-90 text-xs font-semibold flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                )}

                {/* Card Bottom Meta */}
                <div className="pt-2 border-t border-zinc-200/70 dark:border-zinc-800/70 flex items-center justify-between text-[11px] text-zinc-400">
                  <span>Saved on {rec.createdAt}</span>
                  <span className="font-mono">{rec.fields.length} Fields</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE CATEGORY MODAL */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-blue-500" />
                <span>Create New Category / Project Folder</span>
              </h3>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Category Name (ক্যাটাগরি বা প্রজেক্টের নাম) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. বাবা-মার তথ্যাবলী, জমির দলিল, ক্লায়েন্ট প্রজেক্ট..."
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Description / নোট (ঐচ্ছিক)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. জরুরি কাগজপত্র ও এনআইডি রেকর্ড সংরক্ষণের ফোল্ডার।"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 transition-colors shadow-sm"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE / EDIT RECORD MODAL */}
      {isRecordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="w-full max-w-2xl rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                <span>
                  {editingRecord ? "Edit Record" : "Add New Record / Details / File"}
                </span>
              </h3>
              <button
                onClick={() => setIsRecordModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRecord} className="space-y-4">
              {/* Category & Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Select Category (ক্যাটাগরি) *
                  </label>
                  <select
                    value={recCategoryId}
                    onChange={(e) => setRecCategoryId(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Record Title (শিরোনাম) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. পিতা: মোঃ আশরাফুল হক, খতিয়ান নং ৪৭২..."
                    value={recTitle}
                    onChange={(e) => setRecTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                  />
                </div>
              </div>

              {/* Dynamic Key-Value Fields */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                    Custom Fields (তথ্যাবলী / ফিল্ডস)
                  </span>
                  <button
                    type="button"
                    onClick={handleAddField}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Another Field</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {recFields.map((field, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Label (e.g. এনআইডি / খতিয়ান)"
                        value={field.label}
                        onChange={(e) => handleFieldChange(idx, "label", e.target.value)}
                        className="w-1/3 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                      />
                      <input
                        type="text"
                        placeholder="Value (e.g. 9581214047 / ৪৭২ দাগ)"
                        value={field.value}
                        onChange={(e) => handleFieldChange(idx, "value", e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                      />
                      {recFields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveField(idx)}
                          className="p-1.5 text-zinc-400 hover:text-rose-500 rounded"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Note / Long Description */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Notes / বিবরণী (ঐচ্ছিক)
                </label>
                <textarea
                  rows={3}
                  placeholder="যেকোনো বিস্তারিত নোট, দলিলের ইতিহাস, ব্যাংকের নির্দেশাবলী..."
                  value={recNote}
                  onChange={(e) => setRecNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400 resize-none"
                />
              </div>

              {/* File Attachment Upload */}
              <div className="space-y-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                <span className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Attach Document / Photo / PDF (ফাইল সংযুক্ত করুন)
                </span>

                {recFile ? (
                  <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 flex items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <Paperclip className="w-4 h-4 text-blue-500 shrink-0" />
                      <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200 truncate">
                        {recFile.name} ({recFile.size})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setRecFile(null)}
                      className="text-xs text-rose-500 hover:underline shrink-0 ml-2"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full p-3 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 flex items-center justify-center gap-2 transition-colors"
                    >
                      <Paperclip className="w-4 h-4 text-zinc-400" />
                      <span>Click to upload image or PDF document</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsRecordModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 transition-colors shadow-sm"
                >
                  {editingRecord ? "Save Changes" : "Save Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FILE PREVIEW MODAL */}
      {activePreviewFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-3xl rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                {activePreviewFile.title}
              </h3>
              <div className="flex items-center gap-2">
                <a
                  href={activePreviewFile.url}
                  download="document"
                  className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
                <button
                  onClick={() => setActivePreviewFile(null)}
                  className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4 flex-1 overflow-auto flex items-center justify-center bg-zinc-100 dark:bg-zinc-950 min-h-[300px]">
              {activePreviewFile.type === "pdf" ? (
                <iframe
                  src={activePreviewFile.url}
                  title="PDF Preview"
                  className="w-full h-[500px] rounded-lg border border-zinc-200 dark:border-zinc-800"
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={activePreviewFile.url}
                  alt={activePreviewFile.title}
                  className="max-h-[500px] w-auto object-contain rounded-lg shadow-md"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

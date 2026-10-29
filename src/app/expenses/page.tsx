"use client";

import React, { useState, useMemo, useRef } from "react";
import Link from "next/link";
import {
  Wallet,
  Plus,
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  Filter,
  Search,
  PieChart as PieChartIcon,
  DollarSign,
  Coffee,
  Utensils,
  ShoppingBag,
  Bus,
  Wifi,
  Home,
  HeartPulse,
  Tag,
  Smile,
  MoreHorizontal,
  Trash2,
  Edit3,
  Download,
  Printer,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Sliders,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Receipt,
  Upload,
  Eye,
  X,
  CreditCard,
  ListTodo,
  CheckSquare,
  Square,
  ClipboardList,
  Target
} from "lucide-react";
import { useExpense } from "@/context/ExpenseContext";
import {
  ExpenseItem,
  IncomeItem,
  MonthlyPlanItem,
  ExpenseCategory,
  PaymentMethod,
  IncomeSource,
  EXPENSE_CATEGORIES,
  INCOME_SOURCES,
  PAYMENT_METHODS,
  COMMON_EXPENSE_PRESETS
} from "@/types/expense";

export default function ExpensesPage() {
  const {
    expenses,
    incomes,
    monthlyPlans,
    budgetConfig,
    addExpense,
    updateExpense,
    deleteExpense,
    addIncome,
    updateIncome,
    deleteIncome,
    addMonthlyPlan,
    updateMonthlyPlan,
    deleteMonthlyPlan,
    toggleMonthlyPlanComplete,
    updateBudgetConfig,
    resetToDefaults,
    isReady
  } = useExpense();

  // Selected Month for analysis & planning (defaults to current YYYY-MM)
  const currentYearMonth = new Date().toISOString().slice(0, 7);
  const [selectedMonth, setSelectedMonth] = useState<string>(currentYearMonth);

  // Active Main Tab ("tracker" = খরচ ও লেনদেন, "planner" = মাসের খরচের পরিকল্পনা ও তালিকা)
  const [activeMainTab, setActiveMainTab] = useState<"tracker" | "planner">("tracker");

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("all");
  const [viewFilter, setViewFilter] = useState<"all" | "expenses" | "incomes">("all");
  const [dateRangeFilter, setDateRangeFilter] = useState<"all" | "today" | "this_month">("this_month");

  // Modals
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseItem | null>(null);
  const [editingIncome, setEditingIncome] = useState<IncomeItem | null>(null);
  const [editingPlan, setEditingPlan] = useState<MonthlyPlanItem | null>(null);
  const [previewReceiptUrl, setPreviewReceiptUrl] = useState<string | null>(null);

  // Success Banner
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // ---------------- Expense Form State ----------------
  const [expTitle, setExpTitle] = useState("");
  const [expAmount, setExpAmount] = useState<string>("");
  const [expCategory, setExpCategory] = useState<ExpenseCategory>("tea_expense");
  const [expDate, setExpDate] = useState(new Date().toISOString().slice(0, 10));
  const [expPaymentMethod, setExpPaymentMethod] = useState<PaymentMethod>("Cash");
  const [expNote, setExpNote] = useState("");
  const [expReceiptUrl, setExpReceiptUrl] = useState("");
  const [isUploadingReceipt, setIsUploadingReceipt] = useState(false);
  const receiptInputRef = useRef<HTMLInputElement>(null);

  // ---------------- Income Form State ----------------
  const [incTitle, setIncTitle] = useState("");
  const [incAmount, setIncAmount] = useState<string>("");
  const [incSource, setIncSource] = useState<IncomeSource>("salary");
  const [incDate, setIncDate] = useState(new Date().toISOString().slice(0, 10));
  const [incPaymentMethod, setIncPaymentMethod] = useState<PaymentMethod>("Bank");
  const [incNote, setIncNote] = useState("");

  // ---------------- Monthly Plan Form State ----------------
  const [planTitle, setPlanTitle] = useState("");
  const [planAmount, setPlanAmount] = useState<string>("");
  const [planCategory, setPlanCategory] = useState<ExpenseCategory>("meals");
  const [planNote, setPlanNote] = useState("");

  // ---------------- Budget Form State ----------------
  const [budgetInitialCapital, setBudgetInitialCapital] = useState(budgetConfig.initialCapital.toString());
  const [budgetMonthly, setBudgetMonthly] = useState(budgetConfig.monthlyBudget.toString());
  const [budgetDaily, setBudgetDaily] = useState(budgetConfig.dailyBudget.toString());

  // ---------------- Upload Receipt via Cloudinary ----------------
  const handleReceiptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingReceipt(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (res.ok && json.success && json.url) {
        setExpReceiptUrl(json.url);
        showSuccess("রসিদের ছবি আপলোড সফল হয়েছে!");
      } else {
        alert("Upload failed: " + (json.error || "Could not upload image"));
      }
    } catch (err: any) {
      console.error(err);
      alert("Upload failed: " + err.message);
    } finally {
      setIsUploadingReceipt(false);
    }
  };

  // ---------------- Open Expense Modal Helper ----------------
  const openNewExpenseModal = (preset?: typeof COMMON_EXPENSE_PRESETS[0]) => {
    setEditingExpense(null);
    setExpTitle(preset ? preset.title : "");
    setExpAmount(preset ? preset.defaultAmount.toString() : "");
    setExpCategory(preset ? preset.category : "tea_expense");
    setExpDate(new Date().toISOString().slice(0, 10));
    setExpPaymentMethod("Cash");
    setExpNote(preset ? preset.title : "");
    setExpReceiptUrl("");
    setIsExpenseModalOpen(true);
  };

  const openEditExpenseModal = (item: ExpenseItem) => {
    setEditingExpense(item);
    setExpTitle(item.title);
    setExpAmount(item.amount.toString());
    setExpCategory(item.category);
    setExpDate(item.date);
    setExpPaymentMethod(item.paymentMethod);
    setExpNote(item.note || "");
    setExpReceiptUrl(item.receiptUrl || "");
    setIsExpenseModalOpen(true);
  };

  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(expAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert("অনুগ্রহ করে সঠিক টাকার পরিমাণ লিখুন!");
      return;
    }
    if (!expTitle.trim()) {
      alert("খরচের বিবরণ বা নাম লিখুন!");
      return;
    }

    if (editingExpense) {
      updateExpense(editingExpense.id, {
        title: expTitle.trim(),
        amount: parsedAmount,
        category: expCategory,
        date: expDate,
        paymentMethod: expPaymentMethod,
        note: expNote.trim(),
        receiptUrl: expReceiptUrl || undefined
      });
      showSuccess("খরচের তথ্য আপডেট করা হয়েছে!");
    } else {
      addExpense({
        title: expTitle.trim(),
        amount: parsedAmount,
        category: expCategory,
        date: expDate,
        paymentMethod: expPaymentMethod,
        note: expNote.trim(),
        receiptUrl: expReceiptUrl || undefined
      });
      showSuccess("নতুন খরচ সফলভাবে যোগ হয়েছে!");
    }
    setIsExpenseModalOpen(false);
  };

  // ---------------- Open Income Modal Helper ----------------
  const openNewIncomeModal = () => {
    setEditingIncome(null);
    setIncTitle("");
    setIncAmount("");
    setIncSource("salary");
    setIncDate(new Date().toISOString().slice(0, 10));
    setIncPaymentMethod("Bank");
    setIncNote("");
    setIsIncomeModalOpen(true);
  };

  const openEditIncomeModal = (item: IncomeItem) => {
    setEditingIncome(item);
    setIncTitle(item.title);
    setIncAmount(item.amount.toString());
    setIncSource(item.source);
    setIncDate(item.date);
    setIncPaymentMethod(item.paymentMethod);
    setIncNote(item.note || "");
    setIsIncomeModalOpen(true);
  };

  const handleSaveIncome = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(incAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert("অনুগ্রহ করে সঠিক টাকার পরিমাণ লিখুন!");
      return;
    }
    if (!incTitle.trim()) {
      alert("আয়ের বিবরণ লিখুন!");
      return;
    }

    if (editingIncome) {
      updateIncome(editingIncome.id, {
        title: incTitle.trim(),
        amount: parsedAmount,
        source: incSource,
        date: incDate,
        paymentMethod: incPaymentMethod,
        note: incNote.trim()
      });
      showSuccess("আয়ের তথ্য আপডেট করা হয়েছে!");
    } else {
      addIncome({
        title: incTitle.trim(),
        amount: parsedAmount,
        source: incSource,
        date: incDate,
        paymentMethod: incPaymentMethod,
        note: incNote.trim()
      });
      showSuccess("নতুন আয় সফলভাবে যুক্ত হয়েছে!");
    }
    setIsIncomeModalOpen(false);
  };

  // ---------------- Open Monthly Plan Modal Helper ----------------
  const openNewPlanModal = () => {
    setEditingPlan(null);
    setPlanTitle("");
    setPlanAmount("");
    setPlanCategory("meals");
    setPlanNote("");
    setIsPlanModalOpen(true);
  };

  const openEditPlanModal = (item: MonthlyPlanItem) => {
    setEditingPlan(item);
    setPlanTitle(item.title);
    setPlanAmount(item.plannedAmount.toString());
    setPlanCategory(item.category || "meals");
    setPlanNote(item.note || "");
    setIsPlanModalOpen(true);
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(planAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert("পরিকল্পিত খরচের সঠিক টাকার পরিমাণ লিখুন!");
      return;
    }
    if (!planTitle.trim()) {
      alert("পরিকল্পনার বিবরণ বা খাতের নাম লিখুন!");
      return;
    }

    if (editingPlan) {
      updateMonthlyPlan(editingPlan.id, {
        title: planTitle.trim(),
        plannedAmount: parsedAmount,
        category: planCategory,
        note: planNote.trim()
      });
      showSuccess("পরিকল্পনার তথ্য আপডেট করা হয়েছে!");
    } else {
      addMonthlyPlan({
        month: selectedMonth,
        title: planTitle.trim(),
        plannedAmount: parsedAmount,
        category: planCategory,
        note: planNote.trim(),
        isCompleted: false
      });
      showSuccess("মাসের খরচের তালিকায় নতুন পরিকল্পনা যোগ হয়েছে!");
    }
    setIsPlanModalOpen(false);
  };

  // ---------------- Load Standard Monthly Plan Template ----------------
  const loadDefaultPlanTemplate = () => {
    const templates = [
      { title: "মেস / বাড়ি ভাড়া ও বিল", plannedAmount: 3500, category: "bills_rent" as ExpenseCategory, note: "৫ তারিখের মধ্যে" },
      { title: "দুপুর ও রাতের খাবার / মিল", plannedAmount: 4500, category: "meals" as ExpenseCategory, note: "মাসিক মিল" },
      { title: "চা খরচ ও সকালের নাস্তা", plannedAmount: 900, category: "tea_expense" as ExpenseCategory, note: "প্রতিদিন গড়ে ৩০ টাকা" },
      { title: "যাতায়াত ও রিকশা-বাস ভাড়া", plannedAmount: 1200, category: "transport" as ExpenseCategory, note: "প্রতিদিনের ভাড়া" },
      { title: "মোবাইল রিচার্জ ও ইন্টারনেট", plannedAmount: 800, category: "recharge_net" as ExpenseCategory, note: "নেট ও মিনিট প্যাক" },
      { title: "কাঁচাবাজার ও মুদি সদাই", plannedAmount: 1500, category: "grocery" as ExpenseCategory, note: "সাপ্তাহিক বাজার" },
      { title: "অন্যান্য জরুরি ব্যাকআপ", plannedAmount: 1000, category: "other" as ExpenseCategory, note: "জরুরি ফান্ড" }
    ];

    templates.forEach((t) => {
      addMonthlyPlan({
        month: selectedMonth,
        title: t.title,
        plannedAmount: t.plannedAmount,
        category: t.category,
        note: t.note,
        isCompleted: false
      });
    });

    showSuccess(`${selectedMonth} মাসের জন্য স্ট্যান্ডার্ড খরচের পরিকল্পনা তালিকা লোড হয়েছে!`);
  };

  // ---------------- Budget Save ----------------
  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    updateBudgetConfig({
      initialCapital: parseFloat(budgetInitialCapital) || 0,
      monthlyBudget: parseFloat(budgetMonthly) || 0,
      dailyBudget: parseFloat(budgetDaily) || 0
    });
    setIsBudgetModalOpen(false);
    showSuccess("মূল ব্যালেন্স ও বাজেট লিমিট আপডেট করা হয়েছে!");
  };

  // ---------------- Computations & Auto Calculations ----------------
  const todayStr = new Date().toISOString().slice(0, 10);

  // All time totals
  const totalAllExpenses = useMemo(() => {
    return expenses.reduce((acc, curr) => acc + curr.amount, 0);
  }, [expenses]);

  const totalAllIncomes = useMemo(() => {
    return incomes.reduce((acc, curr) => acc + curr.amount, 0);
  }, [incomes]);

  // Current Remaining Main Balance (মূল টাকা + মোট আয় - মোট খরচ)
  const currentNetRemainingBalance = useMemo(() => {
    return budgetConfig.initialCapital + totalAllIncomes - totalAllExpenses;
  }, [budgetConfig.initialCapital, totalAllIncomes, totalAllExpenses]);

  // Today's Expense
  const todayExpenses = useMemo(() => {
    return expenses.filter((item) => item.date === todayStr);
  }, [expenses, todayStr]);

  const todayTotalSpent = useMemo(() => {
    return todayExpenses.reduce((acc, curr) => acc + curr.amount, 0);
  }, [todayExpenses]);

  // Month-specific calculations (for selectedMonth)
  const monthExpenses = useMemo(() => {
    return expenses.filter((item) => item.date.startsWith(selectedMonth));
  }, [expenses, selectedMonth]);

  const monthIncomes = useMemo(() => {
    return incomes.filter((item) => item.date.startsWith(selectedMonth));
  }, [incomes, selectedMonth]);

  const monthTotalSpent = useMemo(() => {
    return monthExpenses.reduce((acc, curr) => acc + curr.amount, 0);
  }, [monthExpenses]);

  const monthTotalIncome = useMemo(() => {
    return monthIncomes.reduce((acc, curr) => acc + curr.amount, 0);
  }, [monthIncomes]);

  // Net saved this month (মাস শেষে কত টাকা থাকে)
  const monthNetRemaining = monthTotalIncome - monthTotalSpent;

  // Monthly Plans for the selectedMonth
  const selectedMonthPlans = useMemo(() => {
    return monthlyPlans.filter((p) => p.month === selectedMonth);
  }, [monthlyPlans, selectedMonth]);

  // Total Planned Amount for selectedMonth
  const totalPlannedForMonth = useMemo(() => {
    return selectedMonthPlans.reduce((acc, curr) => acc + curr.plannedAmount, 0);
  }, [selectedMonthPlans]);

  // Category breakdown for selectedMonth
  const categoryBreakdown = useMemo(() => {
    const map: Record<ExpenseCategory, { total: number; count: number }> = {
      tea_expense: { total: 0, count: 0 },
      tea_snacks: { total: 0, count: 0 },
      meals: { total: 0, count: 0 },
      grocery: { total: 0, count: 0 },
      transport: { total: 0, count: 0 },
      recharge_net: { total: 0, count: 0 },
      bills_rent: { total: 0, count: 0 },
      medical: { total: 0, count: 0 },
      shopping: { total: 0, count: 0 },
      entertainment: { total: 0, count: 0 },
      other: { total: 0, count: 0 }
    };

    monthExpenses.forEach((item) => {
      if (map[item.category]) {
        map[item.category].total += item.amount;
        map[item.category].count += 1;
      }
    });

    const list = EXPENSE_CATEGORIES.map((cat) => ({
      ...cat,
      total: map[cat.id]?.total || 0,
      count: map[cat.id]?.count || 0,
      percentage: monthTotalSpent > 0 ? ((map[cat.id]?.total || 0) / monthTotalSpent) * 100 : 0
    })).filter((c) => c.total > 0);

    // Sort descending by total amount
    list.sort((a, b) => b.total - a.total);
    return list;
  }, [monthExpenses, monthTotalSpent]);

  // Top spending category
  const topCategory = categoryBreakdown[0] || null;

  // Month options for dropdown selector
  const availableMonths = useMemo(() => {
    const set = new Set<string>();
    set.add(currentYearMonth);
    // Add next 3 months so user can easily plan upcoming months!
    const [currY, currM] = currentYearMonth.split("-").map(Number);
    for (let i = 1; i <= 3; i++) {
      const d = new Date(currY, currM - 1 + i, 1);
      set.add(d.toISOString().slice(0, 7));
    }
    expenses.forEach((e) => set.add(e.date.slice(0, 7)));
    incomes.forEach((i) => set.add(i.date.slice(0, 7)));
    monthlyPlans.forEach((p) => set.add(p.month));
    return Array.from(set).sort().reverse();
  }, [expenses, incomes, monthlyPlans, currentYearMonth]);

  // Filtered list of transactions
  const combinedTransactions = useMemo(() => {
    let list: Array<{ type: "expense" | "income"; data: ExpenseItem | IncomeItem }> = [];

    if (viewFilter === "all" || viewFilter === "expenses") {
      expenses.forEach((exp) => list.push({ type: "expense", data: exp }));
    }
    if (viewFilter === "all" || viewFilter === "incomes") {
      incomes.forEach((inc) => list.push({ type: "income", data: inc }));
    }

    // Date range filter
    if (dateRangeFilter === "today") {
      list = list.filter((item) => item.data.date === todayStr);
    } else if (dateRangeFilter === "this_month") {
      list = list.filter((item) => item.data.date.startsWith(selectedMonth));
    }

    // Category filter (only applies to expenses)
    if (selectedCategory !== "all") {
      list = list.filter(
        (item) => item.type === "expense" && (item.data as ExpenseItem).category === selectedCategory
      );
    }

    // Payment method filter
    if (selectedPaymentMethod !== "all") {
      list = list.filter((item) => item.data.paymentMethod === selectedPaymentMethod);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (item) =>
          item.data.title.toLowerCase().includes(q) ||
          (item.data.note && item.data.note.toLowerCase().includes(q))
      );
    }

    // Sort descending by date, then by creation
    list.sort((a, b) => {
      const dateCmp = b.data.date.localeCompare(a.data.date);
      if (dateCmp !== 0) return dateCmp;
      return b.data.createdAt.localeCompare(a.data.createdAt);
    });

    return list;
  }, [
    expenses,
    incomes,
    viewFilter,
    dateRangeFilter,
    selectedCategory,
    selectedPaymentMethod,
    searchQuery,
    selectedMonth,
    todayStr
  ]);

  // ---------------- Icon Helper ----------------
  const getCategoryIcon = (category: ExpenseCategory) => {
    switch (category) {
      case "tea_expense":
        return <Coffee className="w-5 h-5 text-amber-500" />;
      case "tea_snacks":
        return <Utensils className="w-5 h-5 text-orange-500" />;
      case "meals":
        return <Utensils className="w-5 h-5 text-emerald-500" />;
      case "grocery":
        return <ShoppingBag className="w-5 h-5 text-lime-500" />;
      case "transport":
        return <Bus className="w-5 h-5 text-blue-500" />;
      case "recharge_net":
        return <Wifi className="w-5 h-5 text-cyan-500" />;
      case "bills_rent":
        return <Home className="w-5 h-5 text-indigo-500" />;
      case "medical":
        return <HeartPulse className="w-5 h-5 text-red-500" />;
      case "shopping":
        return <Tag className="w-5 h-5 text-purple-500" />;
      case "entertainment":
        return <Smile className="w-5 h-5 text-pink-500" />;
      default:
        return <MoreHorizontal className="w-5 h-5 text-zinc-500" />;
    }
  };

  const getCategoryMeta = (catId: ExpenseCategory) => {
    return EXPENSE_CATEGORIES.find((c) => c.id === catId) || EXPENSE_CATEGORIES[EXPENSE_CATEGORIES.length - 1];
  };

  // Helper to compute actual spent for a category in selectedMonth
  const getActualSpentForCategory = (catId?: ExpenseCategory) => {
    if (!catId) return 0;
    return monthExpenses
      .filter((e) => e.category === catId)
      .reduce((sum, curr) => sum + curr.amount, 0);
  };

  // ---------------- CSV Export Helper ----------------
  const exportToCSV = () => {
    const headers = ["Type", "Title", "Amount", "Date", "Category/Source", "PaymentMethod", "Note"];
    const rows = combinedTransactions.map((item) => {
      if (item.type === "expense") {
        const exp = item.data as ExpenseItem;
        return [
          "Expense",
          `"${exp.title.replace(/"/g, '""')}"`,
          exp.amount,
          exp.date,
          getCategoryMeta(exp.category).nameBn,
          exp.paymentMethod,
          `"${(exp.note || "").replace(/"/g, '""')}"`
        ];
      } else {
        const inc = item.data as IncomeItem;
        return [
          "Income",
          `"${inc.title.replace(/"/g, '""')}"`,
          inc.amount,
          inc.date,
          inc.source,
          inc.paymentMethod,
          `"${(inc.note || "").replace(/"/g, '""')}"`
        ];
      }
    });

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `hisab_report_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showSuccess("CSV ফাইল ডাউনলোড সম্পন্ন হয়েছে!");
  };

  return (
    <div className="space-y-7 max-w-7xl mx-auto pb-20 animate-fade-in text-zinc-900 dark:text-zinc-100">
      
      {/* Top Header Card (Bigger fonts and padding) */}
      <div className="p-5 sm:p-7 rounded-2xl bg-white/90 dark:bg-zinc-900/80 border border-zinc-200/90 dark:border-zinc-800 shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-3.5">
            <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-xs">
              <Wallet className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
                  দৈনন্দিন খরচ ও বাজেট হিসাব
                </h1>
                <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-bold bg-blue-500/10 text-blue-600 dark:text-cyan-400 border border-blue-500/25">
                  স্বয়ংক্রিয় অটো হিসাব
                </span>
              </div>
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mt-1 font-medium">
                চা খরচ, খাবার, যাতায়াত সহ প্রতিদিনের যাবতীয় খরচের অটো হিসাব এবং মাস শেষে কত টাকা থাকে তার পূর্ণাঙ্গ ব্যালেন্স।
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons (Larger text, solid touch targets) */}
        <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto">
          <button
            onClick={() => {
              setBudgetInitialCapital(budgetConfig.initialCapital.toString());
              setBudgetMonthly(budgetConfig.monthlyBudget.toString());
              setBudgetDaily(budgetConfig.dailyBudget.toString());
              setIsBudgetModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 sm:py-3 rounded-xl text-sm font-bold border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 transition-all shadow-xs"
            title="মূল ফান্ড ও বাজেট সেটিংস"
          >
            <Sliders className="w-4 h-4 text-zinc-500" />
            <span>মূল টাকা ও বাজেট</span>
          </button>

          <button
            onClick={openNewIncomeModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 sm:py-3 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ আয় যোগ করুন</span>
          </button>

          <button
            onClick={() => openNewExpenseModal()}
            className="inline-flex items-center gap-2 px-5 py-2.5 sm:py-3 rounded-xl text-sm font-extrabold bg-rose-600 hover:bg-rose-700 text-white shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ খরচ লিখুন</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="px-5 py-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/35 text-emerald-900 dark:text-emerald-200 text-sm sm:text-base font-semibold flex items-center justify-between shadow-xs animate-fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Quick 1-Click Common Presets Bar ("চা খরচ, ভাত, নাস্তা, etc.") */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-zinc-50 dark:via-zinc-900/80 to-blue-500/10 border border-zinc-200 dark:border-zinc-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
          <span className="text-sm sm:text-base font-extrabold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            দ্রুত খরচ এন্ট্রি (১-ক্লিক শর্টকাট):
          </span>
          <span className="text-xs sm:text-sm text-zinc-500 font-medium">
            যেকোনো আইটেমে ক্লিক করলেই সরাসরি প্রি-ফিল্ড ফর্ম চলে আসবে
          </span>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
          {COMMON_EXPENSE_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => openNewExpenseModal(preset)}
              type="button"
              className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white dark:bg-zinc-800/90 border border-zinc-300 dark:border-zinc-700/80 hover:border-zinc-500 text-zinc-800 dark:text-zinc-100 shadow-xs hover:shadow-sm active:scale-95 transition-all"
            >
              {getCategoryIcon(preset.category)}
              <span>{preset.title}</span>
              <span className="text-xs font-black text-rose-600 dark:text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded">
                ৳{preset.defaultAmount}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Top 4 Auto-Calculation Cards (Larger, bold typography) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Card 1: Main Balance Remaining (হাতে কত টাকা থাকে) */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-emerald-500/15 via-white dark:via-zinc-900 to-emerald-500/5 border-2 border-emerald-500/40 dark:border-emerald-500/30 shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-400 mb-2.5">
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wide">
              হাতে মোট অবশিষ্ট টাকা
            </span>
            <div className="p-2 rounded-lg bg-emerald-500/15">
              <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
            ৳{currentNetRemainingBalance.toLocaleString("bn-BD")}
          </div>
          <div className="mt-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 flex items-center justify-between font-semibold border-t border-emerald-500/20 pt-2.5">
            <span>শুরু ফান্ড: ৳{budgetConfig.initialCapital.toLocaleString("bn-BD")}</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
              সব আয়-খরচ সহ
            </span>
          </div>
        </div>

        {/* Card 2: Today's Expense */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400 mb-2.5">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wide">
              আজকের মোট খরচ (Today)
            </span>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-rose-600 dark:text-rose-400 tracking-tight">
            ৳{todayTotalSpent.toLocaleString("bn-BD")}
          </div>
          <div className="mt-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 flex items-center justify-between font-medium border-t border-zinc-100 dark:border-zinc-800 pt-2.5">
            <span>দৈনিক বাজেট: ৳{budgetConfig.dailyBudget.toLocaleString("bn-BD")}</span>
            <span className={todayTotalSpent > budgetConfig.dailyBudget ? "text-rose-500 font-bold" : "text-emerald-600 font-bold"}>
              {todayTotalSpent > budgetConfig.dailyBudget
                ? `৳${(todayTotalSpent - budgetConfig.dailyBudget).toLocaleString("bn-BD")} বেশি`
                : `৳${(budgetConfig.dailyBudget - todayTotalSpent).toLocaleString("bn-BD")} বাকি`}
            </span>
          </div>
        </div>

        {/* Card 3: This Month's Total Expense */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400 mb-2.5">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wide">
              চলতি মাসের খরচ ({selectedMonth})
            </span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
              <ArrowDownRight className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
            ৳{monthTotalSpent.toLocaleString("bn-BD")}
          </div>
          <div className="mt-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 flex items-center justify-between font-medium border-t border-zinc-100 dark:border-zinc-800 pt-2.5">
            <span>বাজেট: ৳{budgetConfig.monthlyBudget.toLocaleString("bn-BD")}</span>
            <span className="text-zinc-700 dark:text-zinc-300 font-bold">
              {budgetConfig.monthlyBudget > 0
                ? `${Math.round((monthTotalSpent / budgetConfig.monthlyBudget) * 100)}% খরচ`
                : ""}
            </span>
          </div>
        </div>

        {/* Card 4: This Month's Net Balance (মাস শেষে কত থাকে) */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400 mb-2.5">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wide">
              চলতি মাসে বাঁচে / উদ্বৃত্ত
            </span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div
            className={`text-3xl sm:text-4xl font-black tracking-tight ${
              monthNetRemaining >= 0
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-rose-600 dark:text-rose-400"
            }`}
          >
            ৳{monthNetRemaining.toLocaleString("bn-BD")}
          </div>
          <div className="mt-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 flex items-center justify-between font-medium border-t border-zinc-100 dark:border-zinc-800 pt-2.5">
            <span>আয়: ৳{monthTotalIncome.toLocaleString("bn-BD")}</span>
            <span>খরচ: ৳{monthTotalSpent.toLocaleString("bn-BD")}</span>
          </div>
        </div>

      </div>

      {/* Main Tabs Navigation: (১) লেনদেনের খতিয়ান ও বিশ্লেষণ (২) মাসের খরচের পরিকল্পনা ও বাজেট তালিকা */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-800">
        <div className="inline-flex rounded-xl p-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700/80 shadow-xs">
          <button
            onClick={() => setActiveMainTab("tracker")}
            className={`px-5 py-2.5 rounded-lg text-sm font-black transition-all flex items-center gap-2 ${
              activeMainTab === "tracker"
                ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            <PieChartIcon className="w-4 h-4" />
            <span>দৈনন্দিন খরচ ও বিশ্লেষণ</span>
          </button>

          <button
            onClick={() => setActiveMainTab("planner")}
            className={`px-5 py-2.5 rounded-lg text-sm font-black transition-all flex items-center gap-2 ${
              activeMainTab === "planner"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-blue-600"
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>মাসের খরচের পরিকল্পনা তালিকা ({selectedMonthPlans.length})</span>
          </button>
        </div>

        {/* Global Month Selector */}
        <div className="flex items-center gap-2 px-3 py-1">
          <Calendar className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">নির্বাচিত মাস:</span>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3.5 py-1.5 rounded-xl text-sm font-bold bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {availableMonths.map((m) => (
              <option key={m} value={m}>
                {m === currentYearMonth ? `চলতি মাস (${m})` : m}
              </option>
            ))}
          </select>
          {/* Custom Month Picker Input */}
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => e.target.value && setSelectedMonth(e.target.value)}
            className="px-2 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 cursor-pointer"
            title="ক্যালেন্ডার থেকে যেকোনো মাস নির্বাচন করুন"
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: PLANNER - মাসের খরচের বাজেট ও পরিকল্পনা তালিকা (Requested Feature) */}
      {/* ========================================================================= */}
      {activeMainTab === "planner" && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Planner Overview Header Box */}
          <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-blue-500/10 via-white dark:via-zinc-900 to-indigo-500/5 border-2 border-blue-500/30 dark:border-blue-500/20 shadow-md">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-5 border-b border-blue-500/20">
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-blue-500/15 text-blue-600 dark:text-cyan-400">
                    <Target className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100">
                      {selectedMonth} মাসের খরচের পরিকল্পনা ও বাজেট তালিকা
                    </h2>
                    <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-0.5 font-medium">
                      এই মাসে কোন খাতে কত টাকা খরচ করার লক্ষ্য ঠিক করেছেন তা নিচে লিখুন। আসল খরচের সাথে মিলিয়ে দেখুন।
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {selectedMonthPlans.length === 0 && (
                  <button
                    onClick={loadDefaultPlanTemplate}
                    type="button"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 transition-colors"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>স্ট্যান্ডার্ড তালিকা লোড করুন</span>
                  </button>
                )}

                <button
                  onClick={openNewPlanModal}
                  type="button"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black bg-blue-600 hover:bg-blue-700 text-white shadow-md active:scale-95 transition-all"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>+ নতুন পরিকল্পনা যোগ করুন</span>
                </button>
              </div>
            </div>

            {/* Planner 3 Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
              <div className="p-4 rounded-xl bg-white/80 dark:bg-zinc-800/70 border border-zinc-200 dark:border-zinc-700">
                <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide block mb-1">
                  মোট পরিকল্পিত বাজেট
                </span>
                <span className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-cyan-400">
                  ৳{totalPlannedForMonth.toLocaleString("bn-BD")}
                </span>
                <span className="text-xs text-zinc-500 block mt-1">
                  মোট {selectedMonthPlans.length}টি খাতের টার্গেট
                </span>
              </div>

              <div className="p-4 rounded-xl bg-white/80 dark:bg-zinc-800/70 border border-zinc-200 dark:border-zinc-700">
                <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide block mb-1">
                  প্রকৃত আসল খরচ
                </span>
                <span className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400">
                  ৳{monthTotalSpent.toLocaleString("bn-BD")}
                </span>
                <span className="text-xs text-zinc-500 block mt-1">
                  {totalPlannedForMonth > 0
                    ? `পরিকল্পনার ${Math.round((monthTotalSpent / totalPlannedForMonth) * 100)}% খরচ হয়েছে`
                    : "কোনো পরিকল্পনা নেই"}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-white/80 dark:bg-zinc-800/70 border border-zinc-200 dark:border-zinc-700">
                <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide block mb-1">
                  পরিকল্পনা অনুযায়ী বাকি আছে
                </span>
                <span
                  className={`text-2xl sm:text-3xl font-black ${
                    totalPlannedForMonth - monthTotalSpent >= 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  ৳{(totalPlannedForMonth - monthTotalSpent).toLocaleString("bn-BD")}
                </span>
                <span className="text-xs text-zinc-500 block mt-1">
                  {totalPlannedForMonth - monthTotalSpent >= 0 ? "বাজেটের ভেতরে" : "বাজেট ছাড়িয়েছে!"}
                </span>
              </div>
            </div>
          </div>

          {/* Planned Items Table / Checklist */}
          <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="font-bold text-base sm:text-lg text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-emerald-500" />
                {selectedMonth} মাসের খতিয়ান ও চেকলিস্ট
              </h3>
              <span className="text-xs text-zinc-500 font-medium">
                টিক চিহ্ন দিয়ে পরিশোধিত বা সম্পন্ন মার্ক করুন
              </span>
            </div>

            {selectedMonthPlans.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <ClipboardList className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto" />
                <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base font-medium">
                  {selectedMonth} মাসের জন্য এখনো কোনো খরচের পরিকল্পনা তৈরি করা হয়নি।
                </p>
                <button
                  onClick={loadDefaultPlanTemplate}
                  type="button"
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 text-white shadow-sm hover:bg-blue-700 transition-all"
                >
                  স্ট্যান্ডার্ড খরচের তালিকা তৈরি করুন
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
                <table className="w-full text-left text-sm sm:text-base">
                  <thead className="bg-zinc-100/80 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 border-b border-zinc-200 dark:border-zinc-800 text-xs sm:text-sm font-bold">
                    <tr>
                      <th className="py-3 px-4 w-12 text-center">স্ট্যাটাস</th>
                      <th className="py-3 px-4">খাত / বিবরণ</th>
                      <th className="py-3 px-4">ক্যাটাগরি</th>
                      <th className="py-3 px-4 text-right">পরিকল্পিত বাজেট (৳)</th>
                      <th className="py-3 px-4 text-right">আসল খরচ (৳)</th>
                      <th className="py-3 px-4 text-right">বাকি / ওভার (৳)</th>
                      <th className="py-3 px-4 text-center no-print">একশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200/80 dark:divide-zinc-800/80 font-medium">
                    {selectedMonthPlans.map((plan) => {
                      const actualSpent = getActualSpentForCategory(plan.category);
                      const diff = plan.plannedAmount - actualSpent;
                      const catMeta = plan.category ? getCategoryMeta(plan.category) : null;

                      return (
                        <tr
                          key={plan.id}
                          className={`hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors ${
                            plan.isCompleted ? "bg-emerald-500/5 dark:bg-emerald-950/20" : ""
                          }`}
                        >
                          <td className="py-3.5 px-4 text-center">
                            <button
                              onClick={() => toggleMonthlyPlanComplete(plan.id)}
                              type="button"
                              className="text-zinc-400 hover:text-emerald-600 transition-colors"
                              title={plan.isCompleted ? "সম্পন্ন হয়েছে" : "সম্পন্ন করতে ক্লিক করুন"}
                            >
                              {plan.isCompleted ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                              ) : (
                                <Square className="w-5 h-5" />
                              )}
                            </button>
                          </td>

                          <td className="py-3.5 px-4">
                            <div
                              className={`font-bold text-sm sm:text-base ${
                                plan.isCompleted
                                  ? "line-through text-zinc-400 dark:text-zinc-500"
                                  : "text-zinc-900 dark:text-zinc-100"
                              }`}
                            >
                              {plan.title}
                            </div>
                            {plan.note && <div className="text-xs text-zinc-500 mt-0.5">{plan.note}</div>}
                          </td>

                          <td className="py-3.5 px-4">
                            {catMeta ? (
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${catMeta.badgeClass}`}
                              >
                                {getCategoryIcon(catMeta.id)}
                                {catMeta.nameBn}
                              </span>
                            ) : (
                              <span className="text-zinc-400 text-xs">-</span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-right font-black text-blue-600 dark:text-cyan-400 text-base sm:text-lg whitespace-nowrap">
                            ৳{plan.plannedAmount.toLocaleString("bn-BD")}
                          </td>

                          <td className="py-3.5 px-4 text-right font-bold text-rose-600 dark:text-rose-400 text-sm sm:text-base whitespace-nowrap">
                            ৳{actualSpent.toLocaleString("bn-BD")}
                          </td>

                          <td className="py-3.5 px-4 text-right font-bold text-xs sm:text-sm whitespace-nowrap">
                            {diff >= 0 ? (
                              <span className="text-emerald-600 dark:text-emerald-400">
                                ৳{diff.toLocaleString("bn-BD")} বাকি
                              </span>
                            ) : (
                              <span className="text-rose-600 dark:text-rose-400 font-extrabold">
                                ৳{Math.abs(diff).toLocaleString("bn-BD")} অতিরিক্ত!
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-center no-print whitespace-nowrap">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                onClick={() => openEditPlanModal(plan)}
                                className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                title="এডিট"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`"${plan.title}" পরিকল্পনাটি কি মুছে ফেলতে চান?`)) {
                                    deleteMonthlyPlan(plan.id);
                                    showSuccess("পরিকল্পনা মুছে ফেলা হয়েছে!");
                                  }
                                }}
                                className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                                title="ডিলিট"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: TRACKER - দৈনন্দিন খরচ ও খতিয়ান (Default Active Tab) */}
      {/* ========================================================================= */}
      {activeMainTab === "tracker" && (
        <div className="space-y-7 animate-fade-in">
          
          {/* Month Breakdown & Analysis Section ("মাসে কোথায় কত খরচ হয়েছে") */}
          <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <div className="flex items-center gap-2.5">
                <PieChartIcon className="w-6 h-6 text-blue-500" />
                <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  মাসে কোথায় কত খরচ হয়েছে ({selectedMonth} Category Breakdown)
                </h2>
              </div>

              <div className="text-xs sm:text-sm text-zinc-500 font-medium">
                স্বয়ংক্রিয়ভাবে খতিয়ান অনুযায়ী ক্যাটাগরি তৈরি হয়েছে
              </div>
            </div>

            {/* Breakdown Stats & Progress Bars */}
            {categoryBreakdown.length === 0 ? (
              <div className="text-center py-12 text-zinc-400 dark:text-zinc-500 text-sm sm:text-base font-medium">
                এই মাসে এখনো কোনো খরচ লিপিবদ্ধ করা হয়নি। উপরের &quot;+ খরচ লিখুন&quot; বাটনে ক্লিক করে খরচ যোগ করুন!
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
                {/* Left: Progress Bars for each category */}
                <div className="space-y-4">
                  {categoryBreakdown.map((item) => (
                    <div key={item.id} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm sm:text-base">
                        <span className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                          {getCategoryIcon(item.id)}
                          {item.nameBn} ({item.count}টি খরচ)
                        </span>
                        <span className="font-extrabold text-zinc-900 dark:text-zinc-100">
                          ৳{item.total.toLocaleString("bn-BD")}
                          <span className="text-zinc-500 font-semibold ml-1.5 text-xs sm:text-sm">
                            ({Math.round(item.percentage)}%)
                          </span>
                        </span>
                      </div>
                      <div className="h-3 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            item.id === "meals"
                              ? "bg-emerald-500"
                              : item.id === "tea_expense"
                              ? "bg-amber-500"
                              : item.id === "tea_snacks"
                              ? "bg-orange-500"
                              : item.id === "grocery"
                              ? "bg-lime-500"
                              : item.id === "transport"
                              ? "bg-blue-500"
                              : item.id === "bills_rent"
                              ? "bg-indigo-500"
                              : "bg-purple-500"
                          }`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right: Key Insights Card */}
                <div className="p-5 sm:p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-xs sm:text-sm font-extrabold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block mb-3">
                      মাসের খরচের অটো বিশ্লেষণ ({selectedMonth})
                    </span>

                    {topCategory && (
                      <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-950 dark:text-amber-200 text-sm mb-4">
                        <span className="font-bold">সর্বাধিক খরচের খাত: </span>
                        <span className="font-extrabold text-base">{topCategory.nameBn}</span> - মোট ৳{topCategory.total.toLocaleString("bn-BD")} (পুরো খরচের {Math.round(topCategory.percentage)}%)
                      </div>
                    )}

                    <div className="space-y-3 text-sm sm:text-base text-zinc-700 dark:text-zinc-300">
                      <div className="flex justify-between py-1.5 border-b border-zinc-200/80 dark:border-zinc-700/80">
                        <span className="font-medium">এই মাসের মোট আয়:</span>
                        <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                          ৳{monthTotalIncome.toLocaleString("bn-BD")}
                        </span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-zinc-200/80 dark:border-zinc-700/80">
                        <span className="font-medium">এই মাসের মোট খরচ:</span>
                        <span className="font-extrabold text-rose-600 dark:text-rose-400">
                          ৳{monthTotalSpent.toLocaleString("bn-BD")}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-zinc-200/80 dark:border-zinc-700/80 font-bold text-base sm:text-lg">
                        <span>মাস শেষে হাতে থাকে:</span>
                        <span className={monthNetRemaining >= 0 ? "text-emerald-600 font-black" : "text-rose-600 font-black"}>
                          ৳{monthNetRemaining.toLocaleString("bn-BD")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 text-xs text-zinc-500 font-medium">
                    টিপস: অযথা খরচ কমাতে দৈনিক চা ও বাইরের খাবারের বাজেট নির্দিষ্ট সীমায় রাখুন।
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Transaction History & Records Section (Larger text & inputs) */}
          <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-5">
            
            {/* Controls Bar: Search, Filters, Export */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2.5">
                
                {/* View Filter Tabs */}
                <div className="inline-flex rounded-xl p-1 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                  <button
                    onClick={() => setViewFilter("all")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                      viewFilter === "all"
                        ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs"
                        : "text-zinc-600 dark:text-zinc-400"
                    }`}
                  >
                    সকল ({combinedTransactions.length})
                  </button>
                  <button
                    onClick={() => setViewFilter("expenses")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                      viewFilter === "expenses"
                        ? "bg-white dark:bg-zinc-700 text-rose-600 dark:text-rose-400 shadow-xs"
                        : "text-zinc-600 dark:text-zinc-400"
                    }`}
                  >
                    খরচসমূহ
                  </button>
                  <button
                    onClick={() => setViewFilter("incomes")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                      viewFilter === "incomes"
                        ? "bg-white dark:bg-zinc-700 text-emerald-600 dark:text-emerald-400 shadow-xs"
                        : "text-zinc-600 dark:text-zinc-400"
                    }`}
                  >
                    আয়সমূহ
                  </button>
                </div>

                {/* Date Range Tabs */}
                <select
                  value={dateRangeFilter}
                  onChange={(e) => setDateRangeFilter(e.target.value as any)}
                  className="px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200"
                >
                  <option value="this_month">নির্বাচিত মাস ({selectedMonth})</option>
                  <option value="today">শুধুমাত্র আজকের ({todayStr})</option>
                  <option value="all">সম্পূর্ণ ইতিহাস (All Time)</option>
                </select>

                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200"
                >
                  <option value="all">সকল ক্যাটাগরি</option>
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nameBn}
                    </option>
                  ))}
                </select>

                {/* Payment Method Filter */}
                <select
                  value={selectedPaymentMethod}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  className="px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200"
                >
                  <option value="all">সকল পেমেন্ট মেথড</option>
                  {PAYMENT_METHODS.map((pm) => (
                    <option key={pm} value={pm}>
                      {pm}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Box & Export */}
              <div className="flex items-center gap-2.5">
                <div className="relative flex-1 md:w-56">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="খুঁজুন (যেমন: চা, ভাত)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>

                <button
                  onClick={exportToCSV}
                  type="button"
                  className="p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
                  title="CSV এক্সপোর্ট"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={() => window.print()}
                  type="button"
                  className="p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
                  title="প্রিন্ট বা PDF রিপোর্ট"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Transactions Table / List (Larger text and comfortable padding) */}
            <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
              <table className="w-full text-left text-sm sm:text-base">
                <thead className="bg-zinc-100/80 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 border-b border-zinc-200 dark:border-zinc-800 text-xs sm:text-sm font-bold">
                  <tr>
                    <th className="py-3 px-4">তারিখ</th>
                    <th className="py-3 px-4">বিবরণ / খাত</th>
                    <th className="py-3 px-4">ক্যাটাগরি</th>
                    <th className="py-3 px-4">পেমেন্ট মেথড</th>
                    <th className="py-3 px-4">রসিদ</th>
                    <th className="py-3 px-4 text-right">পরিমাণ (৳)</th>
                    <th className="py-3 px-4 text-center no-print">একশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200/80 dark:divide-zinc-800/80 text-zinc-900 dark:text-zinc-100 font-medium">
                  {combinedTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-zinc-400 dark:text-zinc-500 font-medium text-sm sm:text-base">
                        কোনো লেনদেনের তথ্য পাওয়া যায়নি।
                      </td>
                    </tr>
                  ) : (
                    combinedTransactions.map((item) => {
                      const isExpense = item.type === "expense";
                      const data = item.data;

                      if (isExpense) {
                        const exp = data as ExpenseItem;
                        const catMeta = getCategoryMeta(exp.category);

                        return (
                          <tr key={exp.id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors">
                            <td className="py-3.5 px-4 text-zinc-600 dark:text-zinc-400 font-mono text-xs sm:text-sm whitespace-nowrap">
                              {exp.date} {exp.time && <span className="text-zinc-400">({exp.time})</span>}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-zinc-900 dark:text-zinc-100 text-sm sm:text-base">{exp.title}</div>
                              {exp.note && <div className="text-xs text-zinc-500 mt-0.5">{exp.note}</div>}
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${catMeta.badgeClass}`}
                              >
                                {getCategoryIcon(exp.category)}
                                {catMeta.nameBn}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm font-semibold">
                              {exp.paymentMethod}
                            </td>
                            <td className="py-3.5 px-4">
                              {exp.receiptUrl ? (
                                <button
                                  onClick={() => setPreviewReceiptUrl(exp.receiptUrl!)}
                                  className="text-blue-600 dark:text-cyan-400 hover:underline inline-flex items-center gap-1 text-xs sm:text-sm font-bold"
                                  title="রসিদ দেখুন"
                                >
                                  <Receipt className="w-4 h-4" /> রসিদ
                                </button>
                              ) : (
                                <span className="text-zinc-300 dark:text-zinc-600">-</span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-right font-black text-rose-600 dark:text-rose-400 text-base sm:text-lg whitespace-nowrap">
                              - ৳{exp.amount.toLocaleString("bn-BD")}
                            </td>
                            <td className="py-3.5 px-4 text-center no-print whitespace-nowrap">
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  onClick={() => openEditExpenseModal(exp)}
                                  className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                  title="এডিট"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`"${exp.title}" খরচটি কি মুছে ফেলতে চান?`)) {
                                      deleteExpense(exp.id);
                                      showSuccess("খরচ মুছে ফেলা হয়েছে!");
                                    }
                                  }}
                                  className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                                  title="ডিলিট"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      } else {
                        const inc = data as IncomeItem;

                        return (
                          <tr key={inc.id} className="bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors">
                            <td className="py-3.5 px-4 text-zinc-600 dark:text-zinc-400 font-mono text-xs sm:text-sm whitespace-nowrap">
                              {inc.date}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-zinc-900 dark:text-zinc-100 text-sm sm:text-base">{inc.title}</div>
                              {inc.note && <div className="text-xs text-zinc-500 mt-0.5">{inc.note}</div>}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                                <TrendingUp className="w-3.5 h-3.5" /> আয় ({inc.source})
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm font-semibold">
                              {inc.paymentMethod}
                            </td>
                            <td className="py-3.5 px-4 text-zinc-300 dark:text-zinc-600">-</td>
                            <td className="py-3.5 px-4 text-right font-black text-emerald-600 dark:text-emerald-400 text-base sm:text-lg whitespace-nowrap">
                              + ৳{inc.amount.toLocaleString("bn-BD")}
                            </td>
                            <td className="py-3.5 px-4 text-center no-print whitespace-nowrap">
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  onClick={() => openEditIncomeModal(inc)}
                                  className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                  title="এডিট"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`"${inc.title}" আয়ের তথ্যটি মুছে ফেলবেন?`)) {
                                      deleteIncome(inc.id);
                                      showSuccess("আয়ের তথ্য মুছে ফেলা হয়েছে!");
                                    }
                                  }}
                                  className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                                  title="ডিলিট"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      }
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 1: ADD/EDIT EXPENSE (Larger fonts) ================= */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#121214] rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500">
                  <ArrowDownRight className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-lg sm:text-xl text-zinc-900 dark:text-zinc-100">
                  {editingExpense ? "খরচ এডিট করুন" : "নতুন খরচ লিখুন"}
                </h3>
              </div>
              <button
                onClick={() => setIsExpenseModalOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveExpense} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1 text-sm">
              {/* Quick preset selector dropdown */}
              <div>
                <label className="block font-bold text-zinc-800 dark:text-zinc-200 mb-1.5 text-sm">
                  প্রচলিত খরচ বাছাই করুন (অথবা নিচে লিখুন):
                </label>
                <select
                  onChange={(e) => {
                    const preset = COMMON_EXPENSE_PRESETS.find((p) => p.title === e.target.value);
                    if (preset) {
                      setExpTitle(preset.title);
                      setExpCategory(preset.category);
                      if (!expAmount) setExpAmount(preset.defaultAmount.toString());
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/90 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                >
                  <option value="">-- ড্রপডাউন থেকে দ্রুত সিলেক্ট করুন --</option>
                  {COMMON_EXPENSE_PRESETS.map((p, idx) => (
                    <option key={idx} value={p.title}>
                      {p.title} (প্রায় ৳{p.defaultAmount})
                    </option>
                  ))}
                </select>
              </div>

              {/* Title & Amount Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-zinc-800 dark:text-zinc-200 mb-1.5 text-sm">
                    খরচের নাম / বিবরণ *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: চা খরচ, ভাত, রিকশা ভাড়া"
                    value={expTitle}
                    onChange={(e) => setExpTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-800 dark:text-zinc-200 mb-1.5 text-sm">
                    টাকার পরিমাণ (৳) *
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="যেমন: ৫০"
                    value={expAmount}
                    onChange={(e) => setExpAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-black text-base focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              {/* Category & Payment Method */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-zinc-800 dark:text-zinc-200 mb-1.5 text-sm">
                    ক্যাটাগরি
                  </label>
                  <select
                    value={expCategory}
                    onChange={(e) => setExpCategory(e.target.value as ExpenseCategory)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                  >
                    {EXPENSE_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nameBn} ({c.nameEn})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-zinc-800 dark:text-zinc-200 mb-1.5 text-sm">
                    পেমেন্ট মেথড
                  </label>
                  <select
                    value={expPaymentMethod}
                    onChange={(e) => setExpPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                  >
                    {PAYMENT_METHODS.map((pm) => (
                      <option key={pm} value={pm}>
                        {pm}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date & Note */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-zinc-800 dark:text-zinc-200 mb-1.5 text-sm">
                    তারিখ
                  </label>
                  <input
                    type="date"
                    value={expDate}
                    onChange={(e) => setExpDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-medium text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-800 dark:text-zinc-200 mb-1.5 text-sm">
                    অতিরিক্ত নোট / দোকান
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: মামার দোকান, ধানমন্ডি"
                    value={expNote}
                    onChange={(e) => setExpNote(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-medium text-sm"
                  />
                </div>
              </div>

              {/* Optional Receipt Upload */}
              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2 text-sm">
                    <Receipt className="w-4 h-4 text-zinc-400" />
                    রসিদ বা বিলের ছবি (অপশনাল):
                  </span>
                  {expReceiptUrl && (
                    <button
                      type="button"
                      onClick={() => setExpReceiptUrl("")}
                      className="text-rose-500 text-xs font-bold hover:underline"
                    >
                      মুছুন
                    </button>
                  )}
                </div>

                {expReceiptUrl ? (
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={expReceiptUrl}
                      alt="Receipt"
                      className="w-14 h-14 object-cover rounded-lg border border-zinc-300 dark:border-zinc-700 shadow-xs"
                    />
                    <span className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-bold">
                      ✓ রসিদের ছবি সফলভাবে সংরক্ষিত হয়েছে
                    </span>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      ref={receiptInputRef}
                      onChange={handleReceiptUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => receiptInputRef.current?.click()}
                      disabled={isUploadingReceipt}
                      className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center gap-2 text-zinc-800 dark:text-zinc-200 transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      {isUploadingReceipt ? "আপলোড হচ্ছে..." : "রসিদ আপলোড করুন"}
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-black bg-rose-600 hover:bg-rose-700 text-white shadow-md text-sm active:scale-95 transition-all"
                >
                  {editingExpense ? "আপডেট করুন" : "খরচ সেভ করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: ADD/EDIT INCOME ================= */}
      {isIncomeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#121214] rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-lg sm:text-xl text-zinc-900 dark:text-zinc-100">
                  {editingIncome ? "আয়ের তথ্য এডিট" : "নতুন আয় বা ফান্ড যোগ করুন"}
                </h3>
              </div>
              <button
                onClick={() => setIsIncomeModalOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveIncome} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-zinc-800 dark:text-zinc-200 mb-1.5 text-sm">
                    আয়ের বিবরণ / নাম *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: অক্টোবর মাসের বেতন, ফ্রিল্যান্সিং"
                    value={incTitle}
                    onChange={(e) => setIncTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-800 dark:text-zinc-200 mb-1.5 text-sm">
                    টাকার পরিমাণ (৳) *
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="যেমন: ২৫০০০"
                    value={incAmount}
                    onChange={(e) => setIncAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-black text-base focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-zinc-800 dark:text-zinc-200 mb-1.5 text-sm">
                    আয়ের উৎস (Source)
                  </label>
                  <select
                    value={incSource}
                    onChange={(e) => setIncSource(e.target.value as IncomeSource)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-semibold text-sm"
                  >
                    {INCOME_SOURCES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nameBn}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-zinc-800 dark:text-zinc-200 mb-1.5 text-sm">
                    পেমেন্ট মেথড
                  </label>
                  <select
                    value={incPaymentMethod}
                    onChange={(e) => setIncPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-semibold text-sm"
                  >
                    {PAYMENT_METHODS.map((pm) => (
                      <option key={pm} value={pm}>
                        {pm}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-zinc-800 dark:text-zinc-200 mb-1.5 text-sm">
                    তারিখ
                  </label>
                  <input
                    type="date"
                    value={incDate}
                    onChange={(e) => setIncDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-medium text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-800 dark:text-zinc-200 mb-1.5 text-sm">
                    নোট
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: ক্লায়েন্টের নাম বা রেফারেন্স"
                    value={incNote}
                    onChange={(e) => setIncNote(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-medium text-sm"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsIncomeModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-md text-sm active:scale-95 transition-all"
                >
                  {editingIncome ? "আপডেট করুন" : "আয় যোগ করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: BUDGET & INITIAL CAPITAL CONFIG ================= */}
      {isBudgetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#121214] rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500">
                  <Sliders className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-lg sm:text-xl text-zinc-900 dark:text-zinc-100">
                  মূল ফান্ড ও বাজেট লিমিট সেটিংস
                </h3>
              </div>
              <button
                onClick={() => setIsBudgetModalOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveBudget} className="p-5 sm:p-6 space-y-4 text-sm">
              <div>
                <label className="block font-bold text-zinc-800 dark:text-zinc-200 mb-1.5 text-sm">
                  আমার বর্তমান মূল ক্যাপিটাল / শুরু ফান্ড (৳)
                </label>
                <input
                  type="number"
                  step="any"
                  value={budgetInitialCapital}
                  onChange={(e) => setBudgetInitialCapital(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-black text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-xs text-zinc-500 mt-1 block font-medium">
                  হাতে থাকা মূল ক্যাপিটাল যা থেকে প্রতিদিনের খরচ বাদ দিয়ে মূল অবশিষ্ট হিসাব হবে।
                </span>
              </div>

              <div>
                <label className="block font-bold text-zinc-800 dark:text-zinc-200 mb-1.5 text-sm">
                  মাসিক খরচের বাজেট লিমিট (৳)
                </label>
                <input
                  type="number"
                  step="any"
                  value={budgetMonthly}
                  onChange={(e) => setBudgetMonthly(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-black text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-xs text-zinc-500 mt-1 block font-medium">
                  প্রতি মাসে এর বেশি খরচ না করার লক্ষ্যমাত্রা।
                </span>
              </div>

              <div>
                <label className="block font-bold text-zinc-800 dark:text-zinc-200 mb-1.5 text-sm">
                  দৈনিক খরচের টার্গেট / বাজেট (৳)
                </label>
                <input
                  type="number"
                  step="any"
                  value={budgetDaily}
                  onChange={(e) => setBudgetDaily(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-black text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-xs text-zinc-500 mt-1 block font-medium">
                  চা খরচ, নাস্তা ও খাবার সহ প্রতিদিন গড়ে কত টাকার মধ্যে থাকতে চান।
                </span>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsBudgetModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-black bg-blue-600 hover:bg-blue-700 text-white shadow-md text-sm active:scale-95 transition-all"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 4: ADD/EDIT MONTHLY PLAN ITEM (Requested Feature) ================= */}
      {isPlanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#121214] rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/15 text-blue-600 dark:text-cyan-400">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg sm:text-xl text-zinc-900 dark:text-zinc-100">
                    {editingPlan ? "পরিকল্পনা এডিট করুন" : `${selectedMonth} মাসের খরচের পরিকল্পনা`}
                  </h3>
                  <span className="text-xs text-zinc-500 font-medium">
                    এই মাসে কত টাকা খরচ করার লক্ষ্য রাখছেন তা নির্ধারণ করুন
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsPlanModalOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSavePlan} className="p-5 sm:p-6 space-y-4 text-sm">
              <div>
                <label className="block font-bold text-zinc-800 dark:text-zinc-200 mb-1.5 text-sm">
                  খাত / খরচের বিবরণ *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: মেস বা বাসা ভাড়া, মাসিক মিল, চা খরচ, যাতায়াত"
                  value={planTitle}
                  onChange={(e) => setPlanTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-zinc-800 dark:text-zinc-200 mb-1.5 text-sm">
                    পরিকল্পিত খরচের টাকা (৳) *
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="যেমন: ৩৫০০"
                    value={planAmount}
                    onChange={(e) => setPlanAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-black text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-800 dark:text-zinc-200 mb-1.5 text-sm">
                    ক্যাটাগরি
                  </label>
                  <select
                    value={planCategory}
                    onChange={(e) => setPlanCategory(e.target.value as ExpenseCategory)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-semibold text-sm"
                  >
                    {EXPENSE_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nameBn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-zinc-800 dark:text-zinc-200 mb-1.5 text-sm">
                  নোট / সময়সীমা (অপশনাল)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: মাসের ৫ তারিখের মধ্যে দিতে হবে"
                  value={planNote}
                  onChange={(e) => setPlanNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-medium text-sm"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsPlanModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-black bg-blue-600 hover:bg-blue-700 text-white shadow-md text-sm active:scale-95 transition-all"
                >
                  {editingPlan ? "আপডেট করুন" : "পরিকল্পনা যোগ করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 5: RECEIPT FULL PREVIEW ================= */}
      {previewReceiptUrl && (
        <div
          onClick={() => setPreviewReceiptUrl(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-xl max-h-[85vh] bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl p-2.5"
          >
            <button
              onClick={() => setPreviewReceiptUrl(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-all z-10"
            >
              <X className="w-5 h-5" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewReceiptUrl}
              alt="Receipt Preview"
              className="w-full h-auto max-h-[75vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export type ExpenseCategory =
  | "tea_expense"     // চা খরচ
  | "tea_snacks"      // নাস্তা ও বিস্কুট
  | "meals"           // ভাত ও দুপুরের/রাতের খাবার (Meal)
  | "grocery"         // বাজার সদাই
  | "transport"       // যাতায়াত ও ভাড়া
  | "recharge_net"    // মোবাইল রিচার্জ ও ইন্টারনেট
  | "bills_rent"      // মেস/বাসা ভাড়া ও বিল
  | "medical"         // ঔষধ ও চিকিৎসা
  | "shopping"        // কেনাকাটা ও পোশাক
  | "entertainment"   // বিনোদন ও ঘোরাঘুরি
  | "other";          // অন্যান্য খরচ

export type PaymentMethod =
  | "Cash"
  | "bKash"
  | "Nagad"
  | "Rocket"
  | "Card"
  | "Bank"
  | "Other";

export interface ExpenseItem {
  id: string;
  title: string;           // যেমন: "চা খরচ", "ভাত", "বাস ভাড়া"
  amount: number;
  date: string;            // YYYY-MM-DD
  time?: string;           // HH:MM
  category: ExpenseCategory;
  paymentMethod: PaymentMethod;
  note?: string;
  receiptUrl?: string;     // Cloudinary image
  createdAt: string;
}

export type IncomeSource =
  | "salary"        // মাসিক বেতন
  | "freelancing"   // ফ্রিল্যান্সিং
  | "business"      // ব্যবসা
  | "family"        // পরিবার থেকে
  | "pocket_money"  // হাতখরচ
  | "other";        // অন্যান্য

export interface IncomeItem {
  id: string;
  title: string;
  amount: number;
  date: string;
  source: IncomeSource;
  paymentMethod: PaymentMethod;
  note?: string;
  createdAt: string;
}

export interface MonthlyPlanItem {
  id: string;
  month: string;           // YYYY-MM (যেমন: "2026-10" বা "2026-11")
  title: string;           // যেমন: "বাড়ি ভাড়া", "খাবার ও বাজার", "চা খরচ"
  plannedAmount: number;   // পরিকল্পিত খরচ (টাকা)
  category?: ExpenseCategory;
  note?: string;
  isCompleted?: boolean;
  createdAt: string;
}

export interface BudgetConfig {
  initialCapital: number;    // মূল টাকা / বর্তমান মূল ক্যাপিটাল
  monthlyBudget: number;     // মাসিক বাজেট
  dailyBudget: number;       // দৈনিক খরচের বাজেট লিমিট
  currencySymbol: string;    // ৳
}

export interface CategoryMeta {
  id: ExpenseCategory;
  nameEn: string;
  nameBn: string;
  iconName: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  badgeClass: string;
}

export const COMMON_EXPENSE_PRESETS = [
  { title: "চা খরচ", category: "tea_expense" as ExpenseCategory, defaultAmount: 15 },
  { title: "চা ও নাস্তা", category: "tea_snacks" as ExpenseCategory, defaultAmount: 35 },
  { title: "ভাত / দুপুরের খাবার", category: "meals" as ExpenseCategory, defaultAmount: 90 },
  { title: "রাতের খাবার / মিল", category: "meals" as ExpenseCategory, defaultAmount: 85 },
  { title: "বাস ও রিকশা ভাড়া", category: "transport" as ExpenseCategory, defaultAmount: 30 },
  { title: "বাজার সদাই", category: "grocery" as ExpenseCategory, defaultAmount: 350 },
  { title: "মোবাইল রিচার্জ", category: "recharge_net" as ExpenseCategory, defaultAmount: 100 },
  { title: "মেস / বাড়ি ভাড়া", category: "bills_rent" as ExpenseCategory, defaultAmount: 3500 },
  { title: "ওষুধ ও ফার্মেসি", category: "medical" as ExpenseCategory, defaultAmount: 120 },
  { title: "অন্যান্য খরচ", category: "other" as ExpenseCategory, defaultAmount: 50 }
];

export const EXPENSE_CATEGORIES: CategoryMeta[] = [
  {
    id: "tea_expense",
    nameEn: "Tea Expense",
    nameBn: "চা খরচ",
    iconName: "Coffee",
    color: "amber",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    textColor: "text-amber-600 dark:text-amber-400",
    badgeClass: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800"
  },
  {
    id: "tea_snacks",
    nameEn: "Snacks & Tiffin",
    nameBn: "নাস্তা ও জলখাবার",
    iconName: "Utensils",
    color: "orange",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
    textColor: "text-orange-600 dark:text-orange-400",
    badgeClass: "bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 border-orange-300 dark:border-orange-800"
  },
  {
    id: "meals",
    nameEn: "Rice & Meals",
    nameBn: "ভাত ও দুপুরের/রাতের খাবার",
    iconName: "Utensils",
    color: "emerald",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    textColor: "text-emerald-600 dark:text-emerald-400",
    badgeClass: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
  },
  {
    id: "grocery",
    nameEn: "Grocery & Bazar",
    nameBn: "বাজার সদাই",
    iconName: "ShoppingBag",
    color: "lime",
    bgColor: "bg-lime-500/10",
    borderColor: "border-lime-500/30",
    textColor: "text-lime-700 dark:text-lime-400",
    badgeClass: "bg-lime-100 text-lime-800 dark:bg-lime-950/60 dark:text-lime-300 border-lime-300 dark:border-lime-800"
  },
  {
    id: "transport",
    nameEn: "Transport & Fare",
    nameBn: "যাতায়াত ও ভাড়া",
    iconName: "Bus",
    color: "blue",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    textColor: "text-blue-600 dark:text-blue-400",
    badgeClass: "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300 dark:border-blue-800"
  },
  {
    id: "recharge_net",
    nameEn: "Recharge & Internet",
    nameBn: "মোবাইল রিচার্জ ও নেট",
    iconName: "Wifi",
    color: "cyan",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/30",
    textColor: "text-cyan-600 dark:text-cyan-400",
    badgeClass: "bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300 border-cyan-300 dark:border-cyan-800"
  },
  {
    id: "bills_rent",
    nameEn: "Bills & Rent",
    nameBn: "মেস/বাসা ভাড়া ও বিল",
    iconName: "Home",
    color: "indigo",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/30",
    textColor: "text-indigo-600 dark:text-indigo-400",
    badgeClass: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800"
  },
  {
    id: "medical",
    nameEn: "Medical & Health",
    nameBn: "ঔষধ ও চিকিৎসা",
    iconName: "HeartPulse",
    color: "red",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
    textColor: "text-red-600 dark:text-red-400",
    badgeClass: "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border-red-300 dark:border-red-800"
  },
  {
    id: "shopping",
    nameEn: "Shopping & Goods",
    nameBn: "কেনাকাটা ও পোশাক",
    iconName: "Tag",
    color: "purple",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    textColor: "text-purple-600 dark:text-purple-400",
    badgeClass: "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-300 dark:border-purple-800"
  },
  {
    id: "entertainment",
    nameEn: "Entertainment",
    nameBn: "বিনোদন ও আড্ডা",
    iconName: "Smile",
    color: "pink",
    bgColor: "bg-pink-500/10",
    borderColor: "border-pink-500/30",
    textColor: "text-pink-600 dark:text-pink-400",
    badgeClass: "bg-pink-100 text-pink-800 dark:bg-pink-950/60 dark:text-pink-300 border-pink-300 dark:border-pink-800"
  },
  {
    id: "other",
    nameEn: "Others",
    nameBn: "অন্যান্য খরচ",
    iconName: "MoreHorizontal",
    color: "zinc",
    bgColor: "bg-zinc-500/10",
    borderColor: "border-zinc-500/30",
    textColor: "text-zinc-600 dark:text-zinc-400",
    badgeClass: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700"
  }
];

export const INCOME_SOURCES: { id: IncomeSource; nameEn: string; nameBn: string }[] = [
  { id: "salary", nameEn: "Monthly Salary", nameBn: "মাসিক বেতন" },
  { id: "freelancing", nameEn: "Freelancing Project", nameBn: "ফ্রিল্যান্সিং প্রোজেক্ট" },
  { id: "business", nameEn: "Business / Trade", nameBn: "ব্যবসা বা উদ্যোগ" },
  { id: "family", nameEn: "Family Send Money", nameBn: "পরিবার থেকে টাকা" },
  { id: "pocket_money", nameEn: "Pocket Money / Gift", nameBn: "হাতখরচ / উপহার" },
  { id: "other", nameEn: "Other Sources", nameBn: "অন্যান্য ফান্ড" }
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  "Cash",
  "bKash",
  "Nagad",
  "Rocket",
  "Card",
  "Bank",
  "Other"
];

export const DEFAULT_BUDGET_CONFIG: BudgetConfig = {
  initialCapital: 10000, // মূল টাকা / শুরু ব্যালেন্স
  monthlyBudget: 15000,  // মাসিক বাজেট
  dailyBudget: 500,      // দৈনিক খরচের বাজেট
  currencySymbol: "৳"
};

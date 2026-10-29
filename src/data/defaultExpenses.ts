import { ExpenseItem, IncomeItem, MonthlyPlanItem } from "@/types/expense";

const todayStr = new Date().toISOString().slice(0, 10);
const yesterdayStr = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
const twoDaysAgoStr = new Date(Date.now() - 86400000 * 2).toISOString().slice(0, 10);
const threeDaysAgoStr = new Date(Date.now() - 86400000 * 3).toISOString().slice(0, 10);

export const defaultExpenses: ExpenseItem[] = [
  {
    id: "exp-1",
    title: "সকালের চা ও বিস্কুট",
    amount: 25,
    date: todayStr,
    time: "08:30",
    category: "tea_snacks",
    paymentMethod: "Cash",
    note: "মোড়ের টং দোকানে নাস্তা",
    createdAt: new Date().toISOString()
  },
  {
    id: "exp-2",
    title: "দুপুরে স্পেশাল চা খরচ",
    amount: 30,
    date: todayStr,
    time: "11:15",
    category: "tea_expense",
    paymentMethod: "Cash",
    note: "রং চা ও আদা চা",
    createdAt: new Date().toISOString()
  },
  {
    id: "exp-3",
    title: "দুপুরের ভাত ও মাছ মিল",
    amount: 110,
    date: todayStr,
    time: "14:00",
    category: "meals",
    paymentMethod: "Cash",
    note: "হোটেল আল-কাদেরিয়া",
    createdAt: new Date().toISOString()
  },
  {
    id: "exp-4",
    title: "বাস ও রিকশা ভাড়া",
    amount: 50,
    date: todayStr,
    time: "17:45",
    category: "transport",
    paymentMethod: "Cash",
    note: "মিরপুর ১০ থেকে ফার্মগেট",
    createdAt: new Date().toISOString()
  },
  {
    id: "exp-5",
    title: "সন্ধ্যায় চা ও বন্ধুদের সাথে আড্ডা",
    amount: 60,
    date: yesterdayStr,
    time: "19:30",
    category: "tea_expense",
    paymentMethod: "bKash",
    note: "মাল্টা চা ও দুধ চা",
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "exp-6",
    title: "রাতের চা খরচ",
    amount: 20,
    date: yesterdayStr,
    time: "21:00",
    category: "tea_expense",
    paymentMethod: "Cash",
    note: "লেবু চা",
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "exp-7",
    title: "রাতের ভাত ও তরকারি",
    amount: 90,
    date: yesterdayStr,
    time: "22:15",
    category: "meals",
    paymentMethod: "Cash",
    note: "রাতের মিল",
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "exp-8",
    title: "কাঁচাবাজার সদাই (সবজি ও ডিম)",
    amount: 450,
    date: twoDaysAgoStr,
    time: "10:00",
    category: "grocery",
    paymentMethod: "Nagad",
    note: "কাঁচাবাজার সদাই",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: "exp-9",
    title: "মোবাইল রিচার্জ (গ্রামীনফোন)",
    amount: 198,
    date: threeDaysAgoStr,
    time: "16:20",
    category: "recharge_net",
    paymentMethod: "bKash",
    note: "ডাটা প্যাক",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  }
];

export const defaultIncomes: IncomeItem[] = [
  {
    id: "inc-1",
    title: "চলতি মাসের প্রাথমিক ক্যাপিটাল ও ফান্ড",
    amount: 25000,
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10),
    source: "salary",
    paymentMethod: "Bank",
    note: "মাসিক শুরু ব্যালেন্স ও সেভিংস ফান্ড",
    createdAt: new Date().toISOString()
  },
  {
    id: "inc-2",
    title: "ওয়েব ডেভেলপমেন্ট ছোট প্রোজেক্ট",
    amount: 8000,
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 15).toISOString().slice(0, 10),
    source: "freelancing",
    paymentMethod: "bKash",
    note: "ক্লায়েন্ট সাইট ফিক্সিং",
    createdAt: new Date().toISOString()
  }
];

const currentMonthStr = new Date().toISOString().slice(0, 7);

export const defaultMonthlyPlans: MonthlyPlanItem[] = [
  {
    id: "plan-1",
    month: currentMonthStr,
    title: "মেস / রুম ভাড়া ও সার্ভিস চার্জ",
    plannedAmount: 3500,
    category: "bills_rent",
    note: "প্রতি মাসের ৫ তারিখের মধ্যে",
    isCompleted: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "plan-2",
    month: currentMonthStr,
    title: "দুপুর ও রাতের মিল / খাবার খরচ",
    plannedAmount: 4500,
    category: "meals",
    note: "মাসিক মিল হিসাব",
    isCompleted: false,
    createdAt: new Date().toISOString()
  },
  {
    id: "plan-3",
    month: currentMonthStr,
    title: "দৈনিক চা ও নাস্তা বাজেট",
    plannedAmount: 800,
    category: "tea_expense",
    note: "প্রতিদিন গড়ে ২৫-৩০ টাকা",
    isCompleted: false,
    createdAt: new Date().toISOString()
  },
  {
    id: "plan-4",
    month: currentMonthStr,
    title: "লোকাল বাস ও রিকশা যাতায়াত ভাড়া",
    plannedAmount: 1200,
    category: "transport",
    note: "অফিস ও ক্লায়েন্ট মিটিং",
    isCompleted: false,
    createdAt: new Date().toISOString()
  },
  {
    id: "plan-5",
    month: currentMonthStr,
    title: "মোবাইল রিচার্জ ও ইন্টারনেট বিল",
    plannedAmount: 800,
    category: "recharge_net",
    note: "ব্রডব্যান্ড ও জিবি প্যাক",
    isCompleted: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "plan-6",
    month: currentMonthStr,
    title: "জরুরি অন্যান্য ও হাতখরচ ফান্ড",
    plannedAmount: 1000,
    category: "other",
    note: "জরুরি ব্যাকআপ",
    isCompleted: false,
    createdAt: new Date().toISOString()
  }
];


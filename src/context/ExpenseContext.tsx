"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  ExpenseItem,
  IncomeItem,
  MonthlyPlanItem,
  BudgetConfig,
  DEFAULT_BUDGET_CONFIG
} from "@/types/expense";
import { defaultExpenses, defaultIncomes, defaultMonthlyPlans } from "@/data/defaultExpenses";

interface ExpenseContextType {
  expenses: ExpenseItem[];
  incomes: IncomeItem[];
  monthlyPlans: MonthlyPlanItem[];
  budgetConfig: BudgetConfig;
  addExpense: (item: Omit<ExpenseItem, "id" | "createdAt">) => void;
  updateExpense: (id: string, updated: Partial<ExpenseItem>) => void;
  deleteExpense: (id: string) => void;
  addIncome: (item: Omit<IncomeItem, "id" | "createdAt">) => void;
  updateIncome: (id: string, updated: Partial<IncomeItem>) => void;
  deleteIncome: (id: string) => void;
  addMonthlyPlan: (item: Omit<MonthlyPlanItem, "id" | "createdAt">) => void;
  updateMonthlyPlan: (id: string, updated: Partial<MonthlyPlanItem>) => void;
  deleteMonthlyPlan: (id: string) => void;
  toggleMonthlyPlanComplete: (id: string) => void;
  updateBudgetConfig: (updated: Partial<BudgetConfig>) => void;
  resetToDefaults: () => void;
  clearAllData: () => void;
  isReady: boolean;
}

const STORAGE_EXPENSES_KEY = "shuvo_expenses_v2";
const STORAGE_INCOMES_KEY = "shuvo_incomes_v2";
const STORAGE_PLANS_KEY = "shuvo_monthly_plans_v1";
const STORAGE_BUDGET_KEY = "shuvo_budget_cfg_v2";

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const [expenses, setExpenses] = useState<ExpenseItem[]>(defaultExpenses);
  const [incomes, setIncomes] = useState<IncomeItem[]>(defaultIncomes);
  const [monthlyPlans, setMonthlyPlans] = useState<MonthlyPlanItem[]>(defaultMonthlyPlans);
  const [budgetConfig, setBudgetConfig] = useState<BudgetConfig>(DEFAULT_BUDGET_CONFIG);
  const [isReady, setIsReady] = useState(false);

  // Initialize from localStorage and sync from server
  useEffect(() => {
    try {
      const storedExp = localStorage.getItem(STORAGE_EXPENSES_KEY);
      if (storedExp) {
        const parsed = JSON.parse(storedExp);
        if (Array.isArray(parsed)) setExpenses(parsed);
      }

      const storedInc = localStorage.getItem(STORAGE_INCOMES_KEY);
      if (storedInc) {
        const parsed = JSON.parse(storedInc);
        if (Array.isArray(parsed)) setIncomes(parsed);
      }

      const storedPlans = localStorage.getItem(STORAGE_PLANS_KEY);
      if (storedPlans) {
        const parsed = JSON.parse(storedPlans);
        if (Array.isArray(parsed)) setMonthlyPlans(parsed);
      }

      const storedCfg = localStorage.getItem(STORAGE_BUDGET_KEY);
      if (storedCfg) {
        setBudgetConfig(JSON.parse(storedCfg));
      }
    } catch (e) {
      console.error("Failed to load expenses from localStorage:", e);
    }

    // Backend MongoDB sync
    fetch("/api/data")
      .then((res) => res.json())
      .then((serverData) => {
        if (serverData) {
          if (Array.isArray(serverData.expenses)) {
            setExpenses(serverData.expenses);
            localStorage.setItem(STORAGE_EXPENSES_KEY, JSON.stringify(serverData.expenses));
          }
          if (Array.isArray(serverData.incomes)) {
            setIncomes(serverData.incomes);
            localStorage.setItem(STORAGE_INCOMES_KEY, JSON.stringify(serverData.incomes));
          }
          if (Array.isArray(serverData.monthlyPlans)) {
            setMonthlyPlans(serverData.monthlyPlans);
            localStorage.setItem(STORAGE_PLANS_KEY, JSON.stringify(serverData.monthlyPlans));
          }
          if (serverData.budgetConfig) {
            setBudgetConfig(serverData.budgetConfig);
            localStorage.setItem(STORAGE_BUDGET_KEY, JSON.stringify(serverData.budgetConfig));
          }
        }
      })
      .catch((err) => console.warn("Backend expense sync notice:", err))
      .finally(() => setIsReady(true));
  }, []);

  const syncToServer = (payload: {
    expenses?: ExpenseItem[];
    incomes?: IncomeItem[];
    monthlyPlans?: MonthlyPlanItem[];
    budgetConfig?: BudgetConfig;
  }) => {
    fetch("/api/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).catch((err) => console.warn("Failed to sync expenses to server:", err));
  };

  const addExpense = (item: Omit<ExpenseItem, "id" | "createdAt">) => {
    const newItem: ExpenseItem = {
      ...item,
      id: "exp-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
      createdAt: new Date().toISOString()
    };
    const updated = [newItem, ...expenses];
    setExpenses(updated);
    try {
      localStorage.setItem(STORAGE_EXPENSES_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    syncToServer({ expenses: updated });
  };

  const updateExpense = (id: string, updatedFields: Partial<ExpenseItem>) => {
    const updated = expenses.map((item) =>
      item.id === id ? { ...item, ...updatedFields } : item
    );
    setExpenses(updated);
    try {
      localStorage.setItem(STORAGE_EXPENSES_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    syncToServer({ expenses: updated });
  };

  const deleteExpense = (id: string) => {
    const updated = expenses.filter((item) => item.id !== id);
    setExpenses(updated);
    try {
      localStorage.setItem(STORAGE_EXPENSES_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    syncToServer({ expenses: updated });
  };

  const addIncome = (item: Omit<IncomeItem, "id" | "createdAt">) => {
    const newItem: IncomeItem = {
      ...item,
      id: "inc-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
      createdAt: new Date().toISOString()
    };
    const updated = [newItem, ...incomes];
    setIncomes(updated);
    try {
      localStorage.setItem(STORAGE_INCOMES_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    syncToServer({ incomes: updated });
  };

  const updateIncome = (id: string, updatedFields: Partial<IncomeItem>) => {
    const updated = incomes.map((item) =>
      item.id === id ? { ...item, ...updatedFields } : item
    );
    setIncomes(updated);
    try {
      localStorage.setItem(STORAGE_INCOMES_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    syncToServer({ incomes: updated });
  };

  const deleteIncome = (id: string) => {
    const updated = incomes.filter((item) => item.id !== id);
    setIncomes(updated);
    try {
      localStorage.setItem(STORAGE_INCOMES_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    syncToServer({ incomes: updated });
  };

  const addMonthlyPlan = (item: Omit<MonthlyPlanItem, "id" | "createdAt">) => {
    const newItem: MonthlyPlanItem = {
      ...item,
      id: "plan-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
      createdAt: new Date().toISOString()
    };
    const updated = [...monthlyPlans, newItem];
    setMonthlyPlans(updated);
    try {
      localStorage.setItem(STORAGE_PLANS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    syncToServer({ monthlyPlans: updated });
  };

  const updateMonthlyPlan = (id: string, updatedFields: Partial<MonthlyPlanItem>) => {
    const updated = monthlyPlans.map((item) =>
      item.id === id ? { ...item, ...updatedFields } : item
    );
    setMonthlyPlans(updated);
    try {
      localStorage.setItem(STORAGE_PLANS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    syncToServer({ monthlyPlans: updated });
  };

  const deleteMonthlyPlan = (id: string) => {
    const updated = monthlyPlans.filter((item) => item.id !== id);
    setMonthlyPlans(updated);
    try {
      localStorage.setItem(STORAGE_PLANS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    syncToServer({ monthlyPlans: updated });
  };

  const toggleMonthlyPlanComplete = (id: string) => {
    const updated = monthlyPlans.map((item) =>
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    );
    setMonthlyPlans(updated);
    try {
      localStorage.setItem(STORAGE_PLANS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    syncToServer({ monthlyPlans: updated });
  };

  const updateBudgetConfig = (updated: Partial<BudgetConfig>) => {
    const newCfg = { ...budgetConfig, ...updated };
    setBudgetConfig(newCfg);
    try {
      localStorage.setItem(STORAGE_BUDGET_KEY, JSON.stringify(newCfg));
    } catch (e) {
      console.error(e);
    }
    syncToServer({ budgetConfig: newCfg });
  };

  const clearAllData = () => {
    setExpenses([]);
    setIncomes([]);
    setMonthlyPlans([]);
    try {
      localStorage.setItem(STORAGE_EXPENSES_KEY, JSON.stringify([]));
      localStorage.setItem(STORAGE_INCOMES_KEY, JSON.stringify([]));
      localStorage.setItem(STORAGE_PLANS_KEY, JSON.stringify([]));
    } catch (e) {
      console.error(e);
    }
    syncToServer({
      expenses: [],
      incomes: [],
      monthlyPlans: []
    });
  };

  const resetToDefaults = () => {
    clearAllData();
  };

  return (
    <ExpenseContext.Provider
      value={{
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
        clearAllData,
        isReady
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpense() {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error("useExpense must be used within an ExpenseProvider");
  }
  return context;
}

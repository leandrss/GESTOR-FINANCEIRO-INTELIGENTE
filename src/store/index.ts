/**
 * STORE GLOBAL - GERENCIAMENTO DE ESTADO CENTRALIZADO
 * 
 * Este é o coração do sistema de estado do aplicativo.
 * Todas as funcionalidades compartilham dados através deste store.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ============================================
// TIPOS E INTERFACES
// ============================================

export interface Transaction {
  id: number;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  date: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserData {
  id?: string;
  name: string;
  email: string;
  phone: string;
  plan: 'free' | 'premium' | 'enterprise';
  isActive: boolean;
  createdAt?: string;
}

export interface Budget {
  id: number;
  category: string;
  limit: number;
  spent: number;
  period: 'monthly' | 'weekly' | 'yearly';
}

export interface Goal {
  id: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
}

export interface Notification {
  id: number;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

// ============================================
// ESTADO GLOBAL
// ============================================

interface GlobalState {
  // ========== DADOS DO USUÁRIO ==========
  user: UserData | null;
  isAuthenticated: boolean;
  
  // ========== TRANSAÇÕES ==========
  transactions: Transaction[];
  
  // ========== ORÇAMENTOS ==========
  budgets: Budget[];
  
  // ========== METAS ==========
  goals: Goal[];
  
  // ========== NOTIFICAÇÕES ==========
  notifications: Notification[];
  
  // ========== UI STATE ==========
  isLoading: boolean;
  error: string | null;
  
  // ========== FILTROS E PREFERÊNCIAS ==========
  filters: {
    dateRange: { start: string; end: string } | null;
    categories: string[];
    transactionType: 'all' | 'income' | 'expense';
  };
  
  preferences: {
    currency: string;
    language: string;
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
  };
  
  // ========== AÇÕES - USUÁRIO ==========
  setUser: (user: UserData) => void;
  updateUser: (updates: Partial<UserData>) => void;
  logout: () => void;
  
  // ========== AÇÕES - TRANSAÇÕES ==========
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTransaction: (id: number, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: number) => void;
  getTransactionsByDateRange: (start: string, end: string) => Transaction[];
  getTransactionsByCategory: (category: string) => Transaction[];
  
  // ========== AÇÕES - ORÇAMENTOS ==========
  addBudget: (budget: Omit<Budget, 'id' | 'spent'>) => void;
  updateBudget: (id: number, updates: Partial<Budget>) => void;
  deleteBudget: (id: number) => void;
  
  // ========== AÇÕES - METAS ==========
  addGoal: (goal: Omit<Goal, 'id' | 'currentAmount'>) => void;
  updateGoal: (id: number, updates: Partial<Goal>) => void;
  deleteGoal: (id: number) => void;
  contributeToGoal: (id: number, amount: number) => void;
  
  // ========== AÇÕES - NOTIFICAÇÕES ==========
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void;
  markNotificationAsRead: (id: number) => void;
  clearNotifications: () => void;
  
  // ========== AÇÕES - FILTROS ==========
  setFilters: (filters: Partial<GlobalState['filters']>) => void;
  resetFilters: () => void;
  
  // ========== AÇÕES - PREFERÊNCIAS ==========
  setPreferences: (preferences: Partial<GlobalState['preferences']>) => void;
  
  // ========== AÇÕES - UI ==========
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // ========== AÇÕES - ESTATÍSTICAS ==========
  getStats: () => {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
    transactionCount: number;
    averageIncome: number;
    averageExpense: number;
  };
  
  // ========== AÇÕES - RESET ==========
  resetStore: () => void;
}

// ============================================
// ESTADO INICIAL
// ============================================

const initialState = {
  user: null,
  isAuthenticated: false,
  transactions: [],
  budgets: [],
  goals: [],
  notifications: [],
  isLoading: false,
  error: null,
  filters: {
    dateRange: null,
    categories: [],
    transactionType: 'all' as const,
  },
  preferences: {
    currency: 'BRL',
    language: 'pt-BR',
    theme: 'system' as const,
    notifications: true,
  },
};

// ============================================
// CRIAÇÃO DO STORE COM PERSISTÊNCIA
// ============================================

export const useStore = create<GlobalState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // ========== IMPLEMENTAÇÃO - USUÁRIO ==========
      setUser: (user) => set({ user, isAuthenticated: true }),
      
      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null,
      })),
      
      logout: () => set({
        user: null,
        isAuthenticated: false,
        transactions: [],
        budgets: [],
        goals: [],
        notifications: [],
      }),
      
      // ========== IMPLEMENTAÇÃO - TRANSAÇÕES ==========
      addTransaction: (transaction) => set((state) => {
        const now = new Date().toISOString();
        const newTransaction: Transaction = {
          ...transaction,
          id: Date.now(),
          createdAt: now,
          updatedAt: now,
        };
        
        // Atualizar orçamentos automaticamente
        const updatedBudgets = state.budgets.map(budget => {
          if (budget.category === transaction.category && transaction.type === 'expense') {
            return {
              ...budget,
              spent: budget.spent + transaction.amount,
            };
          }
          return budget;
        });
        
        // Criar notificação se orçamento estourar
        const notifications = [...state.notifications];
        updatedBudgets.forEach(budget => {
          if (budget.spent > budget.limit) {
            notifications.push({
              id: Date.now() + Math.random(),
              type: 'warning',
              title: 'Orçamento Excedido',
              message: `Você ultrapassou o orçamento de ${budget.category}`,
              read: false,
              createdAt: now,
            });
          }
        });
        
        return {
          transactions: [newTransaction, ...state.transactions],
          budgets: updatedBudgets,
          notifications,
        };
      }),
      
      updateTransaction: (id, updates) => set((state) => ({
        transactions: state.transactions.map(t =>
          t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
        ),
      })),
      
      deleteTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter(t => t.id !== id),
      })),
      
      getTransactionsByDateRange: (start, end) => {
        const transactions = get().transactions;
        return transactions.filter(t => {
          const date = new Date(t.date);
          return date >= new Date(start) && date <= new Date(end);
        });
      },
      
      getTransactionsByCategory: (category) => {
        return get().transactions.filter(t => t.category === category);
      },
      
      // ========== IMPLEMENTAÇÃO - ORÇAMENTOS ==========
      addBudget: (budget) => set((state) => ({
        budgets: [...state.budgets, { ...budget, id: Date.now(), spent: 0 }],
      })),
      
      updateBudget: (id, updates) => set((state) => ({
        budgets: state.budgets.map(b => b.id === id ? { ...b, ...updates } : b),
      })),
      
      deleteBudget: (id) => set((state) => ({
        budgets: state.budgets.filter(b => b.id !== id),
      })),
      
      // ========== IMPLEMENTAÇÃO - METAS ==========
      addGoal: (goal) => set((state) => ({
        goals: [...state.goals, { ...goal, id: Date.now(), currentAmount: 0 }],
      })),
      
      updateGoal: (id, updates) => set((state) => ({
        goals: state.goals.map(g => g.id === id ? { ...g, ...updates } : g),
      })),
      
      deleteGoal: (id) => set((state) => ({
        goals: state.goals.filter(g => g.id !== id),
      })),
      
      contributeToGoal: (id, amount) => set((state) => {
        const updatedGoals = state.goals.map(g => {
          if (g.id === id) {
            const newAmount = g.currentAmount + amount;
            
            // Criar notificação se meta for atingida
            if (newAmount >= g.targetAmount && g.currentAmount < g.targetAmount) {
              state.notifications.push({
                id: Date.now(),
                type: 'success',
                title: 'Meta Atingida! 🎉',
                message: `Parabéns! Você atingiu a meta "${g.name}"`,
                read: false,
                createdAt: new Date().toISOString(),
              });
            }
            
            return { ...g, currentAmount: newAmount };
          }
          return g;
        });
        
        return { goals: updatedGoals };
      }),
      
      // ========== IMPLEMENTAÇÃO - NOTIFICAÇÕES ==========
      addNotification: (notification) => set((state) => ({
        notifications: [
          {
            ...notification,
            id: Date.now(),
            read: false,
            createdAt: new Date().toISOString(),
          },
          ...state.notifications,
        ],
      })),
      
      markNotificationAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(n =>
          n.id === id ? { ...n, read: true } : n
        ),
      })),
      
      clearNotifications: () => set({ notifications: [] }),
      
      // ========== IMPLEMENTAÇÃO - FILTROS ==========
      setFilters: (filters) => set((state) => ({
        filters: { ...state.filters, ...filters },
      })),
      
      resetFilters: () => set({
        filters: initialState.filters,
      }),
      
      // ========== IMPLEMENTAÇÃO - PREFERÊNCIAS ==========
      setPreferences: (preferences) => set((state) => ({
        preferences: { ...state.preferences, ...preferences },
      })),
      
      // ========== IMPLEMENTAÇÃO - UI ==========
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      
      // ========== IMPLEMENTAÇÃO - ESTATÍSTICAS ==========
      getStats: () => {
        const { transactions } = get();
        const incomes = transactions.filter(t => t.type === 'income');
        const expenses = transactions.filter(t => t.type === 'expense');
        
        const totalIncome = incomes.reduce((sum, t) => sum + t.amount, 0);
        const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
        
        return {
          totalIncome,
          totalExpenses,
          balance: totalIncome - totalExpenses,
          transactionCount: transactions.length,
          averageIncome: incomes.length > 0 ? totalIncome / incomes.length : 0,
          averageExpense: expenses.length > 0 ? totalExpenses / expenses.length : 0,
        };
      },
      
      // ========== IMPLEMENTAÇÃO - RESET ==========
      resetStore: () => set(initialState),
    }),
    {
      name: 'finz-storage', // Nome da chave no localStorage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Persistir apenas dados importantes
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        transactions: state.transactions,
        budgets: state.budgets,
        goals: state.goals,
        preferences: state.preferences,
      }),
    }
  )
);

// ============================================
// SELETORES OTIMIZADOS
// ============================================

// Evita re-renders desnecessários
export const useUser = () => useStore((state) => state.user);
export const useTransactions = () => useStore((state) => state.transactions);
export const useBudgets = () => useStore((state) => state.budgets);
export const useGoals = () => useStore((state) => state.goals);
export const useNotifications = () => useStore((state) => state.notifications);
export const usePreferences = () => useStore((state) => state.preferences);
export const useStats = () => useStore((state) => state.getStats());

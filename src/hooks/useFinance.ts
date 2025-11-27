/**
 * HOOKS CUSTOMIZADOS - ACESSO SIMPLIFICADO AO ESTADO
 * 
 * Hooks especializados para funcionalidades financeiras.
 * Abstração sobre o store global.
 */

import { useMemo } from 'react';
import { useStore } from '@/store';
import type { Transaction } from '@/store';

// ============================================
// HOOK DE TRANSAÇÕES
// ============================================

export function useTransactions() {
  const transactions = useStore((state) => state.transactions);
  const addTransaction = useStore((state) => state.addTransaction);
  const updateTransaction = useStore((state) => state.updateTransaction);
  const deleteTransaction = useStore((state) => state.deleteTransaction);
  const filters = useStore((state) => state.filters);
  
  // Transações filtradas
  const filteredTransactions = useMemo(() => {
    let result = [...transactions];
    
    // Filtrar por tipo
    if (filters.transactionType !== 'all') {
      result = result.filter(t => t.type === filters.transactionType);
    }
    
    // Filtrar por categorias
    if (filters.categories.length > 0) {
      result = result.filter(t => filters.categories.includes(t.category));
    }
    
    // Filtrar por data
    if (filters.dateRange) {
      const start = new Date(filters.dateRange.start);
      const end = new Date(filters.dateRange.end);
      result = result.filter(t => {
        const date = new Date(t.date);
        return date >= start && date <= end;
      });
    }
    
    return result;
  }, [transactions, filters]);
  
  return {
    transactions: filteredTransactions,
    allTransactions: transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
}

// ============================================
// HOOK DE ESTATÍSTICAS
// ============================================

export function useFinanceStats() {
  const transactions = useStore((state) => state.transactions);
  
  const stats = useMemo(() => {
    const incomes = transactions.filter(t => t.type === 'income');
    const expenses = transactions.filter(t => t.type === 'expense');
    
    const totalIncome = incomes.reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpenses;
    
    // Estatísticas por categoria
    const byCategory = transactions.reduce((acc, t) => {
      if (!acc[t.category]) {
        acc[t.category] = { income: 0, expense: 0, total: 0 };
      }
      
      if (t.type === 'income') {
        acc[t.category].income += t.amount;
      } else {
        acc[t.category].expense += t.amount;
      }
      
      acc[t.category].total = acc[t.category].income - acc[t.category].expense;
      
      return acc;
    }, {} as Record<string, { income: number; expense: number; total: number }>);
    
    // Estatísticas mensais
    const byMonth = transactions.reduce((acc, t) => {
      const month = new Date(t.date).toISOString().slice(0, 7); // YYYY-MM
      
      if (!acc[month]) {
        acc[month] = { income: 0, expense: 0, balance: 0 };
      }
      
      if (t.type === 'income') {
        acc[month].income += t.amount;
      } else {
        acc[month].expense += t.amount;
      }
      
      acc[month].balance = acc[month].income - acc[month].expense;
      
      return acc;
    }, {} as Record<string, { income: number; expense: number; balance: number }>);
    
    return {
      totalIncome,
      totalExpenses,
      balance,
      transactionCount: transactions.length,
      averageIncome: incomes.length > 0 ? totalIncome / incomes.length : 0,
      averageExpense: expenses.length > 0 ? totalExpenses / expenses.length : 0,
      byCategory,
      byMonth,
    };
  }, [transactions]);
  
  return stats;
}

// ============================================
// HOOK DE ORÇAMENTOS
// ============================================

export function useBudgets() {
  const budgets = useStore((state) => state.budgets);
  const addBudget = useStore((state) => state.addBudget);
  const updateBudget = useStore((state) => state.updateBudget);
  const deleteBudget = useStore((state) => state.deleteBudget);
  
  // Calcular status dos orçamentos
  const budgetsWithStatus = useMemo(() => {
    return budgets.map(budget => {
      const percentage = (budget.spent / budget.limit) * 100;
      const remaining = budget.limit - budget.spent;
      
      let status: 'safe' | 'warning' | 'danger' = 'safe';
      if (percentage >= 100) status = 'danger';
      else if (percentage >= 80) status = 'warning';
      
      return {
        ...budget,
        percentage,
        remaining,
        status,
      };
    });
  }, [budgets]);
  
  return {
    budgets: budgetsWithStatus,
    addBudget,
    updateBudget,
    deleteBudget,
  };
}

// ============================================
// HOOK DE METAS
// ============================================

export function useGoals() {
  const goals = useStore((state) => state.goals);
  const addGoal = useStore((state) => state.addGoal);
  const updateGoal = useStore((state) => state.updateGoal);
  const deleteGoal = useStore((state) => state.deleteGoal);
  const contributeToGoal = useStore((state) => state.contributeToGoal);
  
  // Calcular progresso das metas
  const goalsWithProgress = useMemo(() => {
    return goals.map(goal => {
      const percentage = (goal.currentAmount / goal.targetAmount) * 100;
      const remaining = goal.targetAmount - goal.currentAmount;
      const isCompleted = goal.currentAmount >= goal.targetAmount;
      
      // Calcular dias restantes
      const today = new Date();
      const deadline = new Date(goal.deadline);
      const daysRemaining = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      return {
        ...goal,
        percentage,
        remaining,
        isCompleted,
        daysRemaining,
      };
    });
  }, [goals]);
  
  return {
    goals: goalsWithProgress,
    addGoal,
    updateGoal,
    deleteGoal,
    contributeToGoal,
  };
}

// ============================================
// HOOK DE NOTIFICAÇÕES
// ============================================

export function useNotifications() {
  const notifications = useStore((state) => state.notifications);
  const addNotification = useStore((state) => state.addNotification);
  const markAsRead = useStore((state) => state.markNotificationAsRead);
  const clearAll = useStore((state) => state.clearNotifications);
  
  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);
  
  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    clearAll,
  };
}

// ============================================
// HOOK DE FILTROS
// ============================================

export function useFilters() {
  const filters = useStore((state) => state.filters);
  const setFilters = useStore((state) => state.setFilters);
  const resetFilters = useStore((state) => state.resetFilters);
  
  return {
    filters,
    setFilters,
    resetFilters,
  };
}

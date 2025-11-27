/**
 * SERVIÇO DE API - COMUNICAÇÃO CENTRALIZADA COM BACKEND
 * 
 * Todas as chamadas de API passam por aqui.
 * Integração automática com o store global.
 */

import { useStore } from '@/store';
import type { Transaction, UserData, Budget, Goal } from '@/store';

// ============================================
// CONFIGURAÇÃO BASE
// ============================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const { setLoading, setError } = useStore.getState();
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }
  
  // ========== TRANSAÇÕES ==========
  
  async getTransactions(): Promise<Transaction[]> {
    return this.request<Transaction[]>('/transactions');
  }
  
  async createTransaction(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<Transaction> {
    const result = await this.request<Transaction>('/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction),
    });
    
    // Atualizar store automaticamente
    useStore.getState().addTransaction(transaction);
    
    return result;
  }
  
  async updateTransaction(id: number, updates: Partial<Transaction>): Promise<Transaction> {
    const result = await this.request<Transaction>(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    
    // Atualizar store automaticamente
    useStore.getState().updateTransaction(id, updates);
    
    return result;
  }
  
  async deleteTransaction(id: number): Promise<void> {
    await this.request<void>(`/transactions/${id}`, {
      method: 'DELETE',
    });
    
    // Atualizar store automaticamente
    useStore.getState().deleteTransaction(id);
  }
  
  // ========== USUÁRIO ==========
  
  async getUser(): Promise<UserData> {
    return this.request<UserData>('/user');
  }
  
  async updateUser(updates: Partial<UserData>): Promise<UserData> {
    const result = await this.request<UserData>('/user', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    
    // Atualizar store automaticamente
    useStore.getState().updateUser(updates);
    
    return result;
  }
  
  // ========== ORÇAMENTOS ==========
  
  async getBudgets(): Promise<Budget[]> {
    return this.request<Budget[]>('/budgets');
  }
  
  async createBudget(budget: Omit<Budget, 'id' | 'spent'>): Promise<Budget> {
    const result = await this.request<Budget>('/budgets', {
      method: 'POST',
      body: JSON.stringify(budget),
    });
    
    // Atualizar store automaticamente
    useStore.getState().addBudget(budget);
    
    return result;
  }
  
  async updateBudget(id: number, updates: Partial<Budget>): Promise<Budget> {
    const result = await this.request<Budget>(`/budgets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    
    // Atualizar store automaticamente
    useStore.getState().updateBudget(id, updates);
    
    return result;
  }
  
  async deleteBudget(id: number): Promise<void> {
    await this.request<void>(`/budgets/${id}`, {
      method: 'DELETE',
    });
    
    // Atualizar store automaticamente
    useStore.getState().deleteBudget(id);
  }
  
  // ========== METAS ==========
  
  async getGoals(): Promise<Goal[]> {
    return this.request<Goal[]>('/goals');
  }
  
  async createGoal(goal: Omit<Goal, 'id' | 'currentAmount'>): Promise<Goal> {
    const result = await this.request<Goal>('/goals', {
      method: 'POST',
      body: JSON.stringify(goal),
    });
    
    // Atualizar store automaticamente
    useStore.getState().addGoal(goal);
    
    return result;
  }
  
  async updateGoal(id: number, updates: Partial<Goal>): Promise<Goal> {
    const result = await this.request<Goal>(`/goals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    
    // Atualizar store automaticamente
    useStore.getState().updateGoal(id, updates);
    
    return result;
  }
  
  async deleteGoal(id: number): Promise<void> {
    await this.request<void>(`/goals/${id}`, {
      method: 'DELETE',
    });
    
    // Atualizar store automaticamente
    useStore.getState().deleteGoal(id);
  }
  
  // ========== SINCRONIZAÇÃO ==========
  
  async syncData(): Promise<void> {
    const [transactions, budgets, goals, user] = await Promise.all([
      this.getTransactions(),
      this.getBudgets(),
      this.getGoals(),
      this.getUser(),
    ]);
    
    // Atualizar todo o store de uma vez
    const store = useStore.getState();
    store.setUser(user);
    
    // Limpar e recarregar transações
    transactions.forEach(t => store.addTransaction(t));
    budgets.forEach(b => store.addBudget(b));
    goals.forEach(g => store.addGoal(g));
  }
}

// ============================================
// EXPORTAÇÃO SINGLETON
// ============================================

export const apiService = new ApiService();

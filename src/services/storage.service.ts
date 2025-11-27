/**
 * SERVIÇO DE PERSISTÊNCIA - ARMAZENAMENTO LOCAL E REMOTO
 * 
 * Gerencia salvamento e sincronização de dados.
 * Integração automática com o store global.
 */

import { useStore } from '@/store';

// ============================================
// TIPOS
// ============================================

interface StorageOptions {
  encrypt?: boolean;
  compress?: boolean;
  ttl?: number; // Time to live em segundos
}

// ============================================
// SERVIÇO DE STORAGE
// ============================================

class StorageService {
  private readonly PREFIX = 'finz_';
  
  // ========== ARMAZENAMENTO LOCAL ==========
  
  set<T>(key: string, value: T, options: StorageOptions = {}): void {
    try {
      const data = {
        value,
        timestamp: Date.now(),
        ttl: options.ttl,
      };
      
      const serialized = JSON.stringify(data);
      localStorage.setItem(this.PREFIX + key, serialized);
    } catch (error) {
      console.error('Erro ao salvar no storage:', error);
    }
  }
  
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.PREFIX + key);
      
      if (!item) {
        return null;
      }
      
      const data = JSON.parse(item);
      
      // Verificar TTL
      if (data.ttl) {
        const age = (Date.now() - data.timestamp) / 1000;
        if (age > data.ttl) {
          this.remove(key);
          return null;
        }
      }
      
      return data.value;
    } catch (error) {
      console.error('Erro ao ler do storage:', error);
      return null;
    }
  }
  
  remove(key: string): void {
    localStorage.removeItem(this.PREFIX + key);
  }
  
  clear(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }
  
  // ========== SINCRONIZAÇÃO ==========
  
  async syncToCloud(): Promise<void> {
    const state = useStore.getState();
    
    try {
      const dataToSync = {
        transactions: state.transactions,
        budgets: state.budgets,
        goals: state.goals,
        preferences: state.preferences,
        timestamp: Date.now(),
      };
      
      await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSync),
      });
      
      console.log('Dados sincronizados com sucesso');
    } catch (error) {
      console.error('Erro ao sincronizar:', error);
    }
  }
  
  async syncFromCloud(): Promise<void> {
    try {
      const response = await fetch('/api/sync');
      const data = await response.json();
      
      // Atualizar store com dados da nuvem
      const state = useStore.getState();
      
      // Merge inteligente - manter dados mais recentes
      data.transactions?.forEach((t: any) => {
        const existing = state.transactions.find(tx => tx.id === t.id);
        if (!existing || new Date(t.updatedAt) > new Date(existing.updatedAt)) {
          state.updateTransaction(t.id, t);
        }
      });
      
      console.log('Dados baixados da nuvem com sucesso');
    } catch (error) {
      console.error('Erro ao baixar dados:', error);
    }
  }
  
  // ========== AUTO-SYNC ==========
  
  enableAutoSync(intervalMinutes: number = 5): void {
    setInterval(() => {
      this.syncToCloud();
    }, intervalMinutes * 60 * 1000);
  }
  
  // ========== BACKUP ==========
  
  exportData(): string {
    const state = useStore.getState();
    
    const backup = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      data: {
        user: state.user,
        transactions: state.transactions,
        budgets: state.budgets,
        goals: state.goals,
        preferences: state.preferences,
      },
    };
    
    return JSON.stringify(backup, null, 2);
  }
  
  importData(jsonData: string): void {
    try {
      const backup = JSON.parse(jsonData);
      
      if (!backup.version || !backup.data) {
        throw new Error('Formato de backup inválido');
      }
      
      const state = useStore.getState();
      
      // Restaurar dados
      if (backup.data.user) state.setUser(backup.data.user);
      if (backup.data.preferences) state.setPreferences(backup.data.preferences);
      
      // Restaurar transações
      backup.data.transactions?.forEach((t: any) => {
        state.addTransaction(t);
      });
      
      // Restaurar orçamentos
      backup.data.budgets?.forEach((b: any) => {
        state.addBudget(b);
      });
      
      // Restaurar metas
      backup.data.goals?.forEach((g: any) => {
        state.addGoal(g);
      });
      
      console.log('Backup restaurado com sucesso');
    } catch (error) {
      console.error('Erro ao importar backup:', error);
      throw error;
    }
  }
  
  // ========== CACHE ==========
  
  cacheApiResponse<T>(endpoint: string, data: T, ttl: number = 300): void {
    this.set(`cache_${endpoint}`, data, { ttl });
  }
  
  getCachedApiResponse<T>(endpoint: string): T | null {
    return this.get<T>(`cache_${endpoint}`);
  }
}

// ============================================
// EXPORTAÇÃO SINGLETON
// ============================================

export const storageService = new StorageService();

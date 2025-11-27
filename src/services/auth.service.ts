/**
 * SERVIÇO DE AUTENTICAÇÃO - GERENCIAMENTO CENTRALIZADO
 * 
 * Controla login, logout e sessão do usuário.
 * Integração automática com o store global.
 */

import { useStore } from '@/store';
import type { UserData } from '@/store';

// ============================================
// TIPOS
// ============================================

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData extends LoginCredentials {
  name: string;
  phone: string;
}

interface AuthResponse {
  user: UserData;
  token: string;
}

// ============================================
// SERVIÇO DE AUTENTICAÇÃO
// ============================================

class AuthService {
  private readonly TOKEN_KEY = 'finz-auth-token';
  
  // ========== LOGIN ==========
  
  async login(credentials: LoginCredentials): Promise<UserData> {
    const { setLoading, setError, setUser } = useStore.getState();
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) {
        throw new Error('Credenciais inválidas');
      }
      
      const data: AuthResponse = await response.json();
      
      // Salvar token
      this.setToken(data.token);
      
      // Atualizar store
      setUser(data.user);
      
      return data.user;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer login';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }
  
  // ========== REGISTRO ==========
  
  async register(data: RegisterData): Promise<UserData> {
    const { setLoading, setError, setUser } = useStore.getState();
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Erro ao criar conta');
      }
      
      const result: AuthResponse = await response.json();
      
      // Salvar token
      this.setToken(result.token);
      
      // Atualizar store
      setUser(result.user);
      
      return result.user;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao registrar';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }
  
  // ========== LOGOUT ==========
  
  logout(): void {
    const { logout } = useStore.getState();
    
    // Remover token
    this.removeToken();
    
    // Limpar store
    logout();
  }
  
  // ========== VERIFICAR SESSÃO ==========
  
  async checkSession(): Promise<boolean> {
    const token = this.getToken();
    
    if (!token) {
      return false;
    }
    
    try {
      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        this.logout();
        return false;
      }
      
      const data: { user: UserData } = await response.json();
      useStore.getState().setUser(data.user);
      
      return true;
    } catch (error) {
      this.logout();
      return false;
    }
  }
  
  // ========== GERENCIAMENTO DE TOKEN ==========
  
  private setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }
  
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }
  
  private removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }
  
  // ========== HELPERS ==========
  
  isAuthenticated(): boolean {
    return useStore.getState().isAuthenticated;
  }
  
  getCurrentUser(): UserData | null {
    return useStore.getState().user;
  }
}

// ============================================
// EXPORTAÇÃO SINGLETON
// ============================================

export const authService = new AuthService();

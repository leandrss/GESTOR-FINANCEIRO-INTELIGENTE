// Sistema de autenticação local com criptografia
import { User, SubscriptionStatus } from './types';

const STORAGE_KEY = 'finz_users';
const SESSION_KEY = 'finz_session';

// Função simples de hash para senhas (em produção, use bcrypt)
const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Obter todos os usuários
const getUsers = (): User[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

// Salvar usuários
const saveUsers = (users: User[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

// Registrar novo usuário
export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<{ success: boolean; message: string; user?: User }> => {
  const users = getUsers();
  
  // Verificar se email já existe
  if (users.find(u => u.email === email)) {
    return { success: false, message: 'Este e-mail já está cadastrado' };
  }

  // Criar novo usuário
  const hashedPassword = await hashPassword(password);
  const newUser: User = {
    id: Date.now().toString(),
    name,
    email,
    password: hashedPassword,
    createdAt: new Date().toISOString(),
    subscription: {
      status: 'inactive',
      plan: 'free',
    },
  };

  users.push(newUser);
  saveUsers(users);

  return { success: true, message: 'Conta criada com sucesso!', user: newUser };
};

// Login
export const loginUser = async (
  email: string,
  password: string,
  rememberMe: boolean = false
): Promise<{ success: boolean; message: string; user?: User }> => {
  const users = getUsers();
  const hashedPassword = await hashPassword(password);
  
  const user = users.find(u => u.email === email && u.password === hashedPassword);
  
  if (!user) {
    return { success: false, message: 'E-mail ou senha incorretos' };
  }

  // Criar sessão
  const session = {
    userId: user.id,
    email: user.email,
    rememberMe,
    expiresAt: rememberMe 
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 dias
      : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 1 dia
  };
  
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));

  return { success: true, message: 'Login realizado com sucesso!', user };
};

// Verificar sessão ativa
export const checkSession = (): User | null => {
  if (typeof window === 'undefined') return null;
  
  const sessionData = localStorage.getItem(SESSION_KEY);
  if (!sessionData) return null;

  const session = JSON.parse(sessionData);
  
  // Verificar se sessão expirou
  if (new Date(session.expiresAt) < new Date()) {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }

  // Buscar usuário
  const users = getUsers();
  const user = users.find(u => u.id === session.userId);
  
  return user || null;
};

// Logout
export const logoutUser = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_KEY);
};

// Atualizar dados do usuário
export const updateUser = (userId: string, updates: Partial<User>): boolean => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === userId);
  
  if (index === -1) return false;

  users[index] = { ...users[index], ...updates };
  saveUsers(users);
  
  return true;
};

// Atualizar status da assinatura
export const updateSubscription = (
  userId: string,
  status: SubscriptionStatus,
  nextBillingDate?: string
): boolean => {
  const users = getUsers();
  const user = users.find(u => u.id === userId);
  
  if (!user) return false;

  user.subscription.status = status;
  user.subscription.startDate = user.subscription.startDate || new Date().toISOString();
  
  if (nextBillingDate) {
    user.subscription.nextBillingDate = nextBillingDate;
  }

  if (status === 'active') {
    user.subscription.plan = 'premium';
  }

  saveUsers(users);
  return true;
};

// Recuperação de senha (simula envio de e-mail)
export const requestPasswordReset = (email: string): { success: boolean; message: string } => {
  const users = getUsers();
  const user = users.find(u => u.email === email);
  
  if (!user) {
    return { success: false, message: 'E-mail não encontrado' };
  }

  // Em produção, aqui enviaria um e-mail real
  console.log(`E-mail de recuperação enviado para: ${email}`);
  
  return { 
    success: true, 
    message: 'Instruções de recuperação enviadas para seu e-mail' 
  };
};

// Validar força da senha
export const validatePasswordStrength = (password: string): {
  strength: 'weak' | 'medium' | 'strong';
  message: string;
} => {
  if (password.length < 6) {
    return { strength: 'weak', message: 'Senha muito curta (mínimo 6 caracteres)' };
  }

  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 1) {
    return { strength: 'weak', message: 'Senha fraca' };
  } else if (score <= 2) {
    return { strength: 'medium', message: 'Senha média' };
  } else {
    return { strength: 'strong', message: 'Senha forte' };
  }
};

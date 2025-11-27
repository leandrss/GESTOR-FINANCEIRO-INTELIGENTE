// ============================================
// FUNÇÕES DE BANCO DE DADOS - FINZ
// ============================================

import { supabase } from './supabase';
import type { 
  User, 
  FinancialEntry, 
  Boleto, 
  Subscription,
  DashboardStats 
} from './types';

// ============================================
// USUÁRIOS
// ============================================

export async function createUser(userData: Omit<User, 'id' | 'createdAt'>) {
  const { data, error } = await supabase
    .from('users')
    .insert([userData])
    .select()
    .single();

  if (error) throw error;
  return data as User;
}

export async function getUserById(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data as User;
}

export async function updateUser(userId: string, updates: Partial<User>) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data as User;
}

// ============================================
// LANÇAMENTOS FINANCEIROS
// ============================================

export async function createFinancialEntry(entry: Omit<FinancialEntry, 'id' | 'createdAt'>) {
  const { data, error } = await supabase
    .from('financial_entries')
    .insert([entry])
    .select()
    .single();

  if (error) throw error;
  return data as FinancialEntry;
}

export async function getFinancialEntries(
  userId: string,
  filters?: {
    accountType?: 'cpf' | 'cnpj';
    type?: 'income' | 'expense';
    startDate?: Date;
    endDate?: Date;
  }
) {
  let query = supabase
    .from('financial_entries')
    .select('*')
    .eq('userId', userId)
    .order('date', { ascending: false });

  if (filters?.accountType) {
    query = query.eq('accountType', filters.accountType);
  }

  if (filters?.type) {
    query = query.eq('type', filters.type);
  }

  if (filters?.startDate) {
    query = query.gte('date', filters.startDate.toISOString());
  }

  if (filters?.endDate) {
    query = query.lte('date', filters.endDate.toISOString());
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as FinancialEntry[];
}

export async function deleteFinancialEntry(entryId: string) {
  const { error } = await supabase
    .from('financial_entries')
    .delete()
    .eq('id', entryId);

  if (error) throw error;
}

// ============================================
// BOLETOS
// ============================================

export async function createBoleto(boleto: Omit<Boleto, 'id' | 'createdAt'>) {
  const { data, error } = await supabase
    .from('boletos')
    .insert([boleto])
    .select()
    .single();

  if (error) throw error;
  return data as Boleto;
}

export async function getBoletos(
  userId: string,
  filters?: {
    accountType?: 'cpf' | 'cnpj';
    status?: 'pending' | 'paid' | 'overdue' | 'cancelled';
  }
) {
  let query = supabase
    .from('boletos')
    .select('*')
    .eq('userId', userId)
    .order('dueDate', { ascending: true });

  if (filters?.accountType) {
    query = query.eq('accountType', filters.accountType);
  }

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as Boleto[];
}

export async function updateBoletoStatus(
  boletoId: string,
  status: 'pending' | 'paid' | 'overdue' | 'cancelled',
  paidAt?: Date
) {
  const updates: any = { status };
  if (paidAt) updates.paidAt = paidAt;

  const { data, error } = await supabase
    .from('boletos')
    .update(updates)
    .eq('id', boletoId)
    .select()
    .single();

  if (error) throw error;
  return data as Boleto;
}

// ============================================
// ASSINATURAS
// ============================================

export async function createSubscription(subscription: Omit<Subscription, 'id'>) {
  const { data, error } = await supabase
    .from('subscriptions')
    .insert([subscription])
    .select()
    .single();

  if (error) throw error;
  return data as Subscription;
}

export async function getActiveSubscription(userId: string) {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('userId', userId)
    .eq('status', 'active')
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
  return data as Subscription | null;
}

export async function updateSubscription(
  subscriptionId: string,
  updates: Partial<Subscription>
) {
  const { data, error } = await supabase
    .from('subscriptions')
    .update(updates)
    .eq('id', subscriptionId)
    .select()
    .single();

  if (error) throw error;
  return data as Subscription;
}

// ============================================
// DASHBOARD STATS
// ============================================

export async function getDashboardStats(
  userId: string,
  accountType?: 'cpf' | 'cnpj'
): Promise<DashboardStats> {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  // Buscar todas as entradas
  let allEntriesQuery = supabase
    .from('financial_entries')
    .select('*')
    .eq('userId', userId);

  if (accountType) {
    allEntriesQuery = allEntriesQuery.eq('accountType', accountType);
  }

  const { data: allEntries, error: allError } = await allEntriesQuery;
  if (allError) throw allError;

  // Buscar entradas do mês
  let monthEntriesQuery = supabase
    .from('financial_entries')
    .select('*')
    .eq('userId', userId)
    .gte('date', firstDayOfMonth.toISOString())
    .lte('date', lastDayOfMonth.toISOString());

  if (accountType) {
    monthEntriesQuery = monthEntriesQuery.eq('accountType', accountType);
  }

  const { data: monthEntries, error: monthError } = await monthEntriesQuery;
  if (monthError) throw monthError;

  // Buscar boletos
  let boletosQuery = supabase
    .from('boletos')
    .select('*')
    .eq('userId', userId);

  if (accountType) {
    boletosQuery = boletosQuery.eq('accountType', accountType);
  }

  const { data: boletos, error: boletosError } = await boletosQuery;
  if (boletosError) throw boletosError;

  // Calcular totais
  const totalIncome = allEntries
    ?.filter(e => e.type === 'income')
    .reduce((sum, e) => sum + e.amount, 0) || 0;

  const totalExpenses = allEntries
    ?.filter(e => e.type === 'expense')
    .reduce((sum, e) => sum + e.amount, 0) || 0;

  const monthlyIncome = monthEntries
    ?.filter(e => e.type === 'income')
    .reduce((sum, e) => sum + e.amount, 0) || 0;

  const monthlyExpenses = monthEntries
    ?.filter(e => e.type === 'expense')
    .reduce((sum, e) => sum + e.amount, 0) || 0;

  const pendingBoletos = boletos?.filter(b => b.status === 'pending').length || 0;
  const overdueBoletos = boletos?.filter(b => b.status === 'overdue').length || 0;

  return {
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
    monthlyIncome,
    monthlyExpenses,
    monthlyBalance: monthlyIncome - monthlyExpenses,
    pendingBoletos,
    overdueBoletos,
  };
}

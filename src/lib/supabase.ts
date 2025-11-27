import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos do banco de dados
export interface User {
  id: string;
  name: string;
  email: string;
  cpf?: string;
  cnpj?: string;
  phone: string;
  plan: 'free' | 'premium';
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  status: 'active' | 'inactive' | 'cancelled' | 'pending';
  plan: 'free' | 'premium';
  price: number;
  start_date: string;
  end_date?: string;
  payment_method?: string;
  created_at: string;
}

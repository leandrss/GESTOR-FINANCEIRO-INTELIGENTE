// Tipos do sistema

export type SubscriptionStatus = 'active' | 'inactive' | 'pending' | 'expired';

export interface Subscription {
  status: SubscriptionStatus;
  plan: 'free' | 'premium';
  startDate?: string;
  nextBillingDate?: string;
  canceledAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
  subscription: Subscription;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: Date;
  userId?: string;
}

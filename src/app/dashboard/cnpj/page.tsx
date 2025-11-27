"use client";

import DashboardLayout from "@/components/custom/DashboardLayout";
import { Building2, TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart, Package } from "lucide-react";

export default function DashboardCNPJPage() {
  // Dados mockados - em produção, viriam da API
  const stats = {
    revenue: 45000.00,
    expenses: 28500.00,
    profit: 16500.00,
    sales: 127,
    customers: 45,
    products: 23
  };

  const recentSales = [
    { id: 1, customer: 'João Silva', product: 'Produto A', amount: 350.00, date: '2024-01-15', status: 'paid' },
    { id: 2, customer: 'Maria Santos', product: 'Serviço B', amount: 1200.00, date: '2024-01-15', status: 'paid' },
    { id: 3, customer: 'Pedro Costa', product: 'Produto C', amount: 580.00, date: '2024-01-14', status: 'pending' },
    { id: 4, customer: 'Ana Lima', product: 'Produto A', amount: 350.00, date: '2024-01-14', status: 'paid' },
    { id: 5, customer: 'Carlos Souza', product: 'Serviço D', amount: 2500.00, date: '2024-01-13', status: 'paid' },
  ];

  return (
    <DashboardLayout accountType="cnpj">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#0D7377] rounded-xl flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Empresarial</h1>
            <p className="text-gray-600">Visão geral do seu negócio</p>
          </div>
        </div>

        {/* Company Info */}
        <div className="bg-gradient-to-r from-[#0D7377] to-[#14FFEC] rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">CNPJ: 12.345.678/0001-90</p>
              <h2 className="text-2xl font-bold">Empresa Exemplo LTDA</h2>
              <p className="text-sm opacity-90 mt-1">Nome Fantasia: Exemplo Corp</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90 mb-1">Faturamento Mensal</p>
              <p className="text-3xl font-bold">R$ {stats.revenue.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Receitas */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600">Receitas</span>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">R$ {stats.revenue.toFixed(2)}</p>
            <p className="text-sm text-green-600">+18% vs mês anterior</p>
          </div>

          {/* Despesas */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600">Despesas</span>
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">R$ {stats.expenses.toFixed(2)}</p>
            <p className="text-sm text-red-600">+5% vs mês anterior</p>
          </div>

          {/* Lucro */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600">Lucro Líquido</span>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">R$ {stats.profit.toFixed(2)}</p>
            <p className="text-sm text-blue-600">Margem: 36.7%</p>
          </div>

          {/* Vendas */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600">Vendas</span>
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{stats.sales}</p>
            <p className="text-sm text-gray-600">Este mês</p>
          </div>

          {/* Clientes */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600">Clientes Ativos</span>
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{stats.customers}</p>
            <p className="text-sm text-gray-600">+8 novos este mês</p>
          </div>

          {/* Produtos */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600">Produtos/Serviços</span>
              <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-teal-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{stats.products}</p>
            <p className="text-sm text-gray-600">Cadastrados</p>
          </div>
        </div>

        {/* Recent Sales */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Vendas Recentes</h2>
            <p className="text-sm text-gray-600 mt-1">Últimas transações registradas</p>
          </div>
          <div className="divide-y divide-gray-200">
            {recentSales.map((sale) => (
              <div key={sale.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#0D7377]/10 rounded-full flex items-center justify-center">
                      <ShoppingCart className="w-6 h-6 text-[#0D7377]" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{sale.customer}</p>
                      <p className="text-sm text-gray-600">{sale.product} • {sale.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">R$ {sale.amount.toFixed(2)}</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      sale.status === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {sale.status === 'paid' ? 'Pago' : 'Pendente'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <button className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all text-left group">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
              <ShoppingCart className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Nova Venda</h3>
            <p className="text-sm text-gray-600">Registrar venda</p>
          </button>

          <button className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all text-left group">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-200 transition-colors">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Nova Despesa</h3>
            <p className="text-sm text-gray-600">Registrar custo</p>
          </button>

          <button className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all text-left group">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Clientes</h3>
            <p className="text-sm text-gray-600">Gerenciar clientes</p>
          </button>

          <button className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all text-left group">
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-teal-200 transition-colors">
              <Package className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Produtos</h3>
            <p className="text-sm text-gray-600">Gerenciar catálogo</p>
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

"use client";

import DashboardLayout from "@/components/custom/DashboardLayout";
import { BarChart3, TrendingUp, TrendingDown, Calendar, Download, Filter } from "lucide-react";

export default function RelatoriosPage() {
  // Dados mockados - em produção, viriam da API
  const monthlyData = [
    { month: 'Jan', income: 5000, expenses: 1760 },
    { month: 'Fev', income: 5200, expenses: 1850 },
    { month: 'Mar', income: 4800, expenses: 1920 },
    { month: 'Abr', income: 5500, expenses: 1680 },
    { month: 'Mai', income: 5300, expenses: 1790 },
    { month: 'Jun', income: 5800, expenses: 1850 },
  ];

  const categoryExpenses = [
    { category: 'Alimentação', amount: 580.50, percentage: 33 },
    { category: 'Transporte', amount: 320.00, percentage: 18 },
    { category: 'Moradia', amount: 450.00, percentage: 26 },
    { category: 'Lazer', amount: 210.00, percentage: 12 },
    { category: 'Outros', amount: 199.50, percentage: 11 },
  ];

  const insights = [
    {
      type: 'positive',
      title: 'Economia em Transporte',
      description: 'Você gastou 15% menos com transporte este mês comparado ao anterior.'
    },
    {
      type: 'warning',
      title: 'Gastos com Alimentação',
      description: 'Seus gastos com alimentação aumentaram 8% este mês.'
    },
    {
      type: 'info',
      title: 'Meta de Economia',
      description: 'Você está 85% próximo da sua meta de economia mensal de R$ 2.000.'
    },
  ];

  return (
    <DashboardLayout accountType="cpf">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Relatórios</h1>
            <p className="text-gray-600">Análise detalhada das suas finanças</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filtros</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#0D7377] text-white rounded-lg hover:bg-[#0D7377]/90 transition-colors">
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">Exportar PDF</span>
            </button>
          </div>
        </div>

        {/* Period Selector */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <Calendar className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-600">Período:</span>
            <select className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#0D7377]">
              <option>Últimos 6 meses</option>
              <option>Últimos 3 meses</option>
              <option>Este mês</option>
              <option>Este ano</option>
              <option>Personalizado</option>
            </select>
          </div>
        </div>

        {/* Monthly Comparison Chart */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Evolução Mensal</h2>
            <p className="text-sm text-gray-600">Comparação de receitas e despesas</p>
          </div>

          {/* Simple Bar Chart Visualization */}
          <div className="space-y-4">
            {monthlyData.map((data) => {
              const maxValue = Math.max(...monthlyData.map(d => Math.max(d.income, d.expenses)));
              const incomeWidth = (data.income / maxValue) * 100;
              const expensesWidth = (data.expenses / maxValue) * 100;

              return (
                <div key={data.month} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700 w-12">{data.month}</span>
                    <div className="flex-1 mx-4 space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                          <div
                            className="bg-green-500 h-full rounded-full flex items-center justify-end pr-2"
                            style={{ width: `${incomeWidth}%` }}
                          >
                            <span className="text-xs font-medium text-white">R$ {data.income}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                          <div
                            className="bg-red-500 h-full rounded-full flex items-center justify-end pr-2"
                            style={{ width: `${expensesWidth}%` }}
                          >
                            <span className="text-xs font-medium text-white">R$ {data.expenses}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-600">Receitas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm text-gray-600">Despesas</span>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Despesas por Categoria</h2>
            <p className="text-sm text-gray-600">Distribuição dos seus gastos</p>
          </div>

          <div className="space-y-4">
            {categoryExpenses.map((item) => (
              <div key={item.category} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">{item.category}</span>
                  <span className="text-gray-900 font-semibold">R$ {item.amount.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-[#0D7377] h-full rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Insights Inteligentes</h2>
            <p className="text-sm text-gray-600">Análises personalizadas para você</p>
          </div>

          <div className="space-y-4">
            {insights.map((insight, index) => {
              const config = {
                positive: {
                  bg: 'bg-green-50',
                  border: 'border-green-200',
                  icon: TrendingUp,
                  iconColor: 'text-green-600',
                  iconBg: 'bg-green-100'
                },
                warning: {
                  bg: 'bg-orange-50',
                  border: 'border-orange-200',
                  icon: TrendingDown,
                  iconColor: 'text-orange-600',
                  iconBg: 'bg-orange-100'
                },
                info: {
                  bg: 'bg-blue-50',
                  border: 'border-blue-200',
                  icon: BarChart3,
                  iconColor: 'text-blue-600',
                  iconBg: 'bg-blue-100'
                }
              }[insight.type];

              const Icon = config.icon;

              return (
                <div
                  key={index}
                  className={`${config.bg} ${config.border} border rounded-xl p-4 flex items-start gap-4`}
                >
                  <div className={`${config.iconBg} w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${config.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{insight.title}</h3>
                    <p className="text-sm text-gray-600">{insight.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium opacity-90">Maior Receita</span>
            </div>
            <p className="text-3xl font-bold mb-1">R$ 5.800</p>
            <p className="text-sm opacity-90">Junho 2024</p>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium opacity-90">Maior Despesa</span>
            </div>
            <p className="text-3xl font-bold mb-1">R$ 1.920</p>
            <p className="text-sm opacity-90">Março 2024</p>
          </div>

          <div className="bg-gradient-to-br from-[#0D7377] to-[#14FFEC] rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium opacity-90">Média Mensal</span>
            </div>
            <p className="text-3xl font-bold mb-1">R$ 3.433</p>
            <p className="text-sm opacity-90">Saldo médio</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

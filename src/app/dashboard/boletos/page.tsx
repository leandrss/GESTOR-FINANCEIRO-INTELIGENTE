"use client";

import DashboardLayout from "@/components/custom/DashboardLayout";
import { FileText, Calendar, DollarSign, AlertCircle, CheckCircle2, Clock, Download, ExternalLink } from "lucide-react";

export default function BoletosPage() {
  // Dados mockados - em produção, viriam da API
  const boletos = [
    {
      id: 1,
      issuer: 'Energia Elétrica',
      amount: 180.50,
      dueDate: '2024-01-20',
      status: 'pending',
      barcode: '23793.38128 60000.123456 78901.234567 8 12340000018050',
      pixQRCode: 'https://example.com/qrcode1.png'
    },
    {
      id: 2,
      issuer: 'Internet Fibra',
      amount: 120.00,
      dueDate: '2024-01-22',
      status: 'pending',
      barcode: '23793.38128 60000.234567 78901.345678 9 12340000012000',
      pixQRCode: 'https://example.com/qrcode2.png'
    },
    {
      id: 3,
      issuer: 'Água e Saneamento',
      amount: 85.30,
      dueDate: '2024-01-25',
      status: 'pending',
      barcode: '23793.38128 60000.345678 78901.456789 1 12340000008530',
      pixQRCode: 'https://example.com/qrcode3.png'
    },
    {
      id: 4,
      issuer: 'Condomínio',
      amount: 450.00,
      dueDate: '2024-01-15',
      status: 'overdue',
      barcode: '23793.38128 60000.456789 78901.567890 2 12340000045000',
      pixQRCode: 'https://example.com/qrcode4.png'
    },
    {
      id: 5,
      issuer: 'Cartão de Crédito',
      amount: 1250.00,
      dueDate: '2024-01-10',
      status: 'paid',
      barcode: '23793.38128 60000.567890 78901.678901 3 12340000125000',
      paidAt: '2024-01-09'
    },
  ];

  const stats = {
    pending: boletos.filter(b => b.status === 'pending').length,
    overdue: boletos.filter(b => b.status === 'overdue').length,
    paid: boletos.filter(b => b.status === 'paid').length,
    totalPending: boletos
      .filter(b => b.status === 'pending' || b.status === 'overdue')
      .reduce((sum, b) => sum + b.amount, 0)
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Pendente',
          color: 'bg-yellow-100 text-yellow-800',
          icon: Clock
        };
      case 'overdue':
        return {
          label: 'Vencido',
          color: 'bg-red-100 text-red-800',
          icon: AlertCircle
        };
      case 'paid':
        return {
          label: 'Pago',
          color: 'bg-green-100 text-green-800',
          icon: CheckCircle2
        };
      default:
        return {
          label: 'Desconhecido',
          color: 'bg-gray-100 text-gray-800',
          icon: FileText
        };
    }
  };

  return (
    <DashboardLayout accountType="cpf">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Boletos</h1>
          <p className="text-gray-600">Gerencie seus boletos automaticamente</p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600">Pendentes</span>
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600">Vencidos</span>
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.overdue}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600">Pagos</span>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.paid}</p>
          </div>

          <div className="bg-gradient-to-br from-[#0D7377] to-[#14FFEC] rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium opacity-90">Total a Pagar</span>
              <DollarSign className="w-5 h-5 opacity-90" />
            </div>
            <p className="text-3xl font-bold">R$ {stats.totalPending.toFixed(2)}</p>
          </div>
        </div>

        {/* Boletos List */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Todos os Boletos</h2>
                <p className="text-sm text-gray-600 mt-1">Boletos encontrados automaticamente</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Exportar</span>
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {boletos.map((boleto) => {
              const statusConfig = getStatusConfig(boleto.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div key={boleto.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Left: Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-[#0D7377]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-[#0D7377]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{boleto.issuer}</h3>
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {statusConfig.label}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>Vencimento: {boleto.dueDate}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            <span className="font-semibold">R$ {boleto.amount.toFixed(2)}</span>
                          </div>
                        </div>
                        {boleto.status === 'paid' && boleto.paidAt && (
                          <p className="text-xs text-green-600 mt-1">Pago em {boleto.paidAt}</p>
                        )}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    {boleto.status !== 'paid' && (
                      <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 bg-[#0D7377] text-white rounded-lg hover:bg-[#0D7377]/90 transition-all hover:scale-105 shadow-md">
                          <ExternalLink className="w-4 h-4" />
                          <span className="text-sm font-medium">Pagar com Pix</span>
                        </button>
                        <button className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Barcode (collapsible) */}
                  {boleto.status !== 'paid' && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">Código de barras:</p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 px-3 py-2 bg-gray-50 rounded text-xs font-mono text-gray-700 overflow-x-auto">
                          {boleto.barcode}
                        </code>
                        <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-xs font-medium">
                          Copiar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

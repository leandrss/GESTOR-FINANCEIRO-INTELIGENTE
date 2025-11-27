"use client";

import DashboardLayout from "@/components/custom/DashboardLayout";
import SubscriptionManager from "@/components/custom/SubscriptionManager";
import { User, Mail, Phone, CreditCard, Shield, Bell, Smartphone, LogOut, CheckCircle2, Crown } from "lucide-react";
import { useState } from "react";

export default function PerfilPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "subscription">("profile");

  // Dados mockados - em produção, viriam da API
  const user = {
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '(11) 99999-9999',
    cpf: '123.456.789-00',
    cnpj: '12.345.678/0001-90',
    subscriptionStatus: 'active',
    subscriptionPlan: 'both',
    subscriptionStartDate: '2024-01-01',
    nextBillingDate: '2024-02-01',
    paymentMethod: 'Cartão de Crédito ****1234'
  };

  return (
    <DashboardLayout accountType="cpf">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Perfil e Configurações</h1>
          <p className="text-gray-600">Gerencie suas informações e preferências</p>
        </div>

        {/* Profile Card */}
        <div className="bg-gradient-to-br from-[#0D7377] to-[#14FFEC] rounded-2xl p-8 text-white shadow-lg">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-4xl font-bold border-4 border-white/30">
              JS
            </div>
            <div className="text-center sm:text-left flex-1">
              <h2 className="text-3xl font-bold mb-2">{user.name}</h2>
              <p className="text-lg opacity-90 mb-4">{user.email}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  Assinante Ativo
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium">
                  <Shield className="w-4 h-4" />
                  Plano Completo
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex-1 px-6 py-4 font-semibold transition-colors relative ${
                  activeTab === "profile"
                    ? "text-[#0D7377] bg-[#0D7377]/5"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <User className="w-5 h-5" />
                  <span>Informações Pessoais</span>
                </div>
                {activeTab === "profile" && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#0D7377]" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("subscription")}
                className={`flex-1 px-6 py-4 font-semibold transition-colors relative ${
                  activeTab === "subscription"
                    ? "text-[#0D7377] bg-[#0D7377]/5"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Crown className="w-5 h-5" />
                  <span>Assinatura</span>
                </div>
                {activeTab === "subscription" && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#0D7377]" />
                )}
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === "profile" ? (
              <div className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Dados Cadastrais</h2>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome completo
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={user.name}
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0D7377]"
                          readOnly
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        E-mail
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          value={user.email}
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0D7377]"
                          readOnly
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Telefone (WhatsApp)
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          value={user.phone}
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0D7377]"
                          readOnly
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CPF
                      </label>
                      <div className="relative">
                        <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={user.cpf}
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0D7377]"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>

                  <button className="mt-6 px-6 py-3 bg-[#0D7377] text-white rounded-lg font-medium hover:bg-[#0D7377]/90 transition-colors">
                    Editar Informações
                  </button>
                </div>

                {/* Subscription Status */}
                <div className="pt-6 border-t border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Status da Assinatura</h2>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600 mb-1">Status da Assinatura</p>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <span className="text-lg font-bold text-gray-900">Ativa</span>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600 mb-1">Plano Atual</p>
                      <p className="text-lg font-bold text-gray-900">Completo (CPF + CNPJ)</p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600 mb-1">Início da Assinatura</p>
                      <p className="text-lg font-bold text-gray-900">{user.subscriptionStartDate}</p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600 mb-1">Próxima Cobrança</p>
                      <p className="text-lg font-bold text-gray-900">{user.nextBillingDate}</p>
                    </div>
                  </div>

                  <div className="mt-6 bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="text-sm text-gray-600">Método de Pagamento</p>
                          <p className="font-semibold text-gray-900">{user.paymentMethod}</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                        Alterar
                      </button>
                    </div>
                  </div>
                </div>

                {/* Notifications */}
                <div className="pt-6 border-t border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Notificações</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-900">Alertas de Gastos</p>
                          <p className="text-sm text-gray-600">Receba notificações quando ultrapassar metas</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0D7377]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0D7377]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-900">Notificações WhatsApp</p>
                          <p className="text-sm text-gray-600">Confirmações de registro via WhatsApp</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0D7377]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0D7377]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-900">E-mail Semanal</p>
                          <p className="text-sm text-gray-600">Resumo semanal das suas finanças</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0D7377]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0D7377]"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="pt-6 border-t border-red-200">
                  <h2 className="text-xl font-bold text-red-600 mb-4">Zona de Perigo</h2>
                  <div className="space-y-4">
                    <button className="flex items-center gap-3 w-full px-6 py-4 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors border border-red-200">
                      <LogOut className="w-5 h-5" />
                      <span>Sair da Conta</span>
                    </button>
                    <button className="flex items-center gap-3 w-full px-6 py-4 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors border border-red-200">
                      <Shield className="w-5 h-5" />
                      <span>Excluir Conta Permanentemente</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Gerencie sua Assinatura</h2>
                <p className="text-gray-600 mb-8">
                  Escolha o plano ideal para suas necessidades ou altere seu plano atual
                </p>
                <SubscriptionManager 
                  currentPlan={user.subscriptionPlan}
                  subscriptionStatus={user.subscriptionStatus}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

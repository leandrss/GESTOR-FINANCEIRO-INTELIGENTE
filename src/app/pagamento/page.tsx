"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Shield, BarChart3, CheckCircle2, CreditCard, ExternalLink, User, Building2 } from "lucide-react";

export default function PagamentoPage() {
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'success'>('pending');
  const [selectedPlan, setSelectedPlan] = useState<'cpf' | 'cnpj'>('cpf');

  const handleFinalizarPagamento = () => {
    setLoading(true);
    // Redirecionar para o único link de pagamento do Stripe
    window.location.href = 'https://buy.stripe.com/dRm6oIgc91rXeY7dzM7AI01';
  };

  // Simular retorno do webhook (em produção, isso viria do backend)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    
    if (status === 'approved') {
      setPaymentStatus('success');
      // Redirecionar para dashboard correspondente após 3 segundos
      setTimeout(() => {
        if (selectedPlan === 'cnpj') {
          window.location.href = '/dashboard/cnpj';
        } else {
          window.location.href = '/dashboard';
        }
      }, 3000);
    }
  }, [selectedPlan]);

  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0D7377] via-[#0A5C5F] to-[#1A1A1A] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl text-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Pagamento Confirmado!</h1>
            <p className="text-gray-300 mb-6">
              Sua assinatura foi ativada com sucesso. Redirecionando para o dashboard...
            </p>
            <div className="animate-spin w-8 h-8 border-4 border-[#14FFEC] border-t-transparent rounded-full mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D7377] via-[#0A5C5F] to-[#1A1A1A] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-3 mb-8">
          <div className="relative">
            <Shield className="w-12 h-12 text-[#14FFEC]" strokeWidth={2.5} />
            <div className="absolute inset-0 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" strokeWidth={3} />
            </div>
          </div>
          <span className="text-3xl font-bold text-white">FINZ</span>
        </Link>

        {/* Payment Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 sm:p-12 border border-white/20 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Complete sua assinatura
            </h1>
            <p className="text-lg text-gray-300">
              Escolha seu plano e comece a usar o FINZ agora
            </p>
          </div>

          {/* Seleção CPF ou CNPJ */}
          <div className="mb-8">
            <label className="block text-white font-semibold mb-4 text-center">
              Selecione o tipo de conta:
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedPlan('cpf')}
                className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all ${
                  selectedPlan === 'cpf'
                    ? 'bg-[#14FFEC]/20 border-[#14FFEC] shadow-lg shadow-[#14FFEC]/30'
                    : 'bg-white/5 border-white/20 hover:border-white/40'
                }`}
              >
                <User className={`w-10 h-10 ${selectedPlan === 'cpf' ? 'text-[#14FFEC]' : 'text-gray-400'}`} />
                <div className="text-center">
                  <p className={`font-bold text-lg ${selectedPlan === 'cpf' ? 'text-[#14FFEC]' : 'text-white'}`}>
                    CPF
                  </p>
                  <p className="text-sm text-gray-300">Pessoa Física</p>
                </div>
              </button>

              <button
                onClick={() => setSelectedPlan('cnpj')}
                className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all ${
                  selectedPlan === 'cnpj'
                    ? 'bg-[#14FFEC]/20 border-[#14FFEC] shadow-lg shadow-[#14FFEC]/30'
                    : 'bg-white/5 border-white/20 hover:border-white/40'
                }`}
              >
                <Building2 className={`w-10 h-10 ${selectedPlan === 'cnpj' ? 'text-[#14FFEC]' : 'text-gray-400'}`} />
                <div className="text-center">
                  <p className={`font-bold text-lg ${selectedPlan === 'cnpj' ? 'text-[#14FFEC]' : 'text-white'}`}>
                    CNPJ
                  </p>
                  <p className="text-sm text-gray-300">Pessoa Jurídica</p>
                </div>
              </button>
            </div>
          </div>

          {/* Detalhes do Plano Selecionado */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-[#14FFEC]/50 mb-8">
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold text-white mb-2">
                {selectedPlan === 'cpf' ? 'Plano Pessoal (CPF)' : 'Plano Empresarial (CNPJ)'}
              </h3>
              <div className="mb-4">
                <span className="text-5xl font-bold text-[#14FFEC]">R$ 9,99</span>
                <span className="text-gray-300 text-xl">/mês</span>
              </div>
            </div>
            
            <ul className="space-y-3 text-gray-300">
              {selectedPlan === 'cpf' ? (
                <>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#14FFEC] flex-shrink-0 mt-0.5" />
                    <span>Registro via WhatsApp</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#14FFEC] flex-shrink-0 mt-0.5" />
                    <span>Boletos automáticos</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#14FFEC] flex-shrink-0 mt-0.5" />
                    <span>Relatórios inteligentes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#14FFEC] flex-shrink-0 mt-0.5" />
                    <span>Sugestões de economia com IA</span>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#14FFEC] flex-shrink-0 mt-0.5" />
                    <span>Tudo do plano Pessoal</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#14FFEC] flex-shrink-0 mt-0.5" />
                    <span>Dashboard empresarial completo</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#14FFEC] flex-shrink-0 mt-0.5" />
                    <span>Controle de vendas e despesas</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#14FFEC] flex-shrink-0 mt-0.5" />
                    <span>Fluxo de caixa detalhado</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#14FFEC] flex-shrink-0 mt-0.5" />
                    <span>Gestão de clientes e produtos</span>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Botão Finalizar Pagamento */}
          <div className="space-y-4">
            <button
              onClick={handleFinalizarPagamento}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-[#14FFEC] text-[#0D7377] rounded-xl font-bold text-lg hover:bg-[#14FFEC]/90 transition-all hover:scale-105 shadow-2xl shadow-[#14FFEC]/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CreditCard className="w-6 h-6" />
              {loading ? (
                <span>Processando...</span>
              ) : (
                <>
                  FINALIZAR PAGAMENTO
                  <ExternalLink className="w-5 h-5" />
                </>
              )}
            </button>

            <p className="text-center text-sm text-gray-400">
              Pagamento seguro processado pelo Stripe
            </p>
          </div>

          {/* Garantias */}
          <div className="mt-8 pt-8 border-t border-white/20">
            <div className="grid sm:grid-cols-3 gap-4 text-center">
              <div>
                <CheckCircle2 className="w-8 h-8 text-[#14FFEC] mx-auto mb-2" />
                <p className="text-sm text-gray-300">Cancele quando quiser</p>
              </div>
              <div>
                <CheckCircle2 className="w-8 h-8 text-[#14FFEC] mx-auto mb-2" />
                <p className="text-sm text-gray-300">Sem taxas ocultas</p>
              </div>
              <div>
                <CheckCircle2 className="w-8 h-8 text-[#14FFEC] mx-auto mb-2" />
                <p className="text-sm text-gray-300">Suporte dedicado</p>
              </div>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <Link href="/cadastro" className="text-gray-300 hover:text-white transition-colors">
            ← Voltar para cadastro
          </Link>
        </div>
      </div>
    </div>
  );
}

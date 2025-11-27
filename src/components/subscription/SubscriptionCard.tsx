"use client";

import { Check, Crown, ExternalLink } from 'lucide-react';

const MERCADO_PAGO_LINK = 'https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=506a18c60dc24295b93b2c6e0d82e9a5';

interface SubscriptionCardProps {
  onSubscribe: () => void;
}

export default function SubscriptionCard({ onSubscribe }: SubscriptionCardProps) {
  const handleSubscribe = () => {
    // Abrir link do Mercado Pago em nova aba
    window.open(MERCADO_PAGO_LINK, '_blank');
    
    // Notificar componente pai
    onSubscribe();
  };

  const benefits = [
    'Controle ilimitado de transações',
    'Interpretação inteligente de ganhos e gastos',
    'Relatórios financeiros em tempo real',
    'Backup automático na nuvem',
    'Categorização automática avançada',
    'Suporte prioritário',
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/30 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">FINZ Premium</h2>
          <p className="text-gray-300">Controle financeiro inteligente e completo</p>
        </div>

        {/* Preço */}
        <div className="text-center mb-8">
          <div className="flex items-baseline justify-center gap-2 mb-2">
            <span className="text-5xl font-bold text-white">R$ 9,99</span>
            <span className="text-gray-400 text-lg">/mês</span>
          </div>
          <p className="text-sm text-gray-400">Cancele quando quiser, sem multas</p>
        </div>

        {/* Benefícios */}
        <div className="space-y-4 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">O que está incluído:</h3>
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5">
                <Check className="w-4 h-4 text-green-400" />
              </div>
              <p className="text-gray-300">{benefit}</p>
            </div>
          ))}
        </div>

        {/* Botão de Assinatura */}
        <button
          onClick={handleSubscribe}
          className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all hover:scale-105 shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2"
        >
          Assinar por R$ 9,99/mês
          <ExternalLink className="w-5 h-5" />
        </button>

        {/* Informações de Pagamento */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Pagamento seguro via <span className="text-cyan-400 font-semibold">Mercado Pago</span>
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Você será redirecionado para completar o pagamento de forma segura
          </p>
        </div>

        {/* Garantia */}
        <div className="mt-6 bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 text-center">
          <p className="text-cyan-400 font-semibold mb-1">💎 Garantia de Satisfação</p>
          <p className="text-gray-300 text-sm">
            Cancele a qualquer momento sem complicações
          </p>
        </div>
      </div>
    </div>
  );
}

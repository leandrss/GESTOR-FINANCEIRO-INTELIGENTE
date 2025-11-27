"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { CreditCard, CheckCircle2, Loader2, ExternalLink } from "lucide-react";

// Inicializa o Stripe com sua chave pública
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_51SUlJoJwlyvvKdzAluRkEhTr9JdsbiZKETNc9T2TnbuTK5njwVxFJIglz2Qtle00ex1z0PvWs6CUKBlEwKSVq7Um00Aq75IGhJ");

interface SubscriptionManagerProps {
  currentPlan?: string;
  subscriptionStatus?: string;
}

export default function SubscriptionManager({ 
  currentPlan = "none",
  subscriptionStatus = "inactive" 
}: SubscriptionManagerProps) {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans = [
    {
      id: "cpf",
      name: "Plano CPF",
      price: "R$ 29,90",
      priceValue: 29.90,
      description: "Ideal para controle financeiro pessoal",
      features: [
        "Controle de receitas e despesas",
        "Gestão de boletos",
        "Relatórios mensais",
        "Integração WhatsApp",
        "Suporte por e-mail"
      ],
      popular: false
    },
    {
      id: "cnpj",
      name: "Plano CNPJ",
      price: "R$ 49,90",
      priceValue: 49.90,
      description: "Para pequenas empresas e MEIs",
      features: [
        "Tudo do Plano CPF",
        "Gestão empresarial",
        "Múltiplos usuários",
        "Relatórios avançados",
        "Suporte prioritário"
      ],
      popular: false
    },
    {
      id: "both",
      name: "Plano Completo",
      price: "R$ 69,90",
      priceValue: 69.90,
      description: "Melhor custo-benefício",
      features: [
        "Tudo dos planos anteriores",
        "CPF + CNPJ integrados",
        "Dashboard unificado",
        "Relatórios personalizados",
        "Suporte VIP 24/7"
      ],
      popular: true
    }
  ];

  const handleSubscribe = async (planId: string) => {
    setLoading(true);
    setSelectedPlan(planId);

    try {
      // Aqui você faria a chamada para sua API para criar uma sessão de checkout do Stripe
      // Por enquanto, vamos simular o redirecionamento
      
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId,
          priceId: getPriceId(planId), // Você precisará criar os Price IDs no Stripe Dashboard
        }),
      });

      const { sessionId } = await response.json();
      
      // Redireciona para o Checkout do Stripe
      const stripe = await stripePromise;
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          console.error("Erro ao redirecionar:", error);
          alert("Erro ao processar pagamento. Tente novamente.");
        }
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao processar assinatura. Tente novamente.");
    } finally {
      setLoading(false);
      setSelectedPlan(null);
    }
  };

  const getPriceId = (planId: string) => {
    // Estes são IDs de exemplo - você precisa criar os produtos no Stripe Dashboard
    // e substituir pelos IDs reais
    const priceIds: Record<string, string> = {
      cpf: "price_cpf_monthly",
      cnpj: "price_cnpj_monthly",
      both: "price_both_monthly"
    };
    return priceIds[planId];
  };

  return (
    <div className="space-y-6">
      {/* Status Atual */}
      {subscriptionStatus === "active" && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-semibold text-green-900">Assinatura Ativa</p>
              <p className="text-sm text-green-700">
                Você está no {plans.find(p => p.id === currentPlan)?.name || "plano atual"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Planos Disponíveis */}
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrentPlan = plan.id === currentPlan && subscriptionStatus === "active";
          const isLoading = loading && selectedPlan === plan.id;

          return (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl border-2 shadow-lg transition-all hover:shadow-xl ${
                plan.popular
                  ? "border-[#0D7377] ring-2 ring-[#0D7377]/20"
                  : "border-gray-200"
              } ${isCurrentPlan ? "opacity-75" : ""}`}
            >
              {/* Badge Popular */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-4 py-1 bg-gradient-to-r from-[#0D7377] to-[#14FFEC] text-white text-sm font-bold rounded-full shadow-lg">
                    ⭐ Mais Popular
                  </span>
                </div>
              )}

              <div className="p-6 space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                  <p className="text-sm text-gray-600">{plan.description}</p>
                  <div className="pt-4">
                    <span className="text-4xl font-bold text-[#0D7377]">{plan.price}</span>
                    <span className="text-gray-600">/mês</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#0D7377] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isCurrentPlan || loading}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                    isCurrentPlan
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : plan.popular
                      ? "bg-gradient-to-r from-[#0D7377] to-[#14FFEC] text-white hover:shadow-lg hover:scale-105"
                      : "bg-[#0D7377] text-white hover:bg-[#0D7377]/90 hover:shadow-lg"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processando...
                    </>
                  ) : isCurrentPlan ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Plano Atual
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Assinar Agora
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Informações Adicionais */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <ExternalLink className="w-5 h-5 text-blue-600" />
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-blue-900">Pagamento Seguro com Stripe</h4>
            <p className="text-sm text-blue-700">
              Todos os pagamentos são processados de forma segura através do Stripe. 
              Aceitamos cartões de crédito e débito. Você pode cancelar sua assinatura a qualquer momento.
            </p>
            <ul className="text-sm text-blue-700 space-y-1 mt-3">
              <li>✓ Cobrança mensal automática</li>
              <li>✓ Cancele quando quiser, sem multas</li>
              <li>✓ Seus dados estão protegidos</li>
              <li>✓ Suporte disponível para dúvidas</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

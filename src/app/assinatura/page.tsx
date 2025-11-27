"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, BarChart3, Crown, CheckCircle2, X, Sparkles, TrendingUp, FileText, Lock } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AssinaturaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [userPlan, setUserPlan] = useState<'free' | 'premium'>('free');
  const [userId, setUserId] = useState("");

  useEffect(() => {
    // Verificar se usuário está logado
    const storedUserId = localStorage.getItem('userId');
    const storedUserName = localStorage.getItem('userName');
    const storedUserPlan = localStorage.getItem('userPlan') as 'free' | 'premium';

    if (!storedUserId) {
      router.push('/login');
      return;
    }

    setUserId(storedUserId);
    setUserName(storedUserName || '');
    setUserPlan(storedUserPlan || 'free');
  }, [router]);

  const handleUpgradeToPremium = async () => {
    setLoading(true);

    try {
      // Atualizar plano do usuário para Premium
      const { error: updateError } = await supabase
        .from('users')
        .update({ plan: 'premium' })
        .eq('id', userId);

      if (updateError) throw updateError;

      // Criar registro de assinatura
      const { error: subscriptionError } = await supabase
        .from('subscriptions')
        .insert([
          {
            user_id: userId,
            status: 'active',
            plan: 'premium',
            price: 9.99,
            start_date: new Date().toISOString(),
            payment_method: 'credit_card',
          }
        ]);

      if (subscriptionError) throw subscriptionError;

      // Atualizar localStorage
      localStorage.setItem('userPlan', 'premium');

      alert('🎉 Parabéns! Você agora é Premium!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Erro ao fazer upgrade:', error);
      alert('Erro ao processar assinatura. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D7377] via-[#0A5C5F] to-[#1A1A1A]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-2 sm:gap-3 cursor-pointer" onClick={() => router.push('/')}>
              <div className="relative">
                <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-[#14FFEC]" strokeWidth={2.5} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={3} />
                </div>
              </div>
              <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">FINZ</span>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 text-white hover:text-[#14FFEC] transition-colors"
            >
              Voltar ao Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Saudação Personalizada */}
          {userName && (
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                Olá, {userName}! 👋
              </h1>
              <p className="text-xl text-gray-300">
                {userPlan === 'premium' 
                  ? 'Você já é Premium! Aproveite todos os benefícios.' 
                  : 'Escolha o plano ideal para você'}
              </p>
            </div>
          )}

          {/* Comparação de Planos */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Plano Free */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-xl">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-500/20 rounded-full mb-4">
                  <Shield className="w-8 h-8 text-gray-300" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Gratuito</h2>
                <div className="text-4xl font-bold text-white mb-4">
                  R$ 0<span className="text-lg text-gray-400">/mês</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#14FFEC] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Registro de transações via WhatsApp</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#14FFEC] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Dashboard básico</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#14FFEC] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Relatórios mensais simples</span>
                </div>
                <div className="flex items-start gap-3">
                  <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-400 line-through">Gerenciamento de boletos</span>
                </div>
                <div className="flex items-start gap-3">
                  <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-400 line-through">Sugestões de investimentos</span>
                </div>
              </div>

              {userPlan === 'free' && (
                <div className="bg-[#14FFEC]/10 border border-[#14FFEC]/30 rounded-lg p-4 text-center">
                  <p className="text-[#14FFEC] font-semibold">Plano Atual</p>
                </div>
              )}
            </div>

            {/* Plano Premium */}
            <div className="bg-gradient-to-br from-[#14FFEC]/20 to-[#14FFEC]/5 backdrop-blur-xl rounded-3xl p-8 border-2 border-[#14FFEC] shadow-2xl shadow-[#14FFEC]/20 relative overflow-hidden">
              {/* Badge Premium */}
              <div className="absolute top-4 right-4">
                <div className="bg-[#14FFEC] text-[#0D7377] px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                  <Crown className="w-4 h-4" />
                  POPULAR
                </div>
              </div>

              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#14FFEC]/20 rounded-full mb-4">
                  <Crown className="w-8 h-8 text-[#14FFEC]" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Premium</h2>
                <div className="text-4xl font-bold text-[#14FFEC] mb-4">
                  R$ 9,99<span className="text-lg text-gray-300">/mês</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#14FFEC] flex-shrink-0 mt-0.5" />
                  <span className="text-white font-medium">Tudo do plano Gratuito</span>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-[#14FFEC] flex-shrink-0 mt-0.5" />
                  <span className="text-white font-medium">Gerenciamento completo de boletos</span>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-[#14FFEC] flex-shrink-0 mt-0.5" />
                  <span className="text-white font-medium">Sugestões personalizadas de investimentos</span>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-[#14FFEC] flex-shrink-0 mt-0.5" />
                  <span className="text-white font-medium">Relatórios avançados e análises</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#14FFEC] flex-shrink-0 mt-0.5" />
                  <span className="text-white font-medium">Alertas automáticos de vencimentos</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#14FFEC] flex-shrink-0 mt-0.5" />
                  <span className="text-white font-medium">Suporte prioritário</span>
                </div>
              </div>

              {userPlan === 'premium' ? (
                <div className="bg-[#14FFEC]/20 border border-[#14FFEC] rounded-lg p-4 text-center">
                  <p className="text-[#14FFEC] font-bold flex items-center justify-center gap-2">
                    <Crown className="w-5 h-5" />
                    Você é Premium!
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleUpgradeToPremium}
                  disabled={loading}
                  className="w-full px-6 py-4 bg-[#14FFEC] text-[#0D7377] rounded-lg font-bold text-lg hover:bg-[#14FFEC]/90 transition-all hover:scale-105 shadow-lg shadow-[#14FFEC]/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    "Processando..."
                  ) : (
                    <>
                      <Crown className="w-5 h-5" />
                      Assinar Premium Agora
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Informações Adicionais */}
          <div className="mt-16 max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">
                Por que escolher o Premium?
              </h3>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#14FFEC]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-[#14FFEC]" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Boletos Automáticos</h4>
                    <p className="text-gray-300 text-sm">
                      Busca e organização automática de todos os seus boletos em um só lugar.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#14FFEC]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-[#14FFEC]" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Investimentos Inteligentes</h4>
                    <p className="text-gray-300 text-sm">
                      Recomendações personalizadas baseadas no seu perfil financeiro.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

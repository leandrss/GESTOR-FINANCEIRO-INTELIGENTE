"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Shield, 
  BarChart3, 
  Crown, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  FileText, 
  Lightbulb,
  Lock,
  ArrowRight,
  LogOut
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [userPlan, setUserPlan] = useState<'free' | 'premium'>('free');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se usuário está logado
    const storedUserId = localStorage.getItem('userId');
    const storedUserName = localStorage.getItem('userName');
    const storedUserPlan = localStorage.getItem('userPlan') as 'free' | 'premium';

    if (!storedUserId) {
      router.push('/login');
      return;
    }

    setUserName(storedUserName || 'Usuário');
    setUserPlan(storedUserPlan || 'free');
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userPlan');
    router.push('/');
  };

  const isPremium = userPlan === 'premium';

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0D7377] via-[#0A5C5F] to-[#1A1A1A] flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D7377] via-[#0A5C5F] to-[#1A1A1A]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative">
                <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-[#14FFEC]" strokeWidth={2.5} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={3} />
                </div>
              </div>
              <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">FINZ</span>
            </div>

            <div className="flex items-center gap-4">
              {/* Badge do Plano */}
              {isPremium ? (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#14FFEC]/20 border border-[#14FFEC] rounded-full">
                  <Crown className="w-4 h-4 text-[#14FFEC]" />
                  <span className="text-[#14FFEC] font-semibold text-sm">Premium</span>
                </div>
              ) : (
                <button
                  onClick={() => router.push('/assinatura')}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-500/20 border border-gray-400 rounded-full hover:bg-gray-500/30 transition-colors"
                >
                  <Shield className="w-4 h-4 text-gray-300" />
                  <span className="text-gray-300 font-semibold text-sm">Free</span>
                </button>
              )}

              <button
                onClick={handleLogout}
                className="p-2 text-white hover:text-red-400 transition-colors"
                title="Sair"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Saudação Personalizada */}
          <div className="mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">
              Olá, {userName}! 👋
            </h1>
            <p className="text-xl text-gray-300">
              Bem-vindo ao seu painel financeiro
            </p>
          </div>

          {/* Cards de Resumo */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* Receitas */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
                <span className="text-green-400 text-sm font-semibold">+12%</span>
              </div>
              <h3 className="text-gray-300 text-sm mb-1">Receitas</h3>
              <p className="text-3xl font-bold text-white">R$ 5.000,00</p>
            </div>

            {/* Despesas */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-red-400" />
                </div>
                <span className="text-red-400 text-sm font-semibold">-8%</span>
              </div>
              <h3 className="text-gray-300 text-sm mb-1">Despesas</h3>
              <p className="text-3xl font-bold text-white">R$ 1.760,00</p>
            </div>

            {/* Saldo */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-[#14FFEC]/20 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-[#14FFEC]" />
                </div>
                <span className="text-[#14FFEC] text-sm font-semibold">Saldo</span>
              </div>
              <h3 className="text-gray-300 text-sm mb-1">Disponível</h3>
              <p className="text-3xl font-bold text-white">R$ 3.240,00</p>
            </div>
          </div>

          {/* Funcionalidades Premium */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Gerenciamento de Boletos */}
            <div className={`bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 relative ${!isPremium && 'opacity-60'}`}>
              {!isPremium && (
                <div className="absolute top-4 right-4">
                  <Lock className="w-6 h-6 text-gray-400" />
                </div>
              )}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-[#14FFEC]/20 rounded-xl flex items-center justify-center">
                  <FileText className="w-7 h-7 text-[#14FFEC]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Gerenciamento de Boletos</h3>
                  {!isPremium && (
                    <span className="text-sm text-[#14FFEC] font-semibold">Premium</span>
                  )}
                </div>
              </div>
              <p className="text-gray-300 mb-6">
                {isPremium 
                  ? 'Gerencie todos os seus boletos em um só lugar. Busca automática e alertas de vencimento.'
                  : 'Desbloqueie o gerenciamento completo de boletos com o plano Premium.'}
              </p>
              {isPremium ? (
                <button className="w-full px-6 py-3 bg-[#14FFEC] text-[#0D7377] rounded-lg font-semibold hover:bg-[#14FFEC]/90 transition-all flex items-center justify-center gap-2">
                  Acessar Boletos
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={() => router.push('/assinatura')}
                  className="w-full px-6 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-all flex items-center justify-center gap-2 border border-white/20"
                >
                  <Crown className="w-5 h-5 text-[#14FFEC]" />
                  Fazer Upgrade
                </button>
              )}
            </div>

            {/* Sugestões de Investimentos */}
            <div className={`bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 relative ${!isPremium && 'opacity-60'}`}>
              {!isPremium && (
                <div className="absolute top-4 right-4">
                  <Lock className="w-6 h-6 text-gray-400" />
                </div>
              )}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-[#14FFEC]/20 rounded-xl flex items-center justify-center">
                  <Lightbulb className="w-7 h-7 text-[#14FFEC]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Sugestões de Investimentos</h3>
                  {!isPremium && (
                    <span className="text-sm text-[#14FFEC] font-semibold">Premium</span>
                  )}
                </div>
              </div>
              <p className="text-gray-300 mb-6">
                {isPremium 
                  ? 'Receba recomendações personalizadas de investimentos baseadas no seu perfil financeiro.'
                  : 'Desbloqueie sugestões inteligentes de investimentos com o plano Premium.'}
              </p>
              {isPremium ? (
                <button className="w-full px-6 py-3 bg-[#14FFEC] text-[#0D7377] rounded-lg font-semibold hover:bg-[#14FFEC]/90 transition-all flex items-center justify-center gap-2">
                  Ver Sugestões
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={() => router.push('/assinatura')}
                  className="w-full px-6 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-all flex items-center justify-center gap-2 border border-white/20"
                >
                  <Crown className="w-5 h-5 text-[#14FFEC]" />
                  Fazer Upgrade
                </button>
              )}
            </div>
          </div>

          {/* Banner de Upgrade (apenas para Free) */}
          {!isPremium && (
            <div className="mt-12 bg-gradient-to-br from-[#14FFEC]/20 to-[#14FFEC]/5 backdrop-blur-xl rounded-3xl p-8 border-2 border-[#14FFEC] shadow-2xl shadow-[#14FFEC]/20">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Crown className="w-6 h-6 text-[#14FFEC]" />
                    <h3 className="text-2xl font-bold text-white">Desbloqueie o Poder Premium</h3>
                  </div>
                  <p className="text-gray-300 mb-4">
                    Tenha acesso a gerenciamento de boletos, sugestões de investimentos e muito mais por apenas R$ 9,99/mês.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-gray-300">
                      <div className="w-1.5 h-1.5 bg-[#14FFEC] rounded-full"></div>
                      Gerenciamento completo de boletos
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <div className="w-1.5 h-1.5 bg-[#14FFEC] rounded-full"></div>
                      Sugestões personalizadas de investimentos
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <div className="w-1.5 h-1.5 bg-[#14FFEC] rounded-full"></div>
                      Relatórios avançados e análises
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => router.push('/assinatura')}
                  className="px-8 py-4 bg-[#14FFEC] text-[#0D7377] rounded-xl font-bold text-lg hover:bg-[#14FFEC]/90 transition-all hover:scale-105 shadow-lg shadow-[#14FFEC]/30 flex items-center gap-2 whitespace-nowrap"
                >
                  <Crown className="w-5 h-5" />
                  Assinar Premium
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Shield, BarChart3, MessageSquare, X, ArrowRight, CheckCircle2, TrendingUp, Wallet, FileText } from "lucide-react";
import Link from "next/link";

export default function DemoPage() {
  const [step, setStep] = useState(0);
  const [showMessage, setShowMessage] = useState(false);

  const steps = [
    {
      title: "Bem-vindo ao FINZ!",
      description: "Vamos mostrar como é fácil controlar suas finanças pelo WhatsApp.",
      action: "Começar Tour"
    },
    {
      title: "1. Envie uma mensagem simples",
      description: "Digite no WhatsApp algo como: 'Gastei 40 no mercado'",
      action: "Ver Registro"
    },
    {
      title: "2. FINZ registra automaticamente",
      description: "Nossa IA interpreta e categoriza seu gasto instantaneamente",
      action: "Ver Dashboard"
    },
    {
      title: "3. Acompanhe tudo em tempo real",
      description: "Veja gráficos, relatórios e insights personalizados",
      action: "Ver Boletos"
    },
    {
      title: "4. Boletos automáticos",
      description: "Encontramos e organizamos todos os seus boletos automaticamente",
      action: "Finalizar"
    }
  ];

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
      if (step === 0) setShowMessage(true);
    } else {
      // Redirecionar para cadastro
      window.location.href = "/cadastro";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D7377] via-[#0A5C5F] to-[#1A1A1A] relative overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link href="/" className="flex items-center gap-2 sm:gap-3">
              <div className="relative">
                <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-[#14FFEC]" strokeWidth={2.5} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={3} />
                </div>
              </div>
              <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">FINZ</span>
            </Link>

            <Link 
              href="/"
              className="text-white hover:text-[#14FFEC] transition-colors"
            >
              <X className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="fixed top-16 sm:top-20 left-0 right-0 z-40 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                  index <= step ? "bg-[#14FFEC]" : "bg-white/20"
                }`}
              />
            ))}
          </div>
          <p className="text-white/70 text-sm mt-2">
            Passo {step + 1} de {steps.length}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-32 sm:pt-40 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Step 0 - Welcome */}
          {step === 0 && (
            <div className="text-center animate-fade-in">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-[#14FFEC]/20 rounded-full mb-6">
                <Shield className="w-10 h-10 text-[#14FFEC]" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                {steps[step].title}
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                {steps[step].description}
              </p>
              <button
                onClick={nextStep}
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#14FFEC] text-[#0D7377] rounded-lg font-bold text-lg hover:bg-[#14FFEC]/90 transition-all hover:scale-105 shadow-2xl shadow-[#14FFEC]/30"
              >
                {steps[step].action}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Step 1 - WhatsApp Message */}
          {step === 1 && (
            <div className="grid lg:grid-cols-2 gap-8 items-center animate-fade-in">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  {steps[step].title}
                </h1>
                <p className="text-lg text-gray-300 mb-6">
                  {steps[step].description}
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#14FFEC] flex-shrink-0 mt-1" />
                    <p className="text-gray-300">Linguagem natural - escreva como você fala</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#14FFEC] flex-shrink-0 mt-1" />
                    <p className="text-gray-300">IA interpreta automaticamente valor e categoria</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#14FFEC] flex-shrink-0 mt-1" />
                    <p className="text-gray-300">Confirmação instantânea no WhatsApp</p>
                  </div>
                </div>
                <button
                  onClick={nextStep}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#14FFEC] text-[#0D7377] rounded-lg font-bold text-lg hover:bg-[#14FFEC]/90 transition-all hover:scale-105"
                >
                  {steps[step].action}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {/* WhatsApp Mock */}
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
                <div className="bg-[#0D7377] rounded-2xl p-4 mb-4">
                  <div className="flex items-center gap-3 mb-4">
                    <MessageSquare className="w-6 h-6 text-[#14FFEC]" />
                    <span className="text-white font-semibold">WhatsApp - FINZ</span>
                  </div>
                  <div className="space-y-3">
                    {showMessage && (
                      <>
                        <div className="bg-white/20 rounded-lg rounded-br-none p-4 ml-auto max-w-[80%] animate-slide-in-right">
                          <p className="text-white">Gastei 40 no mercado</p>
                          <p className="text-xs text-white/60 mt-1">14:32</p>
                        </div>
                        <div className="bg-[#14FFEC]/30 rounded-lg rounded-bl-none p-4 max-w-[80%] animate-slide-in-left">
                          <p className="text-white font-semibold mb-2">✅ Registrado com sucesso!</p>
                          <div className="space-y-1 text-sm text-white/90">
                            <p>💰 Valor: R$ 40,00</p>
                            <p>🏷️ Categoria: Alimentação</p>
                            <p>📅 Data: Hoje, 14:32</p>
                          </div>
                          <p className="text-xs text-white/60 mt-2">14:32</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="text-center text-sm text-gray-400">
                  Exemplo de conversa real com o FINZ
                </div>
              </div>
            </div>
          )}

          {/* Step 2 - AI Processing */}
          {step === 2 && (
            <div className="text-center animate-fade-in">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-[#14FFEC]/20 rounded-full mb-6 animate-pulse">
                <BarChart3 className="w-10 h-10 text-[#14FFEC]" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                {steps[step].title}
              </h1>
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                {steps[step].description}
              </p>

              <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 mb-8">
                <div className="grid sm:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-[#14FFEC]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MessageSquare className="w-8 h-8 text-[#14FFEC]" />
                    </div>
                    <h3 className="text-white font-semibold mb-2">Recebe mensagem</h3>
                    <p className="text-sm text-gray-400">Gastei 40 no mercado</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-[#14FFEC]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <BarChart3 className="w-8 h-8 text-[#14FFEC]" />
                    </div>
                    <h3 className="text-white font-semibold mb-2">IA processa</h3>
                    <p className="text-sm text-gray-400">Identifica valor e categoria</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-[#14FFEC]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle2 className="w-8 h-8 text-[#14FFEC]" />
                    </div>
                    <h3 className="text-white font-semibold mb-2">Registra</h3>
                    <p className="text-sm text-gray-400">Salvo no seu histórico</p>
                  </div>
                </div>
              </div>

              <button
                onClick={nextStep}
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#14FFEC] text-[#0D7377] rounded-lg font-bold text-lg hover:bg-[#14FFEC]/90 transition-all hover:scale-105"
              >
                {steps[step].action}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Step 3 - Dashboard */}
          {step === 3 && (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  {steps[step].title}
                </h1>
                <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                  {steps[step].description}
                </p>
              </div>

              {/* Dashboard Mock */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Card 1 - Saldo */}
                <div className="bg-gradient-to-br from-[#14FFEC]/20 to-[#14FFEC]/5 backdrop-blur-xl rounded-2xl p-6 border border-[#14FFEC]/30">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold">Saldo do Mês</h3>
                    <Wallet className="w-6 h-6 text-[#14FFEC]" />
                  </div>
                  <p className="text-4xl font-bold text-[#14FFEC] mb-4">R$ 3.240</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">Receitas</span>
                      <span className="text-green-400 font-semibold">+ R$ 5.000</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">Despesas</span>
                      <span className="text-red-400 font-semibold">- R$ 1.760</span>
                    </div>
                  </div>
                </div>

                {/* Card 2 - Gastos por Categoria */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold">Gastos por Categoria</h3>
                    <TrendingUp className="w-6 h-6 text-[#14FFEC]" />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-300">Alimentação</span>
                        <span className="text-sm text-white font-semibold">R$ 680</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-[#14FFEC] h-2 rounded-full" style={{ width: "45%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-300">Transporte</span>
                        <span className="text-sm text-white font-semibold">R$ 420</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-[#14FFEC] h-2 rounded-full" style={{ width: "28%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-300">Lazer</span>
                        <span className="text-sm text-white font-semibold">R$ 320</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-[#14FFEC] h-2 rounded-full" style={{ width: "21%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={nextStep}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#14FFEC] text-[#0D7377] rounded-lg font-bold text-lg hover:bg-[#14FFEC]/90 transition-all hover:scale-105"
                >
                  {steps[step].action}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4 - Boletos */}
          {step === 4 && (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  {steps[step].title}
                </h1>
                <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                  {steps[step].description}
                </p>
              </div>

              {/* Boletos Mock */}
              <div className="max-w-3xl mx-auto space-y-4 mb-8">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#14FFEC]/20 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-[#14FFEC]" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">Conta de Luz - Cemig</h3>
                        <p className="text-sm text-gray-400">Vencimento: 15/01/2025</p>
                      </div>
                    </div>
                    <span className="text-xl font-bold text-[#14FFEC]">R$ 185,40</span>
                  </div>
                  <button className="w-full py-3 bg-[#14FFEC] text-[#0D7377] rounded-lg font-semibold hover:bg-[#14FFEC]/90 transition-all">
                    Pagar com Pix
                  </button>
                </div>

                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#14FFEC]/20 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-[#14FFEC]" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">Internet - Vivo Fibra</h3>
                        <p className="text-sm text-gray-400">Vencimento: 20/01/2025</p>
                      </div>
                    </div>
                    <span className="text-xl font-bold text-[#14FFEC]">R$ 99,90</span>
                  </div>
                  <button className="w-full py-3 bg-[#14FFEC] text-[#0D7377] rounded-lg font-semibold hover:bg-[#14FFEC]/90 transition-all">
                    Pagar com Pix
                  </button>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={nextStep}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#14FFEC] text-[#0D7377] rounded-lg font-bold text-lg hover:bg-[#14FFEC]/90 transition-all hover:scale-105 shadow-2xl shadow-[#14FFEC]/30"
                >
                  Começar Agora - R$ 9,99/mês
                  <ArrowRight className="w-5 h-5" />
                </button>
                <p className="text-sm text-gray-400 mt-4">
                  Cancele quando quiser. Sem taxas ocultas.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.5s ease-out;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.5s ease-out 0.3s both;
        }
      `}</style>
    </div>
  );
}

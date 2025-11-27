"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, BarChart3, User, Mail, Phone, CreditCard, Building2, ArrowRight, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function CadastroPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    cnpj: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Criar usuário no Supabase
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            cpf: formData.cpf || null,
            cnpj: formData.cnpj || null,
            plan: 'free', // Começa com plano gratuito
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // Salvar ID do usuário no localStorage
      localStorage.setItem('userId', data.id);
      localStorage.setItem('userName', data.name);
      localStorage.setItem('userPlan', 'free');

      // Redirecionar para dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      alert('Erro ao realizar cadastro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D7377] via-[#0A5C5F] to-[#1A1A1A] flex items-center justify-center p-4">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-lg border-b border-white/10">
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
          </div>
        </div>
      </div>

      {/* Formulário de Cadastro */}
      <div className="w-full max-w-md mt-20">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Criar Conta</h1>
            <p className="text-gray-300">Comece sua jornada financeira agora</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome */}
            <div>
              <label className="block text-white font-medium mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Nome Completo
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#14FFEC] focus:border-transparent"
                placeholder="Seu nome completo"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-white font-medium mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#14FFEC] focus:border-transparent"
                placeholder="seu@email.com"
              />
            </div>

            {/* Telefone */}
            <div>
              <label className="block text-white font-medium mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Telefone (WhatsApp)
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#14FFEC] focus:border-transparent"
                placeholder="(00) 00000-0000"
              />
            </div>

            {/* CPF (Opcional) */}
            <div>
              <label className="block text-white font-medium mb-2">
                <CreditCard className="w-4 h-4 inline mr-2" />
                CPF (Opcional)
              </label>
              <input
                type="text"
                value={formData.cpf}
                onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#14FFEC] focus:border-transparent"
                placeholder="000.000.000-00"
              />
            </div>

            {/* CNPJ (Opcional) */}
            <div>
              <label className="block text-white font-medium mb-2">
                <Building2 className="w-4 h-4 inline mr-2" />
                CNPJ (Opcional)
              </label>
              <input
                type="text"
                value={formData.cnpj}
                onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#14FFEC] focus:border-transparent"
                placeholder="00.000.000/0000-00"
              />
            </div>

            {/* Botão de Cadastro */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 bg-[#14FFEC] text-[#0D7377] rounded-lg font-bold text-lg hover:bg-[#14FFEC]/90 transition-all hover:scale-105 shadow-lg shadow-[#14FFEC]/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                "Cadastrando..."
              ) : (
                <>
                  Criar Conta Gratuita
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Informação sobre plano gratuito */}
            <div className="bg-[#14FFEC]/10 border border-[#14FFEC]/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#14FFEC] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-semibold mb-1">Plano Gratuito</p>
                  <p className="text-gray-300 text-sm">
                    Comece gratuitamente e faça upgrade para Premium quando quiser para desbloquear funcionalidades exclusivas.
                  </p>
                </div>
              </div>
            </div>
          </form>

          {/* Link para Login */}
          <div className="mt-6 text-center">
            <p className="text-gray-300">
              Já tem uma conta?{" "}
              <button
                onClick={() => router.push('/login')}
                className="text-[#14FFEC] font-semibold hover:underline"
              >
                Fazer Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

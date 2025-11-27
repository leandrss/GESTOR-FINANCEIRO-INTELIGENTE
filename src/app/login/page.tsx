"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, BarChart3, Mail, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Buscar usuário pelo email
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !data) {
        alert('Usuário não encontrado. Faça seu cadastro primeiro.');
        setLoading(false);
        return;
      }

      // Salvar dados no localStorage
      localStorage.setItem('userId', data.id);
      localStorage.setItem('userName', data.name);
      localStorage.setItem('userPlan', data.plan || 'free');

      // Redirecionar para dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      alert('Erro ao fazer login. Tente novamente.');
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

      {/* Formulário de Login */}
      <div className="w-full max-w-md mt-20">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Bem-vindo de volta!</h1>
            <p className="text-gray-300">Acesse sua conta FINZ</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-white font-medium mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#14FFEC] focus:border-transparent"
                placeholder="seu@email.com"
              />
            </div>

            {/* Botão de Login */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 bg-[#14FFEC] text-[#0D7377] rounded-lg font-bold text-lg hover:bg-[#14FFEC]/90 transition-all hover:scale-105 shadow-lg shadow-[#14FFEC]/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                "Entrando..."
              ) : (
                <>
                  Entrar
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Link para Cadastro */}
          <div className="mt-6 text-center">
            <p className="text-gray-300">
              Não tem uma conta?{" "}
              <button
                onClick={() => router.push('/cadastro')}
                className="text-[#14FFEC] font-semibold hover:underline"
              >
                Criar Conta Gratuita
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, Check, X, Crown } from 'lucide-react';
import { registerUser, validatePasswordStrength } from '@/lib/auth';

interface RegisterFormProps {
  onSuccess: (user: any) => void;
  onSwitchToLogin: () => void;
}

export default function RegisterForm({ onSuccess, onSwitchToLogin }: RegisterFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordStrength = password ? validatePasswordStrength(password) : null;

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validações
    if (!name.trim()) {
      setError('Por favor, informe seu nome completo');
      return;
    }

    if (!validateEmail(email)) {
      setError('Por favor, informe um e-mail válido');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const result = await registerUser(name, email, password);
      
      if (result.success && result.user) {
        // Cadastro criado com sucesso - redirecionar para pagamento
        onSuccess(result.user);
      } else {
        setError(result.message);
        setLoading(false);
      }
    } catch (err) {
      setError('Erro ao criar conta. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Criar Conta</h2>
          <p className="text-gray-400">Preencha seus dados para continuar</p>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full px-4 py-2 mt-3">
            <span className="text-white font-semibold">R$ 9,99/mês</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nome Completo
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all"
                placeholder="Seu nome completo"
              />
            </div>
          </div>

          {/* E-mail */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              E-mail
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          {/* Senha */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all"
                placeholder="Mínimo 6 caracteres"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Medidor de Força da Senha */}
            {password && passwordStrength && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  <div className={`h-1 flex-1 rounded ${passwordStrength.strength === 'weak' ? 'bg-red-500' : passwordStrength.strength === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`} />
                  <div className={`h-1 flex-1 rounded ${passwordStrength.strength === 'medium' || passwordStrength.strength === 'strong' ? 'bg-yellow-500' : 'bg-gray-600'}`} />
                  <div className={`h-1 flex-1 rounded ${passwordStrength.strength === 'strong' ? 'bg-green-500' : 'bg-gray-600'}`} />
                </div>
                <p className={`text-xs ${passwordStrength.strength === 'weak' ? 'text-red-400' : passwordStrength.strength === 'medium' ? 'text-yellow-400' : 'text-green-400'}`}>
                  {passwordStrength.message}
                </p>
              </div>
            )}
          </div>

          {/* Erro */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 flex items-start gap-2">
              <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Botão */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all hover:scale-105 shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Redirecionando para pagamento...' : 'Continuar para Pagamento'}
          </button>

          <p className="text-gray-400 text-xs text-center">
            Ao continuar, você será redirecionado para o Mercado Pago para finalizar sua assinatura
          </p>
        </form>

        {/* Link para Login */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Já tem uma conta?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
            >
              Fazer Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

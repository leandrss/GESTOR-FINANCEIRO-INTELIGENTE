"use client";

import { useState } from 'react';
import { User as UserIcon, Mail, Calendar, Crown, CreditCard, LogOut, Edit2, Check, X, AlertCircle } from 'lucide-react';
import { User } from '@/lib/types';
import { updateUser, logoutUser } from '@/lib/auth';

interface AccountAreaProps {
  user: User;
  onLogout: () => void;
  onUserUpdate: (user: User) => void;
}

export default function AccountArea({ user, onLogout, onUserUpdate }: AccountAreaProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);
  const [message, setMessage] = useState('');

  const handleSaveChanges = () => {
    if (!editName.trim() || !editEmail.trim()) {
      setMessage('Por favor, preencha todos os campos');
      return;
    }

    const success = updateUser(user.id, { name: editName, email: editEmail });
    
    if (success) {
      onUserUpdate({ ...user, name: editName, email: editEmail });
      setMessage('Dados atualizados com sucesso!');
      setIsEditing(false);
      
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage('Erro ao atualizar dados');
    }
  };

  const handleCancelEdit = () => {
    setEditName(user.name);
    setEditEmail(user.email);
    setIsEditing(false);
    setMessage('');
  };

  const handleLogout = () => {
    logoutUser();
    onLogout();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'pending':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'expired':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativa';
      case 'pending':
        return 'Aguardando Confirmação';
      case 'expired':
        return 'Expirada';
      default:
        return 'Inativa';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Minha Conta</h2>
            <p className="text-gray-400">Gerencie suas informações e assinatura</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500/20 text-red-400 rounded-xl font-semibold hover:bg-red-500/30 transition-all flex items-center gap-2 border border-red-500/30"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>

        {/* Mensagem de Feedback */}
        {message && (
          <div className="mb-6 bg-cyan-500/20 border border-cyan-500/50 rounded-xl p-3 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
            <p className="text-cyan-400 text-sm">{message}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Dados Pessoais */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-cyan-400" />
                Dados Pessoais
              </h3>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 bg-white/10 text-gray-400 rounded-lg hover:bg-white/20 hover:text-white transition-all"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="space-y-4">
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Nome Completo
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-cyan-400 transition-all"
                  />
                ) : (
                  <p className="text-white font-medium">{user.name}</p>
                )}
              </div>

              {/* E-mail */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  E-mail
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-cyan-400 transition-all"
                  />
                ) : (
                  <p className="text-white font-medium">{user.email}</p>
                )}
              </div>

              {/* Membro desde */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Membro desde
                </label>
                <p className="text-white font-medium">
                  {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                </p>
              </div>

              {/* Botões de Edição */}
              {isEditing && (
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleSaveChanges}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Salvar
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Status da Assinatura */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Crown className="w-5 h-5 text-purple-400" />
              Assinatura Premium
            </h3>

            <div className="space-y-4">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Status
                </label>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${getStatusColor(user.subscription.status)}`}>
                  <div className="w-2 h-2 rounded-full bg-current" />
                  <span className="font-semibold">{getStatusText(user.subscription.status)}</span>
                </div>
              </div>

              {/* Valor */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Valor da Assinatura
                </label>
                <p className="text-white font-medium text-2xl">
                  R$ 9,99<span className="text-gray-400 text-base">/mês</span>
                </p>
              </div>

              {/* Próxima Cobrança */}
              {user.subscription.status === 'active' && user.subscription.nextBillingDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Próxima Cobrança
                  </label>
                  <p className="text-white font-medium">
                    {new Date(user.subscription.nextBillingDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              )}

              {/* Ações */}
              <div className="pt-4 space-y-2">
                {user.subscription.status === 'active' && (
                  <a
                    href="https://www.mercadopago.com.br/subscriptions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full px-4 py-2 bg-red-500/20 text-red-400 rounded-lg font-semibold hover:bg-red-500/30 transition-all text-center border border-red-500/30"
                  >
                    Cancelar Assinatura
                  </a>
                )}
                
                <a
                  href="https://www.mercadopago.com.br/subscriptions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-4 py-2 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-all text-center"
                >
                  Gerenciar no Mercado Pago
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="mt-6 bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Crown className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-purple-400 font-semibold mb-1">Assinatura Premium - R$ 9,99/mês</p>
              <p className="text-gray-300 text-sm">
                Aproveite todos os recursos do FINZ com controle financeiro inteligente. 
                Cancele quando quiser, sem multas ou complicações.
              </p>
            </div>
          </div>
        </div>

        {/* Segurança */}
        <div className="mt-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <CreditCard className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-cyan-400 font-semibold mb-1">Pagamentos Seguros</p>
              <p className="text-gray-300 text-sm">
                Todos os pagamentos são processados de forma segura pelo Mercado Pago. 
                Seus dados financeiros estão protegidos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

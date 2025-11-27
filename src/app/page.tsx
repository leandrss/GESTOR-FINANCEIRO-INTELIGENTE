"use client";

import { useState, useEffect } from "react";
import { Plus, TrendingUp, TrendingDown, Wallet, Trash2, Edit2, Check, X, User, Crown, Lock, Sparkles } from "lucide-react";
import { checkSession } from "@/lib/auth";
import { User as UserType, Transaction } from "@/lib/types";
import RegisterForm from "@/components/auth/RegisterForm";
import LoginForm from "@/components/auth/LoginForm";
import SubscriptionCard from "@/components/subscription/SubscriptionCard";
import AccountArea from "@/components/account/AccountArea";

export default function Home() {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [authView, setAuthView] = useState<'login' | 'register' | null>(null);
  const [showSubscription, setShowSubscription] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [input, setInput] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [confirmation, setConfirmation] = useState<{
    show: boolean;
    description: string;
    amount: number;
    suggestedType: "income" | "expense";
  }>({
    show: false,
    description: "",
    amount: 0,
    suggestedType: "expense",
  });

  // Verificar sessão ao carregar
  useEffect(() => {
    const user = checkSession();
    if (user) {
      setCurrentUser(user);
      // Se usuário não tem assinatura ativa, mostrar tela de assinatura
      if (user.subscription.status !== 'active') {
        setShowSubscription(true);
      }
    }
  }, []);

  // Palavras-chave para identificar ganhos
  const incomeKeywords = [
    "recebi", "recebido", "ganho", "ganhei", "salário", "salario",
    "pagamento", "renda", "lucro", "venda", "vendido", "entrada",
    "crédito", "credito", "deposito", "depósito", "transferência recebida"
  ];

  // Palavras-chave para identificar gastos
  const expenseKeywords = [
    "paguei", "pago", "gastei", "gasto", "comprei", "compra",
    "conta", "fatura", "débito", "debito", "despesa", "saída",
    "pagamento", "boleto", "aluguel", "luz", "água", "internet",
    "mercado", "supermercado", "restaurante", "combustível"
  ];

  // Função para extrair valor numérico da string
  const extractAmount = (text: string): number | null => {
    const normalized = text
      .toLowerCase()
      .replace(/r\$\s*/g, "")
      .replace(/\s+/g, " ")
      .trim();

    const patterns = [
      /(\d+[.,]\d{3}[.,]\d{2})/,
      /(\d+[.,]\d{2})/,
      /(\d+)/,
    ];

    for (const pattern of patterns) {
      const match = normalized.match(pattern);
      if (match) {
        let numStr = match[1];
        if (numStr.includes(",") && numStr.includes(".")) {
          numStr = numStr.replace(/\./g, "").replace(",", ".");
        } else if (numStr.includes(",")) {
          const parts = numStr.split(",");
          if (parts[1] && parts[1].length === 2) {
            numStr = numStr.replace(",", ".");
          } else {
            numStr = numStr.replace(",", "");
          }
        }
        const amount = parseFloat(numStr);
        if (!isNaN(amount) && amount > 0) {
          return amount;
        }
      }
    }
    return null;
  };

  // Função para classificar o tipo de transação
  const classifyTransaction = (text: string): "income" | "expense" | "unclear" => {
    const lowerText = text.toLowerCase();
    
    const hasIncomeKeyword = incomeKeywords.some(keyword => lowerText.includes(keyword));
    const hasExpenseKeyword = expenseKeywords.some(keyword => lowerText.includes(keyword));

    if (hasIncomeKeyword && !hasExpenseKeyword) {
      return "income";
    }
    if (hasExpenseKeyword && !hasIncomeKeyword) {
      return "expense";
    }
    
    if (!hasIncomeKeyword && !hasExpenseKeyword) {
      return "unclear";
    }

    return "unclear";
  };

  // Função para adicionar transação
  const handleAddTransaction = () => {
    if (!input.trim()) return;

    const amount = extractAmount(input);
    if (!amount) {
      alert("Não consegui identificar um valor válido. Por favor, inclua um número na descrição.");
      return;
    }

    const type = classifyTransaction(input);

    if (type === "unclear") {
      setConfirmation({
        show: true,
        description: input,
        amount: amount,
        suggestedType: "expense",
      });
    } else {
      addTransaction(input, amount, type);
    }
  };

  // Função auxiliar para adicionar transação
  const addTransaction = (description: string, amount: number, type: "income" | "expense") => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      description: description,
      amount: amount,
      type: type,
      date: new Date(),
      userId: currentUser?.id,
    };

    setTransactions([newTransaction, ...transactions]);
    setInput("");
    setConfirmation({ show: false, description: "", amount: 0, suggestedType: "expense" });
  };

  // Função para confirmar transação
  const handleConfirmTransaction = (type: "income" | "expense") => {
    addTransaction(confirmation.description, confirmation.amount, type);
  };

  // Função para cancelar confirmação
  const handleCancelConfirmation = () => {
    setConfirmation({ show: false, description: "", amount: 0, suggestedType: "expense" });
  };

  // Função para deletar transação
  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  // Função para iniciar edição
  const handleStartEdit = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setEditValue(transaction.description);
  };

  // Função para salvar edição
  const handleSaveEdit = (id: string) => {
    if (!editValue.trim()) return;

    const amount = extractAmount(editValue);
    if (!amount) {
      alert("Não consegui identificar um valor válido na edição.");
      return;
    }

    const type = classifyTransaction(editValue);
    const finalType = type === "unclear" ? "expense" : type;

    setTransactions(transactions.map(t => 
      t.id === id 
        ? { ...t, description: editValue, amount: amount, type: finalType }
        : t
    ));
    setEditingId(null);
    setEditValue("");
  };

  // Função para cancelar edição
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  // Calcular totais
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  // Filtrar transações por tipo
  const incomeTransactions = transactions.filter(t => t.type === "income");
  const expenseTransactions = transactions.filter(t => t.type === "expense");

  // Handlers de autenticação
  const handleLoginSuccess = (user: UserType) => {
    setCurrentUser(user);
    setAuthView(null);
    // Verificar se precisa mostrar assinatura
    if (user.subscription.status !== 'active') {
      setShowSubscription(true);
    }
  };

  const handleRegisterSuccess = (user: UserType) => {
    setCurrentUser(user);
    setAuthView(null);
    // Sempre redirecionar para pagamento após cadastro
    window.open('https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=506a18c60dc24295b93b2c6e0d82e9a5', '_blank');
    setShowSubscription(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setShowAccount(false);
    setShowSubscription(false);
    setTransactions([]);
  };

  const handleSubscribe = () => {
    setShowSubscription(false);
  };

  // TELA INICIAL - Sem usuário logado
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {authView === null ? (
            // TELA HOME INICIAL
            <div className="text-center space-y-8">
              {/* Logo */}
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-2xl shadow-cyan-500/30 mb-4">
                <Wallet className="w-10 h-10 text-white" />
              </div>

              {/* Título e Descrição */}
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                  FINZ
                </h1>
                <p className="text-xl text-gray-300 mb-6">
                  Gerencie suas finanças de forma simples e automática.
                </p>
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full px-6 py-3">
                  <Crown className="w-5 h-5 text-purple-400" />
                  <span className="text-white font-semibold text-lg">Assine por apenas R$ 9,99/mês</span>
                </div>
              </div>

              {/* Benefícios */}
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 space-y-3 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-green-400" />
                  </div>
                  <p className="text-gray-300">Controle inteligente de ganhos e gastos</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-green-400" />
                  </div>
                  <p className="text-gray-300">Classificação automática de transações</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-green-400" />
                  </div>
                  <p className="text-gray-300">Visualização clara do seu saldo</p>
                </div>
              </div>

              {/* Botões Principais */}
              <div className="space-y-4">
                <button
                  onClick={() => setAuthView('login')}
                  className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold text-lg hover:from-cyan-600 hover:to-blue-700 transition-all hover:scale-105 shadow-lg shadow-cyan-500/30"
                >
                  Entrar
                </button>
                <button
                  onClick={() => setAuthView('register')}
                  className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all hover:scale-105 shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Criar Conta (R$ 9,99/mês)
                </button>
              </div>

              <p className="text-gray-500 text-sm">
                Sem período de teste. Acesso completo mediante assinatura.
              </p>
            </div>
          ) : authView === 'login' ? (
            <LoginForm
              onSuccess={handleLoginSuccess}
              onSwitchToRegister={() => setAuthView('register')}
            />
          ) : (
            <RegisterForm
              onSuccess={handleRegisterSuccess}
              onSwitchToLogin={() => setAuthView('login')}
            />
          )}
        </div>
      </div>
    );
  }

  // Se está mostrando área de assinatura
  if (showSubscription) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="w-full max-w-6xl">
          {currentUser.subscription.status === 'active' ? (
            <button
              onClick={() => setShowSubscription(false)}
              className="mb-6 px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all"
            >
              ← Voltar
            </button>
          ) : null}
          <SubscriptionCard onSubscribe={handleSubscribe} />
        </div>
      </div>
    );
  }

  // Se está mostrando área da conta
  if (showAccount) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="w-full max-w-6xl">
          <button
            onClick={() => setShowAccount(false)}
            className="mb-6 px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all"
          >
            ← Voltar
          </button>
          <AccountArea
            user={currentUser}
            onLogout={handleLogout}
            onUserUpdate={setCurrentUser}
          />
        </div>
      </div>
    );
  }

  // Se usuário não tem assinatura ativa, bloquear acesso
  if (currentUser.subscription.status !== 'active') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="w-full max-w-2xl">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-6">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Assinatura Necessária
            </h2>
            <p className="text-gray-300 mb-6 text-lg">
              Para acessar o FINZ e gerenciar suas finanças, você precisa de uma assinatura ativa.
            </p>
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-4 mb-6">
              <p className="text-white font-semibold text-xl">
                Apenas R$ 9,99/mês
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Cancele quando quiser
              </p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => setShowSubscription(true)}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all hover:scale-105 shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2"
              >
                <Crown className="w-5 h-5" />
                Assinar Agora
              </button>
              <button
                onClick={handleLogout}
                className="w-full py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Tela principal do aplicativo (apenas para assinantes ativos)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header com Menu do Usuário */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">
              Controle Financeiro <span className="text-cyan-400">Inteligente</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Olá, {currentUser.name}! Digite livremente seus ganhos e gastos
            </p>
          </div>
          
          <div className="flex gap-3">
            {/* Badge Premium */}
            <div className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl flex items-center gap-2">
              <Crown className="w-5 h-5 text-purple-400" />
              <span className="text-white font-semibold">Premium</span>
            </div>
            
            {/* Botão da Conta */}
            <button
              onClick={() => setShowAccount(true)}
              className="px-4 py-2 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all flex items-center gap-2 border border-white/20"
            >
              <User className="w-5 h-5" />
              Minha Conta
            </button>
          </div>
        </div>

        {/* Campo de Entrada Principal */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-white/20 shadow-2xl mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddTransaction()}
              placeholder='Ex: "paguei R$ 50 no mercado", "recebi 200 do cliente", "salário 3500"'
              className="flex-1 px-6 py-4 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-gray-400 text-lg focus:outline-none focus:border-cyan-400 transition-all"
            />
            <button
              onClick={handleAddTransaction}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold text-lg hover:from-cyan-600 hover:to-blue-700 transition-all hover:scale-105 shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2"
            >
              <Plus className="w-6 h-6" />
              Adicionar
            </button>
          </div>
        </div>

        {/* Modal de Confirmação */}
        {confirmation.show && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-2xl p-6 sm:p-8 max-w-md w-full border border-white/20 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-4">
                Confirme o tipo de lançamento
              </h3>
              <p className="text-gray-300 mb-2">
                <span className="font-semibold">Descrição:</span> {confirmation.description}
              </p>
              <p className="text-gray-300 mb-6">
                <span className="font-semibold">Valor:</span> R$ {confirmation.amount.toFixed(2)}
              </p>
              <p className="text-gray-400 text-sm mb-6">
                Não consegui identificar automaticamente. É um ganho ou gasto?
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => handleConfirmTransaction("income")}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                >
                  <TrendingUp className="w-5 h-5" />
                  Ganho
                </button>
                <button
                  onClick={() => handleConfirmTransaction("expense")}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                >
                  <TrendingDown className="w-5 h-5" />
                  Gasto
                </button>
              </div>
              <button
                onClick={handleCancelConfirmation}
                className="w-full mt-4 px-6 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Cards de Totais */}
        <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {/* Total Ganhos */}
          <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 backdrop-blur-lg rounded-2xl p-6 border border-green-500/30 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-400 font-semibold">Ganhos</span>
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <p className="text-3xl font-bold text-white">
              R$ {totalIncome.toFixed(2)}
            </p>
          </div>

          {/* Total Gastos */}
          <div className="bg-gradient-to-br from-red-500/20 to-red-600/10 backdrop-blur-lg rounded-2xl p-6 border border-red-500/30 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-red-400 font-semibold">Gastos</span>
              <TrendingDown className="w-6 h-6 text-red-400" />
            </div>
            <p className="text-3xl font-bold text-white">
              R$ {totalExpense.toFixed(2)}
            </p>
          </div>

          {/* Saldo */}
          <div className={`bg-gradient-to-br ${balance >= 0 ? 'from-cyan-500/20 to-blue-600/10 border-cyan-500/30' : 'from-orange-500/20 to-red-600/10 border-orange-500/30'} backdrop-blur-lg rounded-2xl p-6 border shadow-xl`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`${balance >= 0 ? 'text-cyan-400' : 'text-orange-400'} font-semibold`}>Saldo</span>
              <Wallet className={`w-6 h-6 ${balance >= 0 ? 'text-cyan-400' : 'text-orange-400'}`} />
            </div>
            <p className="text-3xl font-bold text-white">
              R$ {balance.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Listas de Transações */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Lista de Ganhos */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-green-400" />
              <h2 className="text-2xl font-bold text-white">Ganhos</h2>
              <span className="ml-auto bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
                {incomeTransactions.length}
              </span>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {incomeTransactions.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  Nenhum ganho registrado ainda
                </p>
              ) : (
                incomeTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="bg-white/5 rounded-xl p-4 border border-green-500/20 hover:bg-white/10 transition-all"
                  >
                    {editingId === transaction.id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-400"
                        />
                        <button
                          onClick={() => handleSaveEdit(transaction.id)}
                          className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between mb-2">
                          <p className="text-white font-medium flex-1">
                            {transaction.description}
                          </p>
                          <div className="flex gap-2 ml-2">
                            <button
                              onClick={() => handleStartEdit(transaction)}
                              className="p-1.5 bg-white/10 text-gray-400 rounded-lg hover:bg-white/20 hover:text-white transition-all"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteTransaction(transaction.id)}
                              className="p-1.5 bg-white/10 text-gray-400 rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-green-400">
                            + R$ {transaction.amount.toFixed(2)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {transaction.date.toLocaleDateString()}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Lista de Gastos */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <TrendingDown className="w-6 h-6 text-red-400" />
              <h2 className="text-2xl font-bold text-white">Gastos</h2>
              <span className="ml-auto bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm font-semibold">
                {expenseTransactions.length}
              </span>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {expenseTransactions.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  Nenhum gasto registrado ainda
                </p>
              ) : (
                expenseTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="bg-white/5 rounded-xl p-4 border border-red-500/20 hover:bg-white/10 transition-all"
                  >
                    {editingId === transaction.id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-400"
                        />
                        <button
                          onClick={() => handleSaveEdit(transaction.id)}
                          className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between mb-2">
                          <p className="text-white font-medium flex-1">
                            {transaction.description}
                          </p>
                          <div className="flex gap-2 ml-2">
                            <button
                              onClick={() => handleStartEdit(transaction)}
                              className="p-1.5 bg-white/10 text-gray-400 rounded-lg hover:bg-white/20 hover:text-white transition-all"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteTransaction(transaction.id)}
                              className="p-1.5 bg-white/10 text-gray-400 rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-red-400">
                            - R$ {transaction.amount.toFixed(2)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {transaction.date.toLocaleDateString()}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

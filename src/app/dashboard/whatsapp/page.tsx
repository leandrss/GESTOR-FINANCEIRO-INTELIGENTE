"use client";

import { useState } from "react";
import { Send, MessageSquare } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Transaction {
  tipo: "despesa" | "receita";
  valor: number;
  categoria: string;
  data: string;
  descricao: string;
}

export default function WhatsAppAssistant() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{type: 'user' | 'bot', message: string}>>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const processMessage = async (userMessage: string) => {
    setIsProcessing(true);

    try {
      // Lógica de processamento da mensagem
      const transaction = parseMessage(userMessage);

      if (transaction) {
        // Salvar no Supabase
        const { error } = await supabase
          .from('transactions')
          .insert([transaction]);

        if (error) {
          console.error('Erro ao salvar:', error);
          setChatHistory(prev => [...prev, {type: 'bot', message: 'Erro ao registrar. Tente novamente.'}]);
        } else {
          setChatHistory(prev => [...prev, {type: 'bot', message: transaction.tipo === 'despesa' ? 'Despesa registrada.' : 'Receita registrada.'}]);
        }
      } else {
        setChatHistory(prev => [...prev, {type: 'bot', message: 'Mensagem não reconhecida. Envie valor e categoria.'}]);
      }
    } catch (error) {
      console.error('Erro:', error);
      setChatHistory(prev => [...prev, {type: 'bot', message: 'Erro no processamento.'}]);
    }

    setIsProcessing(false);
  };

  const parseMessage = (msg: string): Transaction | null => {
    const lowerMsg = msg.toLowerCase();

    // Identificar tipo
    const isExpense = lowerMsg.includes('gastei') || lowerMsg.includes('paguei') || lowerMsg.includes('comprei');
    const isIncome = lowerMsg.includes('recebi') || lowerMsg.includes('entrou') || lowerMsg.includes('ganhei');

    if (!isExpense && !isIncome) return null;

    // Extrair valor
    const valueMatch = msg.match(/(\d+(?:[.,]\d{1,2})?)/);
    if (!valueMatch) return null;
    const valor = parseFloat(valueMatch[1].replace(',', '.'));

    // Identificar categoria
    let categoria = 'outros';
    if (lowerMsg.includes('comida') || lowerMsg.includes('alimentação') || lowerMsg.includes('restaurante')) categoria = 'alimentação';
    else if (lowerMsg.includes('transporte') || lowerMsg.includes('uber') || lowerMsg.includes('ônibus')) categoria = 'transporte';
    else if (lowerMsg.includes('internet') || lowerMsg.includes('telefone') || lowerMsg.includes('conta')) categoria = 'contas';
    else if (lowerMsg.includes('salário') || lowerMsg.includes('renda')) categoria = 'renda';

    // Data - usar hoje se não especificada
    const data = new Date().toISOString().split('T')[0];

    // Descrição
    const descricao = msg;

    return {
      tipo: isExpense ? 'despesa' : 'receita',
      valor,
      categoria,
      data,
      descricao
    };
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    setChatHistory(prev => [...prev, {type: 'user', message}]);
    await processMessage(message);
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0D7377] to-[#14FFEC] p-6 text-white">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Assistente WhatsApp</h1>
              <p className="text-sm opacity-90">Envie mensagens como no WhatsApp para registrar transações</p>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {chatHistory.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Envie sua primeira mensagem!</p>
              <p className="text-sm mt-2">Ex: "gastei 45 em comida" ou "recebi 800 do salário"</p>
            </div>
          )}

          {chatHistory.map((chat, index) => (
            <div key={index} className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs px-4 py-2 rounded-lg ${
                chat.type === 'user'
                  ? 'bg-[#0D7377] text-white'
                  : 'bg-white text-gray-800 border'
              }`}>
                {chat.message}
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 border px-4 py-2 rounded-lg">
                Processando...
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t bg-white">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7377]"
              disabled={isProcessing}
            />
            <button
              onClick={handleSend}
              disabled={!message.trim() || isProcessing}
              className="px-6 py-2 bg-[#0D7377] text-white rounded-lg hover:bg-[#0a5a5c] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { MessageCircle, X, Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function WhatsAppAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConnect = async () => {
    if (!phoneNumber) {
      setError("Por favor, insira seu número de WhatsApp");
      return;
    }

    // Validar formato do número (remover caracteres especiais)
    const cleanNumber = phoneNumber.replace(/\D/g, "");
    
    if (cleanNumber.length < 10) {
      setError("Número inválido. Use o formato: +55 11 99999-9999");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Enviar mensagem de boas-vindas
      const response = await fetch("/api/whatsapp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: cleanNumber,
          message: `Olá! Eu sou o assistente oficial do aplicativo FINZ.
Antes de começarmos, posso saber seu nome ou acessar seu cadastro automaticamente pelo número?

Escolha uma opção:
1️⃣ Como usar o aplicativo
2️⃣ Suporte técnico
3️⃣ Área premium
4️⃣ Conversar com atendente
5️⃣ Dúvidas gerais`,
        }),
      });

      if (response.ok) {
        setIsConnected(true);
        setMessages([
          {
            role: "assistant",
            content: "Conexão estabelecida! Enviei uma mensagem de boas-vindas para seu WhatsApp. Você pode continuar a conversa por lá ou aqui mesmo.",
            timestamp: new Date(),
          },
        ]);
      } else {
        throw new Error("Falha ao conectar");
      }
    } catch (err) {
      setError("Erro ao conectar. Verifique suas credenciais do WhatsApp Cloud API.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !phoneNumber) return;

    const userMessage: Message = {
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const cleanNumber = phoneNumber.replace(/\D/g, "");
      
      const response = await fetch("/api/whatsapp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: cleanNumber,
          message: inputMessage,
        }),
      });

      if (response.ok) {
        const assistantMessage: Message = {
          role: "assistant",
          content: "Mensagem enviada para seu WhatsApp! O assistente responderá por lá em instantes.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error("Falha ao enviar mensagem");
      }
    } catch (err) {
      setError("Erro ao enviar mensagem. Tente novamente.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Botão Flutuante */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-br from-[#25D366] to-[#128C7E] text-white rounded-full p-4 shadow-2xl hover:scale-110 transition-all duration-300 hover:shadow-[#25D366]/50 group"
        aria-label="Abrir Assistente WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Assistente WhatsApp
        </div>
      </button>

      {/* Modal do Assistente */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[600px] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <MessageCircle className="w-6 h-6" />
                  {isConnected && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg">Assistente FINZ</h3>
                  <p className="text-xs text-green-100">
                    {isConnected ? "Conectado" : "Desconectado"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 rounded-full p-2 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Área de Conexão */}
            {!isConnected ? (
              <div className="p-6 flex-1 flex flex-col justify-center">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-[#25D366]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-[#25D366]" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    Conecte seu WhatsApp
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Insira seu número para começar a conversar com nosso assistente inteligente
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número do WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+55 11 99999-9999"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25D366] focus:border-transparent outline-none transition-all"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Formato: +55 + DDD + número
                    </p>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    onClick={handleConnect}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Conectando...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        Conectar WhatsApp
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-800">
                    <strong>💡 Dica:</strong> Após conectar, você receberá mensagens automáticas do nosso assistente inteligente com todas as funcionalidades do FINZ.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Área de Mensagens */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          msg.role === "user"
                            ? "bg-[#25D366] text-white"
                            : "bg-white text-gray-900 shadow-sm"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            msg.role === "user" ? "text-green-100" : "text-gray-500"
                          }`}
                        >
                          {msg.timestamp.toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white rounded-2xl px-4 py-3 shadow-sm">
                        <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Input de Mensagem */}
                <div className="p-4 bg-white border-t border-gray-200">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      placeholder="Digite sua mensagem..."
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-[#25D366] focus:border-transparent outline-none transition-all"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={isLoading || !inputMessage.trim()}
                      className="bg-[#25D366] text-white rounded-full p-3 hover:bg-[#128C7E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

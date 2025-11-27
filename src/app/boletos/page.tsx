"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DashboardLayout from "@/components/custom/DashboardLayout";
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Copy, 
  Download,
  RefreshCw,
  AlertCircle,
  ArrowLeft,
  Shield
} from "lucide-react";
import type { Boleto } from "@/lib/types/boletos";

export default function BoletosPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [boletos, setBoletos] = useState<Boleto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [cpf, setCpf] = useState("");
  const [showCpfModal, setShowCpfModal] = useState(false);

  useEffect(() => {
    // Verifica se voltou da autorização
    const authorized = searchParams.get('authorized');
    const token = searchParams.get('token');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      setError(getErrorMessage(errorParam));
    }

    if (authorized === 'true' && token) {
      setIsAuthorized(true);
      loadBoletos(token);
    }
  }, [searchParams]);

  const getErrorMessage = (errorCode: string): string => {
    const errors: Record<string, string> = {
      'missing_code': 'Código de autorização não recebido',
      'invalid_state': 'Estado de autorização inválido',
      'callback_failed': 'Falha no processo de autorização',
      'access_denied': 'Acesso negado pelo usuário',
    };
    return errors[errorCode] || 'Erro desconhecido';
  };

  const handleConnectCpf = () => {
    setShowCpfModal(true);
  };

  const handleAuthorize = async () => {
    if (!cpf) {
      setError('Por favor, digite seu CPF');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/open-finance/authorize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cpf }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao iniciar autorização');
      }

      // Redireciona para a URL de autorização do Open Finance
      window.location.href = data.authorizationUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao conectar');
      setLoading(false);
    }
  };

  const loadBoletos = async (token: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/open-finance/boletos?token=${token}&cpf=${cpf}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao carregar boletos');
      }

      setBoletos(data.boletos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar boletos');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Aqui você pode adicionar um toast de sucesso
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(dateString));
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      pago: {
        icon: CheckCircle,
        color: 'text-green-600',
        bg: 'bg-green-100',
        label: 'Pago',
      },
      pendente: {
        icon: Clock,
        color: 'text-orange-600',
        bg: 'bg-orange-100',
        label: 'Pendente',
      },
      vencido: {
        icon: XCircle,
        color: 'text-red-600',
        bg: 'bg-red-100',
        label: 'Vencido',
      },
    };
    return configs[status as keyof typeof configs] || configs.pendente;
  };

  // Tela de autorização
  if (!isAuthorized) {
    return (
      <DashboardLayout accountType="cpf">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar ao Dashboard
          </button>

          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 md:p-12">
            <div className="text-center max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-[#0D7377]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-[#0D7377]" />
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Conectar CPF ao Open Finance
              </h1>

              <p className="text-gray-600 mb-8">
                Para listar seus boletos, precisamos da sua autorização para acessar
                seus dados bancários através do Open Finance Brasil. Seus dados são
                protegidos e você pode revogar o acesso a qualquer momento.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 text-left">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  O que vamos acessar:
                </h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Boletos emitidos em seu CPF</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Boletos registrados nos bancos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Status de pagamento (pago, pendente, vencido)</span>
                  </li>
                </ul>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={handleConnectCpf}
                disabled={loading}
                className="w-full sm:w-auto px-8 py-4 bg-[#0D7377] text-white rounded-xl font-semibold hover:bg-[#0D7377]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Conectando...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    Conectar CPF e Listar Boletos
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 mt-6">
                Ao conectar, você concorda com os termos do Open Finance Brasil e
                autoriza o acesso temporário aos seus dados bancários.
              </p>
            </div>
          </div>
        </div>

        {/* Modal de CPF */}
        {showCpfModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Digite seu CPF
              </h2>
              <p className="text-gray-600 mb-6">
                Informe o CPF que deseja consultar os boletos
              </p>

              <input
                type="text"
                value={cpf}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setCpf(value);
                }}
                placeholder="000.000.000-00"
                maxLength={11}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0D7377] focus:outline-none mb-6"
              />

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCpfModal(false);
                    setCpf("");
                  }}
                  className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    setShowCpfModal(false);
                    handleAuthorize();
                  }}
                  disabled={cpf.length !== 11}
                  className="flex-1 px-6 py-3 bg-[#0D7377] text-white rounded-xl font-semibold hover:bg-[#0D7377]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuar
                </button>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    );
  }

  // Tela de listagem de boletos
  return (
    <DashboardLayout accountType="cpf">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Meus Boletos</h1>
            <p className="text-gray-600">
              {boletos.length} boleto{boletos.length !== 1 ? 's' : ''} encontrado{boletos.length !== 1 ? 's' : ''}
            </p>
          </div>

          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 text-[#0D7377] animate-spin" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {!loading && !error && boletos.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhum boleto encontrado
            </h3>
            <p className="text-gray-600">
              Não encontramos boletos registrados em seu CPF.
            </p>
          </div>
        )}

        {!loading && !error && boletos.length > 0 && (
          <div className="space-y-4">
            {boletos.map((boleto) => {
              const statusConfig = getStatusConfig(boleto.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={boleto.id}
                  className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 ${statusConfig.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <StatusIcon className={`w-6 h-6 ${statusConfig.color}`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">
                          {boleto.beneficiario}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {boleto.descricao || 'Sem descrição'}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`px-3 py-1 ${statusConfig.bg} ${statusConfig.color} text-xs font-semibold rounded-full`}>
                            {statusConfig.label}
                          </span>
                          <span className="text-xs text-gray-500">
                            {boleto.banco}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(boleto.valor)}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Vencimento: {formatDate(boleto.dataVencimento)}
                      </p>
                      {boleto.dataPagamento && (
                        <p className="text-xs text-green-600 mt-1">
                          Pago em: {formatDate(boleto.dataPagamento)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Linha Digitável</p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 text-sm font-mono bg-gray-50 px-3 py-2 rounded-lg">
                          {boleto.linhaDigitavel}
                        </code>
                        <button
                          onClick={() => copyToClipboard(boleto.linhaDigitavel)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Copiar"
                        >
                          <Copy className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1">Código de Barras</p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 text-sm font-mono bg-gray-50 px-3 py-2 rounded-lg">
                          {boleto.codigoBarras}
                        </code>
                        <button
                          onClick={() => copyToClipboard(boleto.codigoBarras)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Copiar"
                        >
                          <Copy className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

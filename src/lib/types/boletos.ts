// Tipos para o sistema de boletos com Open Finance

export type BoletoStatus = 'pago' | 'pendente' | 'vencido';

export interface Boleto {
  id: string;
  valor: number;
  dataVencimento: string;
  codigoBarras: string;
  linhaDigitavel: string;
  beneficiario: string;
  pagador: {
    nome: string;
    cpf: string;
  };
  status: BoletoStatus;
  dataPagamento?: string;
  valorPago?: number;
  banco: string;
  nossoNumero: string;
  descricao?: string;
}

export interface OpenFinanceConsent {
  consentId: string;
  status: 'AWAITING_AUTHORISATION' | 'AUTHORISED' | 'REJECTED' | 'CONSUMED';
  creationDateTime: string;
  expirationDateTime: string;
  permissions: string[];
  cpf: string;
}

export interface OpenFinanceAuthResponse {
  authorizationUrl: string;
  consentId: string;
  state: string;
}

export interface BoletosResponse {
  boletos: Boleto[];
  totalCount: number;
  lastUpdate: string;
}

// Cliente para integração com Open Finance Brasil

import type { OpenFinanceConsent, OpenFinanceAuthResponse } from './types/boletos';

const OPEN_FINANCE_API_URL = process.env.NEXT_PUBLIC_OPEN_FINANCE_API_URL || 'https://api.openfinancebrasil.org.br';
const CLIENT_ID = process.env.OPEN_FINANCE_CLIENT_ID;
const CLIENT_SECRET = process.env.OPEN_FINANCE_CLIENT_SECRET;
const REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL + '/api/open-finance/callback';

export class OpenFinanceClient {
  private baseUrl: string;
  private clientId: string;
  private clientSecret: string;

  constructor() {
    this.baseUrl = OPEN_FINANCE_API_URL;
    this.clientId = CLIENT_ID || '';
    this.clientSecret = CLIENT_SECRET || '';
  }

  /**
   * Cria um consentimento para acesso aos dados de boletos
   */
  async createConsent(cpf: string): Promise<OpenFinanceConsent> {
    const response = await fetch(`${this.baseUrl}/consents/v1/consents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await this.getAccessToken()}`,
      },
      body: JSON.stringify({
        data: {
          loggedUser: {
            document: {
              identification: cpf,
              rel: 'CPF',
            },
          },
          permissions: [
            'PAYMENTS_READ',
            'PAYMENTS_BOLETO_READ',
            'PAYMENTS_BOLETO_CONSULT',
          ],
          expirationDateTime: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 ano
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Falha ao criar consentimento');
    }

    const data = await response.json();
    return data.data;
  }

  /**
   * Gera URL de autorização para o usuário
   */
  async getAuthorizationUrl(consentId: string, cpf: string): Promise<OpenFinanceAuthResponse> {
    const state = this.generateState();
    const nonce = this.generateNonce();

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: REDIRECT_URI,
      scope: 'openid payments',
      state,
      nonce,
      consent_id: consentId,
      cpf,
    });

    const authorizationUrl = `${this.baseUrl}/auth/authorize?${params.toString()}`;

    return {
      authorizationUrl,
      consentId,
      state,
    };
  }

  /**
   * Troca o código de autorização por um token de acesso
   */
  async exchangeCodeForToken(code: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
      }),
    });

    if (!response.ok) {
      throw new Error('Falha ao trocar código por token');
    }

    const data = await response.json();
    return data.access_token;
  }

  /**
   * Obtém token de acesso para APIs do Open Finance
   */
  private async getAccessToken(): Promise<string> {
    const response = await fetch(`${this.baseUrl}/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        scope: 'payments',
      }),
    });

    if (!response.ok) {
      throw new Error('Falha ao obter token de acesso');
    }

    const data = await response.json();
    return data.access_token;
  }

  /**
   * Consulta boletos do usuário
   */
  async getBoletos(accessToken: string, cpf: string) {
    const response = await fetch(`${this.baseUrl}/payments/v1/boletos`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'x-fapi-interaction-id': this.generateInteractionId(),
      },
    });

    if (!response.ok) {
      throw new Error('Falha ao consultar boletos');
    }

    const data = await response.json();
    return data.data;
  }

  /**
   * Verifica status do consentimento
   */
  async getConsentStatus(consentId: string): Promise<OpenFinanceConsent> {
    const response = await fetch(`${this.baseUrl}/consents/v1/consents/${consentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${await this.getAccessToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Falha ao verificar status do consentimento');
    }

    const data = await response.json();
    return data.data;
  }

  // Funções auxiliares
  private generateState(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  private generateNonce(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  private generateInteractionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }
}

export const openFinanceClient = new OpenFinanceClient();

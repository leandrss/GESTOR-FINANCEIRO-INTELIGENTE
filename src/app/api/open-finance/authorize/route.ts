import { NextRequest, NextResponse } from 'next/server';
import { openFinanceClient } from '@/lib/open-finance';

/**
 * POST /api/open-finance/authorize
 * Inicia o fluxo de autorização do Open Finance
 */
export async function POST(request: NextRequest) {
  try {
    const { cpf } = await request.json();

    if (!cpf) {
      return NextResponse.json(
        { error: 'CPF é obrigatório' },
        { status: 400 }
      );
    }

    // Validação básica de CPF
    const cpfClean = cpf.replace(/\D/g, '');
    if (cpfClean.length !== 11) {
      return NextResponse.json(
        { error: 'CPF inválido' },
        { status: 400 }
      );
    }

    // Cria consentimento no Open Finance
    const consent = await openFinanceClient.createConsent(cpfClean);

    // Gera URL de autorização
    const authResponse = await openFinanceClient.getAuthorizationUrl(
      consent.consentId,
      cpfClean
    );

    // Salva o state e consentId na sessão (em produção, use um banco de dados)
    // Por enquanto, retornamos para o cliente gerenciar

    return NextResponse.json({
      success: true,
      authorizationUrl: authResponse.authorizationUrl,
      consentId: authResponse.consentId,
      state: authResponse.state,
    });
  } catch (error) {
    console.error('Erro ao iniciar autorização:', error);
    return NextResponse.json(
      { error: 'Erro ao iniciar autorização do Open Finance' },
      { status: 500 }
    );
  }
}

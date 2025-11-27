import { NextRequest, NextResponse } from 'next/server';
import { openFinanceClient } from '@/lib/open-finance';

/**
 * GET /api/open-finance/callback
 * Recebe o callback do Open Finance após autorização do usuário
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // Verifica se houve erro na autorização
    if (error) {
      return NextResponse.redirect(
        new URL(`/boletos?error=${error}`, request.url)
      );
    }

    // Verifica se o código foi fornecido
    if (!code) {
      return NextResponse.redirect(
        new URL('/boletos?error=missing_code', request.url)
      );
    }

    // Valida o state (em produção, compare com o state salvo na sessão)
    // Por enquanto, apenas verificamos se existe
    if (!state) {
      return NextResponse.redirect(
        new URL('/boletos?error=invalid_state', request.url)
      );
    }

    // Troca o código por um token de acesso
    const accessToken = await openFinanceClient.exchangeCodeForToken(code);

    // Redireciona para a página de boletos com o token
    // Em produção, salve o token de forma segura (sessão, cookie httpOnly, etc)
    const redirectUrl = new URL('/boletos', request.url);
    redirectUrl.searchParams.set('authorized', 'true');
    redirectUrl.searchParams.set('token', accessToken);

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('Erro no callback do Open Finance:', error);
    return NextResponse.redirect(
      new URL('/boletos?error=callback_failed', request.url)
    );
  }
}

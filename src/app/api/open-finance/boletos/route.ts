import { NextRequest, NextResponse } from 'next/server';
import { openFinanceClient } from '@/lib/open-finance';
import type { Boleto } from '@/lib/types/boletos';

/**
 * GET /api/open-finance/boletos
 * Consulta boletos do usuário via Open Finance
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const accessToken = searchParams.get('token');
    const cpf = searchParams.get('cpf');

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Token de acesso não fornecido' },
        { status: 401 }
      );
    }

    if (!cpf) {
      return NextResponse.json(
        { error: 'CPF não fornecido' },
        { status: 400 }
      );
    }

    // Consulta boletos via Open Finance
    const boletosData = await openFinanceClient.getBoletos(accessToken, cpf);

    // Transforma os dados para o formato da aplicação
    const boletos: Boleto[] = boletosData.map((item: any) => {
      const dataVencimento = new Date(item.dueDate);
      const hoje = new Date();
      const isPago = item.status === 'PAID';
      const isVencido = !isPago && dataVencimento < hoje;

      return {
        id: item.paymentId || item.boletoId,
        valor: parseFloat(item.amount),
        dataVencimento: item.dueDate,
        codigoBarras: item.barCode,
        linhaDigitavel: item.digitableLine,
        beneficiario: item.beneficiary?.name || 'Não informado',
        pagador: {
          nome: item.payer?.name || 'Não informado',
          cpf: cpf,
        },
        status: isPago ? 'pago' : isVencido ? 'vencido' : 'pendente',
        dataPagamento: item.paymentDate,
        valorPago: item.paidAmount ? parseFloat(item.paidAmount) : undefined,
        banco: item.bankName || 'Não informado',
        nossoNumero: item.ourNumber || '',
        descricao: item.description,
      };
    });

    // Ordena por data de vencimento (mais recente primeiro)
    boletos.sort((a, b) => 
      new Date(b.dataVencimento).getTime() - new Date(a.dataVencimento).getTime()
    );

    return NextResponse.json({
      success: true,
      boletos,
      totalCount: boletos.length,
      lastUpdate: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Erro ao consultar boletos:', error);
    return NextResponse.json(
      { error: 'Erro ao consultar boletos. Tente novamente.' },
      { status: 500 }
    );
  }
}

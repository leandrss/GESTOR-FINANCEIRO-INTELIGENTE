/**
 * Formata um número para o padrão de moeda brasileira (R$)
 * 
 * @param value - Número a ser formatado
 * @returns String formatada no padrão R$ 0.000.000,00
 * 
 * @example
 * formatCurrency(5) // "R$ 5,00"
 * formatCurrency(1500) // "R$ 1.500,00"
 * formatCurrency(0001500) // "R$ 1.500,00"
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

/**
 * Formata um valor de input em tempo real para moeda brasileira
 * Remove caracteres inválidos e aplica formatação
 * 
 * @param value - String do input
 * @returns String formatada para exibição no input
 * 
 * @example
 * formatCurrencyInput("1500") // "1.500,00"
 * formatCurrencyInput("15.50") // "15,50"
 */
export function formatCurrencyInput(value: string): string {
  // Remove tudo exceto números
  const numbers = value.replace(/\D/g, '');
  
  if (!numbers) return '';
  
  // Converte para número (centavos)
  const amount = parseInt(numbers) / 100;
  
  // Formata
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Converte string formatada de moeda para número
 * 
 * @param value - String no formato "1.500,00" ou "R$ 1.500,00"
 * @returns Número decimal
 * 
 * @example
 * parseCurrency("1.500,00") // 1500
 * parseCurrency("R$ 1.500,00") // 1500
 */
export function parseCurrency(value: string): number {
  // Remove R$, espaços e pontos (separador de milhar)
  const cleaned = value.replace(/[R$\s.]/g, '');
  // Substitui vírgula por ponto
  const normalized = cleaned.replace(',', '.');
  return parseFloat(normalized) || 0;
}

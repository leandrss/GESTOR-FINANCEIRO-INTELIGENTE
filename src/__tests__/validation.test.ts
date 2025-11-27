// ============================================
// TESTES UNITÁRIOS - VALIDAÇÕES
// ============================================

import { describe, it, expect } from '@jest/globals';
import { validateCPF, validateCNPJ, formatCPF, formatCNPJ, formatCurrency } from '../lib/validation';

describe('Validação de CPF', () => {
  it('deve validar CPF válido', () => {
    expect(validateCPF('123.456.789-09')).toBe(true);
    expect(validateCPF('12345678909')).toBe(true);
  });

  it('deve rejeitar CPF inválido', () => {
    expect(validateCPF('123.456.789-00')).toBe(false);
    expect(validateCPF('111.111.111-11')).toBe(false);
    expect(validateCPF('12345678')).toBe(false);
  });
});

describe('Validação de CNPJ', () => {
  it('deve validar CNPJ válido', () => {
    expect(validateCNPJ('11.222.333/0001-81')).toBe(true);
    expect(validateCNPJ('11222333000181')).toBe(true);
  });

  it('deve rejeitar CNPJ inválido', () => {
    expect(validateCNPJ('11.222.333/0001-00')).toBe(false);
    expect(validateCNPJ('11.111.111/1111-11')).toBe(false);
    expect(validateCNPJ('1122233300')).toBe(false);
  });
});

describe('Formatação', () => {
  it('deve formatar CPF corretamente', () => {
    expect(formatCPF('12345678909')).toBe('123.456.789-09');
  });

  it('deve formatar CNPJ corretamente', () => {
    expect(formatCNPJ('11222333000181')).toBe('11.222.333/0001-81');
  });

  it('deve formatar moeda corretamente', () => {
    expect(formatCurrency(1234.56)).toBe('R$ 1.234,56');
    expect(formatCurrency(0.99)).toBe('R$ 0,99');
  });
});

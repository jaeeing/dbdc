import type { TaxResult } from '../../types';
import { getServiceYearDeduction, getConversionRate, TAX_BRACKETS, ANNUITY_TAX_DISCOUNT } from '../../constants';

// 퇴직소득세 간이 계산
function calculateIncomeTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;
  for (const bracket of TAX_BRACKETS) {
    if (taxableIncome <= bracket.limit) {
      return taxableIncome * bracket.rate - bracket.deduction;
    }
  }
  const last = TAX_BRACKETS[TAX_BRACKETS.length - 1];
  return taxableIncome * last.rate - last.deduction;
}

export function calculateRetirementTax(
  grossAmount: number,
  totalServiceYears: number,
): TaxResult {
  if (grossAmount <= 0 || totalServiceYears <= 0) {
    return {
      grossAmount,
      serviceYearDeduction: 0,
      taxableAmount: 0,
      taxAmount: 0,
      netAmount: grossAmount,
      annuity10yr: { monthly: 0, taxReduction: 0 },
      annuity20yr: { monthly: 0, taxReduction: 0 },
    };
  }

  // 1. 근속연수 공제
  const serviceDeduction = getServiceYearDeduction(totalServiceYears);

  // 2. 환산급여 = (퇴직급여 - 근속연수공제) × 환산율 / 근속연수
  const conversionRate = getConversionRate(totalServiceYears);
  const netRetirement = Math.max(grossAmount - serviceDeduction, 0);
  const convertedIncome = (netRetirement * conversionRate) / totalServiceYears;

  // 3. 환산급여에 대한 세금 계산
  const taxOnConverted = calculateIncomeTax(convertedIncome);

  // 4. 실제 세금 = 환산급여 세금 × 근속연수 / 환산율
  const taxAmount = Math.max((taxOnConverted * totalServiceYears) / conversionRate, 0);

  const netAmount = grossAmount - taxAmount;

  // 연금 수령 계산
  const annuity10yrTax = taxAmount * (1 - ANNUITY_TAX_DISCOUNT['10yr']);
  const annuity20yrTax = taxAmount * (1 - ANNUITY_TAX_DISCOUNT['20yr']);

  return {
    grossAmount,
    serviceYearDeduction: serviceDeduction,
    taxableAmount: convertedIncome * totalServiceYears,
    taxAmount,
    netAmount,
    annuity10yr: {
      monthly: (grossAmount - annuity10yrTax) / (10 * 12),
      taxReduction: taxAmount - annuity10yrTax,
    },
    annuity20yr: {
      monthly: (grossAmount - annuity20yrTax) / (20 * 12),
      taxReduction: taxAmount - annuity20yrTax,
    },
  };
}

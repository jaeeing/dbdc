// 퇴직소득세 근속연수 공제
export function getServiceYearDeduction(years: number): number {
  if (years <= 0) return 0;
  if (years <= 5) return years * 100;
  if (years <= 10) return 500 + (years - 5) * 200;
  if (years <= 20) return 1500 + (years - 10) * 250;
  return 4000 + (years - 20) * 300;
}

// 환산급여 배율 (근속연수 기준)
export function getConversionRate(years: number): number {
  return years <= 10 ? 0.7 : 0.6;
}

// 소득세 누진세율 구간 (만원 단위)
export const TAX_BRACKETS = [
  { limit: 1400, rate: 0.06, deduction: 0 },
  { limit: 5000, rate: 0.15, deduction: 126 },
  { limit: 8800, rate: 0.24, deduction: 576 },
  { limit: 15000, rate: 0.35, deduction: 1544 },
  { limit: 30000, rate: 0.38, deduction: 1994 },
  { limit: 50000, rate: 0.4, deduction: 2594 },
  { limit: 100000, rate: 0.42, deduction: 3594 },
  { limit: Infinity, rate: 0.45, deduction: 6594 },
] as const;

// 연금 수령 시 퇴직소득세 감면율
export const ANNUITY_TAX_DISCOUNT = {
  '10yr': 0.3,
  '20yr': 0.4,
} as const;

export const CHART_COLORS = {
  db: '#2563eb',
  dc: '#16a34a',
  dcPrincipal: '#86efac',
  dcReturns: '#16a34a',
  difference: '#f59e0b',
  breakEven: '#dc2626',
} as const;

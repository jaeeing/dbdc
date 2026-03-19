import type { YearlyResult } from '../../types';

// 현재 가치로 환산
export function deflateAmount(amount: number, inflationRate: number, years: number): number {
  if (inflationRate <= 0 || years <= 0) return amount;
  return amount / Math.pow(1 + inflationRate, years);
}

// 연도별 데이터 전체를 실질가치로 환산
export function deflateYearlyData(
  data: YearlyResult[],
  inflationRate: number,
): YearlyResult[] {
  return data.map((row) => ({
    ...row,
    salary: deflateAmount(row.salary, inflationRate, row.year),
    dbAccumulated: deflateAmount(row.dbAccumulated, inflationRate, row.year),
    dcBalance: deflateAmount(row.dcBalance, inflationRate, row.year),
    dcPrincipal: deflateAmount(row.dcPrincipal, inflationRate, row.year),
    dcReturns: deflateAmount(row.dcReturns, inflationRate, row.year),
  }));
}

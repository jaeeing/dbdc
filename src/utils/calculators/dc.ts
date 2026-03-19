import type { YearlyResult } from '../../types';
import { getSalaryForYear } from './db';

export interface DCYearlyData {
  year: number;
  dcBalance: number;
  dcPrincipal: number;
  dcReturns: number;
}

// DC 최초 전환금 계산
export function calculateInitialTransfer(
  currentSalary: number,
  currentServiceYears: number,
): number {
  return (currentSalary / 12) * currentServiceYears;
}

// DC 연도별 계산 (복리)
// DC잔액[0] = (초기금액 + 1년차부담금) × (1 + 수익률)
// DC잔액[i] = (DC잔액[i-1] + i+1년차부담금) × (1 + 수익률)
export function calculateDCYearly(
  currentSalary: number,
  currentServiceYears: number,
  remainingYears: number,
  salaryIncreaseRate: number,
  returnRate: number,
  initialTransferOverride: number | null,
  manualSalaries?: number[],
): DCYearlyData[] {
  const results: DCYearlyData[] = [];
  const initialTransfer = initialTransferOverride ?? calculateInitialTransfer(currentSalary, currentServiceYears);

  let balance = initialTransfer;
  let totalContributed = initialTransfer;

  // Year 0: 전환 시점
  results.push({
    year: 0,
    dcBalance: balance,
    dcPrincipal: totalContributed,
    dcReturns: 0,
  });

  for (let i = 1; i <= remainingYears; i++) {
    const salary = getSalaryForYear(currentSalary, i, salaryIncreaseRate, manualSalaries);
    const annualContribution = salary / 12;
    totalContributed += annualContribution;

    // 연초에 부담금 납입 → 연말에 수익 반영
    balance = (balance + annualContribution) * (1 + returnRate);

    results.push({
      year: i,
      dcBalance: balance,
      dcPrincipal: totalContributed,
      dcReturns: balance - totalContributed,
    });
  }

  return results;
}

// DC 최종 금액만 계산
export function calculateDC(
  currentSalary: number,
  currentServiceYears: number,
  remainingYears: number,
  salaryIncreaseRate: number,
  returnRate: number,
  initialTransferOverride: number | null,
  manualSalaries?: number[],
): number {
  const yearly = calculateDCYearly(
    currentSalary, currentServiceYears, remainingYears,
    salaryIncreaseRate, returnRate, initialTransferOverride, manualSalaries,
  );
  return yearly[yearly.length - 1]?.dcBalance ?? 0;
}

// 연도별 결과를 DB 데이터와 합쳐서 반환
export function mergeYearlyData(
  dbData: { year: number; salary: number; dbAccumulated: number }[],
  dcData: DCYearlyData[],
): YearlyResult[] {
  return dbData.map((db, i) => {
    const dc = dcData[i] || { dcBalance: 0, dcPrincipal: 0, dcReturns: 0 };
    return {
      year: db.year,
      salary: db.salary,
      dbAccumulated: db.dbAccumulated,
      dcBalance: dc.dcBalance,
      dcPrincipal: dc.dcPrincipal,
      dcReturns: dc.dcReturns,
    };
  });
}

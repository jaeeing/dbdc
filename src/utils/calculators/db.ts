import type { YearlyResult } from '../../types';

export function getSalaryForYear(
  currentSalary: number,
  year: number,
  salaryIncreaseRate: number,
  manualSalaries?: number[],
): number {
  if (manualSalaries && manualSalaries.length > year && manualSalaries[year] > 0) {
    return manualSalaries[year];
  }
  return currentSalary * Math.pow(1 + salaryIncreaseRate, year);
}

// DB 퇴직금 = (퇴직 시점 연봉 / 12) × 총 근속연수
export function calculateDB(
  currentSalary: number,
  currentServiceYears: number,
  remainingYears: number,
  salaryIncreaseRate: number,
  manualSalaries?: number[],
): number {
  const totalYears = currentServiceYears + remainingYears;
  const finalSalary = getSalaryForYear(currentSalary, remainingYears, salaryIncreaseRate, manualSalaries);
  return (finalSalary / 12) * totalYears;
}

// 특정 시점(year)까지 근무했을 때의 DB 누적액
export function calculateDBAtYear(
  currentSalary: number,
  currentServiceYears: number,
  year: number,
  salaryIncreaseRate: number,
  manualSalaries?: number[],
): number {
  const totalYears = currentServiceYears + year;
  const salaryAtYear = getSalaryForYear(currentSalary, year, salaryIncreaseRate, manualSalaries);
  return (salaryAtYear / 12) * totalYears;
}

// 연도별 DB 누적 데이터 생성
export function calculateDBYearly(
  currentSalary: number,
  currentServiceYears: number,
  remainingYears: number,
  salaryIncreaseRate: number,
  manualSalaries?: number[],
): Pick<YearlyResult, 'year' | 'salary' | 'dbAccumulated'>[] {
  const results: Pick<YearlyResult, 'year' | 'salary' | 'dbAccumulated'>[] = [];
  for (let i = 0; i <= remainingYears; i++) {
    const salary = getSalaryForYear(currentSalary, i, salaryIncreaseRate, manualSalaries);
    const dbAccumulated = calculateDBAtYear(currentSalary, currentServiceYears, i, salaryIncreaseRate, manualSalaries);
    results.push({ year: i, salary, dbAccumulated });
  }
  return results;
}

import type { PensionInputs, SensitivityResult } from '../../types';
import { calculateDB } from './db';
import { calculateDC } from './dc';

export function calculateSensitivity(inputs: PensionInputs): SensitivityResult[] {
  const results: SensitivityResult[] = [];
  const salaries = inputs.salaryMode === 'manual' ? inputs.manualSalaries : undefined;
  const dbAmount = calculateDB(
    inputs.currentSalary, inputs.currentServiceYears,
    inputs.remainingYears, inputs.salaryIncreaseRate, salaries,
  );

  // 0.5% 간격으로 1% ~ 10%
  for (let rate = 0.01; rate <= 0.101; rate += 0.005) {
    const roundedRate = Math.round(rate * 1000) / 1000;
    const dcAmount = calculateDC(
      inputs.currentSalary, inputs.currentServiceYears,
      inputs.remainingYears, inputs.salaryIncreaseRate,
      roundedRate, inputs.dcInitialTransfer, salaries,
    );
    results.push({
      returnRate: roundedRate,
      dcAmount,
      dbAmount,
      difference: dcAmount - dbAmount,
    });
  }
  return results;
}

// 손익분기 수익률 이진 탐색
export function findBreakEvenRate(inputs: PensionInputs): number | null {
  const salaries = inputs.salaryMode === 'manual' ? inputs.manualSalaries : undefined;
  const dbAmount = calculateDB(
    inputs.currentSalary, inputs.currentServiceYears,
    inputs.remainingYears, inputs.salaryIncreaseRate, salaries,
  );

  let low = 0;
  let high = 0.3; // 최대 30%
  const epsilon = 0.0001;

  // DC가 수익률 0%에서도 DB보다 높으면 손익분기점 없음
  const dcAtZero = calculateDC(
    inputs.currentSalary, inputs.currentServiceYears,
    inputs.remainingYears, inputs.salaryIncreaseRate,
    0, inputs.dcInitialTransfer, salaries,
  );
  if (dcAtZero >= dbAmount) return 0;

  // DC가 30%에서도 DB보다 낮으면 범위 밖
  const dcAtMax = calculateDC(
    inputs.currentSalary, inputs.currentServiceYears,
    inputs.remainingYears, inputs.salaryIncreaseRate,
    high, inputs.dcInitialTransfer, salaries,
  );
  if (dcAtMax < dbAmount) return null;

  for (let i = 0; i < 50; i++) {
    const mid = (low + high) / 2;
    const dcAtMid = calculateDC(
      inputs.currentSalary, inputs.currentServiceYears,
      inputs.remainingYears, inputs.salaryIncreaseRate,
      mid, inputs.dcInitialTransfer, salaries,
    );
    if (Math.abs(dcAtMid - dbAmount) < epsilon) return mid;
    if (dcAtMid < dbAmount) low = mid;
    else high = mid;
  }
  return (low + high) / 2;
}

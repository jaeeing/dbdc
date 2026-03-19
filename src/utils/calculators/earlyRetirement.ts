import type { PensionInputs, EarlyRetirementResult } from '../../types';
import { calculateDB } from './db';
import { calculateDC } from './dc';

export function calculateEarlyRetirementScenarios(
  inputs: PensionInputs,
  yearsList?: number[],
): EarlyRetirementResult[] {
  const scenarios = yearsList || [5, 10, 15, 20, 25, 30].filter(y => y <= inputs.remainingYears + 10);
  const salaries = inputs.salaryMode === 'manual' ? inputs.manualSalaries : undefined;

  return scenarios.map((remaining) => {
    const totalYears = inputs.currentServiceYears + remaining;
    const dbAmount = calculateDB(
      inputs.currentSalary, inputs.currentServiceYears,
      remaining, inputs.salaryIncreaseRate, salaries,
    );
    const dcAmount = calculateDC(
      inputs.currentSalary, inputs.currentServiceYears,
      remaining, inputs.salaryIncreaseRate,
      inputs.dcReturnRate, inputs.dcInitialTransfer, salaries,
    );

    return {
      remainingYears: remaining,
      totalYears,
      dbAmount,
      dcAmount,
      difference: dcAmount - dbAmount,
      dcIsBetter: dcAmount > dbAmount,
    };
  });
}

import { useMemo } from 'react';
import type { PensionInputs, CalculationResult, SensitivityResult, EarlyRetirementResult, TaxResult } from '../types';
import { calculateDBYearly } from '../utils/calculators/db';
import { calculateDCYearly, mergeYearlyData } from '../utils/calculators/dc';
import { calculateSensitivity, findBreakEvenRate } from '../utils/calculators/sensitivity';
import { calculateEarlyRetirementScenarios } from '../utils/calculators/earlyRetirement';
import { calculateRetirementTax } from '../utils/calculators/tax';
import { deflateYearlyData } from '../utils/calculators/inflation';

interface UseCalculationReturn {
  result: CalculationResult;
  displayData: CalculationResult;
  sensitivity: SensitivityResult[];
  earlyRetirement: EarlyRetirementResult[];
  dbTax: TaxResult;
  dcTax: TaxResult;
}

export function useCalculation(inputs: PensionInputs): UseCalculationReturn {
  const salaries = inputs.salaryMode === 'manual' ? inputs.manualSalaries : undefined;

  const result = useMemo<CalculationResult>(() => {
    const dbYearly = calculateDBYearly(
      inputs.currentSalary, inputs.currentServiceYears,
      inputs.remainingYears, inputs.salaryIncreaseRate, salaries,
    );
    const dcYearly = calculateDCYearly(
      inputs.currentSalary, inputs.currentServiceYears,
      inputs.remainingYears, inputs.salaryIncreaseRate,
      inputs.dcReturnRate, inputs.dcInitialTransfer, salaries,
    );
    const yearlyData = mergeYearlyData(dbYearly, dcYearly);
    const dbFinal = yearlyData[yearlyData.length - 1]?.dbAccumulated ?? 0;
    const dcFinal = yearlyData[yearlyData.length - 1]?.dcBalance ?? 0;
    const breakEvenRate = findBreakEvenRate(inputs);

    return {
      dbFinal,
      dcFinal,
      difference: dcFinal - dbFinal,
      dcIsBetter: dcFinal > dbFinal,
      yearlyData,
      breakEvenRate,
    };
  }, [inputs, salaries]);

  const displayData = useMemo<CalculationResult>(() => {
    if (!inputs.showRealValues) return result;
    const deflated = deflateYearlyData(result.yearlyData, inputs.inflationRate);
    const dbFinal = deflated[deflated.length - 1]?.dbAccumulated ?? 0;
    const dcFinal = deflated[deflated.length - 1]?.dcBalance ?? 0;
    return {
      ...result,
      dbFinal,
      dcFinal,
      difference: dcFinal - dbFinal,
      dcIsBetter: dcFinal > dbFinal,
      yearlyData: deflated,
    };
  }, [result, inputs.showRealValues, inputs.inflationRate]);

  const sensitivity = useMemo(() => calculateSensitivity(inputs), [inputs]);

  const earlyRetirement = useMemo(
    () => calculateEarlyRetirementScenarios(inputs),
    [inputs],
  );

  const dbTax = useMemo(
    () => calculateRetirementTax(result.dbFinal, inputs.currentServiceYears + inputs.remainingYears),
    [result.dbFinal, inputs.currentServiceYears, inputs.remainingYears],
  );

  const dcTax = useMemo(
    () => calculateRetirementTax(result.dcFinal, inputs.currentServiceYears + inputs.remainingYears),
    [result.dcFinal, inputs.currentServiceYears, inputs.remainingYears],
  );

  return { result, displayData, sensitivity, earlyRetirement, dbTax, dcTax };
}

export interface PensionInputs {
  currentSalary: number; // 만원
  currentServiceYears: number;
  remainingYears: number;
  salaryIncreaseRate: number; // 0.035 = 3.5%
  salaryMode: 'uniform' | 'manual';
  manualSalaries: number[]; // 연도별 연봉 (만원)
  dcReturnRate: number; // 0.05 = 5%
  dcInitialTransfer: number | null; // null이면 자동 계산
  inflationRate: number; // 0.025 = 2.5%
  showRealValues: boolean;
}

export interface YearlyResult {
  year: number;
  salary: number;
  dbAccumulated: number;
  dcBalance: number;
  dcPrincipal: number;
  dcReturns: number;
}

export interface CalculationResult {
  dbFinal: number;
  dcFinal: number;
  difference: number; // DC - DB
  dcIsBetter: boolean;
  yearlyData: YearlyResult[];
  breakEvenRate: number | null;
}

export interface TaxResult {
  grossAmount: number;
  serviceYearDeduction: number;
  taxableAmount: number;
  taxAmount: number;
  netAmount: number;
  annuity10yr: { monthly: number; taxReduction: number };
  annuity20yr: { monthly: number; taxReduction: number };
}

export interface EarlyRetirementResult {
  remainingYears: number;
  totalYears: number;
  dbAmount: number;
  dcAmount: number;
  difference: number;
  dcIsBetter: boolean;
}

export interface SensitivityResult {
  returnRate: number;
  dcAmount: number;
  dbAmount: number;
  difference: number;
}

export interface Scenario {
  id: string;
  name: string;
  inputs: PensionInputs;
  result: CalculationResult;
  createdAt: number;
}

export const DEFAULT_INPUTS: PensionInputs = {
  currentSalary: 5000,
  currentServiceYears: 5,
  remainingYears: 20,
  salaryIncreaseRate: 0.035,
  salaryMode: 'uniform',
  manualSalaries: [],
  dcReturnRate: 0.05,
  dcInitialTransfer: null,
  inflationRate: 0.025,
  showRealValues: false,
};

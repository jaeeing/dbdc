import type { PensionInputs } from '../../types';
import { Toggle } from '../common/Toggle';
import { YearBySalaryTable } from './YearBySalaryTable';

interface SalaryModeProps {
  inputs: PensionInputs;
  onChange: (updates: Partial<PensionInputs>) => void;
}

export function SalaryMode({ inputs, onChange }: SalaryModeProps) {
  const isManual = inputs.salaryMode === 'manual';

  const handleToggle = (checked: boolean) => {
    if (checked) {
      // 수동 모드로 전환 시 균일 상승률 기반으로 초기화
      const salaries: number[] = [];
      for (let i = 0; i <= inputs.remainingYears; i++) {
        salaries.push(Math.round(inputs.currentSalary * Math.pow(1 + inputs.salaryIncreaseRate, i)));
      }
      onChange({ salaryMode: 'manual', manualSalaries: salaries });
    } else {
      onChange({ salaryMode: 'uniform', manualSalaries: [] });
    }
  };

  return (
    <div className="space-y-3">
      <Toggle
        label="연도별 연봉 직접 입력"
        checked={isManual}
        onChange={handleToggle}
        description="특정 연도의 연봉을 직접 수정할 수 있습니다"
      />
      {isManual && (
        <YearBySalaryTable inputs={inputs} onChange={onChange} />
      )}
    </div>
  );
}

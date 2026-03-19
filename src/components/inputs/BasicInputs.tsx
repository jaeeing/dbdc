import type { PensionInputs } from '../../types';
import { SliderInput } from './SliderInput';

interface BasicInputsProps {
  inputs: PensionInputs;
  onChange: (updates: Partial<PensionInputs>) => void;
}

export function BasicInputs({ inputs, onChange }: BasicInputsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <SliderInput
        label="현재 연봉 (세전)"
        value={inputs.currentSalary}
        onChange={(v) => onChange({ currentSalary: v })}
        min={2000}
        max={30000}
        step={100}
        unit="만원"
        tooltip="세전 연봉을 만원 단위로 입력하세요"
      />
      <SliderInput
        label="현재 근속연수"
        value={inputs.currentServiceYears}
        onChange={(v) => onChange({ currentServiceYears: Math.round(v) })}
        min={0}
        max={40}
        step={1}
        unit="년"
        tooltip="현재까지의 근무 기간"
      />
      <SliderInput
        label="예상 잔여 근무연수"
        value={inputs.remainingYears}
        onChange={(v) => onChange({ remainingYears: Math.round(v) })}
        min={1}
        max={40}
        step={1}
        unit="년"
        tooltip="앞으로 근무할 예상 연수"
      />
      <SliderInput
        label="매년 연봉 상승률"
        value={inputs.salaryIncreaseRate}
        onChange={(v) => onChange({ salaryIncreaseRate: v })}
        min={0}
        max={0.15}
        step={0.005}
        unit="%"
        isPercent
        tooltip="매년 동일하게 적용되는 연봉 인상률"
      />
    </div>
  );
}

import type { PensionInputs } from '../../types';
import { Toggle } from '../common/Toggle';
import { SliderInput } from '../inputs/SliderInput';

interface InflationToggleProps {
  inputs: PensionInputs;
  onChange: (updates: Partial<PensionInputs>) => void;
}

export function InflationToggle({ inputs, onChange }: InflationToggleProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
      <Toggle
        label="실질가치(현재 가치) 표시"
        checked={inputs.showRealValues}
        onChange={(v) => onChange({ showRealValues: v })}
        description="물가상승률을 반영한 현재 가치로 환산"
      />
      {inputs.showRealValues && (
        <div className="sm:w-64">
          <SliderInput
            label="물가상승률"
            value={inputs.inflationRate}
            onChange={(v) => onChange({ inflationRate: v })}
            min={0}
            max={0.1}
            step={0.005}
            unit="%"
            isPercent
          />
        </div>
      )}
    </div>
  );
}

import type { PensionInputs } from '../../types';
import { SliderInput } from './SliderInput';
import { calculateInitialTransfer } from '../../utils/calculators/dc';
import { formatManwon } from '../../utils/formatters';

interface DcInputsProps {
  inputs: PensionInputs;
  onChange: (updates: Partial<PensionInputs>) => void;
}

export function DcInputs({ inputs, onChange }: DcInputsProps) {
  const autoTransfer = calculateInitialTransfer(inputs.currentSalary, inputs.currentServiceYears);
  const isAutoTransfer = inputs.dcInitialTransfer === null;

  return (
    <div className="space-y-4">
      <SliderInput
        label="연평균 투자수익률"
        value={inputs.dcReturnRate}
        onChange={(v) => onChange({ dcReturnRate: v })}
        min={0}
        max={0.15}
        step={0.005}
        unit="%"
        isPercent
        tooltip="DC 적립금의 연평균 기대 투자수익률"
      />
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">DC 전환 시 최초 입금액</label>
          <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
            <input
              type="checkbox"
              checked={isAutoTransfer}
              onChange={(e) => onChange({ dcInitialTransfer: e.target.checked ? null : autoTransfer })}
              className="rounded border-gray-300"
            />
            자동 계산
          </label>
        </div>
        {isAutoTransfer ? (
          <p className="text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
            자동 계산: <strong className="text-gray-700">{formatManwon(autoTransfer)}</strong>
            <span className="text-xs block mt-0.5">= 현재 연봉 ÷ 12 × 현재 근속연수</span>
          </p>
        ) : (
          <SliderInput
            label=""
            value={inputs.dcInitialTransfer ?? autoTransfer}
            onChange={(v) => onChange({ dcInitialTransfer: v })}
            min={0}
            max={50000}
            step={100}
            unit="만원"
          />
        )}
      </div>
    </div>
  );
}

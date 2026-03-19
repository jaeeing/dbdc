import { Tooltip } from '../common/Tooltip';
import { parseNumberInput } from '../../utils/validators';

interface SliderInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  unit?: string;
  tooltip?: string;
  isPercent?: boolean;
}

export function SliderInput({
  label, value, onChange, min, max, step, unit = '', tooltip, isPercent = false,
}: SliderInputProps) {
  const displayValue = isPercent ? value * 100 : value;
  const displayMin = isPercent ? min * 100 : min;
  const displayMax = isPercent ? max * 100 : max;
  const displayStep = isPercent ? step * 100 : step;

  const handleInputChange = (raw: string) => {
    const parsed = parseNumberInput(raw);
    const actual = isPercent ? parsed / 100 : parsed;
    onChange(Math.min(Math.max(actual, min), max));
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          {tooltip ? <Tooltip content={tooltip}>{label}</Tooltip> : label}
        </label>
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={Number(displayValue.toFixed(2))}
            onChange={(e) => handleInputChange(e.target.value)}
            className="w-24 text-right px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            min={displayMin}
            max={displayMax}
            step={displayStep}
          />
          {unit && <span className="text-sm text-gray-500 w-8">{unit}</span>}
        </div>
      </div>
      <input
        type="range"
        value={displayValue}
        onChange={(e) => handleInputChange(e.target.value)}
        min={displayMin}
        max={displayMax}
        step={displayStep}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-gray-400">
        <span>{displayMin}{unit}</span>
        <span>{displayMax}{unit}</span>
      </div>
    </div>
  );
}

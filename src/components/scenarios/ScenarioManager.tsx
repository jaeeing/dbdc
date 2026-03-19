import { useState } from 'react';
import type { PensionInputs, CalculationResult, Scenario } from '../../types';

interface ScenarioManagerProps {
  scenarios: Scenario[];
  currentInputs: PensionInputs;
  currentResult: CalculationResult;
  onSave: (name: string, inputs: PensionInputs, result: CalculationResult) => void;
  onDelete: (id: string) => void;
  onLoad: (inputs: PensionInputs) => void;
}

export function ScenarioManager({
  scenarios, currentInputs, currentResult, onSave, onDelete, onLoad,
}: ScenarioManagerProps) {
  const [name, setName] = useState('');

  const handleSave = () => {
    const scenarioName = name.trim() || `시나리오 ${scenarios.length + 1}`;
    onSave(scenarioName, currentInputs, currentResult);
    setName('');
  };

  return (
    <div className="space-y-4">
      {/* Save */}
      <div className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="시나리오 이름 (예: 보수적, 공격적)"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
        <button
          onClick={handleSave}
          disabled={scenarios.length >= 3}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          저장 {scenarios.length >= 3 && '(최대 3개)'}
        </button>
      </div>

      {/* Saved scenarios */}
      {scenarios.length > 0 && (
        <div className="space-y-2">
          {scenarios.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 border border-gray-100"
            >
              <div>
                <p className="text-sm font-medium text-gray-800">{s.name}</p>
                <p className="text-xs text-gray-500">
                  연봉 {s.inputs.currentSalary.toLocaleString()}만원 · 수익률 {(s.inputs.dcReturnRate * 100).toFixed(1)}% · 잔여 {s.inputs.remainingYears}년
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onLoad(s.inputs)}
                  className="px-3 py-1 text-xs bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  불러오기
                </button>
                <button
                  onClick={() => onDelete(s.id)}
                  className="px-3 py-1 text-xs text-red-600 bg-white border border-red-200 rounded-md hover:bg-red-50 transition-colors"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

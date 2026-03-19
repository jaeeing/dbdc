import type { Scenario } from '../../types';
import { formatManwon, formatPercent } from '../../utils/formatters';

interface ScenarioComparisonProps {
  scenarios: Scenario[];
}

export function ScenarioComparison({ scenarios }: ScenarioComparisonProps) {
  if (scenarios.length < 2) {
    return (
      <p className="text-sm text-gray-500 text-center py-4">
        2개 이상의 시나리오를 저장하면 비교할 수 있습니다
      </p>
    );
  }

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2.5 text-left text-gray-600 font-medium">항목</th>
            {scenarios.map((s) => (
              <th key={s.id} className="px-4 py-2.5 text-right text-gray-800 font-medium">
                {s.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-gray-100">
            <td className="px-4 py-2 text-gray-600">연봉</td>
            {scenarios.map((s) => (
              <td key={s.id} className="px-4 py-2 text-right">{formatManwon(s.inputs.currentSalary)}</td>
            ))}
          </tr>
          <tr className="border-t border-gray-100">
            <td className="px-4 py-2 text-gray-600">연봉 상승률</td>
            {scenarios.map((s) => (
              <td key={s.id} className="px-4 py-2 text-right">{formatPercent(s.inputs.salaryIncreaseRate)}</td>
            ))}
          </tr>
          <tr className="border-t border-gray-100">
            <td className="px-4 py-2 text-gray-600">투자수익률</td>
            {scenarios.map((s) => (
              <td key={s.id} className="px-4 py-2 text-right">{formatPercent(s.inputs.dcReturnRate)}</td>
            ))}
          </tr>
          <tr className="border-t border-gray-100">
            <td className="px-4 py-2 text-gray-600">잔여 근무연수</td>
            {scenarios.map((s) => (
              <td key={s.id} className="px-4 py-2 text-right">{s.inputs.remainingYears}년</td>
            ))}
          </tr>
          <tr className="border-t border-gray-200 bg-blue-50/50">
            <td className="px-4 py-2 font-medium text-blue-700">DB 최종</td>
            {scenarios.map((s) => (
              <td key={s.id} className="px-4 py-2 text-right font-semibold text-blue-700">
                {formatManwon(Math.round(s.result.dbFinal))}
              </td>
            ))}
          </tr>
          <tr className="border-t border-gray-100 bg-green-50/50">
            <td className="px-4 py-2 font-medium text-green-700">DC 최종</td>
            {scenarios.map((s) => (
              <td key={s.id} className="px-4 py-2 text-right font-semibold text-green-700">
                {formatManwon(Math.round(s.result.dcFinal))}
              </td>
            ))}
          </tr>
          <tr className="border-t border-gray-200">
            <td className="px-4 py-2 font-medium text-gray-800">유리한 쪽</td>
            {scenarios.map((s) => (
              <td key={s.id} className={`px-4 py-2 text-right font-bold ${s.result.dcIsBetter ? 'text-green-600' : 'text-blue-600'}`}>
                {s.result.dcIsBetter ? 'DC' : 'DB'}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

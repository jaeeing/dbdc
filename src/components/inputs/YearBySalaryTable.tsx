import type { PensionInputs } from '../../types';
import { formatNumber } from '../../utils/formatters';

interface YearBySalaryTableProps {
  inputs: PensionInputs;
  onChange: (updates: Partial<PensionInputs>) => void;
}

export function YearBySalaryTable({ inputs, onChange }: YearBySalaryTableProps) {
  const salaries = inputs.manualSalaries;

  const handleChange = (index: number, value: string) => {
    const parsed = parseInt(value.replace(/[^0-9]/g, ''), 10);
    if (isNaN(parsed)) return;
    const updated = [...salaries];
    updated[index] = parsed;
    onChange({ manualSalaries: updated });
  };

  return (
    <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 sticky top-0">
          <tr>
            <th className="px-3 py-2 text-left text-gray-600 font-medium">연차</th>
            <th className="px-3 py-2 text-right text-gray-600 font-medium">연봉 (만원)</th>
            <th className="px-3 py-2 text-right text-gray-600 font-medium">전년 대비</th>
          </tr>
        </thead>
        <tbody>
          {salaries.map((salary, i) => {
            const prevSalary = i > 0 ? salaries[i - 1] : salary;
            const changeRate = i > 0 ? ((salary - prevSalary) / prevSalary * 100).toFixed(1) : '-';
            return (
              <tr key={i} className="border-t border-gray-100 hover:bg-blue-50/30">
                <td className="px-3 py-1.5 text-gray-600">
                  {i === 0 ? '현재' : `+${i}년`}
                </td>
                <td className="px-3 py-1.5 text-right">
                  <input
                    type="text"
                    value={formatNumber(salary)}
                    onChange={(e) => handleChange(i, e.target.value)}
                    className="w-28 text-right px-2 py-0.5 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </td>
                <td className="px-3 py-1.5 text-right text-gray-500">
                  {changeRate === '-' ? '-' : `${changeRate}%`}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

import type { YearlyResult } from '../../types';
import { formatNumber } from '../../utils/formatters';

interface ComparisonTableProps {
  data: YearlyResult[];
  currentServiceYears: number;
}

export function ComparisonTable({ data, currentServiceYears }: ComparisonTableProps) {
  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 sticky top-0">
          <tr>
            <th className="px-3 py-2.5 text-left text-gray-600 font-medium whitespace-nowrap">연차</th>
            <th className="px-3 py-2.5 text-right text-gray-600 font-medium whitespace-nowrap">연봉</th>
            <th className="px-3 py-2.5 text-right text-blue-600 font-medium whitespace-nowrap">DB 누적</th>
            <th className="px-3 py-2.5 text-right text-green-600 font-medium whitespace-nowrap">DC 잔액</th>
            <th className="px-3 py-2.5 text-right text-green-600 font-medium whitespace-nowrap">DC 원금</th>
            <th className="px-3 py-2.5 text-right text-green-600 font-medium whitespace-nowrap">DC 수익</th>
            <th className="px-3 py-2.5 text-right text-gray-600 font-medium whitespace-nowrap">차이(DC-DB)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => {
            const diff = row.dcBalance - row.dbAccumulated;
            const dcLeads = diff > 0;
            return (
              <tr
                key={row.year}
                className={`border-t border-gray-100 ${dcLeads ? 'bg-green-50/30' : ''}`}
              >
                <td className="px-3 py-2 text-gray-600 whitespace-nowrap">
                  {row.year === 0 ? '현재' : `+${row.year}년`}
                  <span className="text-gray-400 text-xs ml-1">
                    (총 {currentServiceYears + row.year}년)
                  </span>
                </td>
                <td className="px-3 py-2 text-right whitespace-nowrap">{formatNumber(row.salary)}</td>
                <td className="px-3 py-2 text-right text-blue-600 whitespace-nowrap font-medium">
                  {formatNumber(row.dbAccumulated)}
                </td>
                <td className="px-3 py-2 text-right text-green-600 whitespace-nowrap font-medium">
                  {formatNumber(Math.round(row.dcBalance))}
                </td>
                <td className="px-3 py-2 text-right text-gray-600 whitespace-nowrap">
                  {formatNumber(Math.round(row.dcPrincipal))}
                </td>
                <td className="px-3 py-2 text-right text-gray-600 whitespace-nowrap">
                  {formatNumber(Math.round(row.dcReturns))}
                </td>
                <td className={`px-3 py-2 text-right whitespace-nowrap font-medium ${dcLeads ? 'text-green-600' : 'text-blue-600'}`}>
                  {diff >= 0 ? '+' : ''}{formatNumber(Math.round(diff))}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

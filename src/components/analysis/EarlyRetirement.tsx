import type { EarlyRetirementResult } from '../../types';
import { formatManwon, formatManwonShort } from '../../utils/formatters';
import { CHART_COLORS } from '../../constants';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts';

interface EarlyRetirementProps {
  data: EarlyRetirementResult[];
  currentServiceYears: number;
}

export function EarlyRetirement({ data, currentServiceYears }: EarlyRetirementProps) {
  const chartData = data.map((d) => ({
    label: `${d.remainingYears}년 후`,
    DB: Math.round(d.dbAmount),
    DC: Math.round(d.dcAmount),
  }));

  return (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="label" fontSize={12} />
          <YAxis tickFormatter={formatManwonShort} fontSize={12} width={60} />
          <Tooltip formatter={(v) => formatManwonShort(Number(v))} />
          <Legend />
          <Bar dataKey="DB" fill={CHART_COLORS.db} radius={[4, 4, 0, 0]} barSize={28} />
          <Bar dataKey="DC" fill={CHART_COLORS.dc} radius={[4, 4, 0, 0]} barSize={28} />
        </BarChart>
      </ResponsiveContainer>

      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-gray-600 font-medium">퇴직 시점</th>
              <th className="px-3 py-2 text-right text-gray-600 font-medium">총 근속</th>
              <th className="px-3 py-2 text-right text-blue-600 font-medium">DB</th>
              <th className="px-3 py-2 text-right text-green-600 font-medium">DC</th>
              <th className="px-3 py-2 text-right text-gray-600 font-medium">유리한 쪽</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.remainingYears} className="border-t border-gray-100">
                <td className="px-3 py-2">{d.remainingYears}년 후</td>
                <td className="px-3 py-2 text-right">{currentServiceYears + d.remainingYears}년</td>
                <td className="px-3 py-2 text-right text-blue-600">{formatManwon(d.dbAmount)}</td>
                <td className="px-3 py-2 text-right text-green-600">{formatManwon(Math.round(d.dcAmount))}</td>
                <td className={`px-3 py-2 text-right font-medium ${d.dcIsBetter ? 'text-green-600' : 'text-blue-600'}`}>
                  {d.dcIsBetter ? 'DC' : 'DB'} (+{formatManwon(Math.round(Math.abs(d.difference)))})
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

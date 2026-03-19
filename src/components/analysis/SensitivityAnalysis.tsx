import type { SensitivityResult } from '../../types';
import { CHART_COLORS } from '../../constants';
import { formatManwonShort, formatPercent } from '../../utils/formatters';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts';

interface SensitivityAnalysisProps {
  data: SensitivityResult[];
  breakEvenRate: number | null;
}

export function SensitivityAnalysis({ data, breakEvenRate }: SensitivityAnalysisProps) {
  const chartData = data.map((d) => ({
    rate: `${(d.returnRate * 100).toFixed(1)}%`,
    rateNum: d.returnRate,
    DC: Math.round(d.dcAmount),
    DB: Math.round(d.dbAmount),
  }));

  return (
    <div className="space-y-4">
      {breakEvenRate !== null ? (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
          <p className="text-sm text-amber-800">
            <strong>손익분기 수익률: {formatPercent(breakEvenRate)}</strong>
            <span className="ml-2 text-amber-600">
              — 이 수익률 이상이면 DC가 DB보다 유리합니다
            </span>
          </p>
        </div>
      ) : (
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
          <p className="text-sm text-blue-800">
            현재 조건에서는 수익률 0%에서도 DC가 DB보다 유리하거나, 30% 이상의 수익률이 필요합니다.
          </p>
        </div>
      )}

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="rate" fontSize={11} />
          <YAxis tickFormatter={formatManwonShort} fontSize={12} width={60} />
          <Tooltip
            formatter={(v, name) => [formatManwonShort(Number(v)), String(name)]}
            labelFormatter={(l) => `수익률 ${l}`}
          />
          <Legend />
          <Line
            type="monotone" dataKey="DB" stroke={CHART_COLORS.db}
            strokeWidth={2} strokeDasharray="5 5" dot={false}
          />
          <Line
            type="monotone" dataKey="DC" stroke={CHART_COLORS.dc}
            strokeWidth={2.5} dot={false} activeDot={{ r: 4 }}
          />
          {breakEvenRate !== null && (
            <ReferenceLine
              x={`${(breakEvenRate * 100).toFixed(1)}%`}
              stroke={CHART_COLORS.breakEven}
              strokeDasharray="3 3"
              label={{ value: '손익분기', fill: CHART_COLORS.breakEven, fontSize: 11 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>

      {/* 데이터 테이블 */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-3 py-2 text-left text-gray-600">수익률</th>
              <th className="px-3 py-2 text-right text-blue-600">DB</th>
              <th className="px-3 py-2 text-right text-green-600">DC</th>
              <th className="px-3 py-2 text-right text-gray-600">차이</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.returnRate} className={`border-t border-gray-100 ${d.difference >= 0 ? 'bg-green-50/30' : ''}`}>
                <td className="px-3 py-1.5">{(d.returnRate * 100).toFixed(1)}%</td>
                <td className="px-3 py-1.5 text-right">{formatManwonShort(d.dbAmount)}</td>
                <td className="px-3 py-1.5 text-right">{formatManwonShort(d.dcAmount)}</td>
                <td className={`px-3 py-1.5 text-right font-medium ${d.difference >= 0 ? 'text-green-600' : 'text-blue-600'}`}>
                  {d.difference >= 0 ? '+' : ''}{formatManwonShort(d.difference)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

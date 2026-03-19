import type { YearlyResult } from '../../types';
import { CHART_COLORS } from '../../constants';
import { formatManwonShort } from '../../utils/formatters';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

interface ComparisonChartsProps {
  data: YearlyResult[];
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload) return null;
  return (
    <div className="bg-white px-3 py-2 border border-gray-200 rounded-lg shadow-lg text-sm">
      <p className="font-medium text-gray-700 mb-1">+{label}년차</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name}: {formatManwonShort(entry.value)}
        </p>
      ))}
    </div>
  );
}

export function ComparisonCharts({ data }: ComparisonChartsProps) {
  const chartData = data.map((d) => ({
    year: d.year,
    DB: Math.round(d.dbAccumulated),
    DC: Math.round(d.dcBalance),
    'DC 원금': Math.round(d.dcPrincipal),
    'DC 수익': Math.round(d.dcReturns),
  }));

  const finalData = data.length > 0
    ? [
        { name: 'DB', value: Math.round(data[data.length - 1].dbAccumulated) },
        { name: 'DC', value: Math.round(data[data.length - 1].dcBalance) },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* 꺾은선 차트: DB vs DC 추이 */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">연도별 누적 금액 추이</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="year" tickFormatter={(v) => `+${v}년`} fontSize={12} />
            <YAxis tickFormatter={formatManwonShort} fontSize={12} width={60} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone" dataKey="DB" stroke={CHART_COLORS.db}
              strokeWidth={2.5} dot={false} activeDot={{ r: 4 }}
            />
            <Line
              type="monotone" dataKey="DC" stroke={CHART_COLORS.dc}
              strokeWidth={2.5} dot={false} activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 막대 차트: 최종 금액 비교 */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">최종 수령액 비교</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={finalData} barSize={60}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" fontSize={13} />
              <YAxis tickFormatter={formatManwonShort} fontSize={12} width={60} />
              <Tooltip formatter={(v) => formatManwonShort(Number(v))} />
              <Bar dataKey="value" name="금액" radius={[6, 6, 0, 0]}>
                {finalData.map((_, i) => (
                  <rect key={i} fill={i === 0 ? CHART_COLORS.db : CHART_COLORS.dc} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 영역 차트: DC 원금 vs 수익 */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">DC 원금 vs 투자수익 구성</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="year" tickFormatter={(v) => `+${v}년`} fontSize={12} />
              <YAxis tickFormatter={formatManwonShort} fontSize={12} width={60} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone" dataKey="DC 원금" stackId="1"
                stroke={CHART_COLORS.dcPrincipal} fill={CHART_COLORS.dcPrincipal} fillOpacity={0.6}
              />
              <Area
                type="monotone" dataKey="DC 수익" stackId="1"
                stroke={CHART_COLORS.dcReturns} fill={CHART_COLORS.dcReturns} fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

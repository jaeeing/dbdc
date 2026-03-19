import type { CalculationResult } from '../../types';
import { formatManwon } from '../../utils/formatters';

interface SummaryCardsProps {
  result: CalculationResult;
  showRealValues: boolean;
}

export function SummaryCards({ result, showRealValues }: SummaryCardsProps) {
  const { dbFinal, dcFinal, difference, dcIsBetter, breakEvenRate } = result;
  const absDiff = Math.abs(difference);
  const percentDiff = dbFinal > 0 ? (absDiff / dbFinal * 100).toFixed(1) : '0';

  return (
    <div className="space-y-4">
      {showRealValues && (
        <p className="text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg">
          현재 가치(실질가치)로 환산된 금액입니다
        </p>
      )}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <p className="text-xs text-blue-600 font-medium mb-1">DB (확정급여형)</p>
          <p className="text-lg sm:text-xl font-bold text-blue-700">{formatManwon(dbFinal)}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 border border-green-100">
          <p className="text-xs text-green-600 font-medium mb-1">DC (확정기여형)</p>
          <p className="text-lg sm:text-xl font-bold text-green-700">{formatManwon(dcFinal)}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <p className="text-xs text-gray-500 font-medium mb-1">차액</p>
          <p className={`text-lg sm:text-xl font-bold ${dcIsBetter ? 'text-green-600' : 'text-blue-600'}`}>
            {formatManwon(absDiff)}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">{percentDiff}% 차이</p>
        </div>
        <div className={`rounded-xl p-4 border ${dcIsBetter ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}`}>
          <p className="text-xs text-gray-500 font-medium mb-1">유리한 쪽</p>
          <p className={`text-lg sm:text-xl font-bold ${dcIsBetter ? 'text-green-700' : 'text-blue-700'}`}>
            {dcIsBetter ? 'DC 유리' : 'DB 유리'}
          </p>
          {breakEvenRate !== null && (
            <p className="text-xs text-gray-500 mt-0.5">
              손익분기 수익률: {(breakEvenRate * 100).toFixed(1)}%
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

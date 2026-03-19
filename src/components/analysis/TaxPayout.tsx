import type { TaxResult } from '../../types';
import { formatManwon } from '../../utils/formatters';

interface TaxPayoutProps {
  dbTax: TaxResult;
  dcTax: TaxResult;
  totalServiceYears: number;
}

function TaxCard({ title, tax, color }: { title: string; tax: TaxResult; color: 'blue' | 'green' }) {
  const colorClasses = color === 'blue'
    ? { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-700', header: 'text-blue-600' }
    : { bg: 'bg-green-50', border: 'border-green-100', text: 'text-green-700', header: 'text-green-600' };

  return (
    <div className={`${colorClasses.bg} rounded-xl p-4 border ${colorClasses.border} space-y-3`}>
      <h4 className={`font-semibold ${colorClasses.header}`}>{title}</h4>

      <div className="space-y-1.5 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">총 수령액 (세전)</span>
          <span className="font-medium">{formatManwon(tax.grossAmount)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">근속연수 공제</span>
          <span className="text-gray-700">-{formatManwon(tax.serviceYearDeduction)}</span>
        </div>
        <div className="flex justify-between border-t border-gray-200 pt-1.5">
          <span className="text-gray-600">퇴직소득세</span>
          <span className="text-red-600 font-medium">-{formatManwon(Math.round(tax.taxAmount))}</span>
        </div>
        <div className="flex justify-between border-t border-gray-200 pt-1.5">
          <span className="font-medium text-gray-900">실수령액 (일시금)</span>
          <span className={`font-bold ${colorClasses.text}`}>{formatManwon(Math.round(tax.netAmount))}</span>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-3 space-y-2">
        <p className="text-xs font-medium text-gray-600">연금 수령 시</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-white rounded-lg p-2">
            <p className="text-gray-500">10년 연금</p>
            <p className="font-semibold text-gray-800">{formatManwon(Math.round(tax.annuity10yr.monthly))}/월</p>
            <p className="text-green-600">세금 {formatManwon(Math.round(tax.annuity10yr.taxReduction))} 절감</p>
          </div>
          <div className="bg-white rounded-lg p-2">
            <p className="text-gray-500">20년 연금</p>
            <p className="font-semibold text-gray-800">{formatManwon(Math.round(tax.annuity20yr.monthly))}/월</p>
            <p className="text-green-600">세금 {formatManwon(Math.round(tax.annuity20yr.taxReduction))} 절감</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TaxPayout({ dbTax, dcTax, totalServiceYears }: TaxPayoutProps) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500">
        총 근속연수 {totalServiceYears}년 기준 · 퇴직소득세 간이 계산 · 연금 수령 시 퇴직소득세 30~40% 감면 적용
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TaxCard title="DB (확정급여형)" tax={dbTax} color="blue" />
        <TaxCard title="DC (확정기여형)" tax={dcTax} color="green" />
      </div>
    </div>
  );
}

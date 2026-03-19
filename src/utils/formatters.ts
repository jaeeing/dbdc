// 만원 단위를 읽기 좋은 형태로 포맷
export function formatManwon(value: number): string {
  if (value < 0) return '-' + formatManwon(-value);
  const rounded = Math.round(value);
  if (rounded >= 10000) {
    const eok = Math.floor(rounded / 10000);
    const remainder = rounded % 10000;
    if (remainder === 0) return `${eok.toLocaleString()}억원`;
    return `${eok.toLocaleString()}억 ${remainder.toLocaleString()}만원`;
  }
  return `${rounded.toLocaleString()}만원`;
}

// 간단한 만원 포맷 (차트 축 등에 사용)
export function formatManwonShort(value: number): string {
  if (Math.abs(value) >= 10000) {
    return `${(value / 10000).toFixed(1)}억`;
  }
  return `${Math.round(value).toLocaleString()}만`;
}

export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function formatNumber(value: number): string {
  return Math.round(value).toLocaleString();
}

// 월 수령액 표시
export function formatMonthly(value: number): string {
  return `월 ${formatManwon(value)}`;
}

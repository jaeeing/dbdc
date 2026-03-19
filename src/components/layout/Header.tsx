export function Header() {
  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          퇴직연금 DB vs DC 비교 시뮬레이터
        </h1>
        <p className="mt-2 text-sm sm:text-base text-gray-500">
          확정급여형(DB)과 확정기여형(DC)의 미래 수령액을 비교 분석합니다
        </p>
      </div>
    </header>
  );
}

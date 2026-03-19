export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-8">
      <div className="max-w-6xl mx-auto px-4 py-6 text-center">
        <p className="text-xs text-gray-400">
          본 시뮬레이터는 참고용이며, 실제 퇴직연금 수령액과 다를 수 있습니다.
          세금 계산은 간이 추정치이며, 정확한 세액은 세무 전문가에게 상담하시기 바랍니다.
        </p>
        <p className="text-xs text-gray-400 mt-1">
          근로자퇴직급여보장법 기준 · 2024년 세법 기준 간이 계산
        </p>
      </div>
    </footer>
  );
}

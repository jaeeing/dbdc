import { useCallback } from 'react';
import { DEFAULT_INPUTS, type PensionInputs } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useCalculation } from './hooks/useCalculation';
import { useScenarios } from './hooks/useScenarios';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Section } from './components/layout/Section';
import { InputSection } from './components/inputs/InputSection';
import { SummaryCards } from './components/results/SummaryCards';
import { ComparisonTable } from './components/results/ComparisonTable';
import { ComparisonCharts } from './components/results/ComparisonCharts';
import { SensitivityAnalysis } from './components/analysis/SensitivityAnalysis';
import { InflationToggle } from './components/analysis/InflationToggle';
import { EarlyRetirement } from './components/analysis/EarlyRetirement';
import { TaxPayout } from './components/analysis/TaxPayout';
import { ScenarioManager } from './components/scenarios/ScenarioManager';
import { ScenarioComparison } from './components/scenarios/ScenarioComparison';

function App() {
  const [inputs, setInputs] = useLocalStorage<PensionInputs>('pension-inputs', DEFAULT_INPUTS);
  const { result, displayData, sensitivity, earlyRetirement, dbTax, dcTax } = useCalculation(inputs);
  const { scenarios, saveScenario, deleteScenario } = useScenarios();

  const handleChange = useCallback((updates: Partial<PensionInputs>) => {
    setInputs((prev) => ({ ...prev, ...updates }));
  }, [setInputs]);

  const handleLoadScenario = useCallback((loadedInputs: PensionInputs) => {
    setInputs(loadedInputs);
  }, [setInputs]);

  const totalServiceYears = inputs.currentServiceYears + inputs.remainingYears;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-5">
        {/* 입력 영역 */}
        <InputSection inputs={inputs} onChange={handleChange} />

        {/* 물가상승률 토글 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-5 py-4">
          <InflationToggle inputs={inputs} onChange={handleChange} />
        </div>

        {/* 결과 요약 */}
        <Section title="비교 결과">
          <SummaryCards result={displayData} showRealValues={inputs.showRealValues} />
        </Section>

        {/* 비교 차트 */}
        <Section title="비교 차트">
          <ComparisonCharts data={displayData.yearlyData} />
        </Section>

        {/* 연도별 비교 테이블 */}
        <Section title="연도별 상세 비교" defaultOpen={false}>
          <div className="max-h-96 overflow-y-auto">
            <ComparisonTable
              data={displayData.yearlyData}
              currentServiceYears={inputs.currentServiceYears}
            />
          </div>
        </Section>

        {/* 민감도 분석 */}
        <Section title="민감도 분석" badge="수익률 변동" defaultOpen={false}>
          <SensitivityAnalysis
            data={sensitivity}
            breakEvenRate={result.breakEvenRate}
          />
        </Section>

        {/* 중도퇴사 시뮬레이션 */}
        <Section title="중도퇴사 시뮬레이션" defaultOpen={false}>
          <EarlyRetirement
            data={earlyRetirement}
            currentServiceYears={inputs.currentServiceYears}
          />
        </Section>

        {/* 세금 및 수령 방식 */}
        <Section title="세금 및 수령 방식" defaultOpen={false}>
          <TaxPayout
            dbTax={dbTax}
            dcTax={dcTax}
            totalServiceYears={totalServiceYears}
          />
        </Section>

        {/* 시나리오 관리 */}
        <Section title="시나리오 저장 및 비교" defaultOpen={false}>
          <div className="space-y-6">
            <ScenarioManager
              scenarios={scenarios}
              currentInputs={inputs}
              currentResult={result}
              onSave={saveScenario}
              onDelete={deleteScenario}
              onLoad={handleLoadScenario}
            />
            <ScenarioComparison scenarios={scenarios} />
          </div>
        </Section>
      </main>

      <Footer />
    </div>
  );
}

export default App;

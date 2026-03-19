import type { PensionInputs, CalculationResult, Scenario } from '../types';
import { useLocalStorage } from './useLocalStorage';

export function useScenarios() {
  const [scenarios, setScenarios] = useLocalStorage<Scenario[]>('pension-scenarios', []);

  const saveScenario = (name: string, inputs: PensionInputs, result: CalculationResult) => {
    setScenarios((prev) => {
      const newScenario: Scenario = {
        id: Date.now().toString(),
        name,
        inputs,
        result,
        createdAt: Date.now(),
      };
      const updated = [...prev, newScenario];
      return updated.slice(-3); // 최대 3개
    });
  };

  const deleteScenario = (id: string) => {
    setScenarios((prev) => prev.filter((s) => s.id !== id));
  };

  const clearAll = () => setScenarios([]);

  return { scenarios, saveScenario, deleteScenario, clearAll };
}

import type { PensionInputs } from '../../types';
import { Section } from '../layout/Section';
import { BasicInputs } from './BasicInputs';
import { SalaryMode } from './SalaryMode';
import { DcInputs } from './DcInputs';

interface InputSectionProps {
  inputs: PensionInputs;
  onChange: (updates: Partial<PensionInputs>) => void;
}

export function InputSection({ inputs, onChange }: InputSectionProps) {
  return (
    <div className="space-y-4">
      <Section title="기본 정보 입력">
        <div className="space-y-6">
          <BasicInputs inputs={inputs} onChange={onChange} />
          <div className="border-t border-gray-100 pt-4">
            <SalaryMode inputs={inputs} onChange={onChange} />
          </div>
        </div>
      </Section>

      <Section title="DC 설정" badge="확정기여형">
        <DcInputs inputs={inputs} onChange={onChange} />
      </Section>
    </div>
  );
}

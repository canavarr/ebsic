import { C, F } from '@/lib/theme';

const START_YEAR = 2026;
const END_YEAR = 2035;

interface YearStepperProps {
  currentYear: number;
  completedYears?: number[];
}

export default function YearStepper({ currentYear }: YearStepperProps) {
  const progress = ((currentYear - START_YEAR) / (END_YEAR - START_YEAR)) * 100;

  return (
    <div style={{ background: C.bg, padding: '14px 48px 10px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ ...F, fontSize: 11, fontWeight: 700, color: C.blue2 }}>
            {currentYear}
          </span>
          <span style={{ ...F, fontSize: 10, fontWeight: 600, color: C.gray }}>
            {currentYear - START_YEAR + 1} / {END_YEAR - START_YEAR + 1}
          </span>
        </div>
        <div style={{ height: 4, borderRadius: 2, background: '#dde1ec' }}>
          <div style={{
            height: '100%',
            borderRadius: 2,
            background: C.blue2,
            width: `${progress}%`,
            transition: 'width 0.4s ease',
          }} />
        </div>
      </div>
    </div>
  );
}

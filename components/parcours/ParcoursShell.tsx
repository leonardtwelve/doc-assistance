'use client';

import { Stepper } from '@/components/Stepper';
import { useParcoursStore } from '@/lib/parcours/store';
import type { ParcoursStepId } from '@/lib/parcours/steps';
import { ParcoursHero } from './ParcoursHero';

export function ParcoursShell({
  currentStepId,
  children,
  showHero = true,
}: {
  currentStepId: ParcoursStepId;
  children: React.ReactNode;
  showHero?: boolean;
}) {
  const completedSteps = useParcoursStore((s) => s.completedSteps);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      {showHero && <ParcoursHero />}
      <div className={showHero ? 'mt-8' : ''}>
        <Stepper currentStepId={currentStepId} completedStepIds={completedSteps} />
      </div>
      {children}
    </div>
  );
}

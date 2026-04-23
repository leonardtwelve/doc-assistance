import Link from 'next/link';
import { PARCOURS_STEPS, type ParcoursStepId, type StepStatus } from '@/lib/parcours/steps';

type StepperProps = {
  currentStepId: ParcoursStepId;
  completedStepIds?: ParcoursStepId[];
};

export function Stepper({ currentStepId, completedStepIds = [] }: StepperProps) {
  const currentIndex = PARCOURS_STEPS.findIndex((s) => s.id === currentStepId);
  const completed = new Set(completedStepIds);

  return (
    <nav aria-label="Étapes du parcours" className="w-full">
      <ol className="flex items-stretch gap-1 sm:gap-2 overflow-x-auto py-2">
        {PARCOURS_STEPS.map((step, index) => {
          const status: StepStatus = completed.has(step.id)
            ? 'done'
            : index === currentIndex
              ? 'current'
              : 'pending';
          const clickable = status === 'done';

          return (
            <li key={step.id} className="flex-1 min-w-[110px]">
              <StepItem step={step} index={index} status={status} clickable={clickable} />
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function StepItem({
  step,
  index,
  status,
  clickable,
}: {
  step: { id: string; label: string; href: string };
  index: number;
  status: StepStatus;
  clickable: boolean;
}) {
  const content = (
    <div
      className="group flex flex-col gap-2"
      aria-current={status === 'current' ? 'step' : undefined}
    >
      <div className="flex items-center gap-2">
        <StepBadge index={index} status={status} />
        <span
          className={[
            'text-sm font-medium truncate',
            status === 'current'
              ? 'text-brand-700'
              : status === 'done'
                ? 'text-success-700'
                : 'text-slate-500',
          ].join(' ')}
        >
          {step.label}
        </span>
      </div>
      <div
        className={[
          'h-0.5 rounded-full transition',
          status === 'current'
            ? 'bg-brand-600'
            : status === 'done'
              ? 'bg-success-500'
              : 'bg-slate-200',
        ].join(' ')}
      />
    </div>
  );

  if (clickable) {
    return (
      <Link
        href={step.href}
        className="block rounded-md outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
      >
        {content}
      </Link>
    );
  }

  return <div className="block">{content}</div>;
}

function StepBadge({ index, status }: { index: number; status: StepStatus }) {
  const base =
    'inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold shrink-0 border';

  if (status === 'done') {
    return (
      <span
        className={`${base} bg-success-500 text-white border-success-500`}
        aria-label="Étape complétée"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        >
          <path d="m5 12 5 5L20 7" />
        </svg>
      </span>
    );
  }

  if (status === 'current') {
    return (
      <span
        className={`${base} bg-brand-700 text-white border-brand-700`}
        aria-label="Étape en cours"
      >
        {index + 1}
      </span>
    );
  }

  return (
    <span className={`${base} bg-white text-slate-400 border-slate-300`} aria-label="Étape à venir">
      {index + 1}
    </span>
  );
}

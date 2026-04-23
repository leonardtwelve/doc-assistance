'use client';

import { useRouter } from 'next/navigation';
import { SINISTRE_TYPES } from '@/lib/parcours/sinistre-types';
import { useParcoursStore } from '@/lib/parcours/store';
import { SinistreIcon } from './SinistreIcon';

export function EtapeSinistre() {
  const router = useRouter();
  const sinistreType = useParcoursStore((s) => s.sinistreType);
  const setSinistreType = useParcoursStore((s) => s.setSinistreType);
  const markStepComplete = useParcoursStore((s) => s.markStepComplete);

  const canContinue = sinistreType !== null;

  const onContinue = () => {
    if (!canContinue) return;
    markStepComplete('sinistre');
    router.push('/declarer/informations');
  };

  return (
    <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-card">
      <header className="flex items-start gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
          </svg>
        </span>
        <div>
          <h2 className="font-serif text-2xl text-slate-900">Quel est votre sinistre ?</h2>
          <p className="text-sm text-slate-500">Sélectionnez la situation qui vous correspond</p>
        </div>
      </header>

      <div className="mt-6 flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 text-slate-500 shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4" />
          <path d="M12 16h.01" />
        </svg>
        <p>
          Munissez-vous de votre <strong className="text-slate-900">numéro de contrat</strong> et
          des <strong className="text-slate-900">justificatifs</strong> liés à votre situation avant
          de commencer.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SINISTRE_TYPES.map((t) => {
          const selected = sinistreType === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setSinistreType(t.id)}
              aria-pressed={selected}
              className={[
                'relative flex flex-col items-center gap-3 rounded-xl border p-5 text-center transition outline-none',
                'focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
                selected
                  ? 'border-brand-600 bg-brand-50/60 ring-1 ring-brand-600 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-brand-300 hover:bg-brand-50/30',
              ].join(' ')}
            >
              {selected && (
                <span className="absolute top-3 right-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-700 text-white">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <path d="m5 12 5 5L20 7" />
                  </svg>
                </span>
              )}
              <span
                className={[
                  'inline-flex h-12 w-12 items-center justify-center rounded-lg',
                  selected ? 'bg-brand-100 text-brand-700' : 'bg-slate-100 text-slate-600',
                ].join(' ')}
              >
                <SinistreIcon icon={t.icon} className="h-6 w-6" />
              </span>
              <span className="font-medium text-slate-900">{t.label}</span>
              <span className="text-xs text-slate-500 line-clamp-2">{t.subtitle}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={onContinue}
          disabled={!canContinue}
          className={[
            'inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition',
            canContinue
              ? 'bg-brand-700 text-white hover:bg-brand-800'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed',
          ].join(' ')}
        >
          Continuer
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m9 6 6 6-6 6" />
          </svg>
        </button>
      </div>
    </section>
  );
}

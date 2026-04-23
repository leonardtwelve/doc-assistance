import { Suspense } from 'react';
import { SuiviForm } from '@/components/SuiviForm';

export default function SuiviPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
      <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 text-brand-700 border border-brand-100 px-3 py-1 text-xs font-medium tracking-wide">
        <svg
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        SUIVI DE DOSSIER
      </span>
      <h1 className="mt-4 font-serif text-3xl sm:text-4xl text-slate-900">
        Consultez l&apos;état de votre dossier
      </h1>
      <p className="mt-2 text-slate-600">
        Entrez votre référence{' '}
        <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">SIN-AAAA-MM-NNNNNN</code> et
        l&apos;email renseigné lors de la déclaration.
      </p>

      <Suspense fallback={null}>
        <SuiviForm />
      </Suspense>

      <div className="mt-6 text-xs text-slate-500">
        Vous n&apos;avez pas encore déclaré de sinistre ?{' '}
        <a href="/declarer" className="font-medium text-brand-700 hover:text-brand-800">
          Déclarer un sinistre →
        </a>
      </div>
    </div>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { useParcoursStore } from '@/lib/parcours/store';
import { formatEuro } from '@/lib/parcours/mock-decision';

export function EtapeDecision() {
  const router = useRouter();
  const decision = useParcoursStore((s) => s.decision);
  const reference = useParcoursStore((s) => s.reference);
  const submittedAt = useParcoursStore((s) => s.submittedAt);
  const reset = useParcoursStore((s) => s.reset);

  if (!decision || !reference) {
    return (
      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-slate-700">
          Aucune décision disponible. Veuillez soumettre votre dossier.
        </p>
        <button
          type="button"
          onClick={() => router.push('/declarer')}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-700 px-4 py-2 text-sm text-white hover:bg-brand-800"
        >
          Retour à l&apos;étape 1
        </button>
      </section>
    );
  }

  const accepted = decision.status === 'ACCEPTED';
  const submittedDate = submittedAt ? new Date(submittedAt) : new Date();

  return (
    <div className="mt-8 space-y-6">
      <div
        className={[
          'rounded-xl p-8 text-center text-white shadow-card',
          accepted ? 'bg-success-700' : 'bg-danger-600',
        ].join(' ')}
      >
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/15">
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            {accepted ? <path d="m5 12 5 5L20 7" /> : <path d="M6 6l12 12M6 18 18 6" />}
          </svg>
        </span>
        <h2 className="mt-4 font-serif text-3xl">
          {accepted ? 'Proposition de remboursement établie' : 'Dossier non éligible'}
        </h2>
        <p className="mt-1 text-sm opacity-90">
          Référence : <span className="tracking-wider">{reference}</span>
        </p>
        <p className="mt-3 text-sm opacity-90 max-w-xl mx-auto">
          {accepted
            ? 'Docmana a validé votre dossier. Votre accord est requis pour déclencher le virement.'
            : "Docmana n'a pas pu valider votre dossier. Un gestionnaire vous contactera sous 24h."}
        </p>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-card">
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
            <h3 className="font-serif text-xl text-slate-900">Décision Docmana</h3>
            <p className="text-sm text-slate-500">
              Raisonnement détaillé — analysé le{' '}
              {new Intl.DateTimeFormat('fr-FR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }).format(new Date(decision.analyzedAt))}
            </p>
          </div>
        </header>

        <div
          className={[
            'mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-lg p-5',
            accepted ? 'bg-success-50/60' : 'bg-danger-500/5',
          ].join(' ')}
        >
          <div>
            <p className="text-xs tracking-wider font-semibold text-slate-500">Décision</p>
            <span
              className={[
                'mt-1 inline-flex rounded-md px-2 py-0.5 text-xs font-medium text-white',
                accepted ? 'bg-success-600' : 'bg-danger-600',
              ].join(' ')}
            >
              {accepted ? 'Accepté' : 'Refusé'}
            </span>
          </div>
          <div>
            <p className="text-xs tracking-wider font-semibold text-slate-500">Montant remboursé</p>
            <p className="mt-1 font-serif text-2xl text-slate-900">{formatEuro(decision.amount)}</p>
          </div>
          <div>
            <p className="text-xs tracking-wider font-semibold text-slate-500">Délai de virement</p>
            <p className="mt-1 text-slate-900">48–72h ouvrées</p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-xs tracking-wider font-semibold text-slate-500">
            RAISONNEMENT DOCMANA — ÉTAPES D&apos;ANALYSE
          </p>
          <ol className="mt-4 space-y-4">
            {decision.reasoning.map((step, i) => (
              <li key={i} className="flex gap-3">
                <ReasoningDot status={step.status} />
                <div>
                  <p className="font-medium text-slate-900">{step.label}</p>
                  <p className="text-sm text-slate-600">{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-6">
          <p className="text-xs tracking-wider font-semibold text-slate-500">SUIVI DU DOSSIER</p>
          <ol className="mt-4 space-y-4">
            <SuiviStep
              dotClass="bg-success-500"
              title="Dossier soumis"
              detail="Accusé de réception envoyé à votre adresse email"
              badge={`Aujourd'hui à ${submittedDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`}
            />
            <SuiviStep
              dotClass="bg-success-500"
              title="Analyse automatique Docmana"
              detail="Classification, extraction, validation, corrélation effectuées"
              badge="Analysé à l'instant"
            />
            <SuiviStep
              dotClass="bg-brand-600"
              title="Décision motivée"
              detail={
                accepted ? 'Accord établi — en attente de confirmation assuré' : 'En revue humaine'
              }
              badge="En cours"
            />
            <SuiviStep
              dotClass="bg-slate-200"
              title="Virement SEPA"
              detail="Remboursement sur votre IBAN après confirmation"
              badge="48–72h après accord"
              muted
            />
          </ol>
        </div>
      </section>

      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <button
          type="button"
          onClick={() => router.push(`/suivi?ref=${reference}`)}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Accéder au suivi de dossier
        </button>
        <button
          type="button"
          onClick={() => {
            reset();
            router.push('/declarer');
          }}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-800"
        >
          Nouvelle déclaration
        </button>
      </div>
    </div>
  );
}

function ReasoningDot({ status }: { status: 'ok' | 'warn' | 'ko' }) {
  const styles =
    status === 'ok'
      ? 'bg-success-500/15 text-success-700'
      : status === 'warn'
        ? 'bg-warning-500/15 text-warning-500'
        : 'bg-danger-500/15 text-danger-600';
  return (
    <span
      className={`mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full ${styles}`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-3.5 w-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      >
        {status === 'ok' ? <path d="m5 12 5 5L20 7" /> : <path d="M6 6l12 12M6 18 18 6" />}
      </svg>
    </span>
  );
}

function SuiviStep({
  dotClass,
  title,
  detail,
  badge,
  muted,
}: {
  dotClass: string;
  title: string;
  detail: string;
  badge: string;
  muted?: boolean;
}) {
  return (
    <li className="flex gap-3">
      <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${dotClass}`} aria-hidden />
      <div>
        <p className={muted ? 'font-medium text-slate-500' : 'font-medium text-slate-900'}>
          {title}
        </p>
        <p className="text-xs text-slate-500">{detail}</p>
        <span className="mt-1 inline-flex rounded-md bg-success-50 px-2 py-0.5 text-xs text-success-700">
          {badge}
        </span>
      </div>
    </li>
  );
}

'use client';

import Link from 'next/link';
import { useDossiersStore } from '@/lib/parcours/dossiers-store';
import { formatEuro } from '@/lib/parcours/mock-decision';

const SINISTRE_LABELS: Record<string, string> = {
  annulation: 'Annulation de voyage',
  interruption: 'Interruption de séjour',
  bagages: 'Bagages perdus / volés',
  rapatriement: 'Rapatriement médical',
  retard: 'Retard de vol',
  autre: 'Autre situation',
};

export function DossierDetail({ reference }: { reference: string }) {
  const dossier = useDossiersStore((s) => s.findByReference(reference));

  if (!dossier) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-card">
        <svg
          viewBox="0 0 24 24"
          className="mx-auto h-12 w-12 text-slate-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4" />
          <path d="M12 16h.01" />
        </svg>
        <h2 className="mt-3 font-serif text-xl text-slate-900">Dossier introuvable</h2>
        <p className="mt-1 text-sm text-slate-600">
          La référence <code className="rounded bg-slate-100 px-1">{reference}</code> ne correspond
          à aucun dossier enregistré sur ce navigateur.
        </p>
        <Link
          href="/suivi"
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-700 px-4 py-2 text-sm text-white hover:bg-brand-800"
        >
          ← Retour au suivi
        </Link>
      </div>
    );
  }

  const accepted = dossier.decision.status === 'ACCEPTED';
  const submittedDate = new Date(dossier.submittedAt);

  return (
    <div className="space-y-6">
      <div
        className={[
          'rounded-xl p-6 text-white shadow-card',
          accepted ? 'bg-success-700' : 'bg-danger-600',
        ].join(' ')}
      >
        <p className="text-xs tracking-wider font-semibold opacity-80">ÉTAT DU DOSSIER</p>
        <h2 className="mt-1 font-serif text-2xl">
          {accepted ? 'Dossier accepté · virement en cours' : 'Dossier non éligible'}
        </h2>
        <p className="mt-2 text-sm opacity-90">
          Référence : <span className="tracking-wider">{dossier.reference}</span> · Soumis le{' '}
          {new Intl.DateTimeFormat('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          }).format(submittedDate)}
        </p>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-card">
        <h3 className="font-serif text-lg text-slate-900">Récapitulatif</h3>
        <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DossierCell label="Type de sinistre" value={SINISTRE_LABELS[dossier.sinistreType]} />
          <DossierCell label="N° de contrat" value={dossier.assure.contractNumber || '—'} />
          <DossierCell
            label="Assuré"
            value={`${dossier.assure.firstName} ${dossier.assure.lastName}`}
          />
          <DossierCell label="Destination" value={dossier.destination || '—'} />
          <DossierCell label="Montant déclaré" value={formatEuro(dossier.amount)} />
          <DossierCell
            label={accepted ? 'Montant remboursé' : 'Décision'}
            value={accepted ? formatEuro(dossier.decision.amount) : 'Refusé'}
            highlight={accepted ? 'success' : 'danger'}
          />
        </dl>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-card">
        <h3 className="font-serif text-lg text-slate-900">Timeline</h3>
        <ol className="mt-4 space-y-4">
          <TimelineStep
            dotClass="bg-success-500"
            title="Dossier soumis"
            detail="Accusé de réception envoyé à votre adresse email"
            badge={`${submittedDate.toLocaleDateString('fr-FR')} · ${submittedDate.toLocaleTimeString(
              'fr-FR',
              { hour: '2-digit', minute: '2-digit' },
            )}`}
          />
          <TimelineStep
            dotClass="bg-success-500"
            title="Analyse automatique Docmana"
            detail="Classification, extraction, validation, corrélation effectuées"
            badge="Terminé"
          />
          <TimelineStep
            dotClass={accepted ? 'bg-success-500' : 'bg-danger-500'}
            title="Décision motivée"
            detail={
              accepted
                ? 'Remboursement approuvé — en attente de confirmation assuré'
                : 'Dossier refusé — un gestionnaire vous recontacte'
            }
            badge="Terminé"
          />
          <TimelineStep
            dotClass={accepted ? 'bg-brand-600' : 'bg-slate-200'}
            title="Virement SEPA"
            detail={
              accepted ? `${formatEuro(dossier.decision.amount)} sur votre IBAN` : 'Non applicable'
            }
            badge={accepted ? 'Dans 48–72h' : '—'}
            muted={!accepted}
          />
        </ol>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-card">
        <h3 className="font-serif text-lg text-slate-900">Raisonnement Docmana</h3>
        <ol className="mt-4 space-y-3">
          {dossier.decision.reasoning.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span
                className={[
                  'mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full text-white',
                  step.status === 'ok'
                    ? 'bg-success-500'
                    : step.status === 'warn'
                      ? 'bg-warning-500'
                      : 'bg-danger-600',
                ].join(' ')}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-3 w-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  {step.status === 'ok' ? (
                    <path d="m5 12 5 5L20 7" />
                  ) : (
                    <path d="M6 6l12 12M6 18 18 6" />
                  )}
                </svg>
              </span>
              <div>
                <p className="font-medium text-slate-900 text-sm">{step.label}</p>
                <p className="text-xs text-slate-600">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <div className="flex justify-between">
        <Link
          href="/suivi"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          ← Autre dossier
        </Link>
        <Link
          href="/declarer"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Nouvelle déclaration
        </Link>
      </div>
    </div>
  );
}

function DossierCell({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: 'success' | 'danger';
}) {
  const valueClass =
    highlight === 'success'
      ? 'text-success-700 font-serif text-xl'
      : highlight === 'danger'
        ? 'text-danger-600 font-medium'
        : 'text-slate-900';
  return (
    <div>
      <dt className="text-xs tracking-wider font-semibold text-slate-500">{label}</dt>
      <dd className={`mt-1 ${valueClass}`}>{value}</dd>
    </div>
  );
}

function TimelineStep({
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
        <span className="mt-1 inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
          {badge}
        </span>
      </div>
    </li>
  );
}

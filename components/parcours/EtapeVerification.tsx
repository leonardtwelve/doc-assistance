'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getSinistreType } from '@/lib/parcours/sinistre-types';
import { useParcoursStore } from '@/lib/parcours/store';
import { useDossiersStore } from '@/lib/parcours/dossiers-store';
import { buildMockDecision, formatEuro, generateReference } from '@/lib/parcours/mock-decision';

export function EtapeVerification() {
  const router = useRouter();
  const sinistreType = useParcoursStore((s) => s.sinistreType);
  const assure = useParcoursStore((s) => s.assure);
  const sinistre = useParcoursStore((s) => s.sinistre);
  const documents = useParcoursStore((s) => s.documents);
  const consentRgpd = useParcoursStore((s) => s.consentRgpd);
  const setConsent = useParcoursStore((s) => s.setConsent);
  const submit = useParcoursStore((s) => s.submit);
  const markStepComplete = useParcoursStore((s) => s.markStepComplete);
  const addDossier = useDossiersStore((s) => s.addDossier);

  const [submitting, setSubmitting] = useState(false);

  const sinistreDef = getSinistreType(sinistreType);
  const docsCount = Object.values(documents).filter(Boolean).length;
  const amount = Number(sinistre.amount || 0);

  if (!sinistreType || !sinistreDef) {
    return (
      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-slate-700">Veuillez d&apos;abord compléter les étapes précédentes.</p>
      </section>
    );
  }

  const onSubmit = () => {
    if (!consentRgpd || submitting) return;
    setSubmitting(true);
    const reference = generateReference();
    const decision = buildMockDecision({
      reference,
      sinistreType,
      assure,
      sinistre,
      docsCount,
    });
    submit(reference, decision);
    addDossier({
      reference,
      submittedAt: new Date().toISOString(),
      sinistreType,
      assure: {
        firstName: assure.firstName,
        lastName: assure.lastName,
        email: assure.email,
        contractNumber: assure.contractNumber,
      },
      destination: sinistre.destination,
      amount: Number(sinistre.amount || 0),
      decision,
    });
    markStepComplete('verification');
    setTimeout(() => router.push('/declarer/decision'), 250);
  };

  const assureFullName =
    [assure.civility, assure.firstName, assure.lastName].filter(Boolean).join(' ').trim() || '—';

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
            <path d="m9 12 2 2 4-4" />
          </svg>
        </span>
        <div>
          <h2 className="font-serif text-2xl text-slate-900">Récapitulatif de votre dossier</h2>
          <p className="text-sm text-slate-500">Vérifiez avant soumission</p>
        </div>
      </header>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <RecapCell label="Type de sinistre" value={sinistreDef.label} />
        <RecapCell label="N° de contrat" value={assure.contractNumber || '—'} />
        <RecapCell label="Assuré" value={assureFullName} />
        <RecapCell label="Motif déclaré" value={sinistre.motif || '—'} />
        <RecapCell label="Destination" value={sinistre.destination || '—'} />
        <RecapCell label="Documents transmis" value={`${docsCount} document(s) joint(s)`} />
      </div>

      <div className="mt-6 flex items-center justify-between rounded-lg border border-success-500/30 bg-success-50/50 px-5 py-4">
        <div>
          <p className="text-xs font-semibold tracking-wider text-success-700">MONTANT DEMANDÉ</p>
          <p className="text-xs text-slate-600">Sous réserve d&apos;analyse Docmana</p>
        </div>
        <p className="font-serif text-2xl text-success-700">
          {amount > 0 ? formatEuro(amount) : '— €'}
        </p>
      </div>

      <div className="mt-8">
        <h3 className="text-xs tracking-wider font-semibold text-slate-500">
          SUIVI PRÉVU DE VOTRE DOSSIER
        </h3>
        <ol className="mt-4 space-y-4">
          <TimelineStep
            dotClass="bg-success-500"
            title="Dossier soumis"
            detail="Accusé de réception immédiat par email"
            badge="Immédiat"
          />
          <TimelineStep
            dotClass="bg-brand-600"
            title="Analyse automatique Docmana"
            detail="Classification, extraction, validation, corrélation des documents"
            badge="Sous 2h ouvrées"
          />
          <TimelineStep
            dotClass="bg-slate-200"
            title="Décision motivée"
            detail="Email avec la décision et son explication détaillée"
            badge="Sous 24h ouvrées"
            muted
          />
          <TimelineStep
            dotClass="bg-slate-200"
            title="Virement SEPA"
            detail="Remboursement sur votre IBAN si dossier accepté"
            badge="48–72h après décision"
            muted
          />
        </ol>
      </div>

      <label className="mt-8 flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 cursor-pointer">
        <input
          type="checkbox"
          checked={consentRgpd}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-slate-400 text-brand-700 focus:ring-brand-500"
        />
        <span className="text-sm text-slate-700">
          Je certifie l&apos;exactitude des informations transmises et consens au traitement
          automatisé de mon dossier par le système Docmana, conformément au RGPD. Je suis informé(e)
          de mon droit à demander une révision humaine de la décision.
        </span>
      </label>

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push('/declarer/documents')}
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          ← Modifier
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!consentRgpd || submitting}
          className={[
            'inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition',
            consentRgpd && !submitting
              ? 'bg-success-600 text-white hover:bg-success-700'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed',
          ].join(' ')}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="m5 12 5 5L20 7" />
          </svg>
          {submitting ? 'Soumission…' : 'Soumettre mon dossier'}
        </button>
      </div>
    </section>
  );
}

function RecapCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs tracking-wider font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-slate-900">{value}</p>
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
        <span className="mt-1 inline-flex rounded-md bg-brand-50 px-2 py-0.5 text-xs text-brand-700">
          {badge}
        </span>
      </div>
    </li>
  );
}

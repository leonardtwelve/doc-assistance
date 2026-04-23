'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { getSinistreType } from '@/lib/parcours/sinistre-types';
import { useParcoursStore } from '@/lib/parcours/store';
import {
  isValidAmount,
  isValidContract,
  isValidEmail,
  isValidIban,
  isValidPhone,
} from '@/lib/parcours/validation';

const MOTIFS_ANNULATION = [
  'Maladie',
  'Accident',
  'Décès',
  "Perte d'emploi",
  'Refus de visa',
  'Autre',
] as const;

const SINISTRE_LABELS: Record<string, string> = {
  annulation: 'ANNULATION DE VOYAGE',
  interruption: 'INTERRUPTION DE SÉJOUR',
  bagages: 'BAGAGES PERDUS / VOLÉS',
  rapatriement: 'RAPATRIEMENT MÉDICAL',
  retard: 'RETARD DE VOL',
  autre: 'AUTRE SITUATION',
};

export function EtapeInformations() {
  const router = useRouter();
  const sinistreType = useParcoursStore((s) => s.sinistreType);
  const assure = useParcoursStore((s) => s.assure);
  const sinistre = useParcoursStore((s) => s.sinistre);
  const bank = useParcoursStore((s) => s.bank);
  const setAssure = useParcoursStore((s) => s.setAssure);
  const setSinistre = useParcoursStore((s) => s.setSinistre);
  const setBank = useParcoursStore((s) => s.setBank);
  const markStepComplete = useParcoursStore((s) => s.markStepComplete);

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const sinistreDef = getSinistreType(sinistreType);
  const sinistreLabel = sinistreType ? SINISTRE_LABELS[sinistreType] : 'SINISTRE';

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!isValidContract(assure.contractNumber))
      e.contractNumber = 'Format invalide (ex: AV 12345)';
    if (!assure.birthDate) e.birthDate = 'Requis';
    if (!assure.firstName.trim()) e.firstName = 'Requis';
    if (!assure.lastName.trim()) e.lastName = 'Requis';
    if (!isValidEmail(assure.email)) e.email = 'Email invalide';
    if (!isValidPhone(assure.phone)) e.phone = 'Format invalide (ex: 06 12 34 56 78)';
    if (!sinistre.destination.trim()) e.destination = 'Requis';
    if (!sinistre.motif.trim()) e.motif = 'Requis';
    if (!isValidAmount(sinistre.amount)) e.amount = 'Montant > 0 requis';
    if (sinistreType === 'annulation' || sinistreType === 'interruption') {
      if (!sinistre.departureDate) e.departureDate = 'Requis';
      if (!sinistre.cancelDate) e.cancelDate = 'Requis';
    }
    if (!bank.holder.trim()) e.holder = 'Requis';
    if (!isValidIban(bank.iban)) e.iban = 'IBAN français invalide';
    return e;
  }, [assure, sinistre, bank, sinistreType]);

  const canContinue = Object.keys(errors).length === 0 && sinistreType !== null;

  const onContinue = () => {
    if (!canContinue) return;
    markStepComplete('informations');
    router.push('/declarer/documents');
  };

  if (!sinistreType) {
    return (
      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-slate-700">Veuillez d&apos;abord sélectionner un type de sinistre.</p>
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

  const showError = (field: string) => touched[field] && errors[field];
  const markTouched = (field: string) => setTouched((t) => ({ ...t, [field]: true }));

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
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
          </svg>
        </span>
        <div>
          <h2 className="font-serif text-2xl text-slate-900">Vos informations</h2>
          <p className="text-sm text-slate-500">
            {sinistreDef?.label ?? 'Sinistre'} — renseignez les détails
          </p>
        </div>
      </header>

      <div className="mt-8">
        <h3 className="text-xs tracking-wider font-semibold text-slate-500">
          IDENTIFICATION ASSURÉ
        </h3>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="Numéro de contrat"
            required
            error={showError('contractNumber') ? errors.contractNumber : ''}
          >
            <input
              type="text"
              value={assure.contractNumber}
              onChange={(e) => setAssure({ contractNumber: e.target.value })}
              onBlur={() => markTouched('contractNumber')}
              placeholder="AV 02262"
              className={inputClass(!!showError('contractNumber'))}
            />
          </Field>
          <Field
            label="Date de naissance"
            required
            error={showError('birthDate') ? errors.birthDate : ''}
          >
            <input
              type="date"
              value={assure.birthDate}
              onChange={(e) => setAssure({ birthDate: e.target.value })}
              onBlur={() => markTouched('birthDate')}
              className={inputClass(!!showError('birthDate'))}
            />
          </Field>
          <Field label="Civilité">
            <select
              value={assure.civility}
              onChange={(e) => setAssure({ civility: e.target.value as 'M.' | 'Mme' | '' })}
              className={inputClass(false)}
            >
              <option value="">—</option>
              <option value="M.">M.</option>
              <option value="Mme">Mme</option>
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Prénom" required error={showError('firstName') ? errors.firstName : ''}>
              <input
                type="text"
                value={assure.firstName}
                onChange={(e) => setAssure({ firstName: e.target.value })}
                onBlur={() => markTouched('firstName')}
                placeholder="Jean"
                className={inputClass(!!showError('firstName'))}
              />
            </Field>
            <Field label="Nom" required error={showError('lastName') ? errors.lastName : ''}>
              <input
                type="text"
                value={assure.lastName}
                onChange={(e) => setAssure({ lastName: e.target.value })}
                onBlur={() => markTouched('lastName')}
                placeholder="Dupont"
                className={inputClass(!!showError('lastName'))}
              />
            </Field>
          </div>
          <Field label="Email" required error={showError('email') ? errors.email : ''}>
            <input
              type="email"
              value={assure.email}
              onChange={(e) => setAssure({ email: e.target.value })}
              onBlur={() => markTouched('email')}
              placeholder="jean.dupont@email.fr"
              className={inputClass(!!showError('email'))}
            />
          </Field>
          <Field label="Téléphone" error={showError('phone') ? errors.phone : ''}>
            <input
              type="tel"
              value={assure.phone}
              onChange={(e) => setAssure({ phone: e.target.value })}
              onBlur={() => markTouched('phone')}
              placeholder="06 12 34 56 78"
              className={inputClass(!!showError('phone'))}
            />
          </Field>
        </div>
      </div>

      <div className="mt-10">
        <h3 className="text-xs tracking-wider font-semibold text-slate-500">
          DÉTAILS DU SINISTRE — {sinistreLabel}
        </h3>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(sinistreType === 'annulation' || sinistreType === 'interruption') && (
            <>
              <Field
                label="Date prévue de départ"
                required
                error={showError('departureDate') ? errors.departureDate : ''}
              >
                <input
                  type="date"
                  value={sinistre.departureDate}
                  onChange={(e) => setSinistre({ departureDate: e.target.value })}
                  onBlur={() => markTouched('departureDate')}
                  className={inputClass(!!showError('departureDate'))}
                />
              </Field>
              <Field
                label="Date d'annulation"
                required
                error={showError('cancelDate') ? errors.cancelDate : ''}
              >
                <input
                  type="date"
                  value={sinistre.cancelDate}
                  onChange={(e) => setSinistre({ cancelDate: e.target.value })}
                  onBlur={() => markTouched('cancelDate')}
                  className={inputClass(!!showError('cancelDate'))}
                />
              </Field>
            </>
          )}
          <Field
            label="Destination"
            required
            error={showError('destination') ? errors.destination : ''}
          >
            <input
              type="text"
              value={sinistre.destination}
              onChange={(e) => setSinistre({ destination: e.target.value })}
              onBlur={() => markTouched('destination')}
              placeholder="Ex : Barcelone, Espagne"
              className={inputClass(!!showError('destination'))}
            />
          </Field>
          <Field
            label={sinistreType === 'annulation' ? "Motif d'annulation" : 'Motif'}
            required
            error={showError('motif') ? errors.motif : ''}
          >
            {sinistreType === 'annulation' ? (
              <select
                value={sinistre.motif}
                onChange={(e) => setSinistre({ motif: e.target.value })}
                onBlur={() => markTouched('motif')}
                className={inputClass(!!showError('motif'))}
              >
                <option value="">Sélectionner</option>
                {MOTIFS_ANNULATION.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={sinistre.motif}
                onChange={(e) => setSinistre({ motif: e.target.value })}
                onBlur={() => markTouched('motif')}
                placeholder="Décrivez brièvement"
                className={inputClass(!!showError('motif'))}
              />
            )}
          </Field>
          <Field
            label="Montant total des frais engagés (€)"
            required
            error={showError('amount') ? errors.amount : ''}
            hint="Billets + hébergement + autres frais non remboursables"
          >
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              value={sinistre.amount}
              onChange={(e) => setSinistre({ amount: e.target.value })}
              onBlur={() => markTouched('amount')}
              placeholder="1450.00"
              className={inputClass(!!showError('amount'))}
            />
          </Field>
        </div>
      </div>

      <div className="mt-10">
        <h3 className="text-xs tracking-wider font-semibold text-slate-500">
          COORDONNÉES BANCAIRES (REMBOURSEMENT)
        </h3>
        <div className="mt-4 flex gap-3 rounded-lg border border-warning-500/30 bg-warning-50 p-4 text-sm text-slate-700">
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 text-warning-500 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
          </svg>
          <p>
            Vos coordonnées bancaires sont chiffrées et utilisées uniquement pour le virement du
            remboursement.
          </p>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="Titulaire du compte"
            required
            error={showError('holder') ? errors.holder : ''}
          >
            <input
              type="text"
              value={bank.holder}
              onChange={(e) => setBank({ holder: e.target.value })}
              onBlur={() => markTouched('holder')}
              placeholder="Jean Dupont"
              className={inputClass(!!showError('holder'))}
            />
          </Field>
          <Field label="IBAN" required error={showError('iban') ? errors.iban : ''}>
            <input
              type="text"
              value={bank.iban}
              onChange={(e) => setBank({ iban: e.target.value.toUpperCase() })}
              onBlur={() => markTouched('iban')}
              placeholder="FR76 1234 5678 9012 3456 7890 189"
              className={inputClass(!!showError('iban'))}
            />
          </Field>
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push('/declarer')}
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          ← Retour
        </button>
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
          Pièces justificatives
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

function Field({
  label,
  required,
  error,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-slate-700">
        {label}
        {required && <span className="ml-1 text-danger-500">*</span>}
        {error && <span className="ml-2 text-xs text-danger-500">✗ {error}</span>}
      </span>
      {children}
      {hint && !error && <span className="text-xs text-slate-500">{hint}</span>}
    </label>
  );
}

function inputClass(invalid: boolean) {
  return [
    'h-10 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 outline-none transition',
    invalid
      ? 'border-danger-500 focus:ring-2 focus:ring-danger-500/30'
      : 'border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20',
  ].join(' ');
}

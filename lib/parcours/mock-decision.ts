import type { DocmanaDecision } from './types';
import type { AssureInfo, SinistreDetails, SinistreTypeId } from './types';

export function generateReference(now: Date = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const seq = String(Math.floor(Math.random() * 900000) + 100000);
  return `SIN-${year}-${month}-${seq}`;
}

export function buildMockDecision(params: {
  reference: string;
  sinistreType: SinistreTypeId;
  assure: AssureInfo;
  sinistre: SinistreDetails;
  docsCount: number;
}): DocmanaDecision {
  const { reference, sinistreType, assure, sinistre, docsCount } = params;
  const amount = Number(sinistre.amount || 0);

  return {
    status: 'ACCEPTED',
    amount,
    currency: 'EUR',
    analyzedAt: new Date().toISOString(),
    reference,
    reasoning: [
      {
        label: 'Classification validée',
        detail: `Type de sinistre : ${labelForType(sinistreType)}. ${docsCount} document(s) classifié(s).`,
        status: 'ok',
      },
      {
        label: 'Extraction réussie',
        detail: `Montant déclaré : ${formatEuro(amount)}. Contrat ${assure.contractNumber || '—'} · Destination : ${sinistre.destination || '—'}.`,
        status: 'ok',
      },
      {
        label: 'Garantie applicable',
        detail: `Contrat ${assure.contractNumber || '—'} — garantie "${garantieLabel(sinistreType)}" active, plafond 8 000 €. Motif éligible art. 4.1.`,
        status: 'ok',
      },
      {
        label: 'Cohérence documentaire confirmée',
        detail:
          'Dates cohérentes entre justificatif et déclaration. Montant factures cohérent. Aucune anomalie.',
        status: 'ok',
      },
      {
        label: 'Décision : remboursement intégral',
        detail: `${formatEuro(amount)} (100% des frais, franchise 0 €). Virement SEPA sous 48–72h.`,
        status: 'ok',
      },
    ],
  };
}

function labelForType(t: SinistreTypeId): string {
  const labels: Record<SinistreTypeId, string> = {
    annulation: 'annulation de voyage',
    interruption: 'interruption de séjour',
    bagages: 'bagages perdus / volés',
    rapatriement: 'rapatriement médical',
    retard: 'retard de vol',
    autre: 'autre situation',
  };
  return labels[t];
}

function garantieLabel(t: SinistreTypeId): string {
  const labels: Record<SinistreTypeId, string> = {
    annulation: 'annulation maladie',
    interruption: 'interruption de séjour',
    bagages: 'bagages',
    rapatriement: 'rapatriement médical',
    retard: 'retard de vol',
    autre: 'assistance générale',
  };
  return labels[t];
}

export function formatEuro(n: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(n);
}

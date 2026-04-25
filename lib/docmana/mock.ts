import type { DocmanaCallbackPayload, DocmanaSubmitPayload, DocmanaSubmitResponse } from './types';

/**
 * Simule le comportement de Docmana pour la démo et les tests.
 * - submitMock : retourne un docmanaId synthétique
 * - buildMockCallback : construit la payload de callback comme si Docmana l'avait analysée
 */

export function submitMock(payload: DocmanaSubmitPayload): DocmanaSubmitResponse {
  return {
    docmanaId: `dmn-mock-${Date.now().toString(36)}`,
    status: 'PENDING',
    estimatedCompletionAt: new Date(Date.now() + 5 * 60_000).toISOString(),
  };
}

export function buildMockCallback(
  payload: DocmanaSubmitPayload,
  docmanaId: string,
): DocmanaCallbackPayload {
  const amount = payload.sinistre.amountEur;
  return {
    docmanaId,
    externalRef: payload.externalRef,
    status: 'ACCEPTED',
    amountEur: amount,
    analyzedAt: new Date().toISOString(),
    reasoning: [
      {
        label: 'Classification validée',
        detail: `Type de sinistre : ${labelType(payload.sinistreType)}. ${payload.documents.length} document(s) classifié(s).`,
        status: 'ok',
      },
      {
        label: 'Extraction réussie',
        detail: `Montant déclaré : ${formatEuro(amount)}. Contrat ${payload.assure.contractNumber} · Destination : ${payload.sinistre.destination}.`,
        status: 'ok',
      },
      {
        label: 'Garantie applicable',
        detail: `Contrat ${payload.assure.contractNumber} — garantie "${garantieLabel(payload.sinistreType)}" active, plafond 8 000 €. Motif éligible art. 4.1.`,
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

function labelType(t: string): string {
  const labels: Record<string, string> = {
    annulation: 'annulation de voyage',
    interruption: 'interruption de séjour',
    bagages: 'bagages perdus / volés',
    rapatriement: 'rapatriement médical',
    retard: 'retard de vol',
    autre: 'autre situation',
  };
  return labels[t] ?? t;
}

function garantieLabel(t: string): string {
  const labels: Record<string, string> = {
    annulation: 'annulation maladie',
    interruption: 'interruption de séjour',
    bagages: 'bagages',
    rapatriement: 'rapatriement médical',
    retard: 'retard de vol',
    autre: 'assistance générale',
  };
  return labels[t] ?? t;
}

function formatEuro(n: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(n);
}

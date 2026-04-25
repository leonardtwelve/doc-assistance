/**
 * Point d'entrée du module Docmana.
 * - submitDossier : envoie un dossier vers Docmana (réel ou mock selon env)
 * - mapToCallback : convertit la callback Docmana vers le format DocmanaDecision utilisé par l'UI
 */

import type { DocmanaDecision } from '@/lib/parcours/types';
import { isDocmanaMockMode, submitDossierToDocmana } from './client';
import { buildMockCallback, submitMock } from './mock';
import type { DocmanaCallbackPayload, DocmanaSubmitPayload, DocmanaSubmitResponse } from './types';

export type SubmitResult = {
  mode: 'real' | 'mock';
  submission: DocmanaSubmitResponse;
  /** Présent uniquement en mode mock (la décision est calculée immédiatement) */
  mockCallback?: DocmanaCallbackPayload;
};

export async function submitDossier(payload: DocmanaSubmitPayload): Promise<SubmitResult> {
  if (isDocmanaMockMode()) {
    const submission = submitMock(payload);
    const mockCallback = buildMockCallback(payload, submission.docmanaId);
    return { mode: 'mock', submission, mockCallback };
  }

  const submission = await submitDossierToDocmana(payload);
  return { mode: 'real', submission };
}

export function callbackToDecision(payload: DocmanaCallbackPayload): DocmanaDecision {
  return {
    status: payload.status,
    amount: payload.amountEur,
    currency: 'EUR',
    reasoning: payload.reasoning,
    analyzedAt: payload.analyzedAt,
    reference: payload.externalRef,
  };
}

export type { DocmanaCallbackPayload, DocmanaSubmitPayload, DocmanaSubmitResponse };

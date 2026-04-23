'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { DocmanaDecision, SinistreTypeId } from './types';

export type SubmittedDossier = {
  reference: string;
  submittedAt: string;
  sinistreType: SinistreTypeId;
  assure: {
    firstName: string;
    lastName: string;
    email: string;
    contractNumber: string;
  };
  destination: string;
  amount: number;
  decision: DocmanaDecision;
};

type DossiersState = {
  dossiers: SubmittedDossier[];
  addDossier: (d: SubmittedDossier) => void;
  findByReferenceAndEmail: (reference: string, email: string) => SubmittedDossier | null;
  findByReference: (reference: string) => SubmittedDossier | null;
};

export const useDossiersStore = create<DossiersState>()(
  persist(
    (set, get) => ({
      dossiers: [],
      addDossier: (d) => set((s) => ({ dossiers: [d, ...s.dossiers].slice(0, 50) })),
      findByReferenceAndEmail: (reference, email) => {
        const ref = reference.trim().toUpperCase();
        const em = email.trim().toLowerCase();
        return (
          get().dossiers.find(
            (d) => d.reference.toUpperCase() === ref && d.assure.email.toLowerCase() === em,
          ) ?? null
        );
      },
      findByReference: (reference) => {
        const ref = reference.trim().toUpperCase();
        return get().dossiers.find((d) => d.reference.toUpperCase() === ref) ?? null;
      },
    }),
    {
      name: 'docassistance.dossiers',
      storage: createJSONStorage(() =>
        typeof window === 'undefined' ? (undefined as unknown as Storage) : window.localStorage,
      ),
    },
  ),
);

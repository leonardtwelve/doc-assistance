'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  AssureInfo,
  BankInfo,
  DocmanaDecision,
  DocumentSlotId,
  SinistreDetails,
  SinistreTypeId,
  UploadedDoc,
} from './types';
import type { ParcoursStepId } from './steps';

type Documents = Partial<Record<DocumentSlotId, UploadedDoc>>;

type ParcoursState = {
  sinistreType: SinistreTypeId | null;
  assure: AssureInfo;
  sinistre: SinistreDetails;
  bank: BankInfo;
  documents: Documents;
  consentRgpd: boolean;
  reference: string | null;
  submittedAt: string | null;
  decision: DocmanaDecision | null;
  completedSteps: ParcoursStepId[];

  setSinistreType: (t: SinistreTypeId) => void;
  setAssure: (patch: Partial<AssureInfo>) => void;
  setSinistre: (patch: Partial<SinistreDetails>) => void;
  setBank: (patch: Partial<BankInfo>) => void;
  setDocument: (slotId: DocumentSlotId, doc: UploadedDoc | null) => void;
  setConsent: (v: boolean) => void;
  markStepComplete: (stepId: ParcoursStepId) => void;
  submit: (reference: string, decision: DocmanaDecision) => void;
  reset: () => void;
};

const emptyAssure: AssureInfo = {
  contractNumber: '',
  birthDate: '',
  civility: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
};

const emptySinistre: SinistreDetails = {
  departureDate: '',
  cancelDate: '',
  destination: '',
  motif: '',
  amount: '',
};

const emptyBank: BankInfo = {
  holder: '',
  iban: '',
};

export const useParcoursStore = create<ParcoursState>()(
  persist(
    (set) => ({
      sinistreType: null,
      assure: emptyAssure,
      sinistre: emptySinistre,
      bank: emptyBank,
      documents: {},
      consentRgpd: false,
      reference: null,
      submittedAt: null,
      decision: null,
      completedSteps: [],

      setSinistreType: (t) => set({ sinistreType: t }),
      setAssure: (patch) => set((s) => ({ assure: { ...s.assure, ...patch } })),
      setSinistre: (patch) => set((s) => ({ sinistre: { ...s.sinistre, ...patch } })),
      setBank: (patch) => set((s) => ({ bank: { ...s.bank, ...patch } })),
      setDocument: (slotId, doc) =>
        set((s) => {
          const documents = { ...s.documents };
          if (doc) documents[slotId] = doc;
          else delete documents[slotId];
          return { documents };
        }),
      setConsent: (v) => set({ consentRgpd: v }),
      markStepComplete: (stepId) =>
        set((s) =>
          s.completedSteps.includes(stepId) ? s : { completedSteps: [...s.completedSteps, stepId] },
        ),
      submit: (reference, decision) =>
        set({
          reference,
          decision,
          submittedAt: new Date().toISOString(),
        }),
      reset: () =>
        set({
          sinistreType: null,
          assure: emptyAssure,
          sinistre: emptySinistre,
          bank: emptyBank,
          documents: {},
          consentRgpd: false,
          reference: null,
          submittedAt: null,
          decision: null,
          completedSteps: [],
        }),
    }),
    {
      name: 'docassistance.parcours',
      storage: createJSONStorage(() =>
        typeof window === 'undefined' ? (undefined as unknown as Storage) : window.sessionStorage,
      ),
    },
  ),
);

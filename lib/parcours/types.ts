export type SinistreTypeId =
  | 'annulation'
  | 'interruption'
  | 'bagages'
  | 'rapatriement'
  | 'retard'
  | 'autre';

export type AssureInfo = {
  contractNumber: string;
  birthDate: string;
  civility: 'M.' | 'Mme' | '';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export type SinistreDetails = {
  departureDate: string;
  cancelDate: string;
  destination: string;
  motif: string;
  amount: string;
};

export type BankInfo = {
  holder: string;
  iban: string;
};

export type DocumentSlotId =
  | 'certificat_medical'
  | 'billet_transport'
  | 'facture'
  | 'piece_identite'
  | 'confirmation_reservation'
  | 'autre';

export type UploadedDoc = {
  slotId: DocumentSlotId;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
};

export type DocmanaReasoningStep = {
  label: string;
  detail: string;
  status: 'ok' | 'warn' | 'ko';
};

export type DocmanaDecision = {
  status: 'ACCEPTED' | 'REFUSED' | 'PARTIAL' | 'PENDING_HUMAN_REVIEW';
  amount: number;
  currency: 'EUR';
  reasoning: DocmanaReasoningStep[];
  analyzedAt: string;
  reference: string;
};

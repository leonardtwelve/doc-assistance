import type { SinistreTypeId } from './types';

export type SinistreTypeDef = {
  id: SinistreTypeId;
  label: string;
  subtitle: string;
  icon: 'plane' | 'refresh' | 'suitcase' | 'hospital' | 'timer' | 'chat';
  requiredDocs: ReadonlyArray<{
    slotId: string;
    label: string;
    description?: string;
  }>;
};

export const SINISTRE_TYPES: readonly SinistreTypeDef[] = [
  {
    id: 'annulation',
    label: 'Annulation de voyage',
    subtitle: "Maladie, accident, décès, perte d'emploi…",
    icon: 'plane',
    requiredDocs: [
      { slotId: 'certificat_medical', label: 'Certificat médical' },
      { slotId: 'billet_transport', label: 'Billet(s) de transport' },
      { slotId: 'facture', label: 'Factures / justificatifs de frais' },
      {
        slotId: 'piece_identite',
        label: "Pièce d'identité",
        description: "Carte d'identité ou passeport",
      },
    ],
  },
  {
    id: 'interruption',
    label: 'Interruption de séjour',
    subtitle: 'Retour anticipé depuis la destination',
    icon: 'refresh',
    requiredDocs: [
      { slotId: 'certificat_medical', label: 'Justificatif médical ou officiel' },
      { slotId: 'billet_transport', label: 'Billet de retour anticipé' },
      { slotId: 'facture', label: 'Factures engagées' },
      { slotId: 'piece_identite', label: "Pièce d'identité" },
    ],
  },
  {
    id: 'bagages',
    label: 'Bagages perdus / volés',
    subtitle: 'Perte, vol ou endommagement',
    icon: 'suitcase',
    requiredDocs: [
      {
        slotId: 'certificat_medical',
        label: 'Déclaration compagnie / police',
        description: 'PIR ou procès-verbal',
      },
      { slotId: 'billet_transport', label: 'Billet de transport' },
      { slotId: 'facture', label: 'Factures des biens' },
      { slotId: 'piece_identite', label: "Pièce d'identité" },
    ],
  },
  {
    id: 'rapatriement',
    label: 'Rapatriement médical',
    subtitle: "Hospitalisation ou rapatriement à l'étranger",
    icon: 'hospital',
    requiredDocs: [
      { slotId: 'certificat_medical', label: 'Dossier médical complet' },
      { slotId: 'billet_transport', label: 'Billet de rapatriement' },
      { slotId: 'facture', label: 'Factures hospitalières' },
      { slotId: 'piece_identite', label: "Pièce d'identité" },
    ],
  },
  {
    id: 'retard',
    label: 'Retard de vol',
    subtitle: 'Vol retardé ou correspondance manquée',
    icon: 'timer',
    requiredDocs: [
      { slotId: 'certificat_medical', label: 'Attestation compagnie aérienne' },
      { slotId: 'billet_transport', label: 'Billet(s) de transport' },
      { slotId: 'facture', label: 'Factures engagées (hôtel, repas)' },
      { slotId: 'piece_identite', label: "Pièce d'identité" },
    ],
  },
  {
    id: 'autre',
    label: 'Autre situation',
    subtitle: 'Un gestionnaire vous contactera sous 2h',
    icon: 'chat',
    requiredDocs: [
      { slotId: 'piece_identite', label: "Pièce d'identité" },
      { slotId: 'facture', label: 'Justificatif de la situation' },
    ],
  },
];

export function getSinistreType(id: SinistreTypeId | null): SinistreTypeDef | null {
  if (!id) return null;
  return SINISTRE_TYPES.find((t) => t.id === id) ?? null;
}

/**
 * Types alignés sur le modèle d'External Systems Docmana :
 * - Field Mappings : déclaration des champs métier que Docmana reçoit
 * - Callback : Docmana renvoie le résultat d'analyse via webhook HTTP
 *
 * À ajuster quand la doc Docmana finale est partagée.
 */

export type DocmanaFieldType = 'string' | 'number' | 'date' | 'boolean' | 'object' | 'array';

export type DocmanaFieldDef = {
  fieldName: string;
  fieldType: DocmanaFieldType;
  fieldDescription: string;
  fieldProperties?: DocmanaFieldDef[];
};

/** Payload qu'on envoie à Docmana à la soumission d'un dossier */
export type DocmanaSubmitPayload = {
  externalRef: string;
  sinistreType: string;
  assure: {
    contractNumber: string;
    firstName: string;
    lastName: string;
    email: string;
    birthDate: string;
  };
  sinistre: {
    destination: string;
    motif: string;
    departureDate?: string;
    cancelDate?: string;
    amountEur: number;
  };
  documents: Array<{
    slotId: string;
    name: string;
    mimeType: string;
    sizeBytes: number;
    /** Soit URL signée vers le fichier, soit base64 inline (selon ce que Docmana accepte) */
    url?: string;
    base64?: string;
  }>;
  callbackUrl: string;
};

export type DocmanaSubmitResponse = {
  docmanaId: string;
  status: 'PENDING' | 'PROCESSING' | 'DONE' | 'ERROR';
  estimatedCompletionAt?: string;
};

/** Payload reçu via webhook callback Docmana avec le résultat d'analyse */
export type DocmanaCallbackPayload = {
  docmanaId: string;
  externalRef: string;
  status: 'ACCEPTED' | 'REFUSED' | 'PARTIAL' | 'PENDING_HUMAN_REVIEW';
  amountEur: number;
  reasoning: Array<{
    label: string;
    detail: string;
    status: 'ok' | 'warn' | 'ko';
  }>;
  analyzedAt: string;
  signature?: string;
};

/** Field mappings que l'on déclare côté Docmana pour qu'il accepte notre payload */
export const DOCASSISTANCE_FIELD_MAPPINGS: ReadonlyArray<DocmanaFieldDef> = [
  {
    fieldName: 'externalRef',
    fieldType: 'string',
    fieldDescription: 'Référence interne du dossier sinistre (format SIN-AAAA-MM-NNNNNN)',
  },
  {
    fieldName: 'sinistreType',
    fieldType: 'string',
    fieldDescription:
      'Type de sinistre déclaré : annulation | interruption | bagages | rapatriement | retard | autre',
  },
  {
    fieldName: 'assure',
    fieldType: 'object',
    fieldDescription: "Informations d'identification de l'assuré",
    fieldProperties: [
      {
        fieldName: 'contractNumber',
        fieldType: 'string',
        fieldDescription: 'Numéro de contrat AssistanceVoyage (format AV NNNNN)',
      },
      { fieldName: 'firstName', fieldType: 'string', fieldDescription: "Prénom de l'assuré" },
      { fieldName: 'lastName', fieldType: 'string', fieldDescription: "Nom de l'assuré" },
      { fieldName: 'email', fieldType: 'string', fieldDescription: "Email de l'assuré" },
      { fieldName: 'birthDate', fieldType: 'date', fieldDescription: 'Date de naissance' },
    ],
  },
  {
    fieldName: 'sinistre',
    fieldType: 'object',
    fieldDescription: 'Détails du sinistre déclaré',
    fieldProperties: [
      { fieldName: 'destination', fieldType: 'string', fieldDescription: 'Destination du voyage' },
      {
        fieldName: 'motif',
        fieldType: 'string',
        fieldDescription: "Motif d'annulation / sinistre",
      },
      {
        fieldName: 'departureDate',
        fieldType: 'date',
        fieldDescription: 'Date prévue de départ',
      },
      { fieldName: 'cancelDate', fieldType: 'date', fieldDescription: "Date d'annulation" },
      {
        fieldName: 'amountEur',
        fieldType: 'number',
        fieldDescription: 'Montant total des frais engagés en euros',
      },
    ],
  },
  {
    fieldName: 'documents',
    fieldType: 'array',
    fieldDescription: 'Pièces justificatives jointes',
    fieldProperties: [
      {
        fieldName: 'slotId',
        fieldType: 'string',
        fieldDescription:
          'Type de pièce : certificat_medical | billet_transport | facture | piece_identite | confirmation_reservation | autre',
      },
      { fieldName: 'name', fieldType: 'string', fieldDescription: 'Nom du fichier' },
      { fieldName: 'mimeType', fieldType: 'string', fieldDescription: 'Type MIME du fichier' },
      { fieldName: 'sizeBytes', fieldType: 'number', fieldDescription: 'Taille en octets' },
      { fieldName: 'url', fieldType: 'string', fieldDescription: 'URL signée vers le fichier' },
    ],
  },
];

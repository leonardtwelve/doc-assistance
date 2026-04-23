export const PARCOURS_STEPS = [
  { id: 'sinistre', label: 'Sinistre', href: '/declarer' },
  { id: 'informations', label: 'Informations', href: '/declarer/informations' },
  { id: 'documents', label: 'Documents', href: '/declarer/documents' },
  { id: 'verification', label: 'Vérification', href: '/declarer/verification' },
  { id: 'decision', label: 'Décision', href: '/declarer/decision' },
] as const;

export type ParcoursStepId = (typeof PARCOURS_STEPS)[number]['id'];
export type ParcoursStep = (typeof PARCOURS_STEPS)[number];
export type StepStatus = 'done' | 'current' | 'pending';

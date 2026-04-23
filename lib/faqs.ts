export type FaqItem = {
  q: string;
  a: string;
  category: 'parcours' | 'delais' | 'documents' | 'securite' | 'decision';
};

export const FAQS: ReadonlyArray<FaqItem> = [
  {
    category: 'parcours',
    q: 'Combien de temps prend la déclaration en ligne ?',
    a: 'En moyenne 5 minutes si vous avez votre numéro de contrat et vos justificatifs à portée de main. Le parcours est découpé en 5 étapes (sinistre, informations, documents, vérification, décision) — vous pouvez revenir en arrière à tout moment.',
  },
  {
    category: 'parcours',
    q: 'Puis-je interrompre ma déclaration et la reprendre plus tard ?',
    a: "Oui, tant que vous n'avez pas fermé votre navigateur : votre progression est conservée automatiquement. Après fermeture, il faudra recommencer la saisie, mais cela ne prend que quelques minutes.",
  },
  {
    category: 'delais',
    q: 'Sous combien de temps vais-je recevoir une décision ?',
    a: "La grande majorité des dossiers reçoivent une décision motivée en moins de 24 heures ouvrées après soumission, grâce à notre moteur d'analyse Docmana. Les dossiers complexes peuvent nécessiter une revue humaine supplémentaire (jusqu'à 72h).",
  },
  {
    category: 'delais',
    q: 'Quand recevrai-je mon remboursement ?',
    a: "Une fois la décision acceptée et votre accord donné, le virement SEPA est effectué sous 48 à 72 heures ouvrées sur l'IBAN fourni lors de la déclaration.",
  },
  {
    category: 'documents',
    q: 'Quels formats de documents sont acceptés ?',
    a: 'PDF, JPG et PNG, dans la limite de 10 Mo par fichier. Les scans doivent être lisibles et complets — une pièce tronquée ou floue peut entraîner une demande de justificatif complémentaire.',
  },
  {
    category: 'documents',
    q: 'Que faire si je n’ai pas tous les justificatifs demandés ?',
    a: 'Les documents marqués « obligatoires » sont requis pour le traitement automatique. Si un document vous manque, commencez par joindre ceux que vous avez : un gestionnaire vous contactera sous 48h pour compléter le dossier avant décision.',
  },
  {
    category: 'securite',
    q: 'Mes coordonnées bancaires sont-elles sécurisées ?',
    a: "Oui. Votre IBAN est chiffré au moment de la soumission et n'est utilisé que pour le virement du remboursement. Il n'est jamais communiqué à un tiers ni stocké en clair.",
  },
  {
    category: 'securite',
    q: 'Qu’est-ce que Docmana et que fait-il de mes documents ?',
    a: 'Docmana est notre moteur IA qui analyse automatiquement vos pièces justificatives : il classifie les documents, extrait les informations clés (dates, montants), et vérifie la cohérence avec votre déclaration. Vos documents sont traités selon le RGPD, chiffrés au repos et supprimés des traitements temporaires après la décision.',
  },
  {
    category: 'decision',
    q: 'Puis-je contester une décision automatique ?',
    a: "Oui, à tout moment. Chaque décision Docmana inclut son raisonnement détaillé. Si vous n'êtes pas d'accord, vous pouvez demander une révision humaine via le bouton « Contester la décision » sur votre page de suivi, ou en répondant à l'email de décision.",
  },
  {
    category: 'decision',
    q: 'Que se passe-t-il si mon dossier est refusé ?',
    a: 'Vous recevez un email détaillant le motif de refus. Vous pouvez fournir des pièces complémentaires via le suivi de dossier, ou demander une révision humaine. La plupart des refus initiaux sont dus à un document manquant ou illisible.',
  },
];

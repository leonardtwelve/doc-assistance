# DocAssistance

Parcours d'assistance en assurance : déclaration de sinistre côté client, vérification IA des pièces justificatives, aide au gestionnaire pour la résolution et le déclenchement du remboursement.

## Prérequis

- Node.js ≥ 18
- npm
- Un compte GitHub avec accès au repo
- (Plus tard) Une clé API Anthropic pour la vérification IA des pièces

## Installation

```bash
git clone https://github.com/leonardtwelve/doc-assistance.git
cd doc-assistance
npm install
```

## Architecture

À compléter. Grandes lignes :

- Front client : déclaration de sinistre, upload PJ
- Back-office gestionnaire : revue des dossiers, décision de remboursement
- Service IA : vérification automatique des pièces jointes

## Commandes de développement

```bash
npm run dev        # démarrer le dev server sur :3000
npm run build      # build de production
npm run start      # lancer le build de prod
npm run lint       # ESLint (next/core-web-vitals)
npm run typecheck  # TypeScript strict
```

## Contribuer

Voir [CONTRIBUTING.md](./CONTRIBUTING.md) pour le workflow de triage, les conventions et comment proposer un bug / feature / feedback.

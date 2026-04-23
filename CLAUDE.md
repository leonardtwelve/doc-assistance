# doc-assistance

## Vision

DocAssistance — Parcours d'assistance dans le monde de l'assurance. Côté client : déclaration de sinistre, reprise des informations de l'affilié, upload de pièces justificatives. Côté gestionnaire : vérification IA des pièces jointes, aide à la résolution de l'incident, déclenchement (ou non) du remboursement.

## Stack technique

- **Framework** : Next.js 14+ / React 18 / TypeScript (strict)
- **UI** : Tailwind CSS + shadcn/ui (à valider)
- **Vérification IA des pièces** : Claude API (Anthropic SDK) — prompt caching activé
- **State / Data** : à décider (Server Actions + Zustand pressenti)
- **Tooling** : ESLint, Prettier, Husky, lint-staged
- **Tests** : Vitest (à installer lors de la première US testée)

## Décisions d'architecture

<!-- À compléter au fil du projet. Documenter ici chaque décision structurante. -->

- Démo commerciale — pragmatisme > perfection. MVP d'abord, raffinement ensuite.

## Environnement

<!-- À compléter : URLs déployées, comptes démo, clés API (jamais de secrets ici). -->

- **Repo** : https://github.com/leonardtwelve/doc-assistance
- **Déploiement** : à définir (Vercel pressenti)

## Workflow de session

1. Lire ce fichier CLAUDE.md pour reprendre le contexte
2. Consulter les GitHub Issues ouvertes : `gh issue list --state open`
3. Valider le plan d'action avant de coder
4. Développer
5. Mettre à jour l'issue (fermeture via `Closes #N` dans le commit)
6. Mettre à jour ce fichier si changement d'architecture

## Conventions

- Commits : `feat:`, `fix:`, `refactor:`, `docs:`, `test:` + référence issue
- Co-author IA : `Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>`
- **React/Next.js** : PascalCase composants, camelCase fonctions/variables, kebab-case fichiers CSS
- **TypeScript** : strict, pas de `any`
- **UI** : textes en français, code/identifiants en anglais

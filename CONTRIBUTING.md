# Contribuer à DocAssistance

## Signaler un bug, proposer une feature, donner un feedback

Toutes les contributions passent par une **GitHub Issue** :

- [Nouveau bug](https://github.com/leonardtwelve/doc-assistance/issues/new?template=bug_report.yml)
- [Nouvelle fonctionnalité](https://github.com/leonardtwelve/doc-assistance/issues/new?template=feature_request.yml)
- [Retour d'expérience](https://github.com/leonardtwelve/doc-assistance/issues/new?template=feedback.yml)

## Workflow de triage

Chaque issue entre avec le label `status:triage`. Le triage consiste à :

1. Vérifier que les critères d'acceptation sont clairs
2. Poser une priorité (`P0` → `P3`)
3. Estimer (t-shirt sizing XS/S/M/L dans le corps de l'issue)
4. Identifier les dépendances (`Blocked by #N`)
5. Passer en `status:accepted` quand c'est prêt à être planifié
6. Passer en `status:in-progress` au démarrage du dev

## Conventions

### Commits

Format conventional commits : `feat:`, `fix:`, `refactor:`, `docs:`, `test:` suivi d'une référence à l'issue.

Exemple :

```
feat: ajouter l'upload de pièces justificatives (#12)
```

Les commits co-écrits avec Claude doivent inclure :

```
Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
```

### Code

- **TypeScript strict**, pas de `any`
- **React/Next.js** : PascalCase composants, camelCase fonctions/variables
- **UI en français**, code/identifiants en anglais
- Les hooks pre-commit (husky + lint-staged + prettier + eslint) tournent automatiquement

### Branches

- `main` : branche principale déployable
- Branches de feature : `feat/<nom-court>` ou `fix/<nom-court>`
- Fermeture d'issue via `Closes #N` dans le message du commit ou la PR

## Definition of Done

Une issue peut être fermée quand :

- [ ] Critères d'acceptation tous cochés
- [ ] Lint / format passent
- [ ] Le changement est testé manuellement ou couvert par un test
- [ ] La documentation (README / CLAUDE.md) est à jour si besoin

# Intégration Docmana — Spec & checklist

## Modèle d'intégration observé

D'après l'écran **External Systems** de Docmana :

- **Push + callback** : on envoie un dossier à Docmana (POST), Docmana l'analyse en async, puis renvoie le résultat sur un webhook HTTP que l'on expose.
- **Field Mappings** : on déclare côté Docmana le schéma des champs métier qu'on lui pousse (nom + type + description).
- **Callback Configuration** : on configure côté Docmana l'URL et le format du callback à recevoir.

## Architecture côté `doc-assistance`

```
                ┌─────────────────────────┐
   user submit  │  /declarer/verification │
       │        └─────────────────────────┘
       ▼
┌──────────────────────────────┐
│  POST /api/docmana/submit    │  ──────────────────────────┐
│  (server route)              │                            │
└──────────────────────────────┘                            │
       │                                                    ▼
       │ mock OR real fetch                          ┌──────────────┐
       ▼                                             │   Docmana    │
┌──────────────────────────────┐                     │   sandbox    │
│  lib/docmana/client.ts       │                     └──────────────┘
│  lib/docmana/mock.ts         │                            │
└──────────────────────────────┘                            │
                                                            │ async analysis
                                                            ▼
                                          ┌──────────────────────────────┐
                                          │  POST /api/docmana/callback  │
                                          │  (webhook receiver)          │
                                          └──────────────────────────────┘
                                                            │
                                                            ▼
                                              [persist + notify user]
```

## Variables d'environnement

À définir dans le dashboard Vercel (Settings → Environment Variables) :

| Var                      | Valeur                                                                    | Mode                    |
| ------------------------ | ------------------------------------------------------------------------- | ----------------------- |
| `DOCMANA_BASE_URL`       | URL de base API Docmana sandbox (ex: `https://sandbox.docmana.io/api/v1`) | prod / preview          |
| `DOCMANA_API_KEY`        | Clé API obtenue dans Docmana                                              | prod / preview          |
| `DOCMANA_WEBHOOK_SECRET` | Secret partagé pour signer les callbacks (HMAC SHA-256 du body)           | prod / preview          |
| `DOCMANA_MOCK`           | `true` pour bypass total (démo)                                           | dev / preview optionnel |

Si `DOCMANA_MOCK=true` ou si `DOCMANA_BASE_URL` est absent, l'app retourne une décision mockée (cf. `lib/docmana/mock.ts`).

## À récupérer dans le dashboard Docmana

### 1. Field Mappings (à déclarer côté Docmana)

Coller le contenu de `DOCASSISTANCE_FIELD_MAPPINGS` (cf. `lib/docmana/types.ts`) dans la zone **Field Mappings Configuration** de Docmana → External Systems.

Aperçu :

```json
[
  { "fieldName": "externalRef", "fieldType": "string", "fieldDescription": "Référence interne du dossier" },
  { "fieldName": "sinistreType", "fieldType": "string", "fieldDescription": "Type de sinistre" },
  { "fieldName": "assure", "fieldType": "object", "fieldProperties": [...] },
  { "fieldName": "sinistre", "fieldType": "object", "fieldProperties": [...] },
  { "fieldName": "documents", "fieldType": "array", "fieldProperties": [...] }
]
```

### 2. Callback Type (à configurer côté Docmana)

Dans le dropdown **Callback Type** :

- Choisir `HTTP Webhook` (ou équivalent)
- URL : `https://<URL_PROD>/api/docmana/callback`
- Méthode : POST · Format : JSON
- Headers de signature : si Docmana propose une signature HMAC, activer et renseigner `DOCMANA_WEBHOOK_SECRET`

### 3. Credentials API

Récupérer dans Docmana (probablement dans **Settings** ou **API Keys**) :

- Base URL de l'API
- API key / token
- Méthode d'auth exacte (Bearer, X-API-Key, OAuth…)

À reporter dans `lib/docmana/client.ts` :

- Constantes `PATH_SUBMIT`, `AUTH_HEADER`, `AUTH_PREFIX` à ajuster si nécessaire.

### 4. Endpoint de soumission

Identifier l'endpoint Docmana qui :

- accepte une payload JSON conforme aux Field Mappings
- accepte les pièces jointes (URLs signées ou base64 inline)
- retourne un `docmanaId` traçable

Documenter ici son chemin exact (ex: `POST /external/submissions`).

## Mode mock vs réel — comment switcher

| Cas         | `DOCMANA_BASE_URL` | `DOCMANA_API_KEY` | `DOCMANA_MOCK`    | Résultat   |
| ----------- | ------------------ | ----------------- | ----------------- | ---------- |
| Démo locale | absent             | absent            | absent            | mock auto  |
| Démo Vercel | absent             | absent            | `true`            | mock       |
| Sandbox     | défini             | défini            | `false` ou absent | appel réel |
| Prod        | défini             | défini            | `false`           | appel réel |

## Tests à faire en sandbox

Une fois les credentials sandbox configurés :

```bash
# 1. Test submit en local avec la sandbox
DOCMANA_BASE_URL=... DOCMANA_API_KEY=... npm run dev
# Compléter le parcours → vérifier les logs serveur

# 2. Test callback simulé
curl -X POST http://localhost:3000/api/docmana/callback \
  -H 'Content-Type: application/json' \
  -d '{"docmanaId":"dmn-test","externalRef":"SIN-2026-04-123456","status":"ACCEPTED","amountEur":1450,"reasoning":[],"analyzedAt":"2026-04-25T10:00:00Z"}'
```

## TODO côté code (post-doc Docmana)

- [ ] Confirmer endpoint exact dans `client.ts:PATH_SUBMIT`
- [ ] Confirmer header d'auth dans `client.ts:AUTH_HEADER` / `AUTH_PREFIX`
- [ ] Confirmer schéma de payload (s'il diverge de `DocmanaSubmitPayload`)
- [ ] Implémenter vérif HMAC dans `app/api/docmana/callback/route.ts:isValidSignature`
- [ ] Brancher `EtapeVerification` sur `/api/docmana/submit` (état `analyzing` côté UI)
- [ ] Persister les dossiers côté serveur (au lieu du seul `localStorage`) pour que le suivi marche cross-device

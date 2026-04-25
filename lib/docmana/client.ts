import type { DocmanaSubmitPayload, DocmanaSubmitResponse } from './types';

/**
 * Client HTTP pour l'API Docmana.
 * Configuration via env :
 *   DOCMANA_BASE_URL  — ex: https://app.docmana.io/api/v1
 *   DOCMANA_API_KEY   — header Authorization Bearer (ou X-API-Key, à confirmer dans la doc)
 *   DOCMANA_MOCK=true — bypass total : retourne une réponse mock sans appel réseau
 *
 * À éditer quand la doc Docmana est partagée :
 *   - URL des endpoints (variables PATH_*)
 *   - Header d'auth (AUTH_HEADER + AUTH_PREFIX)
 *   - Forme exacte du payload si elle diverge de DocmanaSubmitPayload
 */

const PATH_SUBMIT = '/external/submissions'; // À confirmer dans la doc Docmana
const AUTH_HEADER = 'Authorization';
const AUTH_PREFIX = 'Bearer ';

export class DocmanaError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly body?: unknown,
  ) {
    super(message);
    this.name = 'DocmanaError';
  }
}

export type DocmanaClientConfig = {
  baseUrl: string;
  apiKey: string;
};

export function getDocmanaConfig(): DocmanaClientConfig | null {
  const baseUrl = process.env.DOCMANA_BASE_URL;
  const apiKey = process.env.DOCMANA_API_KEY;
  if (!baseUrl || !apiKey) return null;
  return { baseUrl: baseUrl.replace(/\/$/, ''), apiKey };
}

export function isDocmanaMockMode(): boolean {
  return process.env.DOCMANA_MOCK === 'true' || !getDocmanaConfig();
}

export async function submitDossierToDocmana(
  payload: DocmanaSubmitPayload,
): Promise<DocmanaSubmitResponse> {
  const config = getDocmanaConfig();
  if (!config) {
    throw new DocmanaError('Configuration Docmana manquante (DOCMANA_BASE_URL / DOCMANA_API_KEY)');
  }

  const url = `${config.baseUrl}${PATH_SUBMIT}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      [AUTH_HEADER]: `${AUTH_PREFIX}${config.apiKey}`,
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  if (!res.ok) {
    let body: unknown = null;
    try {
      body = await res.json();
    } catch {
      // ignore
    }
    throw new DocmanaError(
      `Docmana submit failed (${res.status} ${res.statusText})`,
      res.status,
      body,
    );
  }

  return (await res.json()) as DocmanaSubmitResponse;
}

import { NextResponse } from 'next/server';
import { submitDossier } from '@/lib/docmana';
import type { DocmanaSubmitPayload } from '@/lib/docmana';

/**
 * POST /api/docmana/submit
 * Reçoit le payload du parcours, l'envoie à Docmana (ou retourne un mock).
 * En mode mock, retourne aussi la décision finale immédiatement (pas de callback async).
 */
export async function POST(request: Request) {
  let body: DocmanaSubmitPayload;
  try {
    body = (await request.json()) as DocmanaSubmitPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body.externalRef || !body.sinistreType) {
    return NextResponse.json({ error: 'externalRef et sinistreType sont requis' }, { status: 400 });
  }

  try {
    const result = await submitDossier(body);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

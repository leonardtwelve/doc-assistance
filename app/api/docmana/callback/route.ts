import { NextResponse } from 'next/server';
import type { DocmanaCallbackPayload } from '@/lib/docmana';

/**
 * POST /api/docmana/callback
 * Webhook recevant le résultat d'analyse de Docmana.
 *
 * À sécuriser dans la prochaine itération :
 *   - Vérifier la signature HMAC dans le header `x-docmana-signature` avec DOCMANA_WEBHOOK_SECRET
 *   - Optionnellement IP-restrict aux IPs Docmana connues
 *
 * Pour le MVP démo : on accepte le callback et on logue. Le front consulte
 * ensuite le dossier via /dossier/[ref] (qui lit le store localStorage rempli
 * à la soumission en mode mock — à brancher sur une vraie persistance serveur
 * quand on passera en prod).
 */

function isValidSignature(_request: Request, _body: string): boolean {
  const secret = process.env.DOCMANA_WEBHOOK_SECRET;
  if (!secret) return true; // Pas de secret configuré = mode démo permissif
  // TODO: implémenter HMAC SHA-256 sur _body avec _secret, comparer avec header
  return true;
}

export async function POST(request: Request) {
  const raw = await request.text();
  if (!isValidSignature(request, raw)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let payload: DocmanaCallbackPayload;
  try {
    payload = JSON.parse(raw) as DocmanaCallbackPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!payload.docmanaId || !payload.externalRef || !payload.status) {
    return NextResponse.json(
      { error: 'docmanaId, externalRef et status sont requis' },
      { status: 400 },
    );
  }

  // TODO (vraie persistance serveur) :
  //  - mettre à jour le dossier en base par externalRef
  //  - notifier l'utilisateur (email avec la décision)
  //  - déclencher le virement si status=ACCEPTED
  console.info('[Docmana callback]', {
    docmanaId: payload.docmanaId,
    externalRef: payload.externalRef,
    status: payload.status,
    amountEur: payload.amountEur,
  });

  return NextResponse.json({ received: true });
}

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDossiersStore } from '@/lib/parcours/dossiers-store';
import { isValidEmail } from '@/lib/parcours/validation';

const REF_REGEX = /^SIN-\d{4}-\d{2}-\d{6}$/i;

export function SuiviForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const findByReferenceAndEmail = useDossiersStore((s) => s.findByReferenceAndEmail);

  const [reference, setReference] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) setReference(ref);
  }, [searchParams]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!REF_REGEX.test(reference.trim())) {
      setError('Format de référence invalide (ex : SIN-2026-04-123456)');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Email invalide');
      return;
    }

    const dossier = findByReferenceAndEmail(reference, email);
    if (!dossier) {
      setError(
        'Aucun dossier trouvé pour cette référence et cet email. Vérifiez vos informations.',
      );
      return;
    }

    router.push(`/dossier/${encodeURIComponent(dossier.reference)}`);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="mt-8 space-y-5 rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-card"
    >
      <div>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-slate-700">
            Référence du dossier <span className="text-danger-500">*</span>
          </span>
          <input
            type="text"
            value={reference}
            onChange={(e) => setReference(e.target.value.toUpperCase())}
            placeholder="SIN-2026-04-123456"
            className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            required
          />
          <span className="text-xs text-slate-500">
            La référence vous a été envoyée par email à la soumission du dossier.
          </span>
        </label>
      </div>

      <div>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-slate-700">
            Email renseigné lors de la déclaration <span className="text-danger-500">*</span>
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jean.dupont@email.fr"
            className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            required
          />
        </label>
      </div>

      {error && (
        <div className="flex gap-2 rounded-lg border border-danger-500/30 bg-danger-500/5 p-3 text-sm text-danger-600">
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4 mt-0.5 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </svg>
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-800"
        >
          Consulter mon dossier
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m9 6 6 6-6 6" />
          </svg>
        </button>
      </div>
    </form>
  );
}

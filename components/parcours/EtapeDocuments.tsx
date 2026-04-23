'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { getSinistreType } from '@/lib/parcours/sinistre-types';
import { useParcoursStore } from '@/lib/parcours/store';
import type { DocumentSlotId, UploadedDoc } from '@/lib/parcours/types';

const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const ACCEPTED_MIME = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

const OPTIONAL_SLOTS: ReadonlyArray<{
  slotId: DocumentSlotId;
  label: string;
  description: string;
}> = [
  {
    slotId: 'confirmation_reservation',
    label: 'Confirmation de réservation',
    description: 'Hôtel, tour-opérateur…',
  },
  {
    slotId: 'autre',
    label: 'Autre document',
    description: 'Tout document utile à votre dossier',
  },
];

const SLOT_ICONS: Record<
  DocumentSlotId,
  'medical' | 'ticket' | 'invoice' | 'id' | 'booking' | 'paperclip'
> = {
  certificat_medical: 'medical',
  billet_transport: 'ticket',
  facture: 'invoice',
  piece_identite: 'id',
  confirmation_reservation: 'booking',
  autre: 'paperclip',
};

export function EtapeDocuments() {
  const router = useRouter();
  const sinistreType = useParcoursStore((s) => s.sinistreType);
  const documents = useParcoursStore((s) => s.documents);
  const setDocument = useParcoursStore((s) => s.setDocument);
  const markStepComplete = useParcoursStore((s) => s.markStepComplete);

  const sinistreDef = getSinistreType(sinistreType);

  if (!sinistreType || !sinistreDef) {
    return (
      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-slate-700">Veuillez d&apos;abord compléter les étapes précédentes.</p>
        <button
          type="button"
          onClick={() => router.push('/declarer')}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-700 px-4 py-2 text-sm text-white hover:bg-brand-800"
        >
          Retour à l&apos;étape 1
        </button>
      </section>
    );
  }

  const allRequiredFilled = sinistreDef.requiredDocs.every(
    (doc) => documents[doc.slotId as DocumentSlotId],
  );

  const onContinue = () => {
    if (!allRequiredFilled) return;
    markStepComplete('documents');
    router.push('/declarer/verification');
  };

  return (
    <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-card">
      <header className="flex items-start gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
            <path d="M14 2v6h6" />
          </svg>
        </span>
        <div>
          <h2 className="font-serif text-2xl text-slate-900">Pièces justificatives</h2>
          <p className="text-sm text-slate-500">PDF, JPG, PNG — 10 Mo max par fichier</p>
        </div>
      </header>

      <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center rounded-md bg-slate-900 px-2 py-0.5 text-xs font-semibold text-white tracking-wider">
            DOCMANA
          </span>
          <p className="text-sm text-slate-700">
            Vos documents seront analysés automatiquement par notre moteur IA
          </p>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {['Classification', 'Extraction', 'Validation', 'Corrélation', 'Décision'].map((c) => (
            <span
              key={c}
              className="inline-flex rounded-md border border-slate-300 bg-white px-2 py-0.5 text-xs text-slate-600"
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xs tracking-wider font-semibold text-slate-500">
          DOCUMENTS OBLIGATOIRES
        </h3>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sinistreDef.requiredDocs.map((doc) => (
            <UploadSlot
              key={doc.slotId}
              slotId={doc.slotId as DocumentSlotId}
              label={doc.label}
              description={doc.description}
              required
              uploaded={documents[doc.slotId as DocumentSlotId]}
              onUpload={(d) => setDocument(doc.slotId as DocumentSlotId, d)}
              onRemove={() => setDocument(doc.slotId as DocumentSlotId, null)}
            />
          ))}
        </div>
      </div>

      <div className="mt-10">
        <h3 className="text-xs tracking-wider font-semibold text-slate-500">
          DOCUMENTS COMPLÉMENTAIRES
        </h3>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {OPTIONAL_SLOTS.map((doc) => (
            <UploadSlot
              key={doc.slotId}
              slotId={doc.slotId}
              label={doc.label}
              description={doc.description}
              uploaded={documents[doc.slotId]}
              onUpload={(d) => setDocument(doc.slotId, d)}
              onRemove={() => setDocument(doc.slotId, null)}
            />
          ))}
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push('/declarer/informations')}
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          ← Retour
        </button>
        <button
          type="button"
          onClick={onContinue}
          disabled={!allRequiredFilled}
          className={[
            'inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition',
            allRequiredFilled
              ? 'bg-brand-700 text-white hover:bg-brand-800'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed',
          ].join(' ')}
        >
          Vérification
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
    </section>
  );
}

function UploadSlot({
  slotId,
  label,
  description,
  required,
  uploaded,
  onUpload,
  onRemove,
}: {
  slotId: DocumentSlotId;
  label: string;
  description?: string;
  required?: boolean;
  uploaded: UploadedDoc | undefined;
  onUpload: (doc: UploadedDoc) => void;
  onRemove: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file: File) => {
    setError(null);
    if (!ACCEPTED_MIME.includes(file.type)) {
      setError('Format non supporté (PDF, JPG, PNG)');
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError(`Fichier > ${MAX_SIZE_MB} Mo`);
      return;
    }
    onUpload({
      slotId,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
    });
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  if (uploaded) {
    return (
      <div className="rounded-xl border border-success-500/40 bg-success-50/40 p-4">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-success-500/10 text-success-600">
            <SlotIcon slot={slotId} />
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-slate-900">{label}</p>
            <p className="truncate text-xs text-slate-600">{uploaded.name}</p>
            <p className="text-xs text-slate-500">
              {(uploaded.size / 1024).toFixed(0)} Ko · transmis
            </p>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="text-xs text-danger-500 hover:text-danger-600"
            aria-label={`Retirer ${label}`}
          >
            Retirer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      className={[
        'flex flex-col items-center gap-2 rounded-xl border-2 border-dashed p-5 text-center transition',
        dragOver
          ? 'border-brand-500 bg-brand-50/50'
          : 'border-slate-300 bg-white hover:border-brand-300',
      ].join(' ')}
    >
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
        <SlotIcon slot={slotId} />
      </span>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="text-sm font-medium text-slate-900 hover:text-brand-700 outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
      >
        {label}
      </button>
      <p className="text-xs text-slate-500">
        {description ?? 'Glissez ou cliquez pour sélectionner'}
      </p>
      <span
        className={[
          'mt-1 inline-flex rounded-md px-2 py-0.5 text-xs',
          required ? 'bg-danger-500/10 text-danger-600' : 'bg-slate-100 text-slate-600',
        ].join(' ')}
      >
        {required ? 'Obligatoire' : 'Optionnel'}
      </span>
      {error && <p className="text-xs text-danger-500">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />
    </div>
  );
}

function SlotIcon({ slot }: { slot: DocumentSlotId }) {
  const kind = SLOT_ICONS[slot];
  const c = {
    viewBox: '0 0 24 24',
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: 1.6,
    className: 'h-5 w-5',
  };
  switch (kind) {
    case 'medical':
      return (
        <svg {...c}>
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="M12 9v6" />
          <path d="M9 12h6" />
        </svg>
      );
    case 'ticket':
      return (
        <svg {...c}>
          <path d="M2 9V7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4Z" />
        </svg>
      );
    case 'invoice':
      return (
        <svg {...c}>
          <path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z" />
          <path d="M14 2v6h6" />
          <path d="M8 13h8" />
          <path d="M8 17h5" />
        </svg>
      );
    case 'id':
      return (
        <svg {...c}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <circle cx="9" cy="12" r="2.5" />
          <path d="M14 10h5" />
          <path d="M14 14h3" />
        </svg>
      );
    case 'booking':
      return (
        <svg {...c}>
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <path d="M8 3v4" />
          <path d="M16 3v4" />
          <path d="M4 11h16" />
        </svg>
      );
    case 'paperclip':
      return (
        <svg {...c}>
          <path d="M21 12 12 21a5.6 5.6 0 0 1-8-8l9-9a4 4 0 0 1 6 6l-9 9a2.4 2.4 0 0 1-3-3l8-8" />
        </svg>
      );
  }
}

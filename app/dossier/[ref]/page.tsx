import { DossierDetail } from '@/components/DossierDetail';

export default function DossierPage({ params }: { params: { ref: string } }) {
  const reference = decodeURIComponent(params.ref);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 text-brand-700 border border-brand-100 px-3 py-1 text-xs font-medium tracking-wide">
          <svg
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
            <path d="M14 2v6h6" />
          </svg>
          DOSSIER {reference}
        </span>
      </div>
      <DossierDetail reference={reference} />
    </div>
  );
}

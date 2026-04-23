import Link from 'next/link';
import { FaqAccordion } from '@/components/FaqAccordion';

export const metadata = {
  title: 'Aide — AssistanceVoyage',
};

export default function AidePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 text-brand-700 border border-brand-100 px-3 py-1 text-xs font-medium tracking-wide">
        <svg
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <path d="M12 17h.01" />
        </svg>
        AIDE
      </span>
      <h1 className="mt-4 font-serif text-3xl sm:text-4xl text-slate-900">Questions fréquentes</h1>
      <p className="mt-2 text-slate-600">
        Tout ce que vous devez savoir pour déclarer et suivre votre sinistre.
      </p>

      <div className="mt-10">
        <FaqAccordion />
      </div>

      <section className="mt-12 rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-card">
        <h2 className="font-serif text-xl text-slate-900">Vous ne trouvez pas votre réponse ?</h2>
        <p className="mt-2 text-sm text-slate-600">
          Notre équipe de gestionnaires est disponible du lundi au vendredi, 9h–18h (hors jours
          fériés).
        </p>
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ContactCard
            icon="mail"
            label="Email"
            value="assistance@assistancevoyage.fr"
            href="mailto:assistance@assistancevoyage.fr"
          />
          <ContactCard
            icon="phone"
            label="Téléphone"
            value="01 23 45 67 89"
            href="tel:+33123456789"
          />
        </div>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link
            href="/declarer"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-700 px-4 py-2 text-sm text-white hover:bg-brand-800"
          >
            Déclarer un sinistre
          </Link>
          <Link
            href="/suivi"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            Suivi de dossier
          </Link>
        </div>
      </section>
    </div>
  );
}

function ContactCard({
  icon,
  label,
  value,
  href,
}: {
  icon: 'mail' | 'phone';
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 hover:bg-slate-100 transition"
    >
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-700 text-white">
        {icon === 'mail' ? (
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 7 9 6 9-6" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z" />
          </svg>
        )}
      </span>
      <div>
        <p className="text-xs tracking-wider font-semibold text-slate-500">{label}</p>
        <p className="text-sm text-slate-900">{value}</p>
      </div>
    </a>
  );
}

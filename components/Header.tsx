import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 group"
          aria-label="AssistanceVoyage — accueil"
        >
          <span
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand-800 text-white shadow-sm"
            aria-hidden
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2 3 7l9 5 9-5-9-5Z" />
              <path d="m3 12 9 5 9-5" />
              <path d="m3 17 9 5 9-5" />
            </svg>
          </span>
          <span className="font-serif text-xl tracking-tight text-slate-900">
            Assistance<span className="text-brand-600">Voyage</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-4 text-sm">
          <Link
            href="/suivi"
            className="px-3 py-2 rounded-md text-slate-700 hover:text-brand-800 hover:bg-slate-100 transition"
          >
            Suivi de dossier
          </Link>
          <Link
            href="/aide"
            className="px-3 py-2 rounded-md text-slate-700 hover:text-brand-800 hover:bg-slate-100 transition"
          >
            Aide
          </Link>
          <span
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600"
            aria-label="Connexion sécurisée SSL"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5 text-success-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            SSL sécurisé
          </span>
        </nav>
      </div>
    </header>
  );
}

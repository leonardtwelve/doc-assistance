export function ParcoursHero() {
  return (
    <div className="flex flex-col gap-4">
      <span className="inline-flex self-start items-center gap-2 rounded-full bg-brand-50 text-brand-700 border border-brand-100 px-3 py-1 text-xs font-medium tracking-wide">
        <svg
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
        DÉCLARATION EN LIGNE
      </span>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Déclarez votre sinistre voyage
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Dossier analysé automatiquement · Décision motivée sous 24h · Virement SEPA 48–72h
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-slate-600">
          <HeroBadge icon="clock" label="5 min" />
          <HeroBadge icon="shield" label="RGPD" />
          <HeroBadge icon="check" label="Décision 24h" />
        </div>
      </div>
    </div>
  );
}

function HeroBadge({ icon, label }: { icon: 'clock' | 'shield' | 'check'; label: string }) {
  const paths = {
    clock: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </>
    ),
    shield: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      </>
    ),
    check: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  };
  return (
    <span className="inline-flex items-center gap-1.5">
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4 text-brand-600"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        {paths[icon]}
      </svg>
      {label}
    </span>
  );
}

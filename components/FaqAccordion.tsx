'use client';

import { useState } from 'react';
import { FAQS, type FaqItem } from '@/lib/faqs';

const CATEGORIES: { id: FaqItem['category']; label: string }[] = [
  { id: 'parcours', label: 'Parcours de déclaration' },
  { id: 'delais', label: 'Délais' },
  { id: 'documents', label: 'Pièces justificatives' },
  { id: 'securite', label: 'Sécurité & RGPD' },
  { id: 'decision', label: 'Décision & recours' },
];

export function FaqAccordion() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="space-y-10">
      {CATEGORIES.map((cat) => {
        const items = FAQS.filter((f) => f.category === cat.id);
        if (items.length === 0) return null;
        return (
          <section key={cat.id}>
            <h2 className="font-serif text-xl text-slate-900">{cat.label}</h2>
            <ul className="mt-3 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white overflow-hidden">
              {items.map((item) => {
                const id = `${cat.id}-${item.q}`;
                const open = openId === id;
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => setOpenId(open ? null : id)}
                      aria-expanded={open}
                      className="w-full text-left px-5 py-4 flex items-start justify-between gap-3 hover:bg-slate-50 transition outline-none focus-visible:bg-slate-50"
                    >
                      <span className="font-medium text-slate-900">{item.q}</span>
                      <svg
                        viewBox="0 0 24 24"
                        className={`h-5 w-5 mt-0.5 shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </button>
                    {open && (
                      <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed">
                        {item.a}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

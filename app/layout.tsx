import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import './globals.css';

export const metadata: Metadata = {
  title: 'AssistanceVoyage — Déclaration de sinistre en ligne',
  description:
    'Déclarez votre sinistre voyage en 5 minutes. Dossier analysé automatiquement, décision motivée sous 24h, virement SEPA 48-72h.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-full bg-slate-50 text-slate-900 antialiased">
        <Header />
        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      </body>
    </html>
  );
}

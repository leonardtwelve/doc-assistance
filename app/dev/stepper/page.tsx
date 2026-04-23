import { Stepper } from '@/components/Stepper';

export const metadata = {
  title: 'Dev · Stepper',
  robots: { index: false, follow: false },
};

export default function StepperDemoPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div>
        <h1 className="font-serif text-3xl text-slate-900">Stepper — démo interne</h1>
        <p className="mt-2 text-sm text-slate-600">
          Page de validation des 3 états (<code>pending</code>, <code>current</code>,{' '}
          <code>done</code>) du composant <code>&lt;Stepper /&gt;</code>. Non indexée.
        </p>
      </div>

      <DemoBlock title="1. Étape 1 courante — rien de complété">
        <Stepper currentStepId="sinistre" />
      </DemoBlock>

      <DemoBlock title="2. Étape 3 courante — 2 étapes complétées (cliquables)">
        <Stepper currentStepId="documents" completedStepIds={['sinistre', 'informations']} />
      </DemoBlock>

      <DemoBlock title="3. Étape 5 courante — 4 étapes complétées">
        <Stepper
          currentStepId="decision"
          completedStepIds={['sinistre', 'informations', 'documents', 'verification']}
        />
      </DemoBlock>
    </div>
  );
}

function DemoBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-medium text-slate-700">{title}</h2>
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card">{children}</div>
    </section>
  );
}

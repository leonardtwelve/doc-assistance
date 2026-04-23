import { ParcoursShell } from '@/components/parcours/ParcoursShell';
import { EtapeDecision } from '@/components/parcours/EtapeDecision';

export default function DecisionPage() {
  return (
    <ParcoursShell currentStepId="decision" showHero={false}>
      <EtapeDecision />
    </ParcoursShell>
  );
}

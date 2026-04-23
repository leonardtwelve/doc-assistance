import { ParcoursShell } from '@/components/parcours/ParcoursShell';
import { EtapeSinistre } from '@/components/parcours/EtapeSinistre';

export default function DeclarerPage() {
  return (
    <ParcoursShell currentStepId="sinistre">
      <EtapeSinistre />
    </ParcoursShell>
  );
}

import { ParcoursShell } from '@/components/parcours/ParcoursShell';
import { EtapeInformations } from '@/components/parcours/EtapeInformations';

export default function InformationsPage() {
  return (
    <ParcoursShell currentStepId="informations" showHero={false}>
      <EtapeInformations />
    </ParcoursShell>
  );
}

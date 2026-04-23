import { ParcoursShell } from '@/components/parcours/ParcoursShell';
import { EtapeDocuments } from '@/components/parcours/EtapeDocuments';

export default function DocumentsPage() {
  return (
    <ParcoursShell currentStepId="documents" showHero={false}>
      <EtapeDocuments />
    </ParcoursShell>
  );
}

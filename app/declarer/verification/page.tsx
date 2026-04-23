import { ParcoursShell } from '@/components/parcours/ParcoursShell';
import { EtapeVerification } from '@/components/parcours/EtapeVerification';

export default function VerificationPage() {
  return (
    <ParcoursShell currentStepId="verification" showHero={false}>
      <EtapeVerification />
    </ParcoursShell>
  );
}

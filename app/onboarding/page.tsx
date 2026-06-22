import { OnboardingPage } from "@/components/pages/onboarding-page";
import { getAppSnapshot } from "@/lib/data";

export default async function Onboarding() {
  const snapshot = await getAppSnapshot();

  return <OnboardingPage snapshot={snapshot} />;
}

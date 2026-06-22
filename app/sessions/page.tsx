import { SessionsPage } from "@/components/pages/sessions-page";
import { getAppSnapshot } from "@/lib/data";

export default async function Sessions() {
  const snapshot = await getAppSnapshot();

  return <SessionsPage snapshot={snapshot} />;
}

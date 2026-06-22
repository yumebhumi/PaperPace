import { DashboardPage } from "@/components/pages/dashboard-page";
import { getAppSnapshot } from "@/lib/data";

export default async function Dashboard() {
  const snapshot = await getAppSnapshot();

  return <DashboardPage snapshot={snapshot} />;
}

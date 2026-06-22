import { ReadingProgressPage } from "@/components/pages/reading-progress-page";
import { getAppSnapshot } from "@/lib/data";

export default async function PagesRoute() {
  const snapshot = await getAppSnapshot();

  return <ReadingProgressPage snapshot={snapshot} />;
}

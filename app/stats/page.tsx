import { GenrePaceChart } from "@/components/charts/genre-pace-chart";
import { ReadingPaceTrendsChart } from "@/components/charts/reading-pace-trends-chart";
import { WeeklyPagesChart } from "@/components/charts/weekly-pages-chart";
import { SectionHeading } from "@/components/ui/section-heading";
import { Surface } from "@/components/ui/surface";
import { getAppSnapshot } from "@/lib/data";

export default async function StatsPage() {
  const snapshot = await getAppSnapshot();
  const paceTrendData = [...snapshot.sessions]
    .sort((left, right) => new Date(left.endedAt).getTime() - new Date(right.endedAt).getTime())
    .slice(-6)
    .map((session) => ({
      session: new Date(session.endedAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      pace: Math.round(session.paceSecondsPerPage),
    }));

  return (
    <div className="space-y-6">
      <Surface className="p-5 md:p-6" decoration="none">
        <SectionHeading
          eyebrow="Stats"
          title="Reading progress"
          description="View pages, pace, and session trends."
        />
      </Surface>
      <div className="grid gap-6 xl:grid-cols-2">
        <Surface className="p-5 md:p-6" decoration="none">
          <SectionHeading
            eyebrow="Weekly pages"
            title="Pages this week"
            description="Review weekly volume."
          />
          <div className="mt-6">
            <WeeklyPagesChart data={snapshot.weeklyPages} />
          </div>
        </Surface>
        <Surface className="p-5 md:p-6" decoration="none">
          <SectionHeading
            eyebrow="Pace trends"
            title="Reading pace"
            description="Review recent pace trends."
          />
          <div className="mt-6">
            <ReadingPaceTrendsChart data={paceTrendData} />
          </div>
        </Surface>
      </div>
      <Surface className="p-5 md:p-6" decoration="none">
        <SectionHeading
          eyebrow="Genre pace"
          title="How your pace shifts by genre"
          description="See where you naturally move faster."
        />
        <div className="mt-6">
          <GenrePaceChart data={snapshot.genrePace} />
        </div>
      </Surface>
    </div>
  );
}

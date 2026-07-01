import { RoughButton } from "@/components/ui/rough-button";
import { RoughInput, RoughSelect } from "@/components/ui/rough-field";
import { SectionHeading } from "@/components/ui/section-heading";
import { Surface } from "@/components/ui/surface";

const dayChips = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const activeDays = new Set(["Mon", "Wed", "Fri", "Sat"]);

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <span className="chip">Settings</span>
      <Surface className="mt-2 p-5 md:p-6" decoration="washi-blue">
        <SectionHeading
          eyebrow="App settings"
          emoji="⚙️"
          tone="blue"
          title="Tune your reading practice"
          description="Manage reminders, account details, and the way your reading is tracked — all taped up in one spot."
        />

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Reminders */}
          <section
            className="relative -rotate-[0.5deg] border-[3px] border-[var(--border)] px-5 py-5 wobbly-note"
            style={{ background: "#fff9c4", boxShadow: "3px 3px 0 var(--border)" }}
          >
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 min-w-[36px] items-center justify-center border-2 border-[var(--border)] bg-white text-[18px] wobbly-note">
                🔔
              </span>
              <div className="font-display text-[19px] font-bold">Reminders</div>
            </div>
            <label className="mt-4 block text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--label)]">
              Reminder time
            </label>
            <RoughSelect className="mt-1.5" defaultValue="evening">
              <option value="morning">Morning · 8:00am</option>
              <option value="afternoon">Afternoon · 1:00pm</option>
              <option value="evening">Evening · 8:30pm</option>
            </RoughSelect>
            <div className="mt-4 flex flex-wrap gap-2">
              {dayChips.map((day) => (
                <span
                  key={day}
                  className="rounded-full border-2 border-[var(--border)] px-3 py-1 text-[12px] font-extrabold"
                  style={{
                    background: activeDays.has(day) ? "#ff4d4d" : "#ffffff",
                    color: activeDays.has(day) ? "#ffffff" : "var(--foreground)",
                    boxShadow: "2px 2px 0 rgba(45,45,45,0.16)",
                  }}
                >
                  {day}
                </span>
              ))}
            </div>
            <p className="mt-3 text-[12px] font-bold text-[#6b655c]">
              A gentle nudge on your reading days — no guilt, just a friendly poke ✨
            </p>
          </section>

          {/* Reading practice */}
          <section
            className="relative rotate-[0.5deg] border-[3px] border-[var(--border)] px-5 py-5 wobbly-note"
            style={{ background: "#ffe9f1", boxShadow: "3px 3px 0 var(--border)" }}
          >
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 min-w-[36px] items-center justify-center border-2 border-[var(--border)] bg-white text-[18px] wobbly-note">
                📏
              </span>
              <div className="font-display text-[19px] font-bold">Reading practice</div>
            </div>
            <label className="mt-4 block text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--label)]">
              Track progress by
            </label>
            <RoughSelect className="mt-1.5" defaultValue="pages">
              <option value="pages">Pages</option>
              <option value="minutes">Minutes</option>
              <option value="percent">Percent complete</option>
            </RoughSelect>
            <label className="mt-4 block text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--label)]">
              Weekly session goal
            </label>
            <RoughInput className="mt-1.5" type="number" min={1} max={21} defaultValue={5} />
            <p className="mt-3 text-[12px] font-bold text-[#6b655c]">
              Sessions, not books, are the unit that keeps the habit sticky 🐢
            </p>
          </section>

          {/* Account */}
          <section
            className="relative -rotate-[0.4deg] border-[3px] border-[var(--border)] px-5 py-5 wobbly-note lg:col-span-2"
            style={{ background: "#d6f5e3", boxShadow: "3px 3px 0 var(--border)" }}
          >
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 min-w-[36px] items-center justify-center border-2 border-[var(--border)] bg-white text-[18px] wobbly-note">
                🧑‍💻
              </span>
              <div className="font-display text-[19px] font-bold">Account</div>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--label)]">
                  Display name
                </label>
                <RoughInput className="mt-1.5" type="text" defaultValue="Jordan Lee" />
              </div>
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--label)]">
                  Email
                </label>
                <RoughInput className="mt-1.5" type="email" defaultValue="jordan@paperpace.app" />
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <RoughButton type="button" variant="primary">
                Save settings ✨
              </RoughButton>
              <RoughButton type="button" variant="ghost">
                Reset to defaults
              </RoughButton>
            </div>
          </section>
        </div>
      </Surface>
    </div>
  );
}

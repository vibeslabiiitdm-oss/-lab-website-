import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, FileBadge, Sparkles, Target, Trophy, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { Reveal } from "@/components/site/Reveal";
import { type Achievement } from "@/data/lab";

export const Route = createFileRoute("/achievements")({ component: AchievementsPage });

const cats = ["All", "Recognition", "Grant", "Patent", "Milestone"] as const;

const iconFor = (c: Achievement["category"] | string) =>
  c === "Recognition" ? Trophy : c === "Grant" ? Sparkles : c === "Patent" ? FileBadge : Target;

function AchievementsPage() {
  const [cat, setCat] = useState<(typeof cats)[number]>("All");
  const [dbAchievements, setDbAchievements] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/achievements")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setDbAchievements(data);
      })
      .catch((err) => console.error("Error loading achievements:", err));
  }, []);

  const list = dbAchievements
    .filter((a) => (cat === "All" ? true : a.category === cat))
    .sort((a, b) => b.year - a.year);

  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <Link
        to="/"
        className="mb-8 flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft size={16} /> Back to Home
      </Link>
      <Reveal>
        <div className="text-xs uppercase tracking-[0.2em] text-primary/80">Achievements</div>
        <h1 className="mt-2 font-display text-4xl md:text-5xl font-bold">
          Lab <span className="text-gradient">achievements</span>
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Major recognitions, grants, patents and milestones earned by ViBeS Lab across the years.
        </p>
      </Reveal>

      <div className="mt-8 inline-flex rounded-lg border border-border/70 overflow-hidden flex-wrap">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`px-4 py-2 text-sm transition ${cat === c ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="mt-12 relative">
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/40 to-transparent" />
        <ol className="space-y-8">
          {list.map((a: any, i) => {
            const Icon = iconFor(a.category);
            const left = i % 2 === 0;
            return (
              <Reveal key={a._id || a.id || i} delay={i * 40}>
                <li
                  className={`relative grid md:grid-cols-2 gap-6 ${left ? "" : "md:[&>*:first-child]:order-2"}`}
                >
                  <div className="hidden md:block" />
                  <div
                    className={`relative pl-12 md:pl-0 ${left ? "md:pr-12 md:text-right" : "md:pl-12"}`}
                  >
                    <div
                      className={`absolute top-2 ${left ? "left-0 md:left-auto md:-right-[26px]" : "left-0 md:-left-[26px]"} h-10 w-10 rounded-full bg-background border border-primary/40 grid place-items-center text-primary shadow-lg shadow-primary/10`}
                    >
                      <Icon size={16} />
                    </div>
                    <div className="rounded-2xl border border-border/60 glass p-5 hover:border-primary/40 transition">
                      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground justify-start md:justify-inherit">
                        <span className="px-2 py-0.5 rounded-full bg-accent/10 border border-accent/30 text-accent">
                          {a.category}
                        </span>
                        <span>{a.year}</span>
                      </div>
                      <div className="mt-2 font-display font-semibold text-lg">{a.title}</div>
                      {a.org && <div className="text-xs text-primary mt-0.5">{a.org}</div>}
                      <p className="mt-2 text-sm text-muted-foreground">{a.detail}</p>
                    </div>
                  </div>
                </li>
              </Reveal>
            );
          })}
        </ol>
      </div>

      {list.length === 0 && (
        <div className="mt-12 text-center text-muted-foreground text-sm">
          <Award className="mx-auto mb-3 text-muted-foreground" size={28} />
          No achievements in this category yet.
        </div>
      )}
    </div>
  );
}

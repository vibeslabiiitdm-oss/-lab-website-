import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Reveal } from "@/components/site/Reveal";
import { allPeople } from "@/data/lab";
import { ChevronDown, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/publications")({ component: PubsPage });

function PubsPage() {
  const all = useMemo(
    () =>
      allPeople.flatMap((p) =>
        p.publications.map((pub) => ({ ...pub, author: p.name, authorId: p.id })),
      ),
    [],
  );
  const years = useMemo(
    () => Array.from(new Set(all.map((p) => p.year))).sort((a, b) => b - a),
    [all],
  );
  const types = ["All", "Journal", "Conference", "Book Chapter"] as const;

  const [q, setQ] = useState("");
  const [year, setYear] = useState<number | "All">("All");
  const [type, setType] = useState<(typeof types)[number]>("All");
  const [expandedPubs, setExpandedPubs] = useState<Record<string, boolean>>({});
  const toggleExpand = (id: string) => {
    setExpandedPubs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filtered = all
    .filter((p) => (year === "All" ? true : p.year === year))
    .filter((p) => (type === "All" ? true : p.type === type))
    .filter((p) => (q ? p.title.toLowerCase().includes(q.toLowerCase()) : true))
    .sort((a, b) => b.year - a.year || b.month - a.month);

  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <Link
        to="/"
        className="mb-8 flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft size={16} /> Back to Home
      </Link>
      <Reveal>
        <div className="text-xs uppercase tracking-[0.2em] text-primary/80">Publications</div>
        <h1 className="mt-2 font-display text-4xl md:text-5xl font-bold">Publications</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Browse {all.length} publications across the lab — filter by year, type, or search by
          title.
        </p>
      </Reveal>

      <div className="mt-8 flex flex-wrap gap-3 items-center">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search title…"
          className="bg-background border border-border/70 rounded-md px-3 py-2 text-sm w-72"
        />
        <select
          value={year}
          onChange={(e) => setYear(e.target.value === "All" ? "All" : Number(e.target.value))}
          className="bg-background border border-border/70 rounded-md px-2 py-2 text-sm"
        >
          <option>All</option>
          {years.map((y) => (
            <option key={y}>{y}</option>
          ))}
        </select>
        <div className="inline-flex rounded-md border border-border/70 overflow-hidden">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`px-3 py-2 text-xs ${type === t ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              {t}
            </button>
          ))}
        </div>
        <span className="text-xs text-muted-foreground">{filtered.length} results</span>
      </div>

      <div className="mt-8 space-y-3">
        {filtered.map((p) => {
          const isExpanded = !!expandedPubs[p.id];
          return (
            <div
              key={p.id}
              className="rounded-xl border border-border/60 glass p-4 hover:border-primary/40 transition flex flex-col gap-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div
                  className={`flex-1 ${p.abstract ? "cursor-pointer select-none" : ""}`}
                  onClick={() => p.abstract && toggleExpand(p.id)}
                >
                  <div className="font-medium text-black dark:text-white transition-colors">{p.title}</div>
                  <div className="text-xs text-black dark:text-white mt-1">
                    {p.venue} · {p.type} · {p.year} · by{" "}
                    {p.author}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] px-2 py-1 rounded-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/20 text-black dark:text-white">
                    {p.domain}
                  </span>
                  {p.abstract && (
                    <button
                      onClick={() => toggleExpand(p.id)}
                      className="p-1 rounded-md hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                      title="Toggle Abstract"
                    >
                      <ChevronDown
                        size={16}
                        className={`transform transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                      />
                    </button>
                  )}
                </div>
              </div>
              {p.abstract && isExpanded && (
                <div className="mt-1 text-xs text-muted-foreground/90 border-t border-border/40 pt-3 leading-relaxed transition-all duration-300">
                  <div className="font-semibold text-[10px] uppercase tracking-wider text-accent/95 mb-1">Abstract</div>
                  {p.abstract}
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-sm text-muted-foreground text-center py-10">
            No publications match your filters.
          </div>
        )}
      </div>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, useRef } from "react";
import { Reveal } from "@/components/site/Reveal";
import { allPeople } from "@/data/lab";
import { ChevronDown, ArrowLeft, ExternalLink, BookOpen } from "lucide-react";

export const Route = createFileRoute("/publications")({ component: PubsPage });

// Feature 1: The two reference papers with title-link + explicit Abstract button
const REFERENCE_PUB_IDS = ["pub-j-1", "pub-c-1"];

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
  // Feature 4: expanded domain groups — all collapsed by default
  const [expandedDomains, setExpandedDomains] = useState<Record<string, boolean>>({});
  const domainRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const toggleExpand = (id: string) => {
    setExpandedPubs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleDomain = (domain: string) => {
    setExpandedDomains((prev) => {
      const next = { ...prev, [domain]: !prev[domain] };
      // Scroll to domain heading when opening
      if (!prev[domain] && domainRefs.current[domain]) {
        setTimeout(() => {
          domainRefs.current[domain]?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 80);
      }
      return next;
    });
  };

  const filtered = all
    .filter((p) => (year === "All" ? true : p.year === year))
    .filter((p) => (type === "All" ? true : p.type === type))
    .filter((p) => (q ? p.title.toLowerCase().includes(q.toLowerCase()) : true))
    .sort((a, b) => b.year - a.year || b.month - a.month);

  // Feature 4: group filtered results by domain
  const domains = useMemo(
    () => Array.from(new Set(filtered.map((p) => p.domain))).sort(),
    [filtered],
  );
  const byDomain = useMemo(() => {
    const map: Record<string, typeof filtered> = {};
    filtered.forEach((p) => {
      map[p.domain] = map[p.domain] || [];
      map[p.domain].push(p);
    });
    return map;
  }, [filtered]);

  const renderPubCard = (p: (typeof filtered)[number]) => {
    const isExpanded = !!expandedPubs[p.id];
    const isReference = REFERENCE_PUB_IDS.includes(p.id);

    return (
      <div
        key={p.id}
        className="rounded-xl border border-border/60 glass p-4 hover:border-primary/40 transition flex flex-col gap-3"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Feature 1: reference papers get a clickable title link */}
            {isReference && p.url ? (
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-black dark:text-white hover:text-primary dark:hover:text-primary transition-colors inline-flex items-start gap-1 group"
              >
                <span>{p.title}</span>
                <ExternalLink size={13} className="shrink-0 mt-0.5 opacity-60 group-hover:opacity-100 transition" />
              </a>
            ) : (
              <div className="font-medium text-black dark:text-white">{p.title}</div>
            )}
            <div className="text-xs text-black dark:text-white mt-1">
              {p.venue} · {p.type} · {p.year} · by {p.author}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] px-2 py-1 rounded-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/20 text-black dark:text-white">
              {p.domain}
            </span>
            {/* Feature 1: reference papers get explicit "Abstract" button; others get chevron */}
            {p.abstract && isReference ? (
              <button
                onClick={() => toggleExpand(p.id)}
                className="flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent hover:bg-accent/20 transition"
                title="Toggle Abstract"
              >
                <BookOpen size={11} />
                Abstract
                <ChevronDown
                  size={11}
                  className={`transform transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                />
              </button>
            ) : p.abstract ? (
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
            ) : null}
          </div>
        </div>
        {p.abstract && isExpanded && (
          <div className="mt-1 text-xs text-muted-foreground/90 border-t border-border/40 pt-3 leading-relaxed">
            <div className="font-semibold text-[10px] uppercase tracking-wider text-accent/95 mb-1">Abstract</div>
            {p.abstract}
          </div>
        )}
      </div>
    );
  };

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

      {/* Feature 4: Domain topic badges — click to scroll/expand that domain group */}
      {domains.length > 0 && (
        <div className="mt-6">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Browse by topic</div>
          <div className="flex flex-wrap gap-2">
            {domains.map((domain) => (
              <button
                key={domain}
                onClick={() => toggleDomain(domain)}
                className={`text-xs px-3 py-1.5 rounded-full border transition font-medium ${
                  expandedDomains[domain]
                    ? "bg-primary/20 border-primary/50 text-primary"
                    : "border-border/70 text-muted-foreground hover:text-foreground hover:border-primary/40"
                }`}
              >
                {domain}
                <span className="ml-1.5 text-[10px] opacity-70">({byDomain[domain]?.length ?? 0})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3 items-center">
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

      {/* Feature 4: Grouped by domain sections */}
      <div className="mt-8 space-y-5">
        {domains.map((domain) => {
          const pubs = byDomain[domain] || [];
          const isOpen = !!expandedDomains[domain];
          return (
            <div
              key={domain}
              ref={(el) => { domainRefs.current[domain] = el; }}
              className="rounded-2xl border border-border/60 glass overflow-hidden"
            >
              <button
                onClick={() => toggleDomain(domain)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-primary/5 transition"
              >
                <span className="font-display text-lg font-bold flex items-center gap-2">
                  {domain}
                  <span className="text-muted-foreground text-sm font-normal">({pubs.length})</span>
                </span>
                <ChevronDown
                  size={18}
                  className={`text-muted-foreground transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 border-t border-border/40">
                  <div className="pt-4 space-y-3">
                    {pubs.map((p) => renderPubCard(p))}
                  </div>
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

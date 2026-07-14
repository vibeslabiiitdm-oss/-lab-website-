import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { Reveal } from "@/components/site/Reveal";
import { type Person, BASE_URL, allPeople as staticPeople } from "@/data/lab";
import { ChevronDown, ArrowLeft, ExternalLink, BookOpen } from "lucide-react";

// Build keyword-based URL lookup from static data so backend results get supplemented
// Uses keyword matching to handle title variations (casing, articles like 'a', hyphens etc.)
const KEYWORD_URL_ENTRIES: Array<{ keywords: string[]; url: string }> = [];
staticPeople.forEach((p) => {
  (p.publications || []).forEach((pub) => {
    if (!pub.url || !pub.title) return;
    // Build keywords: meaningful words (length >= 4) from the title
    const keywords = pub.title
      .toLowerCase()
      .split(/\W+/)
      .filter((w) => w.length >= 4)
      .slice(0, 5); // use first 5 significant words as fingerprint
    KEYWORD_URL_ENTRIES.push({ keywords, url: pub.url });
  });
});

function findUrlByKeywords(title: string): string {
  if (!title) return "";
  const lower = title.toLowerCase();
  
  // Explicit overrides for known papers to guarantee links work
  if (lower.includes("mecsa") && lower.includes("attention")) {
    return "https://link.springer.com/article/10.1007/s10044-026-01634-x";
  }
  if (lower.includes("enhancing aerial pedestrian detection") || lower.includes("yolov12")) {
    return "https://openaccess.thecvf.com/content/CVPR2026W/AERO-HPR/papers/S_Enhancing_Aerial_Pedestrian_Detection_via_High-Resolution_P2_Feature_Integration_in_CVPRW_2026_paper.pdf";
  }

  for (const entry of KEYWORD_URL_ENTRIES) {
    if (entry.keywords.every((k) => lower.includes(k))) return entry.url;
  }
  return "";
}

export const Route = createFileRoute("/publications")({ component: PubsPage });

// Every publication with a URL gets a clickable title link.

function PubsPage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE_URL}/api/people`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPeople(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const all = useMemo(
    () =>
      people.flatMap((p) =>
        (p.publications || [])
          .filter((pub) => {
            const title = (pub.title || "").toLowerCase();
            const venue = (pub.venue || "").toLowerCase();
            return !title.includes("under review") && !venue.includes("under review");
          })
          .map((pub) => ({
            ...pub,
            // Supplement missing URL from static data using keyword matching
            url: pub.url || findUrlByKeywords(pub.title ?? "") || "",
            author: p.name,
            authorId: p.id,
          })),
      ),
    [people],
  );

  const years = useMemo(
    () => Array.from(new Set(all.map((p) => p.year))).sort((a, b) => b - a),
    [all],
  );
  const types = ["All", "Journal", "Conference", "Book Chapter"] as const;

  const [q, setQ] = useState("");
  const [year, setYear] = useState<number | "All">("All");
  const [type, setType] = useState<(typeof types)[number]>("All");
  const [selectedDomain, setSelectedDomain] = useState<string>("All");
  const [expandedPubs, setExpandedPubs] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedPubs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filtered = all
    .filter((p) => (year === "All" ? true : p.year === year))
    .filter((p) => (type === "All" ? true : p.type === type))
    .filter((p) => (selectedDomain === "All" ? true : p.domain === selectedDomain))
    .filter((p) => (q ? p.title.toLowerCase().includes(q.toLowerCase()) : true))
    .sort((a, b) => b.year - a.year || b.month - a.month);

  const allDomains = useMemo(
    () => Array.from(new Set(all.map((p) => p.domain))).sort(),
    [all],
  );

  const domainCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    all.forEach((p) => {
      counts[p.domain] = (counts[p.domain] || 0) + 1;
    });
    return counts;
  }, [all]);

  const renderPubCard = (p: (typeof filtered)[number]) => {
    const isExpanded = !!expandedPubs[p.id];
    const hasAbstract = !!(p.abstract && p.abstract.trim().length > 0);

    return (
      <div
        key={p.id}
        className="rounded-xl border border-border/60 glass p-4 hover:border-primary/40 transition flex flex-col gap-3"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Title — always a link if URL is present */}
            {p.url ? (
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
            {/* Abstract button — always shown; disabled with tooltip if no abstract yet */}
            {hasAbstract ? (
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
            ) : (
              <span
                className="flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-muted border border-border/40 text-muted-foreground cursor-not-allowed"
                title="Abstract not yet available"
              >
                <BookOpen size={11} />
                Coming soon
              </span>
            )}
          </div>
        </div>
        {hasAbstract && isExpanded && (
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

      {isLoading && (
        <div className="mt-10 text-center text-muted-foreground animate-pulse">
          Loading publications...
        </div>
      )}

      {!isLoading && (
        <>
          {allDomains.length > 0 && (
            <div className="mt-6">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Browse by topic</div>
              <div className="flex flex-wrap gap-2">
                {allDomains.map((domain) => (
                  <button
                    key={domain}
                    onClick={() => setSelectedDomain(selectedDomain === domain ? "All" : domain)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition font-medium ${
                      selectedDomain === domain
                        ? "bg-primary/20 border-primary/50 text-primary"
                        : "border-border/70 text-muted-foreground hover:text-foreground hover:border-primary/40"
                    }`}
                  >
                    {domain}
                    <span className="ml-1.5 text-[10px] opacity-70">({domainCounts[domain] || 0})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3 items-center">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search title..."
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
            {filtered.map((p) => renderPubCard(p))}
            {filtered.length === 0 && (
              <div className="text-sm text-muted-foreground text-center py-10 border border-dashed border-border/40 rounded-xl">
                No publications match your filters.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

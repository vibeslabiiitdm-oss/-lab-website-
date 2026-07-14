import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, ExternalLink, BookOpen } from "lucide-react";

export type PubEntry = {
  id: string;
  title: string;
  venue: string;
  type: string;
  year: number;
  month?: number;
  domain: string;
  url?: string;
  abstract?: string;
  author: string;
  authorId: string;
};

type Props = {
  pubs: PubEntry[];
};

/**
 * Groups publications by `domain` and renders each group as a
 * collapsible accordion row. All groups start collapsed.
 * Reusable across the Projects detail page and anywhere else
 * publications are shown grouped by research domain.
 */
export function CollapsiblePubGroups({ pubs }: Props) {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [expandedPubs, setExpandedPubs] = useState<Record<string, boolean>>({});

  if (pubs.length === 0) {
    return (
      <div className="text-sm text-muted-foreground border border-dashed border-border/40 p-8 rounded-xl text-center">
        No publications tagged under this domain yet.
      </div>
    );
  }

  // Group by domain, preserving insertion order (sorted by year within each group)
  const domains = Array.from(new Set(pubs.map((p) => p.domain))).sort();
  const grouped: Record<string, PubEntry[]> = {};
  domains.forEach((d) => {
    grouped[d] = pubs
      .filter((p) => p.domain === d)
      .sort((a, b) => b.year - a.year || (b.month ?? 0) - (a.month ?? 0));
  });

  const toggleGroup = (domain: string) =>
    setOpenGroups((prev) => ({ ...prev, [domain]: !prev[domain] }));

  const togglePub = (id: string) =>
    setExpandedPubs((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="space-y-3">
      {domains.map((domain) => {
        const items = grouped[domain];
        const isOpen = !!openGroups[domain];

        return (
          <div
            key={domain}
            className="rounded-2xl border border-border/60 glass overflow-hidden"
          >
            {/* Clickable header */}
            <button
              onClick={() => toggleGroup(domain)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-primary/5 transition text-left"
            >
              <span className="font-display text-base font-bold flex items-center gap-2">
                <BookOpen size={15} className="text-primary opacity-80 shrink-0" />
                {domain}
                <span className="text-muted-foreground text-sm font-normal ml-1">
                  ({items.length} paper{items.length !== 1 ? "s" : ""})
                </span>
              </span>
              <ChevronDown
                size={18}
                className={`text-muted-foreground shrink-0 transform transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Expanded publication list */}
            {isOpen && (
              <div className="border-t border-border/40 px-4 pb-4 pt-3 space-y-3">
                {items.map((pub) => {
                  const expanded = !!expandedPubs[pub.id];
                  const hasAbstract = !!(pub.abstract && pub.abstract.trim().length > 0);
                  return (
                    <div
                      key={pub.id}
                      className="rounded-xl border border-border/60 glass p-4 hover:border-primary/40 transition flex flex-col gap-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          {/* Title — clickable link if URL present */}
                          {pub.url ? (
                            <a
                              href={pub.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-sm text-black dark:text-white hover:text-primary dark:hover:text-primary transition-colors inline-flex items-start gap-1 group leading-snug"
                            >
                              <span>{pub.title}</span>
                              <ExternalLink size={12} className="shrink-0 mt-0.5 opacity-60 group-hover:opacity-100 transition" />
                            </a>
                          ) : (
                            <div className="font-medium text-sm text-black dark:text-white leading-snug">
                              {pub.title}
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground mt-1">
                            {pub.venue} · {pub.type} · {pub.year} ·{" "}
                            <Link
                              to="/profile/$id"
                              params={{ id: pub.authorId }}
                              className="text-primary hover:underline"
                            >
                              {pub.author}
                            </Link>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {/* Abstract button — always shown */}
                          {hasAbstract ? (
                            <button
                              onClick={() => togglePub(pub.id)}
                              className="flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent hover:bg-accent/20 transition"
                              title="Toggle Abstract"
                            >
                              <BookOpen size={11} />
                              Abstract
                              <ChevronDown
                                size={11}
                                className={`transform transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
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
                      {pub.abstract && expanded && (
                        <div className="mt-1 text-xs text-muted-foreground/90 border-t border-border/40 pt-3 leading-relaxed">
                          <div className="font-semibold text-[10px] uppercase tracking-wider text-accent/95 mb-1">
                            Abstract
                          </div>
                          {pub.abstract}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  Layers,
  Mic,
  Globe,
  Zap,
  Clock,
  ChevronDown,
} from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { Reveal } from "@/components/site/Reveal";
import {
  allPeople,
  getConferencesByDomain,
  getProjectsByDomain,
  getPublicationsByDomain,
} from "@/data/lab";

export const Route = createFileRoute("/domain/$name")({ component: DomainPage });

function generateGlobalUpdates(domain: string) {
  const seeds = [
    `OpenAI announces new breakthrough in ${domain} efficiency.`,
    `Stanford researchers publish new dataset for ${domain}.`,
    `Google DeepMind open-sources new framework targeting ${domain}.`,
    `Major security vulnerability discovered in legacy ${domain} systems.`,
    `EU passes new regulations regarding the use of ${domain} in public spaces.`,
    `Startup raises $50M to apply ${domain} to climate tech.`,
    `MIT CSAIL develops ultra-low latency architecture for ${domain}.`,
    `Global conference on ${domain} sees record attendance this year.`,
  ];
  // Deterministic shuffle based on domain length
  const shuffled = [...seeds].sort(
    (a, b) => ((a.length * domain.length) % 3) - ((b.length * domain.length) % 3),
  );
  return shuffled.slice(0, 3).map((text, i) => ({
    id: i,
    text,
    source: ["TechCrunch", "Nature", "arXiv", "Wired", "Reuters"][i % 5],
    time: `${(i + 1) * 2} hours ago`,
  }));
}

function DomainPage() {
  const { name } = Route.useParams();
  const domain = decodeURIComponent(name);
  const pubs = getPublicationsByDomain(domain).sort((a, b) => b.year - a.year || b.month - a.month);
  const projects = getProjectsByDomain(domain);
  const confs = getConferencesByDomain(domain).slice(0, 8);
  const peopleInDomain = allPeople.filter((p) =>
    p.domains.some(
      (d) =>
        d.toLowerCase().includes(domain.toLowerCase()) ||
        domain.toLowerCase().includes(d.toLowerCase()),
    ),
  );

  const [news, setNews] = useState<any[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [expandedPubs, setExpandedPubs] = useState<Record<string, boolean>>({});
  const toggleExpand = (id: string) => {
    setExpandedPubs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const fallbackUpdates = useMemo(() => generateGlobalUpdates(domain), [domain]);

  useEffect(() => {
    setNewsLoading(true);
    fetch(`http://localhost:5000/api/news?q=${encodeURIComponent(domain)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Backend response error");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setNews(data.slice(0, 3)); // show top 3 updates
        } else {
          setNews(fallbackUpdates);
        }
        setNewsLoading(false);
      })
      .catch((err) => {
        console.error("Error loading live news feed:", err);
        setNews(fallbackUpdates);
        setNewsLoading(false);
      });
  }, [domain, fallbackUpdates]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <Link
        to="/"
        onClick={(e) => {
          if (typeof window !== "undefined" && window.history.length > 1) {
            e.preventDefault();
            window.history.back();
          }
        }}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft size={14} /> Back
      </Link>

      <Reveal>
        <div className="mt-6 relative overflow-hidden rounded-3xl border border-border/60 glass p-8 md:p-12">
          <div className="absolute inset-0 grid-bg opacity-50" />
          <div className="relative">
            <div className="text-xs uppercase tracking-[0.22em] text-primary/80">
              Research Domain
            </div>
            <h1 className="mt-2 font-display text-4xl md:text-6xl font-bold leading-[1.05]">
              <span className="text-gradient">{domain}</span>
            </h1>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              Everything ViBeS Lab has shipped, published and presented under {domain.toLowerCase()}{" "}
              — filtered live from the lab's data.
            </p>

            <div className="mt-6 grid grid-cols-3 max-w-md gap-3">
              <Stat icon={<Layers size={14} />} label="Projects" value={projects.length} />
              <Stat icon={<BookOpen size={14} />} label="Publications" value={pubs.length} />
              <Stat icon={<Mic size={14} />} label="Conferences" value={confs.length} />
            </div>
          </div>
        </div>
      </Reveal>

      {/* Global Updates */}
      <section className="mt-12 mb-16">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="text-primary" size={20} />
          <h2 className="font-display text-xl font-bold">Global World Updates</h2>
          <span className={`ml-2 text-[10px] px-2 py-0.5 rounded border uppercase tracking-wider ${
            newsLoading ? "border-muted text-muted" : news.some(n => n.link) ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10" : "border-accent/40 text-accent bg-accent/10"
          }`}>
            {newsLoading ? "Loading..." : news.some(n => n.link) ? "Live Feed" : "Live Simulation"}
          </span>
        </div>

        {newsLoading ? (
          <div className="grid md:grid-cols-3 gap-4">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="rounded-xl border border-border/40 glass p-5 h-28 animate-pulse bg-muted/10"
              />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {news.map((update, idx) => {
              const content = (
                <>
                  <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-full -z-10 group-hover:bg-primary/10 transition" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <span className="font-medium text-foreground">{update.source}</span>
                    <span className="flex items-center gap-1">
                      <Clock size={10} />{" "}
                      {update.pubDate
                        ? new Date(update.pubDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })
                        : update.time || "Recently"}
                    </span>
                  </div>
                  <p className="text-sm font-medium leading-snug group-hover:text-primary transition-colors text-left">
                    {update.title || update.text}
                  </p>
                  {update.link && (
                    <div className="mt-3 flex items-center gap-1 text-[10px] text-accent font-bold uppercase tracking-wider group-hover:translate-x-0.5 transition-transform duration-200 text-left">
                      Read story <ArrowRight size={10} />
                    </div>
                  )}
                </>
              );

              return update.link ? (
                <a
                  key={idx}
                  href={update.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-border/60 glass p-4 relative overflow-hidden group flex flex-col justify-between hover:border-primary/50 hover:shadow-neon-primary transition duration-300 block"
                >
                  {content}
                </a>
              ) : (
                <div
                  key={idx}
                  className="rounded-xl border border-border/60 glass p-4 relative overflow-hidden group flex flex-col justify-between"
                >
                  {content}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Projects */}
      <section className="mt-16">
        <SectionHeader
          title="Projects"
          subtitle="Work that has gone from lab bench to deployment."
        />
        {projects.length === 0 ? (
          <Empty msg="No projects logged for this domain yet." />
        ) : (
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {projects.map((proj, i) => (
              <Reveal key={proj.id} delay={i * 50}>
                <div className="rounded-2xl border border-border/60 glass overflow-hidden hover:border-primary/40 transition group">
                  <div className={`h-28 bg-gradient-to-br ${proj.image} relative`}>
                    <div className="absolute inset-0 grid-bg opacity-50" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider">
                      <span
                        className={`px-2 py-0.5 rounded-full border ${proj.status === "Ongoing" ? "border-primary/40 text-primary bg-primary/10" : "border-accent/40 text-accent bg-accent/10"}`}
                      >
                        {proj.status}
                      </span>
                      <span className="text-muted-foreground">{proj.year}</span>
                    </div>
                    <div className="mt-2 font-display font-semibold text-lg leading-tight">
                      {proj.title}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {proj.tagline}
                    </p>
                    <Link
                      to="/projects"
                      className="mt-3 inline-flex items-center gap-1 text-xs text-primary group-hover:translate-x-0.5 transition"
                    >
                      View details <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* Publications */}
      <section className="mt-16">
        <SectionHeader title="Publications" subtitle="Papers tagged under this research area." />
        {pubs.length === 0 ? (
          <Empty msg="No publications listed for this domain yet." />
        ) : (
          <div className="mt-6 space-y-3">
            {pubs.map((p) => {
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
                      <div className="font-medium text-foreground hover:text-primary transition-colors">{p.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {p.venue} · <span className="text-primary">{p.type}</span> · {p.year} · by{" "}
                        {p.author}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] px-2 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent whitespace-nowrap">
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
          </div>
        )}
      </section>

      {/* Conferences */}
      <section className="mt-16">
        <SectionHeader
          title="Conferences"
          subtitle="Where the lab presented and engaged with the community."
        />
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          {confs.map((c) => (
            <div
              key={`${c.id}-${c.author}`}
              className="rounded-xl border border-border/60 glass p-5 flex items-start gap-3 hover:border-primary/40 transition"
            >
              <div className="h-10 w-10 rounded-lg bg-primary/15 border border-primary/30 grid place-items-center text-primary shrink-0">
                <Calendar size={16} />
              </div>
              <div>
                <div className="font-medium">
                  {c.name} <span className="text-xs text-muted-foreground">· {c.role}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {c.place} · {c.year} · {c.author}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* People */}
      {peopleInDomain.length > 0 && (
        <section className="mt-16">
          <SectionHeader
            title="Researchers"
            subtitle={`People actively working on ${domain.toLowerCase()}.`}
          />
          <div className="mt-6 flex flex-wrap gap-3">
            {peopleInDomain.map((p) => (
              <Link
                key={p.id}
                to="/profile/$id"
                params={{ id: p.id }}
                className="px-4 py-2 rounded-full border border-border/70 glass hover:border-primary/40 text-sm flex items-center gap-2"
              >
                <span className="h-2 w-2 rounded-full bg-primary pulse-dot" />
                {p.name} <span className="text-muted-foreground text-xs">· {p.designation}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <Reveal>
      <div>
        <h2 className="font-display text-2xl md:text-3xl font-bold">{title}</h2>
        <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
      </div>
    </Reveal>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border/60 glass p-3 text-center">
      <div className="inline-flex items-center gap-1 text-primary text-xs">{icon}</div>
      <div className="font-display text-2xl font-bold">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

function Empty({ msg }: { msg: string }) {
  return (
    <div className="mt-6 rounded-xl border border-dashed border-border/60 p-6 text-sm text-muted-foreground text-center">
      {msg}
    </div>
  );
}

import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Cpu,
  Eye,
  Fingerprint,
  Rocket,
  Sparkles,
  Trophy,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { Stat } from "@/components/site/StatsCounter";
import { Reveal } from "@/components/site/Reveal";
import { DomainCard } from "@/components/site/DomainCard";
import { PeopleCard } from "@/components/site/PeopleCard";
import {
  achievements,
  guide,
  labDomains,
  labStats,
  projects,
  resources,
  scholars,
  liveUpdates,
} from "@/data/lab";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const topProjects = projects.slice(0, 3);
  const topAchievements = achievements.slice(0, 4);

  const [news, setNews] = useState<any[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/news")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setNews(data);
        }
        setNewsLoading(false);
      })
      .catch((err) => {
        console.error("Error loading news feed:", err);
        setNewsLoading(false);
      });
  }, []);

  const updates = (liveUpdates || []).slice(0, 5).map((u) => {
    return {
      id: u.id,
      date: u.date,
      tag: u.tag,
      title: u.title,
      desc: u.desc,
      link: u.link,
    };
  });

  return (
    <div>
      {/* HERO */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-6 pt-14 pb-10 md:pt-20 md:pb-14 flex flex-col gap-12">
          <div>
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] text-primary">
                <Sparkles size={12} /> IIITDM Kancheepuram · Research Lab
              </div>
            </Reveal>
            <Reveal delay={40}>
              <h1 className="mt-5 font-display text-4xl md:text-6xl font-bold leading-[1.05] max-w-5xl text-left">
                Visual Surveillance & <span className="text-gradient">Biometrics Security Lab</span>
                <span className="text-3xl md:text-4xl text-muted-foreground mt-3 block">
                  (ViBeS Lab): L506D
                </span>
              </h1>
            </Reveal>
            <Reveal delay={80}>
              <p className="mt-5 max-w-3xl text-base md:text-lg text-muted-foreground text-left leading-relaxed">
                We explore the intersection of image processing, biometrics, machine learning and
                visual surveillance — building deployable systems from controlled lab rigs to the
                edge.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  to="/team"
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-accent px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-95 transition shadow-lg shadow-primary/20"
                >
                  Meet the Team <ArrowRight size={16} />
                </Link>
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 rounded-lg border border-border/70 px-5 py-2.5 text-sm font-medium hover:border-primary/40"
                >
                  Explore Projects
                </Link>
              </div>
            </Reveal>
            <Reveal delay={160}>
              <div className="mt-10 grid grid-cols-3 gap-3 max-w-lg">
                <div className="text-center md:text-left">
                  <div className="font-display text-2xl font-bold text-primary">
                    {labStats.publications}+
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Papers
                  </div>
                </div>
                <div className="text-center md:text-left border-x border-border/60 px-4">
                  <div className="font-display text-2xl font-bold text-accent">
                    {labStats.members}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Researchers
                  </div>
                </div>
                <div className="text-center md:text-left pl-4">
                  <div className="font-display text-2xl font-bold text-primary">
                    {labStats.projects}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Projects
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={100}>
            <div className="relative rounded-2xl border border-border/60 glass p-6 md:p-8 w-full">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary pulse-dot" />
                  <span className="text-sm font-semibold">Live Updates</span>
                </div>
                <Link
                  to="/achievements"
                  className="text-[11px] text-muted-foreground hover:text-primary transition"
                >
                  View all
                </Link>
              </div>

              <Carousel className="w-full">
                <CarouselContent>
                  {updates.map((u) => (
                    <CarouselItem key={u.id}>
                      <div className="space-y-4 pr-1">
                        <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                          <Calendar size={12} className="text-primary" /> {u.date}
                          <span className="px-2 py-0.5 rounded-full border border-border/70">
                            {u.tag}
                          </span>
                        </div>
                        <h3 className="font-display text-2xl font-bold leading-tight">{u.title}</h3>
                        <p className="text-sm text-muted-foreground">{u.desc}</p>
                        {u.link.startsWith("/") ? (
                          <Link
                            to={u.link}
                            className="inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline group"
                          >
                            Read more{" "}
                            <ArrowRight
                              size={14}
                              className="group-hover:translate-x-1 transition-transform"
                            />
                          </Link>
                        ) : (
                          <a
                            href={u.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline group"
                          >
                            Read more{" "}
                            <ArrowRight
                              size={14}
                              className="group-hover:translate-x-1 transition-transform"
                            />
                          </a>
                        )}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="mt-8 flex justify-end gap-2">
                  <CarouselPrevious className="static translate-x-0 translate-y-0 h-9 w-9 bg-background/50 border border-border/70 hover:bg-primary/20 hover:text-primary hover:border-primary/40 transition-colors" />
                  <CarouselNext className="static translate-x-0 translate-y-0 h-9 w-9 bg-background/50 border border-border/70 hover:bg-primary/20 hover:text-primary hover:border-primary/40 transition-colors" />
                </div>
              </Carousel>
            </div>
          </Reveal>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="mx-auto max-w-7xl px-6 mt-4">
        <Reveal>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <Stat label="Publications" value={labStats.publications} />
            <Stat label="Researchers" value={labStats.members} />
            <Stat label="Active Projects" value={labStats.projects} />
            <Stat label="Collaborations" value={labStats.collaborations} />
            <Stat label="Awards" value={labStats.awards} />
          </div>
        </Reveal>
      </section>

      {/* DOMAINS */}
      <section className="mx-auto max-w-7xl px-6 mt-24">
        <Reveal>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-primary/80">Research</div>
              <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold">
                Domains we work on
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Click a domain to see related projects, papers and events.
              </p>
            </div>
            <Link
              to="/about"
              className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1"
            >
              Lab overview <ArrowRight size={14} />
            </Link>
          </div>
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {labDomains.map((d, i) => (
            <Reveal key={d.name} delay={i * 40}>
              <Link
                to="/domain/$name"
                params={{ name: encodeURIComponent(d.name) }}
                className="block"
              >
                <DomainCard {...d} />
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* PROJECTS */}
      <section className="mx-auto max-w-7xl px-6 mt-24">
        <Reveal>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-primary/80">Projects</div>
              <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold">
                From bench to deployment
              </h2>
            </div>
            <Link
              to="/projects"
              className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1"
            >
              All projects <ArrowRight size={14} />
            </Link>
          </div>
        </Reveal>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {topProjects.map((proj, i) => (
            <Reveal key={proj.id} delay={i * 50}>
              <Link
                to="/projects"
                className="group block rounded-2xl border border-border/60 glass overflow-hidden hover:border-primary/40 transition h-full"
              >
                <div className={`h-32 bg-gradient-to-br ${proj.image} relative`}>
                  <div className="absolute inset-0 grid-bg opacity-50" />
                  <div className="absolute inset-0 grid place-items-center">
                    <Rocket
                      className="text-foreground/40 group-hover:text-foreground/70 transition"
                      size={36}
                    />
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider">
                    <span
                      className={`px-2 py-0.5 rounded-full border ${proj.status === "Ongoing" ? "border-primary/40 text-primary bg-primary/10" : "border-accent/40 text-accent bg-accent/10"}`}
                    >
                      {proj.status}
                    </span>
                    <span className="text-muted-foreground">{proj.domain}</span>
                  </div>
                  <div className="mt-2 font-display font-semibold text-lg leading-tight">
                    {proj.title}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{proj.tagline}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* PEOPLE PREVIEW */}
      <section className="mx-auto max-w-7xl px-6 mt-24">
        <Reveal>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-primary/80">People</div>
              <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold">
                Featured researchers
              </h2>
            </div>
            <Link
              to="/team"
              className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[guide, ...scholars.slice(0, 3)].map((p, i) => (
            <Reveal key={p.id} delay={i * 50}>
              <PeopleCard p={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* GLOBAL RESEARCH NEWS & AI UPDATES */}
      <section className="mx-auto max-w-7xl px-6 mt-24">
        <Reveal>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div className="text-left">
              <div className="text-xs uppercase tracking-[0.2em] text-primary/80">Global Trends</div>
              <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold">
                AI & Vision Research Updates
              </h2>
              <p className="text-xs text-muted-foreground mt-1.5">
                Real-time headlines dynamically fetched from global scientific and tech feeds
              </p>
            </div>
          </div>
        </Reveal>

        {newsLoading ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="rounded-2xl border border-border/40 glass p-5 h-36 animate-pulse bg-muted/10" />
            ))}
          </div>
        ) : news.length > 0 ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {news.map((item, idx) => (
              <Reveal key={idx} delay={idx * 50}>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col justify-between rounded-2xl border border-border/60 glass p-5 h-full hover:border-primary/50 hover:shadow-neon-primary transition duration-300 relative group overflow-hidden"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded-full border border-primary/30 text-primary text-[9px] font-bold uppercase tracking-wider bg-primary/10">
                        {item.source}
                      </span>
                      <span className="text-[9px] text-muted-foreground font-mono">
                        {item.pubDate ? new Date(item.pubDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : ""}
                      </span>
                    </div>
                    <div className="mt-3 font-display font-semibold text-sm leading-snug group-hover:text-primary transition duration-200 line-clamp-3 text-left">
                      {item.title}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-[10px] text-accent font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform duration-200 text-left">
                    Read Full Story <ArrowRight size={10} />
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="mt-8 text-center text-sm text-muted-foreground border border-dashed border-border/40 p-10 rounded-2xl">
            No global updates currently available.
          </div>
        )}
      </section>

      {/* ACHIEVEMENTS */}
      <section className="mx-auto max-w-7xl px-6 mt-24">
        <Reveal>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-primary/80">Milestones</div>
              <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold">
                Recent achievements
              </h2>
            </div>
            <Link
              to="/achievements"
              className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1"
            >
              All milestones <ArrowRight size={14} />
            </Link>
          </div>
        </Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {topAchievements.map((a, i) => (
            <Reveal key={a.id} delay={i * 50}>
              <div className="rounded-2xl border border-border/60 glass p-5 h-full hover:border-accent/40 transition">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-lg bg-accent/15 border border-accent/30 grid place-items-center text-accent">
                    <Trophy size={16} />
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {a.category} · {a.year}
                  </span>
                </div>
                <div className="mt-3 font-display font-semibold leading-tight">{a.title}</div>
                <p className="mt-1.5 text-xs text-muted-foreground line-clamp-3">{a.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* RESOURCES */}
      <section className="mx-auto max-w-7xl px-6 mt-24">
        <Reveal>
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-primary/80">Inside the lab</div>
            <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold">
              Resources & infrastructure
            </h2>
          </div>
        </Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {resources.map((r, i) => {
            const Icon = [Cpu, Fingerprint, Eye][i % 3];
            return (
              <Reveal key={r.name} delay={i * 40}>
                <div className="rounded-2xl border border-border/60 glass p-5 hover:border-accent/40 transition group">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-accent/15 border border-accent/30 grid place-items-center text-accent">
                      <Icon size={18} />
                    </div>
                    <div className="font-semibold">{r.name}</div>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{r.detail}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 mt-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-primary/30 glass p-10 md:p-14 text-center">
            <div className="absolute inset-0 grid-bg opacity-60" />
            <div className="relative">
              <h3 className="font-display text-3xl md:text-4xl font-bold">
                Interested in joining ViBeS Lab?
              </h3>
              <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
                We welcome motivated researchers and interns who love computer vision and applied
                ML.
              </p>
              <Link
                to="/contact"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-semibold text-primary-foreground"
              >
                Get in touch <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
      <div className="h-8" />
    </div>
  );
}

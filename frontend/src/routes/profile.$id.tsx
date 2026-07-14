// This file defines the profile page for individual lab members on the ViBeS Lab website. It uses the `@tanstack/react-router` library to create a route for the profile page, which is accessed via a dynamic URL parameter representing the member's ID. The page displays various sections such as an overview, experience, education, publications, journals, conferences, awards, statistics, and supervised projects. It also includes interactive elements like tabs for navigation between sections, expandable publication cards, and a honeycomb grid for research interests. The page is styled using Tailwind CSS classes and includes responsive design elements for different screen sizes.
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Award,
  GraduationCap,
  Mail,
  MapPin,
  Mic,
  FileText,
  Search,
  BookOpen,
  Users,
  ChevronDown,
  ExternalLink,
  Download,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { ProfileGraphs } from "@/components/site/ProfileGraphs";
import { HoneycombGrid } from "@/components/site/HoneycombGrid";
import { Reveal } from "@/components/site/Reveal";
import {
  type Person,
  supervisedProjects,
  type SupervisedProject,
  BASE_URL,
  allPeople as staticPeople,
} from "@/data/lab";

// Build keyword-based URL lookup from static data so backend results get supplemented
const KEYWORD_URL_ENTRIES: Array<{ keywords: string[]; url: string }> = [];
staticPeople.forEach((person) => {
  (person.publications || []).forEach((pub) => {
    if (!pub.url || !pub.title) return;
    const keywords = pub.title
      .toLowerCase()
      .split(/\W+/)
      .filter((w) => w.length >= 4)
      .slice(0, 5);
    KEYWORD_URL_ENTRIES.push({ keywords, url: pub.url });
  });
});

function findUrlByKeywords(title: string): string {
  const lower = title.toLowerCase();
  for (const entry of KEYWORD_URL_ENTRIES) {
    if (entry.keywords.every((k) => lower.includes(k))) return entry.url;
  }
  return "";
}

export const Route = createFileRoute("/profile/$id")({ component: ProfilePage });

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

type Tab = string;

function ProfilePage() {
  const { id } = Route.useParams();
  
  const [p, setP] = useState<Person | undefined>(undefined);
  const [allPeople, setAllPeople] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    Promise.all([
      fetch(`${BASE_URL}/api/people/${id}`).then(res => res.ok ? res.json() : null),
      fetch(`${BASE_URL}/api/people`).then(res => res.ok ? res.json() : [])
    ]).then(([personData, peopleData]) => {
      if (personData) setP(personData);
      if (peopleData) setAllPeople(peopleData);
      setIsLoading(false);
    }).catch(err => {
      console.error(err);
      setIsLoading(false);
    });
  }, [id]);

  const [tab, setTab] = useState<Tab>("overview");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"All" | "BTP" | "MTP">("All");
  const [expandedPubs, setExpandedPubs] = useState<Record<string, boolean>>({});
  const toggleExpand = (id: string) => {
    setExpandedPubs((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  // Feature 5: collapsible pub type groups — all collapsed by default
  const [expandedPubGroups, setExpandedPubGroups] = useState<Record<string, boolean>>({});
  const togglePubGroup = (type: string) => {
    setExpandedPubGroups((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const filterUnderReview = (pubs: any[]) =>
    pubs.filter((pub) => {
      const title = (pub.title || "").toLowerCase();
      const venue = (pub.venue || "").toLowerCase();
      return !title.includes("under review") && !venue.includes("under review");
    });

  const displayPubs = useMemo(() => {
    if (!p) return [];
    let pubsToDisplay = [];
    
    if (p.role === "guide" || p.id === "rahul_raman" || p.id === "rahul-raman") {
      const allPubs = allPeople.flatMap(person =>
        person.publications.map(pub => ({ ...pub, author: person.name, authorId: person.id }))
      );
      // Remove duplicates by pub ID, then filter Under Review
      const uniquePubs = Array.from(new Map(allPubs.map(pub => [pub.id, pub])).values());
      pubsToDisplay = filterUnderReview(uniquePubs).sort((a, b) => b.year - a.year || b.month - a.month);
    } else {
      pubsToDisplay = filterUnderReview(p.publications);
    }
    
    // Supplement missing URLs from static data using keyword matching
    return pubsToDisplay.map(pub => ({
      ...pub,
      url: pub.url || findUrlByKeywords(pub.title ?? "") || ""
    }));
  }, [p, allPeople]);


  const renderPublicationCard = (pub: any) => {
    const isExpanded = !!expandedPubs[pub.id];
    const hasAbstract = !!(pub.abstract && pub.abstract.trim().length > 0);
    return (
      <div
        key={pub.id}
        className="group rounded-xl border border-border/60 glass p-4 hover:border-primary/40 transition flex flex-col gap-3"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Title — clickable link when URL is available */}
            {pub.url ? (
              <a
                href={pub.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-black dark:text-white hover:text-primary dark:hover:text-primary transition-colors inline-flex items-start gap-1 group"
              >
                <span>{pub.title}</span>
                <ExternalLink size={13} className="shrink-0 mt-0.5 opacity-60 group-hover:opacity-100 transition" />
              </a>
            ) : (
              <div className="font-medium text-black dark:text-white">{pub.title}</div>
            )}
            <div className="text-xs text-black dark:text-white mt-1">
              {pub.venue} · {pub.type} · {pub.year}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/domain/$name"
              params={{ name: encodeURIComponent(pub.domain) }}
              className="text-[10px] px-2 py-1 rounded-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/20 text-black dark:text-white whitespace-nowrap hover:bg-black/10 dark:hover:bg-white/20"
            >
              {pub.domain}
            </Link>
            {/* Abstract button — always shown; disabled if no abstract */}
            {hasAbstract ? (
              <button
                onClick={() => toggleExpand(pub.id)}
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
          <div className="mt-1 text-xs text-muted-foreground/90 border-t border-border/40 pt-3 leading-relaxed transition-all duration-300">
            <div className="font-semibold text-[10px] uppercase tracking-wider text-accent/95 mb-1">Abstract</div>
            {pub.abstract}
          </div>
        )}
      </div>
    );
  };


  const confCount = p
    ? p.conferences.length + displayPubs.filter((pub) => pub.type === "Conference").length
    : 0;
  const journalCount = p ? displayPubs.filter((pub) => pub.type === "Journal").length : 0;

  const dynamicPubTypes = Array.from(new Set(displayPubs.map(p => p.type)))
    .filter(t => t !== "Journal" && t !== "Conference")
    .sort();

  const tabs: { k: Tab; l: string }[] = p
    ? [
        { k: "overview", l: "Overview" },
        ...(p.experience?.length || p.teaching?.length || p.outreachActivities?.length
          ? [{ k: "experience" as Tab, l: "Experience & Service" }]
          : []),
        { k: "education", l: `Education · ${p.education.length}` },
        { k: "publications", l: `Publications · ${displayPubs.length}` },
        ...(journalCount > 0 ? [{ k: "journals" as Tab, l: `Journals · ${journalCount}` }] : []),
        { k: "conferences", l: `Conferences · ${confCount}` },
        ...(p.role === "guide"
          ? [{ k: "supervised" as Tab, l: `Supervised Projects · ${supervisedProjects.length}` }]
          : []),
        ...dynamicPubTypes.map(type => ({
          k: `pubtype-${type}`, 
          l: `${type}${type.endsWith('s') ? '' : 's'} · ${displayPubs.filter((pub) => pub.type === type).length}`
        })),
        { k: "awards", l: `Awards · ${p.awards.length}` },
        ...((p.role === "guide" || p.category === "PhD")
          ? [{ k: "stats" as Tab, l: "Statistics" }]
          : []),
      ]
    : [];

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-muted-foreground animate-pulse">Loading profile...</div>
      </div>
    );
  }

  if (!p) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="font-display text-3xl font-bold">Profile not found</h1>
        <Link to="/team" className="mt-4 inline-block text-primary">
          Back to team
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <Link
        to="/team"
        onClick={(e) => {
          if (typeof window !== "undefined" && window.history.length > 1) {
            e.preventDefault();
            window.history.back();
          }
        }}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft size={14} /> Back to team
      </Link>

      {/* HERO */}
      <Reveal>
        <div className="mt-6 relative overflow-hidden rounded-3xl border border-border/60 glass">
          <div className="h-40 bg-gradient-to-br from-primary/40 via-accent/30 to-primary/10 relative">
            <div className="absolute inset-0 grid-bg opacity-50" />
          </div>
          <div className="px-6 md:px-10 pb-8 -mt-16 grid md:grid-cols-[auto_1fr_auto] gap-6 items-end">
            {p.avatar ? (
              <img
                src={p.avatar.startsWith('/uploads') ? `${BASE_URL}${p.avatar}` : p.avatar}
                alt={p.name}
                className="h-32 w-32 rounded-2xl border border-border/70 object-cover bg-background glow-ring relative z-10"
              />
            ) : (
              <div className="h-32 w-32 rounded-2xl border border-border/70 bg-background grid place-items-center font-display text-4xl font-bold text-gradient glow-ring relative z-10">
                {initials(p.name)}
              </div>
            )}
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-primary/80">
                {p.role === "guide" ? "Faculty · Lab Lead · Doctorate" : "Research Scholar"}
              </div>
              <h1 className="mt-1 font-display text-3xl md:text-4xl font-bold">{p.name}</h1>
              <div className="mt-1 text-muted-foreground">{p.designation}</div>
              <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <MapPin size={12} />
                  {p.affiliation}
                </span>
                <a
                  href={`mailto:${p.email}`}
                  className="inline-flex items-center gap-1 hover:text-primary transition"
                >
                  <Mail size={12} />
                  {p.email}
                </a>
                <span>Since {p.joined}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              {p.resume ? (
                <a
                  href={(p.resume.startsWith('/uploads') || p.resume.startsWith('/resumes')) ? `${BASE_URL}${p.resume}` : (!p.resume.startsWith('http') && !p.resume.startsWith('/')) ? `https://${p.resume}` : p.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs px-3 py-1.5 rounded-lg bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30 flex items-center gap-1.5 font-medium transition"
                >
                  <FileText size={14} /> Resume
                </a>
              ) : null}
              {p.links?.filter(l => l.href && l.href !== "#" && l.href.trim() !== "").map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs px-3 py-1.5 rounded-lg border border-border/70 hover:border-primary/40 transition"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      {/* TABS */}
      <div className="mt-8 inline-flex rounded-lg border border-border/70 overflow-x-auto max-w-full">
        {tabs.map((t) => (
          <button
            key={t.k}
            onClick={() => setTab(t.k)}
            className={`px-4 py-2 text-sm whitespace-nowrap ${tab === t.k ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            {t.l}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "overview" && (
          <div
            className={`grid ${p.role === "guide" ? "lg:grid-cols-[1.1fr_1fr]" : "grid-cols-1 max-w-4xl"} gap-8`}
          >
            <div className="space-y-6">
              <div className="rounded-2xl border border-border/60 glass p-6">
                <div className="text-sm font-semibold mb-2">About</div>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.bio}</p>
              </div>

              {p.researchProject && (
                <div className="rounded-2xl border border-border/60 glass p-6 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent opacity-50" />
                  <div className="relative z-10">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-accent/80 mb-2">
                      Research Project / Focus
                    </div>
                    <h3 className="font-display text-lg font-bold mb-3 text-gradient leading-tight">
                      {p.researchProject.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {p.researchProject.abstract}
                    </p>

                    {p.researchProject.datasets && p.researchProject.datasets.length > 0 && (
                      <div className="mb-4">
                        <div className="text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                          Key Datasets
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {p.researchProject.datasets.map((d, i) => {
                            const linkRegex = /\[(.*?)\]/;
                            const match = d.match(linkRegex);
                            if (match) {
                              const url = match[1];
                              const labelText = d.replace(linkRegex, "").trim();
                              return (
                                <a
                                  key={i}
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] px-2 py-0.5 rounded bg-primary/10 border border-primary/20 hover:border-primary/50 text-primary transition duration-300 flex items-center gap-1 inline-flex hover:shadow-sm"
                                >
                                  <span>{labelText}</span>
                                  <ExternalLink size={10} />
                                </a>
                              );
                            }
                            return (
                              <span
                                key={i}
                                className="text-[10px] px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary"
                              >
                                {d}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {p.researchProject.results && p.researchProject.results.length > 0 && (
                      <div className="mb-4">
                        <div className="text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                          Key Outcomes & Results
                        </div>
                        <ul className="space-y-1.5 text-xs text-muted-foreground list-disc pl-4 marker:text-accent">
                          {p.researchProject.results.map((r, i) => (
                            <li key={i} className="leading-relaxed">
                              {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Media Galleries */}
                    {((p.researchProject.images && p.researchProject.images.length > 0) || 
                      (p.researchProject.videos && p.researchProject.videos.length > 0)) && (
                      <div className="mt-5 border-t border-border/40 pt-4">
                        <div className="text-[11px] font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                          Project Media & Demos
                        </div>
                        
                        {/* Video list */}
                        {p.researchProject.videos && p.researchProject.videos.length > 0 && (
                          <div className="mb-4">
                            <div className="text-[10px] text-muted-foreground/80 mb-2 font-medium">Video Demos</div>
                            <div className="grid gap-4 sm:grid-cols-2">
                              {p.researchProject.videos.map((vid, idx) => (
                                <div key={idx} className="relative rounded-xl overflow-hidden border border-border/50 bg-black/20 aspect-video group">
                                  <video 
                                    src={vid} 
                                    controls 
                                    className="w-full h-full object-cover" 
                                    preload="metadata"
                                  />
                                  <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/60 text-[9px] text-white/90 border border-white/10 pointer-events-none">
                                    Demo #{idx + 1}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Image Gallery */}
                        {p.researchProject.images && p.researchProject.images.length > 0 && (
                          <div>
                            <div className="text-[10px] text-muted-foreground/80 mb-2 font-medium">Image Gallery</div>
                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                              {p.researchProject.images.map((img, idx) => (
                                <a 
                                  key={idx} 
                                  href={img} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="relative rounded-lg overflow-hidden border border-border/40 bg-muted aspect-square hover:border-primary/50 transition-all duration-300 group cursor-zoom-in"
                                >
                                  <img 
                                    src={img} 
                                    alt={`Project attachment ${idx + 1}`} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                                  />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* PDF Dataset Documents */}
                    {p.researchProject.pdfFiles && p.researchProject.pdfFiles.length > 0 && (
                      <div className="mt-5 border-t border-border/40 pt-4">
                        <div className="text-[11px] font-semibold text-muted-foreground mb-2.5 uppercase tracking-wider">
                          Dataset Reports & Documentation
                        </div>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {p.researchProject.pdfFiles.map((pdf, idx) => (
                            <a 
                              key={idx}
                              href={pdf.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-2.5 rounded-xl border border-border/50 bg-card/40 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300 group"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <FileText size={14} className="text-primary shrink-0 group-hover:scale-110 transition-transform" />
                                <span className="text-xs font-medium truncate text-foreground/90">{pdf.name}</span>
                              </div>
                              <Download size={13} className="text-muted-foreground group-hover:text-primary transition-colors shrink-0 ml-2" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="rounded-2xl border border-border/60 glass p-6">
                <div className="text-sm font-semibold mb-3">Skills & tools</div>
                <div className="flex flex-wrap gap-2">
                  {p.skills.map((s) => (
                    <span
                      key={s}
                      className="text-xs px-2.5 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              {(p.role === "guide" || p.category === "PhD") && (
                <div className="rounded-2xl border border-border/60 glass p-6">
                  <div className="text-sm font-semibold mb-3">Quick stats</div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="font-display text-2xl font-bold text-primary">
                        {displayPubs.length}
                      </div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        Pubs
                      </div>
                    </div>
                    <div className="border-x border-border/60">
                      <div className="font-display text-2xl font-bold text-accent">
                        {p.awards.length}
                      </div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        Awards
                      </div>
                    </div>
                    <div>
                      <div className="font-display text-2xl font-bold text-primary">
                        {p.conferences.length}
                      </div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        Confs
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {p.role === "guide" && (
              <div className="rounded-2xl border border-border/60 glass p-6">
                <div className="text-sm font-semibold mb-1">Research interests</div>
                <div className="text-xs text-muted-foreground mb-4">
                  Click any domain to explore its publications, projects and conferences.
                </div>
                <HoneycombGrid items={Array.from(new Set([...p.domains, ...p.skills]))} />
              </div>
            )}
          </div>
        )}

        {tab === "experience" && (
          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-8">
            <div className="space-y-6">
              {p.experience && p.experience.length > 0 && (
                <div className="rounded-2xl border border-border/60 glass p-6">
                  <div className="text-sm font-semibold mb-4">Work Experience</div>
                  <div className="space-y-4">
                    {p.experience.map((e, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
                        <div>
                          <div className="font-medium text-sm">{e.role}</div>
                          <div className="text-xs text-muted-foreground">
                            {e.org} · {e.duration}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {p.projects && p.projects.length > 0 && (
                <div className="rounded-2xl border border-border/60 glass p-6">
                  <div className="text-sm font-semibold mb-4">Research Projects</div>
                  <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-4 marker:text-primary">
                    {p.projects.map((proj, i) => (
                      <li key={i}>{proj}</li>
                    ))}
                  </ul>
                </div>
              )}
              {p.teaching && p.teaching.length > 0 && (
                <div className="rounded-2xl border border-border/60 glass p-6">
                  <div className="text-sm font-semibold mb-4">Teaching</div>
                  <div className="flex flex-wrap gap-2">
                    {p.teaching.map((t, i) => (
                      <span
                        key={i}
                        className="text-xs px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-6">
              {p.professionalService && p.professionalService.length > 0 && (
                <div className="rounded-2xl border border-border/60 glass p-6">
                  <div className="text-sm font-semibold mb-4">Professional Service</div>
                  <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-4 marker:text-accent">
                    {p.professionalService.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
              {p.outreachActivities && p.outreachActivities.length > 0 && (
                <div className="rounded-2xl border border-border/60 glass p-6">
                  <div className="text-sm font-semibold mb-4">Outreach & Invited Talks</div>
                  <div className="max-h-96 overflow-y-auto pr-2 space-y-3 scrollbar-thin">
                    {p.outreachActivities.map((o, i) => (
                      <div
                        key={i}
                        className="text-xs text-muted-foreground bg-black/20 p-3 rounded-lg border border-white/5"
                      >
                        {o}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "education" && (
          <div className="relative max-w-3xl">
            <div className="absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-primary/40 via-accent/30 to-transparent" />
            <ol className="space-y-5">
              {p.education.map((e, i) => (
                <Reveal key={`${e.degree}-${i}`} delay={i * 40}>
                  <li className="relative pl-12">
                    <div className="absolute left-0 top-1 h-9 w-9 rounded-full bg-background border border-primary/40 grid place-items-center text-primary">
                      <GraduationCap size={16} />
                    </div>
                    <div className="rounded-2xl border border-border/60 glass p-5 hover:border-primary/40 transition">
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="font-display font-semibold">
                          {e.degree} · {e.field}
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary">
                          {e.year}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">{e.institute}</div>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
            {p.education.length === 0 && (
              <div className="text-sm text-muted-foreground">No qualifications listed yet.</div>
            )}
          </div>
        )}

        {tab === "publications" &&
          (() => {
            const groupedPubs = displayPubs.reduce(
              (acc, pub) => {
                acc[pub.type] = acc[pub.type] || [];
                acc[pub.type].push(pub);
                return acc;
              },
              {} as Record<string, typeof displayPubs>,
            );

            return (
              <div className="space-y-6">
                {Object.entries(groupedPubs)
                  .sort()
                  .map(([type, pubs]) => {
                    const isGroupOpen = !!expandedPubGroups[type];
                    return (
                      <div key={type} className="rounded-2xl border border-border/60 glass overflow-hidden">
                        <button
                          onClick={() => togglePubGroup(type)}
                          className="w-full flex items-center justify-between px-5 py-4 hover:bg-primary/5 transition"
                        >
                          <span className="font-display text-lg font-bold flex items-center gap-2">
                            {type}s
                            <span className="text-muted-foreground text-sm font-normal">({pubs.length})</span>
                          </span>
                          <ChevronDown
                            size={18}
                            className={`text-muted-foreground transform transition-transform duration-300 ${isGroupOpen ? "rotate-180" : ""}`}
                          />
                        </button>
                        {isGroupOpen && (
                          <div className="px-5 pb-5 space-y-3 border-t border-border/40">
                            <div className="pt-4 space-y-3">
                              {pubs.map((pub) => renderPublicationCard(pub))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                
                {/* Render Custom Publications */}
                {p.customPublications && p.customPublications.map((cat, idx) => {
                  const isGroupOpen = !!expandedPubGroups[`custom-${idx}`];
                  return (
                    <div key={`custom-${idx}`} className="rounded-2xl border border-border/60 glass overflow-hidden">
                      <button
                        onClick={() => togglePubGroup(`custom-${idx}`)}
                        className="w-full flex items-center justify-between px-5 py-4 hover:bg-primary/5 transition"
                      >
                        <span className="font-display text-lg font-bold flex items-center gap-2">
                          {cat.heading}
                          <span className="text-muted-foreground text-sm font-normal">({cat.items.length})</span>
                        </span>
                        <ChevronDown
                          size={18}
                          className={`text-muted-foreground transform transition-transform duration-300 ${isGroupOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      {isGroupOpen && (
                        <div className="px-5 pb-5 border-t border-border/40">
                          <div className="pt-4 space-y-3">
                            {cat.items.map((item, itemIdx) => (
                              <div key={`item-${itemIdx}`} className="group rounded-xl border border-border/60 glass p-4 hover:border-primary/40 transition">
                                <p className="text-sm text-black dark:text-white leading-relaxed">{item}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {displayPubs.length === 0 && (!p.customPublications || p.customPublications.length === 0) && (
                  <div className="text-sm text-muted-foreground">No publications listed yet.</div>
                )}
              </div>
            );
          })()}

        {tab === "journals" &&
          (() => {
            const journalPubs = displayPubs.filter((pub) => pub.type === "Journal");
            return (
              <div className="space-y-10">
                {journalPubs.length > 0 ? (
                  <div>
                    <h3 className="font-display text-xl font-bold mb-4">Journals</h3>
                    <div className="space-y-3">
                      {journalPubs.map((pub) => renderPublicationCard(pub))}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">No journals listed yet.</div>
                )}
              </div>
            );
          })()}

        {tab === "awards" && (
          <div className="grid md:grid-cols-2 gap-4">
            {p.awards.map((a) => (
              <div
                key={a.id}
                className="rounded-xl border border-border/60 glass p-5 flex items-start gap-3 hover:border-accent/40 transition"
              >
                <div className="h-10 w-10 rounded-lg bg-accent/15 border border-accent/30 grid place-items-center text-accent shrink-0">
                  <Award size={18} />
                </div>
                <div>
                  <div className="font-medium">{a.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {a.org} · {a.year}
                  </div>
                </div>
              </div>
            ))}
            {p.awards.length === 0 && (
              <div className="text-sm text-muted-foreground">No awards listed yet.</div>
            )}
          </div>
        )}

        {tab === "conferences" &&
          (() => {
            const confPubs = displayPubs.filter((pub) => pub.type === "Conference");

            return (
              <div className="space-y-10">
                {p.conferences.length > 0 && (
                  <div>
                    <h3 className="font-display text-xl font-bold mb-4">Conference Attendances</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {p.conferences.map((c) => (
                        <div
                          key={c.id}
                          className="rounded-xl border border-border/60 glass p-4 hover:border-primary/40 transition"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="font-medium text-black dark:text-white">{c.name}</div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {c.place} · {c.year}
                              </div>
                            </div>
                            <span className="text-[10px] px-2 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent whitespace-nowrap">
                              {c.role}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {confPubs.length > 0 && (
                  <div>
                    <h3 className="font-display text-xl font-bold mb-4">Conference Publications</h3>
                    <div className="space-y-3">
                      {confPubs.map((pub) => renderPublicationCard(pub))}
                    </div>
                  </div>
                )}

                {p.conferences.length === 0 && confPubs.length === 0 && (
                  <div className="text-sm text-muted-foreground">No conferences listed yet.</div>
                )}
              </div>
            );
          })()}

        {tab.startsWith("pubtype-") &&
          (() => {
            const typeName = tab.replace("pubtype-", "");
            const specificPubs = displayPubs.filter((pub) => pub.type === typeName);
            return (
              <div className="space-y-10">
                {specificPubs.length > 0 ? (
                  <div>
                    <h3 className="font-display text-xl font-bold mb-4">{typeName}{typeName.endsWith('s') ? '' : 's'}</h3>
                    <div className="space-y-3">
                      {specificPubs.map((pub) => renderPublicationCard(pub))}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">No {typeName}s listed yet.</div>
                )}
              </div>
            );
          })()}

        {tab === "stats" && (p.role === "guide" || p.category === "PhD") && <ProfileGraphs p={p} />}

        {tab === "supervised" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-display text-xl font-bold">Supervised Student Projects</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  B.Tech Projects (BTP) & M.Tech Projects (MTP) supervised by Dr. Rahul Raman.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {/* Search Bar */}
                <div className="relative">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    type="text"
                    placeholder="Search by student, title..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 pr-4 py-1.5 rounded-lg border border-border/70 bg-black/20 text-xs focus:outline-none focus:border-primary/50 w-60"
                  />
                </div>
                {/* Type Filters */}
                <div className="flex rounded-md border border-border/70 overflow-hidden text-xs">
                  {(["All", "MTP", "BTP"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`px-3 py-1.5 font-medium transition ${
                        filterType === type
                          ? "bg-primary/20 text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-border/60 glass">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border/60 bg-white/5 font-semibold text-muted-foreground">
                    <th className="p-4 w-12 text-center font-display">S.No</th>
                    <th className="p-4 w-36 font-display">Student</th>
                    <th className="p-4 w-24 font-display">Type</th>
                    <th className="p-4 font-display">Project Details</th>
                    <th className="p-4 w-24 text-center font-display">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {supervisedProjects
                    .filter((proj) => {
                      const matchesSearch =
                        proj.studentName.toLowerCase().includes(search.toLowerCase()) ||
                        proj.rollNo.toLowerCase().includes(search.toLowerCase()) ||
                        proj.title.toLowerCase().includes(search.toLowerCase()) ||
                        proj.explanation.toLowerCase().includes(search.toLowerCase());
                      const matchesType = filterType === "All" || proj.type === filterType;
                      return matchesSearch && matchesType;
                    })
                    .map((proj, idx) => {
                      const matchedScholar = allPeople.find(
                        (person) =>
                          person.role === "scholar" &&
                          (person.name.toLowerCase().includes(proj.studentName.toLowerCase()) ||
                            proj.studentName.toLowerCase().includes(person.name.toLowerCase()) ||
                            (person.email &&
                              person.email.toLowerCase().startsWith(proj.rollNo.toLowerCase()))),
                      );

                      return (
                        <tr key={proj.sno} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 text-center text-muted-foreground font-medium">
                            {idx + 1}
                          </td>
                          <td className="p-4">
                            {matchedScholar ? (
                              <Link
                                to="/profile/$id"
                                params={{ id: matchedScholar.id }}
                                className="font-semibold text-primary hover:underline block"
                              >
                                {proj.studentName}
                              </Link>
                            ) : (
                              <span className="font-semibold text-foreground block">
                                {proj.studentName}
                              </span>
                            )}
                            <span className="text-[10px] text-muted-foreground font-mono">
                              {proj.rollNo}
                            </span>
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase ${
                                proj.type === "MTP"
                                  ? "bg-accent/15 border border-accent/30 text-accent"
                                  : "bg-primary/15 border border-primary/30 text-primary"
                              }`}
                            >
                              {proj.type}
                            </span>
                          </td>
                          <td className="p-4 space-y-1">
                            <div className="font-medium text-foreground text-sm leading-snug">
                              {proj.title}
                            </div>
                            <div className="text-muted-foreground leading-relaxed max-w-2xl">
                              {proj.explanation}
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-medium">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                              Completed
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  {supervisedProjects.filter((proj) => {
                    const matchesSearch =
                      proj.studentName.toLowerCase().includes(search.toLowerCase()) ||
                      proj.rollNo.toLowerCase().includes(search.toLowerCase()) ||
                      proj.title.toLowerCase().includes(search.toLowerCase()) ||
                      proj.explanation.toLowerCase().includes(search.toLowerCase());
                    const matchesType = filterType === "All" || proj.type === filterType;
                    return matchesSearch && matchesType;
                  }).length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted-foreground">
                        No projects found matching the search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Mentored PhD Scholars for Guide */}
      {p.role === "guide" && (
        <div className="mt-16">
          <div className="flex items-center gap-2 mb-6">
            <Users className="text-primary" size={24} />
            <h2 className="font-display text-2xl font-bold">Mentored PhD Scholars</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {allPeople
              .filter((scholar) => scholar.category === "PhD")
              .map((scholar) => (
                <Link
                  key={scholar.id}
                  to="/profile/$id"
                  params={{ id: scholar.id }}
                  className="group relative overflow-hidden rounded-2xl border border-border/60 glass p-5 hover:border-primary/40 transition"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex items-start gap-4 relative z-10">
                    {scholar.avatar ? (
                      <img
                        src={scholar.avatar.startsWith('/uploads') ? `${BASE_URL}${scholar.avatar}` : scholar.avatar}
                        alt={scholar.name}
                        className="h-12 w-12 rounded-xl object-cover border border-border/70 bg-background"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-xl bg-background border border-border/70 grid place-items-center font-display font-bold text-primary">
                        {scholar.name
                          .split(" ")
                          .map((p) => p[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="font-medium group-hover:text-primary transition-colors">
                        {scholar.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {scholar.designation}
                      </div>
                      <div className="text-[10px] uppercase tracking-wider text-accent/80 mt-2">
                        Since {scholar.joined}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Rocket, CheckCircle2, ArrowLeft, X, BookOpen, Image as ImageIcon, ExternalLink } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { type Project, allPeople, BASE_URL } from "@/data/lab";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/projects")({ component: ProjectsPage });

function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    fetch(`${BASE_URL}/api/projects`)
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch projects:", err);
        setIsLoading(false);
      });
  }, []);

  // Feature 2: Get publications related to a project via domain matching
  const getRelatedPublications = (project: Project) => {
    return allPeople.flatMap((person) =>
      person.publications
        .filter((pub) => pub.domain === project.domain)
        .map((pub) => ({ ...pub, author: person.name, authorId: person.id }))
    );
  };

  // Feature 2: Get photos from scholars whose researchProject domain relates
  const getRelatedPhotos = (project: Project) => {
    const photos: { src: string; personName: string }[] = [];
    allPeople.forEach((person) => {
      if (
        person.researchProject?.images &&
        person.domains.includes(project.domain)
      ) {
        person.researchProject.images.forEach((img) => {
          photos.push({ src: img, personName: person.name });
        });
      }
    });
    return photos;
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-muted-foreground animate-pulse">Loading projects...</div>
      </div>
    );
  }

  const relatedPubs = selectedProject ? getRelatedPublications(selectedProject) : [];
  const relatedPhotos = selectedProject ? getRelatedPhotos(selectedProject) : [];

  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <Link
        to="/"
        className="mb-8 flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft size={16} /> Back to Home
      </Link>
      <Reveal>
        <div className="text-xs uppercase tracking-[0.2em] text-primary/80">Our Projects</div>
        <h1 className="mt-2 font-display text-4xl md:text-5xl font-bold">
          Projects in the <span className="text-gradient">lab</span>
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Active and completed projects across biometrics, surveillance, machine learning and image
          processing — click a project to explore related publications and photos.
        </p>
      </Reveal>

      <div className="mt-10 grid gap-8">
        {projects.map((proj, i) => (
          <Reveal key={proj.id} delay={i * 50}>
            <article
              className={`group relative grid md:grid-cols-[1.05fr_1fr] gap-0 rounded-3xl border glass overflow-hidden transition cursor-pointer ${
                selectedProject?.id === proj.id
                  ? "border-primary/60 shadow-lg shadow-primary/10"
                  : "border-border/60 hover:border-primary/40"
              }`}
              onClick={() =>
                setSelectedProject(selectedProject?.id === proj.id ? null : proj)
              }
            >
              <div className={`relative min-h-[220px] bg-gradient-to-br ${proj.image}`}>
                <div className="absolute inset-0 grid-bg opacity-50" />
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span
                    className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border ${proj.status === "Ongoing" ? "border-primary/40 text-primary bg-primary/10" : "border-accent/40 text-accent bg-accent/10"}`}
                  >
                    {proj.status}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border border-border/70 bg-background/50">
                    {proj.year}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <Link
                    to="/domain/$name"
                    params={{ name: encodeURIComponent(proj.domain) }}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-background/70 border border-border/70 hover:border-primary/40 text-foreground/80 hover:text-primary"
                  >
                    {proj.domain} <ArrowRight size={11} />
                  </Link>
                </div>
                <div className="absolute inset-0 grid place-items-center opacity-60 group-hover:opacity-80 transition">
                  <Rocket className="text-foreground/30" size={56} />
                </div>
              </div>
              <div className="p-6 md:p-8">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-display text-2xl font-bold leading-tight">{proj.title}</h2>
                  {selectedProject?.id === proj.id && (
                    <span className="text-[10px] px-2 py-1 rounded-full bg-primary/15 border border-primary/40 text-primary shrink-0">
                      Selected
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-primary/90">{proj.tagline}</p>

                <div className="mt-4">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    Purpose
                  </div>
                  <p className="mt-1 text-sm text-foreground/90 leading-relaxed">{proj.purpose}</p>
                </div>

                <div className="mt-3">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    Approach
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    {proj.description}
                  </p>
                </div>

                <div className="mt-4">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    Results
                  </div>
                  <ul className="mt-1.5 space-y-1.5">
                    {proj.results.map((r) => (
                      <li key={r} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 size={14} className="mt-0.5 text-accent shrink-0" />
                        <span className="text-foreground/90">{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-5 flex flex-wrap gap-1.5">
                  {proj.tech.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 border border-accent/25 text-accent"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                {proj.collaborators && (
                  <div className="mt-4 text-xs text-muted-foreground">
                    With <span className="text-foreground/80">{proj.collaborators.join(", ")}</span>
                  </div>
                )}

                <div className="mt-4 text-xs text-primary/70 font-medium">
                  Click to {selectedProject?.id === proj.id ? "collapse" : "view"} related publications & photos ?
                </div>
              </div>
            </article>

            {/* Feature 2: Detail panel shows when this project is selected */}
            {selectedProject?.id === proj.id && (
              <div className="mt-1 rounded-2xl border border-primary/30 bg-primary/5 p-6 md:p-8 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl font-bold text-gradient">
                    {proj.title} — Detail View
                  </h3>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="p-2 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-foreground transition"
                    title="Close detail view"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Related Publications */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-8 w-8 rounded-lg bg-primary/15 border border-primary/30 grid place-items-center text-primary">
                      <BookOpen size={16} />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">Related Domain Publications</div>
                      <div className="text-xs text-muted-foreground">
                        Papers in the &ldquo;{proj.domain}&rdquo; research domain
                      </div>
                    </div>
                    <span className="ml-auto text-xs text-muted-foreground">{relatedPubs.length} papers</span>
                  </div>
                  {relatedPubs.length > 0 ? (
                    <div className="space-y-3">
                      {relatedPubs.slice(0, 8).map((pub) => (
                        <div
                          key={pub.id}
                          className="rounded-xl border border-border/60 glass p-4 hover:border-primary/40 transition"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="font-medium text-sm">{pub.title}</div>
                              <div className="text-xs text-muted-foreground mt-0.5">
                                {pub.venue} · {pub.type} · {pub.year} ·{" "}
                                <Link
                                  to="/profile/$id"
                                  params={{ id: pub.authorId }}
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-primary hover:underline"
                                >
                                  {pub.author}
                                </Link>
                              </div>
                            </div>
                            {pub.url && (
                              <a
                                href={pub.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-muted-foreground hover:text-primary transition shrink-0"
                              >
                                <ExternalLink size={14} />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                      {relatedPubs.length > 8 && (
                        <div className="text-xs text-muted-foreground text-center pt-2">
                          + {relatedPubs.length - 8} more papers. Visit{" "}
                          <Link to="/publications" className="text-primary hover:underline">
                            Publications
                          </Link>{" "}
                          and filter by &ldquo;{proj.domain}&rdquo; to see all.
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground border border-dashed border-border/40 p-6 rounded-xl text-center">
                      No publications tagged under this domain yet.
                    </div>
                  )}
                </div>

                {/* Related Photos */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-8 w-8 rounded-lg bg-accent/15 border border-accent/30 grid place-items-center text-accent">
                      <ImageIcon size={16} />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">Project Photos</div>
                      <div className="text-xs text-muted-foreground">
                        Images from researchers in the {proj.domain} domain
                      </div>
                    </div>
                    <span className="ml-auto text-xs text-muted-foreground">{relatedPhotos.length} images</span>
                  </div>
                  {relatedPhotos.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {relatedPhotos.map((photo, idx) => (
                        <a
                          key={idx}
                          href={photo.src}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="relative rounded-xl overflow-hidden border border-border/40 bg-muted aspect-square hover:border-primary/50 transition-all group cursor-zoom-in"
                          title={`By ${photo.personName}`}
                        >
                          <img
                            src={photo.src}
                            alt={`Project photo by ${photo.personName}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[9px] px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity truncate">
                            {photo.personName}
                          </div>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground border border-dashed border-border/40 p-6 rounded-xl text-center">
                      No project photos available yet.
                    </div>
                  )}
                </div>
              </div>
            )}
          </Reveal>
        ))}
      </div>
    </div>
  );
}

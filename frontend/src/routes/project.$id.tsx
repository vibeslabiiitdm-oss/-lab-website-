import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, ExternalLink, Image as ImageIcon, Rocket, CheckCircle2 } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { type Project, allPeople, BASE_URL } from "@/data/lab";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/project/$id")({ component: ProjectDetailPage });

function ProjectDetailPage() {
  const { id } = Route.useParams();

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${BASE_URL}/api/projects`)
      .then((res) => res.json())
      .then((data: Project[]) => {
        const found = data.find((p) => p.id === id);
        setProject(found ?? null);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [id]);

  const relatedPubs = project
    ? allPeople.flatMap((person) =>
        person.publications
          .filter((pub) => pub.domain === project.domain)
          .map((pub) => ({ ...pub, author: person.name, authorId: person.id }))
      )
    : [];

  const relatedPhotos: { src: string; personName: string }[] = project
    ? allPeople.flatMap((person) => {
        if (person.researchProject?.images && person.domains.includes(project.domain)) {
          return person.researchProject.images.map((img) => ({
            src: img,
            personName: person.name,
          }));
        }
        return [];
      })
    : [];

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-muted-foreground animate-pulse">Loading project...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-14">
        <Link
          to="/projects"
          className="mb-8 flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft size={16} /> Back to Projects
        </Link>
        <div className="text-center py-20 text-muted-foreground">Project not found.</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      {/* Back button */}
      <Link
        to="/projects"
        className="mb-8 flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft size={16} /> Back to Projects
      </Link>

      {/* Hero Banner */}
      <Reveal>
        <div className={`relative rounded-3xl overflow-hidden min-h-[260px] flex items-end bg-gradient-to-br ${project.image}`}>
          <div className="absolute inset-0 grid-bg opacity-40" />
          <div className="absolute inset-0 grid place-items-center opacity-30">
            <Rocket className="text-white" size={100} />
          </div>
          <div className="absolute top-5 left-5 flex items-center gap-2">
            <span
              className={`text-[11px] uppercase tracking-wider px-3 py-1.5 rounded-full border font-semibold ${
                project.status === "Ongoing"
                  ? "border-primary/60 text-primary bg-primary/20 backdrop-blur"
                  : "border-accent/60 text-accent bg-accent/20 backdrop-blur"
              }`}
            >
              {project.status}
            </span>
            <span className="text-[11px] px-3 py-1.5 rounded-full border border-white/30 bg-black/30 backdrop-blur text-white font-medium">
              Since {project.year}
            </span>
          </div>
          <div className="relative z-10 p-8">
            <div className="text-xs uppercase tracking-[0.2em] text-white/70 mb-1">{project.domain}</div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight">
              {project.title}
            </h1>
            <p className="mt-2 text-white/80 text-sm max-w-2xl">{project.tagline}</p>
          </div>
        </div>
      </Reveal>

      {/* Overview */}
      <Reveal delay={50}>
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-border/60 glass p-6">
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-2">Purpose</div>
            <p className="text-sm text-foreground/90 leading-relaxed">{project.purpose}</p>
          </div>
          <div className="rounded-2xl border border-border/60 glass p-6">
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-2">Approach</div>
            <p className="text-sm text-muted-foreground leading-relaxed">{project.description}</p>
          </div>
        </div>
      </Reveal>

      {/* Results & Tech */}
      <Reveal delay={80}>
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-border/60 glass p-6">
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-3">Key Results</div>
            <ul className="space-y-2">
              {project.results.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 size={14} className="mt-0.5 text-accent shrink-0" />
                  <span className="text-foreground/90">{r}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border/60 glass p-6">
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-3">Technologies</div>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-accent/10 border border-accent/25 text-accent"
                >
                  {t}
                </span>
              ))}
            </div>
            {project.collaborators && (
              <div className="mt-4 text-xs text-muted-foreground">
                <span className="text-foreground/60 uppercase tracking-wider text-[10px]">Collaborators: </span>
                {project.collaborators.join(", ")}
              </div>
            )}
          </div>
        </div>
      </Reveal>

      {/* Related Publications */}
      <Reveal delay={110}>
        <div className="mt-10">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-9 w-9 rounded-xl bg-primary/15 border border-primary/30 grid place-items-center text-primary">
              <BookOpen size={17} />
            </div>
            <div>
              <div className="font-semibold">Related Publications</div>
              <div className="text-xs text-muted-foreground">
                Papers in the "{project.domain}" research domain
              </div>
            </div>
            <span className="ml-auto text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
              {relatedPubs.length} papers
            </span>
          </div>

          {relatedPubs.length > 0 ? (
            <div className="space-y-3">
              {relatedPubs.map((pub) => (
                <div
                  key={pub.id}
                  className="rounded-xl border border-border/60 glass p-4 hover:border-primary/40 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="font-medium text-sm text-black dark:text-white">{pub.title}</div>
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
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/20 text-black dark:text-white">
                        {pub.domain}
                      </span>
                      {pub.url && (
                        <a
                          href={pub.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition"
                          title="Open paper"
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground border border-dashed border-border/40 p-8 rounded-xl text-center">
              No publications tagged under this domain yet.
            </div>
          )}
        </div>
      </Reveal>

      {/* Project Photos */}
      <Reveal delay={140}>
        <div className="mt-10">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-9 w-9 rounded-xl bg-accent/15 border border-accent/30 grid place-items-center text-accent">
              <ImageIcon size={17} />
            </div>
            <div>
              <div className="font-semibold">Project Photos</div>
              <div className="text-xs text-muted-foreground">
                Images from researchers in the {project.domain} domain
              </div>
            </div>
            <span className="ml-auto text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
              {relatedPhotos.length} images
            </span>
          </div>

          {relatedPhotos.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {relatedPhotos.map((photo, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedPhoto(photo.src)}
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
                  </button>
                ))}
              </div>

              {/* Lightbox */}
              {selectedPhoto && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                  onClick={() => setSelectedPhoto(null)}
                >
                  <img
                    src={selectedPhoto}
                    alt="Project photo"
                    className="max-w-full max-h-full rounded-2xl shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button
                    onClick={() => setSelectedPhoto(null)}
                    className="absolute top-4 right-4 text-white bg-black/40 rounded-full p-2 hover:bg-black/60 transition"
                  >
                    ✕
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-sm text-muted-foreground border border-dashed border-border/40 p-8 rounded-xl text-center">
              No project photos available yet.
            </div>
          )}
        </div>
      </Reveal>
    </div>
  );
}

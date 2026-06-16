import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Rocket, CheckCircle2 } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { projects } from "@/data/lab";

export const Route = createFileRoute("/projects")({ component: ProjectsPage });

function ProjectsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <Reveal>
        <div className="text-xs uppercase tracking-[0.2em] text-primary/80">Work</div>
        <h1 className="mt-2 font-display text-4xl md:text-5xl font-bold">
          Projects in the <span className="text-gradient">lab</span>
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Active and completed projects across biometrics, surveillance, machine learning and image
          processing — with purpose, methodology and measured outcomes.
        </p>
      </Reveal>

      <div className="mt-10 grid gap-8">
        {projects.map((proj, i) => (
          <Reveal key={proj.id} delay={i * 50}>
            <article className="group relative grid md:grid-cols-[1.05fr_1fr] gap-0 rounded-3xl border border-border/60 glass overflow-hidden hover:border-primary/40 transition">
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
                <h2 className="font-display text-2xl font-bold leading-tight">{proj.title}</h2>
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
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

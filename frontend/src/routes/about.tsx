import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";
import { Stat } from "@/components/site/StatsCounter";
import { labStats, resources, labDomains } from "@/data/lab";
import { DomainCard } from "@/components/site/DomainCard";
import LabRoverShowcase from "@/components/site/LabRoverShowcase";

export const Route = createFileRoute("/about")({ component: About });

function About() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <Reveal>
        <div className="text-xs uppercase tracking-[0.2em] text-primary/80">About</div>
        <h1 className="mt-2 font-display text-4xl md:text-5xl font-bold">
          Inside the <span className="text-gradient">Advanced Biometric & Surveillance Lab</span>
        </h1>
        <p className="mt-4 max-w-3xl text-muted-foreground">
          Established at IIITDM Kancheepuram, the lab is a hands-on space where research scholars,
          interns and faculty collaborate on computer vision systems — from controlled biometric
          capture rigs to multi-camera surveillance arrays and edge deployments.
        </p>
      </Reveal>

      <div className="mt-10 grid grid-cols-2 md:grid-cols-6 gap-3">
        <Stat label="Publications" value={labStats.publications} />
        <Stat label="Researchers" value={labStats.members} />
        <Stat label="Active Projects" value={labStats.projects} />
        <Stat label="Collaborations" value={labStats.collaborations} />
        <Stat label="Awards" value={labStats.awards} />
        <Stat label="GPUs" value={labStats.gpus} />
      </div>

      <section className="mt-16">
        <h2 className="font-display text-2xl font-bold">Research domains</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {labDomains.map((d) => (
            <DomainCard key={d.name} {...d} />
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-2xl font-bold">Infrastructure</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {resources.map((r) => (
            <div key={r.name} className="rounded-2xl border border-border/60 glass p-5">
              <div className="font-semibold">{r.name}</div>
              <div className="text-sm text-muted-foreground mt-1">{r.detail}</div>
            </div>
          ))}
        </div>
      </section>

      <Reveal delay={40}>
        <section className="mt-16">
          <LabRoverShowcase />
        </section>
      </Reveal>
    </div>
  );
}


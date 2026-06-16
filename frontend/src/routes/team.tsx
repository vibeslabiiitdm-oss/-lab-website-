import { createFileRoute } from "@tanstack/react-router";
import { GraduationCap, Users, Clock } from "lucide-react";
import { PeopleCard } from "@/components/site/PeopleCard";
import { Reveal } from "@/components/site/Reveal";
import { allPeople } from "@/data/lab";

export const Route = createFileRoute("/team")({ component: TeamPage });

function TeamPage() {
  const faculty = allPeople.filter((p) => p.role === "guide");
  const phd = allPeople.filter((p) => p.category === "PhD");
  const pg = allPeople.filter((p) => p.category === "PG");
  const ug = allPeople.filter((p) => p.category === "UG");
  const alumni = allPeople.filter((p) => p.category === "Alumni");

  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <Reveal>
        <div className="text-xs uppercase tracking-[0.2em] text-primary/80">Our People</div>
        <h1 className="mt-2 font-display text-4xl md:text-5xl font-bold">
          The minds behind <span className="text-gradient">ViBeS Lab</span>
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          The lab is led by Dr. Rahul Raman and powered by a talented team of researchers working
          across vision, biometrics, ML and surveillance.
        </p>
      </Reveal>

      {/* DOCTORATE / FACULTY */}
      <section className="mt-14">
        <Reveal>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/15 border border-primary/30 grid place-items-center text-primary">
              <GraduationCap size={18} />
            </div>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold">
                Doctorate · Faculty Lead
              </h2>
              <p className="text-sm text-muted-foreground">
                The principal investigator and lab head.
              </p>
            </div>
          </div>
        </Reveal>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {faculty.map((p, i) => (
            <Reveal key={p.id} delay={i * 50}>
              <PeopleCard p={p} />
            </Reveal>
          ))}
        </div>
      </section>

      <div className="mt-16 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* CURRENT STUDENTS */}
      <section className="mt-12">
        <Reveal>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-accent/15 border border-accent/30 grid place-items-center text-accent">
              <Users size={18} />
            </div>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold">
                Current Working Students
              </h2>
              <p className="text-sm text-muted-foreground">
                PhD, PG, and UG students actively researching in the lab.
              </p>
            </div>
          </div>
        </Reveal>

        {phd.length > 0 && (
          <div className="mt-10">
            <h3 className="font-display text-xl font-semibold mb-4">Research Scholars (PhD)</h3>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {phd.map((p, i) => (
                <Reveal key={p.id} delay={i * 50}>
                  <PeopleCard p={p} />
                </Reveal>
              ))}
            </div>
          </div>
        )}

        {pg.length > 0 && (
          <div className="mt-10">
            <h3 className="font-display text-xl font-semibold mb-4">PG Students</h3>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {pg.map((p, i) => (
                <Reveal key={p.id} delay={i * 50}>
                  <PeopleCard p={p} />
                </Reveal>
              ))}
            </div>
          </div>
        )}

        {ug.length > 0 && (
          <div className="mt-10">
            <h3 className="font-display text-xl font-semibold mb-4">UG Students</h3>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {ug.map((p, i) => (
                <Reveal key={p.id} delay={i * 50}>
                  <PeopleCard p={p} />
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </section>

      <div className="mt-16 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* PREVIOUS STUDENTS */}
      <section className="mt-12">
        <Reveal>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-muted/20 border border-border/70 grid place-items-center text-muted-foreground">
              <Clock size={18} />
            </div>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold">Previous Students</h2>
              <p className="text-sm text-muted-foreground">
                Alumni who have contributed to the lab's research.
              </p>
            </div>
          </div>
        </Reveal>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {alumni.map((p, i) => (
            <Reveal key={p.id} delay={i * 50}>
              <PeopleCard p={p} />
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}

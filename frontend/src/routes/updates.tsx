import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowLeft, Calendar, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { BASE_URL } from "@/data/lab";

export const Route = createFileRoute("/updates")({ component: UpdatesPage });

function UpdatesPage() {
  const [updates, setUpdates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE_URL}/api/updates`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setUpdates(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error loading updates:", err);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <Link
        to="/"
        className="mb-8 flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft size={16} /> Back to Home
      </Link>
      <Reveal>
        <div className="text-xs uppercase tracking-[0.2em] text-primary/80">Lab News</div>
        <h1 className="mt-2 font-display text-4xl md:text-5xl font-bold">
          Live <span className="text-gradient">Updates</span>
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Stay up to date with the latest news, announcements, and milestones from ViBeS Lab.
        </p>
      </Reveal>

      <div className="mt-10 space-y-5">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="rounded-2xl border border-border/40 glass p-6 h-32 animate-pulse bg-muted/10" />
            ))}
          </div>
        ) : updates.length > 0 ? (
          updates.map((u: any, idx) => (
            <Reveal key={u._id || u.id || idx} delay={idx * 40}>
              <div className="group rounded-2xl border border-border/60 glass p-6 hover:border-primary/40 transition">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground mb-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary pulse-dot" />
                  <Calendar size={12} className="text-primary" />
                  {u.date}
                  {u.tag && (
                    <span className="px-2 py-0.5 rounded-full border border-border/70 bg-background/50">
                      {u.tag}
                    </span>
                  )}
                </div>
                <h2 className="font-display text-xl font-bold leading-tight">{u.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{u.desc}</p>
                {u.link && (
                  <div className="mt-4">
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
                )}
              </div>
            </Reveal>
          ))
        ) : (
          <div className="text-center text-sm text-muted-foreground border border-dashed border-border/40 p-12 rounded-2xl">
            No live updates at the moment. Check back soon!
          </div>
        )}
      </div>
    </div>
  );
}

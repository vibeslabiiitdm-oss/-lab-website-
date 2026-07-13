import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { BASE_URL } from "@/data/lab";

export const Route = createFileRoute("/ai-vision-updates")({ component: AIVisionUpdatesPage });

function AIVisionUpdatesPage() {
  const [news, setNews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE_URL}/api/news`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setNews(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error loading news feed:", err);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <Link
        to="/"
        className="mb-8 flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft size={16} /> Back to Home
      </Link>
      <Reveal>
        <div className="text-xs uppercase tracking-[0.2em] text-primary/80">Global Trends</div>
        <h1 className="mt-2 font-display text-4xl md:text-5xl font-bold">
          AI &amp; Vision <span className="text-gradient">Research Updates</span>
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Real-time headlines dynamically fetched from global scientific and tech feeds — covering
          computer vision, biometrics, surveillance, and AI research worldwide.
        </p>
      </Reveal>

      <div className="mt-10">
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="rounded-2xl border border-border/40 glass p-5 h-36 animate-pulse bg-muted/10" />
            ))}
          </div>
        ) : news.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {news.map((item, idx) => (
              <Reveal key={idx} delay={idx * 40}>
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
                        {item.pubDate
                          ? new Date(item.pubDate).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : ""}
                      </span>
                    </div>
                    <div className="mt-3 font-display font-semibold text-sm leading-snug group-hover:text-primary transition duration-200 line-clamp-3 text-left">
                      {item.title}
                    </div>
                    {item.description && (
                      <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                    )}
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-[10px] text-accent font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform duration-200 text-left">
                    Read Full Story <ArrowRight size={10} />
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="text-center text-sm text-muted-foreground border border-dashed border-border/40 p-12 rounded-2xl">
            No global AI &amp; vision updates currently available. Check back soon!
          </div>
        )}
      </div>
    </div>
  );
}

import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Mail } from "lucide-react";
import type { Person } from "@/data/lab";
import { BASE_URL } from "@/data/lab";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function PeopleCard({ p }: { p: Person }) {
  const accent =
    p.role === "guide" ? "from-accent/40 to-primary/40" : "from-primary/30 to-accent/20";
  return (
    <Link
      to="/profile/$id"
      params={{ id: p.id }}
      className="group relative block rounded-2xl border border-border/60 glass overflow-hidden hover:border-primary/40 transition"
    >
      <div className={`h-24 bg-gradient-to-br ${accent} relative`}>
        <div className="absolute inset-0 grid-bg opacity-50" />
      </div>
      <div className="px-5 pb-5 -mt-10">
        {p.avatar ? (
          <img
            src={p.avatar.startsWith('/uploads') ? `${BASE_URL}${p.avatar}` : p.avatar}
            alt={p.name}
            className="h-20 w-20 rounded-2xl border border-border/70 object-cover bg-background relative z-10"
          />
        ) : (
          <div className="h-20 w-20 rounded-2xl border border-border/70 bg-background grid place-items-center font-display text-2xl font-bold text-gradient relative z-10">
            {initials(p.name)}
          </div>
        )}
        <div className="mt-3 flex items-start justify-between gap-2">
          <div>
            <div className="font-display font-semibold leading-tight">{p.name}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{p.designation}</div>
          </div>
          <ArrowUpRight
            className="text-muted-foreground group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition"
            size={18}
          />
        </div>
        <p className="mt-3 text-xs text-muted-foreground line-clamp-2">{p.bio}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {p.domains.slice(0, 3).map((d) => (
            <span
              key={d}
              className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary"
            >
              {d}
            </span>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Mail size={12} /> {p.email}
          </span>
          <span>Since {p.joined}</span>
        </div>
      </div>
    </Link>
  );
}

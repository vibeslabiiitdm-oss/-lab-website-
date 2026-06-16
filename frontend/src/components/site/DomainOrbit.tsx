import { Link } from "@tanstack/react-router";

// Creative orbit visualization of a person's research interest domains.
// Each domain pill is clickable and opens the dedicated domain page.
export function DomainOrbit({ domains }: { domains: string[] }) {
  const n = domains.length;
  return (
    <div className="relative mx-auto h-[340px] w-[340px]">
      <div className="absolute inset-0 rounded-full border border-primary/20 spin-slow" />
      <div
        className="absolute inset-6 rounded-full border border-accent/20 spin-slow"
        style={{ animationDirection: "reverse", animationDuration: "40s" }}
      />
      <div className="absolute inset-14 rounded-full border border-primary/10" />
      <div className="absolute inset-0 grid place-items-center">
        <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 border border-primary/40 grid place-items-center font-display text-xs text-center px-2 glow-ring">
          Research
          <br />
          Interests
        </div>
      </div>
      {domains.map((d, i) => {
        const a = (i / n) * Math.PI * 2 - Math.PI / 2;
        const radius = 140;
        const x = 170 + Math.cos(a) * radius;
        const y = 170 + Math.sin(a) * radius;
        return (
          <Link
            key={d}
            to="/domain/$name"
            params={{ name: encodeURIComponent(d) }}
            className="absolute -translate-x-1/2 -translate-y-1/2 float-y"
            style={{ left: x, top: y, animationDelay: `${i * 0.6}s` }}
          >
            <div className="px-3 py-1.5 rounded-full glass border border-primary/30 text-[11px] font-medium whitespace-nowrap hover:border-accent/60 hover:text-accent transition cursor-pointer">
              {d}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

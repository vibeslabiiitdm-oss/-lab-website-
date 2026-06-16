import { Aperture, Fingerprint, Brain, Eye, type LucideIcon } from "lucide-react";

const icons: Record<string, LucideIcon> = { Aperture, Fingerprint, Brain, Eye };

export function DomainCard({ name, desc, icon }: { name: string; desc: string; icon: string }) {
  const Icon = icons[icon] ?? Aperture;
  return (
    <div className="group relative rounded-2xl border border-border/60 glass p-6 hover:border-primary/40 transition overflow-hidden">
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/10 blur-3xl opacity-0 group-hover:opacity-100 transition" />
      <div className="relative">
        <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary/25 to-accent/25 border border-primary/30 grid place-items-center text-primary">
          <Icon size={20} />
        </div>
        <div className="mt-4 font-display text-lg font-semibold">{name}</div>
        <p className="mt-1.5 text-sm text-muted-foreground">{desc}</p>
        <div className="mt-5 h-px bg-gradient-to-r from-primary/40 via-accent/30 to-transparent" />
      </div>
    </div>
  );
}

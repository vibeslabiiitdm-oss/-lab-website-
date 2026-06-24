import { useEffect, useRef, useState } from "react";

function useCountUp(target: number, duration = 1400) {
  const [v, setV] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const started = useRef(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min(1, (now - start) / duration);
            const val = target * (1 - Math.pow(1 - p, 3));
            setV(target % 1 !== 0 ? Number(val.toFixed(2)) : Math.round(val));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [target, duration]);
  return { v, ref };
}

export function Stat({
  label,
  value,
  suffix = "",
}: {
  label: string;
  value: number;
  suffix?: string;
}) {
  const { v, ref } = useCountUp(value);
  return (
    <div
      ref={ref}
      className="glass rounded-xl p-5 border border-border/60 hover:border-primary/40 transition group"
    >
      <div className="font-display text-3xl md:text-4xl font-bold text-gradient">
        {v}
        {suffix}
      </div>
      <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-3 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition" />
    </div>
  );
}

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// Lightweight reveal — appears almost instantly so navigation feels snappy.
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    // Cap stagger delay so long lists don't feel laggy.
    const d = Math.min(delay, 120);
    const el = ref.current;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      const t = setTimeout(() => setShown(true), d);
      return () => clearTimeout(t);
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: "60px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={cn("reveal", shown && "in", className)}>
      {children}
    </div>
  );
}

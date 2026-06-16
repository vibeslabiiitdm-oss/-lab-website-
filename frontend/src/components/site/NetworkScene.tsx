import { useEffect, useRef, useState } from "react";

// Interactive 3D-ish lab "connection" scene: animated node graph with parallax tilt.
type Node = {
  id: string;
  x: number;
  y: number;
  r: number;
  label: string;
  group: "core" | "domain" | "edge";
};
const NODES: Node[] = [
  { id: "lab", x: 50, y: 50, r: 26, label: "ABSL", group: "core" },
  { id: "ip", x: 18, y: 22, r: 16, label: "Image\nProcessing", group: "domain" },
  { id: "bio", x: 82, y: 24, r: 16, label: "Biometrics", group: "domain" },
  { id: "ml", x: 16, y: 78, r: 16, label: "Machine\nLearning", group: "domain" },
  { id: "vs", x: 84, y: 78, r: 16, label: "Visual\nSurveillance", group: "domain" },
  { id: "e1", x: 38, y: 12, r: 6, label: "", group: "edge" },
  { id: "e2", x: 62, y: 12, r: 6, label: "", group: "edge" },
  { id: "e3", x: 6, y: 50, r: 6, label: "", group: "edge" },
  { id: "e4", x: 94, y: 50, r: 6, label: "", group: "edge" },
  { id: "e5", x: 38, y: 88, r: 6, label: "", group: "edge" },
  { id: "e6", x: 62, y: 88, r: 6, label: "", group: "edge" },
];
const EDGES: [string, string][] = [
  ["lab", "ip"],
  ["lab", "bio"],
  ["lab", "ml"],
  ["lab", "vs"],
  ["ip", "e1"],
  ["bio", "e2"],
  ["ip", "e3"],
  ["bio", "e4"],
  ["ml", "e5"],
  ["vs", "e6"],
  ["ip", "ml"],
  ["bio", "vs"],
];

function nodeAt(id: string) {
  return NODES.find((n) => n.id === id)!;
}

export function NetworkScene() {
  const wrap = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      setTilt({ x: py * -10, y: px * 14 });
    };
    const onLeave = () => setTilt({ x: 0, y: 0 });
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={wrap}
      className="relative h-[440px] md:h-[520px] w-full rounded-2xl border border-border/60 overflow-hidden glass"
      style={{ perspective: "1200px" }}
    >
      <div className="absolute inset-0 grid-bg" />
      <div
        className="absolute inset-0 transition-transform duration-200 ease-out"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
        >
          <defs>
            <radialGradient id="coreG" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="oklch(0.85 0.13 188)" stopOpacity="0.9" />
              <stop offset="100%" stopColor="oklch(0.4 0.13 188)" stopOpacity="0.2" />
            </radialGradient>
            <linearGradient id="lineG" x1="0" x2="1">
              <stop offset="0" stopColor="oklch(0.78 0.13 188)" stopOpacity=".7" />
              <stop offset="1" stopColor="oklch(0.78 0.14 62)" stopOpacity=".7" />
            </linearGradient>
          </defs>
          {EDGES.map(([a, b], i) => {
            const A = nodeAt(a),
              B = nodeAt(b);
            return (
              <line
                key={i}
                x1={A.x}
                y1={A.y}
                x2={B.x}
                y2={B.y}
                stroke="url(#lineG)"
                strokeWidth="0.18"
                className="flow-line"
                opacity="0.9"
              />
            );
          })}
        </svg>

        {NODES.map((n) => {
          const isCore = n.group === "core";
          const isDomain = n.group === "domain";
          return (
            <div
              key={n.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 float-y"
              style={{
                left: `${n.x}%`,
                top: `${n.y}%`,
                animationDelay: `${(n.x + n.y) % 5}s`,
                transform: `translate(-50%,-50%) translateZ(${isCore ? 60 : isDomain ? 30 : 10}px)`,
              }}
            >
              {isCore ? (
                <div className="relative">
                  <div className="h-28 w-28 rounded-full" style={{ background: "url(#coreG)" }} />
                  <div className="absolute inset-0 h-28 w-28 rounded-full border border-primary/60 glow-ring grid place-items-center text-center">
                    <div>
                      <div className="font-display font-bold text-primary">ABSL</div>
                      <div className="text-[10px] text-muted-foreground">Core</div>
                    </div>
                  </div>
                  <div
                    className="absolute inset-0 rounded-full border border-primary/30 spin-slow"
                    style={{ borderStyle: "dashed", transform: "scale(1.4)" }}
                  />
                </div>
              ) : isDomain ? (
                <div className="px-3 py-2 rounded-xl glass border border-primary/30 text-center whitespace-pre-line">
                  <div className="text-[11px] font-semibold text-foreground leading-tight">
                    {n.label}
                  </div>
                </div>
              ) : (
                <div className="h-3 w-3 rounded-full bg-accent pulse-dot" />
              )}
            </div>
          );
        })}
      </div>

      <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-primary pulse-dot" /> Live network
        </span>
        <span className="font-mono">node://absl.iiitdm</span>
      </div>
    </div>
  );
}

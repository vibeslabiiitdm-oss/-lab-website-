import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

const HEX_W = 100;
const HEX_H = 112;
const HEX_GAP_X = 8;
const HEX_GAP_Y = -22; // vertical overlap for honeycomb

export function HoneycombGrid({ items }: { items: string[] }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const animRef = useRef<number>(0);

  // Build honeycomb rows: alternating 3-4-3-4
  const rows: string[][] = [];
  let idx = 0;
  let rowLen = 3;
  while (idx < items.length) {
    rows.push(items.slice(idx, idx + rowLen));
    idx += rowLen;
    rowLen = rowLen === 3 ? 4 : 3;
  }

  // Smooth lerp animation
  useEffect(() => {
    const animate = () => {
      const dx = targetRef.current.x - currentRef.current.x;
      const dy = targetRef.current.y - currentRef.current.y;
      currentRef.current.x += dx * 0.08;
      currentRef.current.y += dy * 0.08;
      setOffset({ x: currentRef.current.x, y: currentRef.current.y });
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / rect.width; // -0.5 to 0.5
    const dy = (e.clientY - cy) / rect.height;
    targetRef.current = { x: dx * 60, y: dy * 40 }; // max shift in px
  };

  const handleMouseLeave = () => {
    targetRef.current = { x: 0, y: 0 };
    setHovered(null);
  };

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden select-none"
      style={{ height: "320px", cursor: "default" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* The whole honeycomb grid shifts together */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px)`,
          willChange: "transform",
        }}
      >
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex"
            style={{
              marginTop: rowIndex === 0 ? 0 : `${HEX_GAP_Y}px`,
              // Odd rows are offset to the right for honeycomb stagger
              marginLeft: rowIndex % 2 === 1 ? `${(HEX_W + HEX_GAP_X) / 2}px` : "0px",
            }}
          >
            {row.map((item, colIndex) => {
              const isActive = hovered === item;
              return (
                <Link
                  key={colIndex}
                  to="/domain/$name"
                  params={{ name: item }}
                  onMouseEnter={() => setHovered(item)}
                  onMouseLeave={() => setHovered(null)}
                  className="relative flex-shrink-0"
                  style={{
                    width: `${HEX_W}px`,
                    height: `${HEX_H}px`,
                    marginLeft: colIndex === 0 ? 0 : `${HEX_GAP_X}px`,
                    clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                    zIndex: isActive ? 10 : 1,
                    transition: "transform 0.2s ease, opacity 0.2s ease",
                    transform: isActive ? "scale(1.15)" : "scale(1)",
                    opacity: hovered && !isActive ? 0.5 : 1,
                  }}
                >
                  {/* Border gradient */}
                  <div
                    className="absolute inset-0 transition-all duration-300"
                    style={{
                      background: isActive
                        ? "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))"
                        : "linear-gradient(135deg, hsl(var(--primary)/0.8), hsl(var(--accent)/0.6))",
                      filter: isActive ? "drop-shadow(0 0 12px hsl(var(--primary)/0.8))" : "none",
                    }}
                  />
                  {/* Inner fill */}
                  <div
                    className="absolute inset-[2px] flex items-center justify-center p-2 text-center"
                    style={{
                      clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                      background: isActive
                        ? "hsl(var(--primary)/0.22)"
                        : "hsl(var(--background)/0.93)",
                      transition: "background 0.3s ease",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "9px",
                        fontWeight: 700,
                        lineHeight: 1.2,
                        color: isActive ? "hsl(var(--primary))" : "hsl(var(--foreground))",
                        textShadow: isActive ? "0 0 10px hsl(var(--primary)/0.9)" : "none",
                        transition: "color 0.3s ease, text-shadow 0.3s ease",
                      }}
                    >
                      {item}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

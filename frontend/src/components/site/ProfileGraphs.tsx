import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Line,
  LineChart,
} from "recharts";
import type { Person } from "@/data/lab";

type Mode = "year" | "month";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function ProfileGraphs({ p }: { p: Person }) {
  const [mode, setMode] = useState<Mode>("year");
  const [year, setYear] = useState<number | "all">("all");

  const years = useMemo(() => Array.from(new Set(p.publications.map((x) => x.year))).sort(), [p]);

  const pubsBy = useMemo(() => {
    if (mode === "year") {
      const map = new Map<number, number>();
      p.publications.forEach((x) => map.set(x.year, (map.get(x.year) ?? 0) + 1));
      return [...map.entries()]
        .sort(([a], [b]) => a - b)
        .map(([k, v]) => ({ key: String(k), value: v }));
    }
    const map = new Map<number, number>();
    p.publications
      .filter((x) => (year === "all" ? true : x.year === year))
      .forEach((x) => map.set(x.month, (map.get(x.month) ?? 0) + 1));
    return Array.from({ length: 12 }, (_, i) => ({ key: months[i], value: map.get(i + 1) ?? 0 }));
  }, [p, mode, year]);

  const byType = useMemo(() => {
    const map = new Map<string, number>();
    p.publications.forEach((x) => map.set(x.type, (map.get(x.type) ?? 0) + 1));
    return [...map.entries()].map(([name, value]) => ({ name, value }));
  }, [p]);

  const byDomain = useMemo(() => {
    const map = new Map<string, number>();
    p.publications.forEach((x) => map.set(x.domain, (map.get(x.domain) ?? 0) + 1));
    return [...map.entries()].map(([name, value]) => ({ name, value }));
  }, [p]);

  const cumulative = useMemo(() => {
    let total = 0;
    return [...pubsBy].map((d) => ({ key: d.key, total: (total += d.value) }));
  }, [pubsBy]);

  const palette = [
    "oklch(0.78 0.13 188)",
    "oklch(0.78 0.14 62)",
    "oklch(0.7 0.13 280)",
    "oklch(0.72 0.16 150)",
    "oklch(0.66 0.18 20)",
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-lg border border-border/70 overflow-hidden">
          {(["year", "month"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1.5 text-xs ${mode === m ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              By {m}
            </button>
          ))}
        </div>
        {mode === "month" && (
          <select
            value={year}
            onChange={(e) => setYear(e.target.value === "all" ? "all" : Number(e.target.value))}
            className="bg-background border border-border/70 rounded-md text-xs px-2 py-1.5"
          >
            <option value="all">All years</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        )}
        <span className="text-[11px] text-muted-foreground">Filter publications</span>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-border/60 glass p-5">
          <div className="text-sm font-semibold mb-3">
            Publications {mode === "year" ? "by year" : "by month"}
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={pubsBy}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.07)" />
                <XAxis dataKey="key" stroke="oklch(0.7 0.02 215)" fontSize={11} />
                <YAxis stroke="oklch(0.7 0.02 215)" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="oklch(0.78 0.13 188)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 glass p-5">
          <div className="text-sm font-semibold mb-3">Cumulative output</div>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={cumulative}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.07)" />
                <XAxis dataKey="key" stroke="oklch(0.7 0.02 215)" fontSize={11} />
                <YAxis stroke="oklch(0.7 0.02 215)" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="oklch(0.78 0.14 62)"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 glass p-5">
          <div className="text-sm font-semibold mb-3">By publication type</div>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={byType}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={85}
                  paddingAngle={3}
                >
                  {byType.map((_, i) => (
                    <Cell key={i} fill={palette[i % palette.length]} />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 glass p-5">
          <div className="text-sm font-semibold mb-3">By domain</div>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart layout="vertical" data={byDomain}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.07)" />
                <XAxis
                  type="number"
                  stroke="oklch(0.7 0.02 215)"
                  fontSize={11}
                  allowDecimals={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="oklch(0.7 0.02 215)"
                  fontSize={11}
                  width={110}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} fill="oklch(0.7 0.13 280)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

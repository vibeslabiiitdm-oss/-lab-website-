import { useState } from "react";
import { MessageCircle, Send, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type Msg = { id: number; from: "bot" | "you"; text: string };
const seed: Msg[] = [
  {
    id: 1,
    from: "bot",
    text: "Hi! I'm ViBeS Lab Assistant 🤖 — ask me about the lab, our research domains, or scholars.",
  },
];
const suggestions = [
  "Who leads the lab?",
  "Show research domains",
  "Recent publications",
  "How do I join?",
];

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>(seed);
  const [input, setInput] = useState("");

  const send = (text: string) => {
    if (!text.trim()) return;
    const next: Msg[] = [...msgs, { id: Date.now(), from: "you", text }];
    setMsgs(next);
    setInput("");
    setTimeout(() => {
      setMsgs((m) => [
        ...m,
        {
          id: Date.now() + 1,
          from: "bot",
          text: "This is a UI-only preview — real responses will be wired up later. Meanwhile, check the Team and Publications pages for details!",
        },
      ]);
    }, 700);
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-50 h-14 w-14 rounded-full grid place-items-center bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg shadow-primary/30 hover:scale-105 transition"
        aria-label="Open chatbot"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      <div
        className={cn(
          "fixed bottom-24 right-5 z-50 w-[min(92vw,360px)] origin-bottom-right transition-all",
          open ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none",
        )}
      >
        <div className="rounded-2xl border border-border/70 glass overflow-hidden shadow-2xl">
          <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border/60 bg-background/50">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 grid place-items-center">
              <Sparkles size={16} className="text-primary" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">ViBeS Lab Assistant</div>
              <div className="text-[10px] text-muted-foreground inline-flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-primary pulse-dot" /> online · UI
                preview
              </div>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto p-3 space-y-2">
            {msgs.map((m) => (
              <div
                key={m.id}
                className={cn("flex", m.from === "you" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-xl px-3 py-2 text-sm",
                    m.from === "you"
                      ? "bg-primary/15 border border-primary/30 text-foreground"
                      : "bg-card border border-border/60 text-foreground",
                  )}
                >
                  {m.text}
                </div>
              </div>
            ))}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-[11px] px-2 py-1 rounded-full border border-border/70 text-muted-foreground hover:text-foreground hover:border-primary/40"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-border/60 px-3 py-2 bg-background/50"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about ViBeS Lab…"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              className="h-8 w-8 grid place-items-center rounded-md bg-primary/20 text-primary hover:bg-primary/30"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

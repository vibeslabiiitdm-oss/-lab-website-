import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
// this file defines the Navbar component for the frontend application. It includes navigation links to different sections of the website, a theme toggle button, and a responsive design that adapts to different screen sizes. The Navbar component uses the `@tanstack/react-router` library for navigation and state management, and it also includes a mobile menu that can be toggled open or closed. The component is styled using Tailwind CSS classes and includes hover effects and active link highlighting.
const links = [
  { to: "/", label: "Home" },
  { to: "/team", label: "Team" },
  { to: "/projects", label: "Projects" },
  { to: "/publications", label: "Publications" },
  { to: "/achievements", label: "Achievements" },
  { to: "/about", label: "About" },
  { to: "/ai-vision-updates", label: "AI & Vision Updates" },
  { to: "/contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 backdrop-blur-xl bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5 group">
          <img
            src="/logo.png"
            alt="ViBeS Lab Logo"
            className="h-9 w-9 object-contain group-hover:scale-105 transition-transform"
          />
          <div className="leading-tight">
            <div className="font-display font-semibold text-sm tracking-wide">ViBeS Lab</div>
            <div className="text-[10px] text-muted-foreground -mt-0.5">IIITDM Kancheepuram</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => {
            const active = pathname === l.to || (l.to !== "/" && pathname.startsWith(l.to));
            return (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "relative px-3 py-2 text-sm rounded-md transition-colors",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {l.label}
                {active && (
                  <span className="absolute left-3 right-3 -bottom-px h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            to="/contact"
            className="hidden lg:inline-flex items-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 px-3.5 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition"
          >
            Join the Lab
          </Link>
          <button
            className="lg:hidden text-foreground"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden border-t border-border/60 px-4 py-3 space-y-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

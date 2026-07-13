import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-background/40">
      <div className="mx-auto max-w-7xl px-6 py-12 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-display text-lg font-semibold">
            Visual Surveillance & Biometrics Security Lab (ViBeS Lab)
          </div>
          <p className="mt-2 text-sm text-muted-foreground max-w-md">
            A research group at IIITDM Kancheepuram exploring image processing, biometrics, machine
            learning and visual surveillance — from theory to deployable edge systems.
          </p>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Explore
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/team" className="hover:text-primary">
                Team
              </Link>
            </li>
            <li>
              <Link to="/projects" className="hover:text-primary">
                Projects
              </Link>
            </li>
            <li>
              <Link to="/publications" className="hover:text-primary">
                Publications
              </Link>
            </li>
            <li>
              <Link to="/achievements" className="hover:text-primary">
                Achievements
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-primary">
                About the Lab
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Contact
          </div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>IIITDM Kancheepuram</li>
            <li>Chennai 600127, India</li>
            <li>vibes@iiitdm.ac.in</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground flex flex-col md:flex-row justify-center items-center gap-1">
        <span>© {new Date().getFullYear()} ViBeS Lab — IIITDM Kancheepuram.</span>
        <span>Designed & Developed by Sai Linisha Vempali.</span>
      </div>
    </footer>
  );
}

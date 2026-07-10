import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Loader2, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Reveal } from "@/components/site/Reveal";
import { BASE_URL } from "@/data/lab";

export const Route = createFileRoute("/contact")({ component: Contact });

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    try {
      const response = await fetch(`${BASE_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong. Please try again.");
      }

      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err: any) {
      console.error("Contact submit error:", err);
      setStatus("error");
      setErrorMessage(err.message || "Failed to connect to the server.");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <div className="col-span-full">
        <Link
          to="/"
          className="mb-8 flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>
      <div className="grid lg:grid-cols-2 gap-10">
        <Reveal>
        <div className="text-xs uppercase tracking-[0.2em] text-primary/80">Contact</div>
        <h1 className="mt-2 font-display text-4xl md:text-5xl font-bold">
          Let's <span className="text-gradient">talk research</span>
        </h1>
        <p className="mt-3 text-muted-foreground max-w-md">
          Collaborations, internships, or questions about our work — drop us a message.
        </p>
        <div className="mt-8 space-y-4">
          <div className="flex items-center gap-3 text-sm">
            <MapPin className="text-primary" size={16} /> IIITDM Kancheepuram, Chennai 600127
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Mail className="text-primary" size={16} /> vibes.iiitdm@gmail.com
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Phone className="text-primary" size={16} /> +91 8763797907
          </div>
        </div>
      </Reveal>

      <Reveal delay={120}>
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border/60 glass p-6 space-y-4"
        >
          <div>
            <label className="text-xs text-muted-foreground">Name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={status === "sending"}
              className="mt-1 w-full bg-background border border-border/70 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "sending"}
              className="mt-1 w-full bg-background border border-border/70 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Message</label>
            <textarea
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={status === "sending"}
              className="mt-1 w-full bg-background border border-border/70 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary"
              placeholder="Tell us about your interest…"
            />
          </div>
          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full rounded-lg bg-gradient-to-r from-primary to-accent px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50 transition cursor-pointer flex justify-center items-center gap-2"
          >
            {status === "sending" ? (
              <>
                <Loader2 className="animate-spin" size={16} /> Sending...
              </>
            ) : (
              "Send message"
            )}
          </button>
          
          {status === "success" && (
            <div className="text-xs text-emerald-500 text-center font-semibold mt-2">
              Message sent successfully! We'll get back to you soon.
            </div>
          )}
          
          {status === "error" && (
            <div className="text-xs text-destructive text-center font-semibold mt-2">
              {errorMessage}
            </div>
          )}
        </form>
      </Reveal>
      </div>
    </div>
  );
}


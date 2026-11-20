"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, Info, Sparkles } from "lucide-react";

import { Card } from "@/components/ui/card";

const COPY = {
  "sign-in": {
    title: "Welcome back",
    subtitle: "Sign in to see your orders and favourite bowls.",
    otherLabel: "New to Casa Bowl?",
    otherHref: "/register",
    otherText: "Create an account",
  },
  register: {
    title: "Create your account",
    subtitle: "Join Casa Bowl for easier ordering next time.",
    otherLabel: "Already have an account?",
    otherHref: "/sign-in",
    otherText: "Sign in",
  },
} as const;

export function AuthPanel({ mode }: { mode: "sign-in" | "register" }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const copy = COPY[mode];

  async function enterDemo() {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/demo-session", { method: "POST" });
      if (!response.ok) throw new Error("Demo session could not be started");
      router.push("/account");
      router.refresh();
    } catch {
      setError("Demo access is unavailable right now. Please try again.");
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-cream px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto grid max-w-6xl items-stretch gap-6 lg:grid-cols-2">
        <section className="relative overflow-hidden rounded-[2rem] border border-lavender/25 bg-gradient-to-br from-lilac via-cream to-blush p-8 shadow-sm sm:p-12">
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-lavender/25 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative">
            <Link href="/" className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-deep-lavender font-serif text-lg font-semibold text-white">
                C
              </span>
              <span className="font-serif text-xl font-semibold text-charcoal">
                Casa Bowl
              </span>
            </Link>

            <span className="mt-12 inline-flex items-center gap-2 rounded-full border border-lavender/30 bg-white/80 px-4 py-1.5 text-xs font-semibold text-deep-lavender">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Customer account preview
            </span>

            <h1 className="mt-6 max-w-md font-serif text-4xl font-semibold leading-tight text-charcoal sm:text-5xl">
              A calmer way to order your favourites.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-charcoal/65">
              Keep your details handy, follow every order and build the bowl you
              are craving — all in one simple place.
            </p>

            <ul className="mt-10 space-y-3">
              {[
                "Track orders from Pending to Completed",
                "Save your delivery details for next time",
                "Reorder bowls and build your own with ease",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-charcoal/70">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/80 text-deep-lavender shadow-sm">
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <Card className="flex flex-col justify-center p-6 sm:p-10">
          <div>
            <h2 className="font-serif text-3xl font-semibold text-charcoal">
              {copy.title}
            </h2>
            <p className="mt-2 text-sm text-charcoal/60">{copy.subtitle}</p>
          </div>

          <div className="mt-6 rounded-2xl border border-lavender/30 bg-lilac/35 p-5">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-deep-lavender" aria-hidden="true" />
              <p className="text-sm font-semibold text-charcoal">
                Temporary demo login
              </p>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-charcoal/60">
              Real authentication is not implemented yet. No credentials are
              checked or stored. This clearly labelled demo session only previews
              the customer area with sample data.
            </p>
            <button
              type="button"
              onClick={enterDemo}
              disabled={busy}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-deep-lavender px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-charcoal disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? "Opening demo…" : "Enter demo account"}
            </button>
            {error && (
              <p className="mt-3 text-xs text-charcoal/70" role="alert">
                {error}
              </p>
            )}
          </div>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-soft-grey" />
            <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-charcoal/40">
              Form design preview
            </span>
            <span className="h-px flex-1 bg-soft-grey" />
          </div>

          <form onSubmit={(event) => event.preventDefault()} className="space-y-4">
            {mode === "register" && (
              <Field label="Full name" placeholder="Your name" />
            )}
            <Field label="Email address" placeholder="you@example.com" />
            <Field label="Password" placeholder="••••••••" type="password" />
            {mode === "register" && (
              <Field label="Confirm password" placeholder="••••••••" type="password" />
            )}
            <p className="text-[0.7rem] leading-relaxed text-charcoal/45">
              These fields are visual placeholders only and are disabled in the
              demo.
            </p>
          </form>

          <p className="mt-8 text-center text-sm text-charcoal/60">
            {copy.otherLabel}{" "}
            <Link
              href={copy.otherHref}
              className="font-semibold text-deep-lavender hover:underline"
            >
              {copy.otherText}
            </Link>
          </p>
          <p className="mt-4 text-center text-xs text-charcoal/40">
            <Link href="/" className="hover:text-deep-lavender hover:underline">
              Back to Casa Bowl
            </Link>
          </p>
        </Card>
      </div>
    </main>
  );
}

function Field({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-charcoal/65">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        disabled
        className="mt-2 w-full rounded-xl border border-soft-grey bg-soft-grey/40 px-4 py-3 text-sm text-charcoal/50 outline-none disabled:cursor-not-allowed"
      />
    </label>
  );
}

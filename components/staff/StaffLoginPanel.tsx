"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, LockKeyhole, ShieldCheck } from "lucide-react";

import { Card } from "@/components/ui/card";

export function StaffLoginPanel() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function enterDemo() {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/demo-staff-session", {
        method: "POST",
      });
      if (!response.ok) throw new Error("Unable to start staff demo");
      router.push("/staff");
      router.refresh();
    } catch {
      setError("Could not open the demo workspace. Please try again.");
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-4 py-12">
      <div className="w-full max-w-5xl">
        <div className="mb-8 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-deep-lavender font-serif text-xl font-semibold text-white">
            C
          </span>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-deep-lavender">
            Casa Bowl staff
          </p>
          <h1 className="mt-2 font-serif text-3xl font-semibold text-charcoal sm:text-4xl">
            Staff workspace access
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-charcoal/60">
            A calm, separate area for order handling and ingredient management.
            This preview uses demo data only and is not connected to a POS,
            payments, suppliers, or live inventory.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <Card className="p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <LockKeyhole
                className="h-5 w-5 text-deep-lavender"
                aria-hidden="true"
              />
              <h2 className="font-serif text-xl font-semibold text-charcoal">
                Staff sign in
              </h2>
            </div>
            <p className="mt-2 text-sm text-charcoal/60">
              Credential fields are intentionally disabled in this demo.
            </p>

            <div className="mt-6 space-y-4 opacity-70">
              <label className="block text-sm font-medium text-charcoal/70">
                Staff email
                <input
                  type="email"
                  value="staff@casabowl.example"
                  disabled
                  className="mt-2 w-full cursor-not-allowed rounded-xl border border-soft-grey bg-warm-off-white px-4 py-3 text-sm text-charcoal/50"
                />
              </label>
              <label className="block text-sm font-medium text-charcoal/70">
                Password
                <input
                  type="password"
                  value="demo-only"
                  disabled
                  className="mt-2 w-full cursor-not-allowed rounded-xl border border-soft-grey bg-warm-off-white px-4 py-3 text-sm text-charcoal/50"
                />
              </label>
            </div>

            <div className="mt-6 rounded-2xl border border-lavender/25 bg-lilac/30 p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck
                  className="mt-0.5 h-5 w-5 shrink-0 text-deep-lavender"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm font-semibold text-charcoal">
                    Temporary demo staff access
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-charcoal/60">
                    No credentials are checked or stored. Entering the demo sets
                    a clearly labeled staff session cookie in this browser.
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <p role="alert" className="mt-4 text-sm text-charcoal/80">
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={enterDemo}
              disabled={busy}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-deep-lavender px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-charcoal disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? "Opening workspace…" : "Enter demo staff workspace"}
              {!busy && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
            </button>
          </Card>

          <Card className="bg-gradient-to-br from-lilac/45 via-cream to-soft-grey/50 p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-deep-lavender">
              What you can preview
            </p>
            <ul className="mt-5 space-y-4 text-sm text-charcoal/70">
              {[
                "Order overview with pending, preparing, and completed counts.",
                "Incoming orders with ingredients, allergens, time, and NPR totals.",
                "Status updates across the five-step kitchen flow.",
                "Ingredient records, availability, deactivation, and NPR prices.",
                "Usage estimates derived from submitted demo orders.",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-deep-lavender" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 rounded-xl border border-sand bg-sand/40 p-4 text-xs leading-relaxed text-charcoal/60">
              Estimates are not live inventory. They are calculated only from
              submitted demo orders and predefined bowl ingredient selections.
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}

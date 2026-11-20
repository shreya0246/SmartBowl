"use client";

import { useState } from "react";
import { Check } from "lucide-react";

import { Card } from "@/components/ui/card";
import { useDemoAccount } from "@/components/providers/DemoAccountProvider";
import type { CustomerProfile } from "@/src/data/customer";

const FIELDS: {
  key: keyof CustomerProfile;
  label: string;
  type?: string;
}[] = [
  { key: "name", label: "Full name" },
  { key: "email", label: "Email address", type: "email" },
  { key: "phone", label: "Phone number" },
  { key: "addressLine", label: "Delivery address" },
  { key: "city", label: "City" },
  { key: "favoriteBase", label: "Favourite base" },
];

export default function AccountProfilePage() {
  const { profile, updateProfile } = useDemoAccount();
  const [form, setForm] = useState<CustomerProfile>(profile);
  const [saved, setSaved] = useState(false);

  function update(key: keyof CustomerProfile, value: string) {
    setSaved(false);
    setForm((current) => ({ ...current, [key]: value }));
  }

  function save() {
    updateProfile(form);
    setSaved(true);
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-deep-lavender">
          Customer profile
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-charcoal">
          Your details
        </h1>
        <p className="mt-2 text-sm text-charcoal/60">
          Demo profile data only. Changes stay in this browser session.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        <Card>
          <h2 className="font-serif text-xl font-semibold text-charcoal">
            Edit profile
          </h2>
          <p className="mt-1 text-xs text-charcoal/55">
            These details are used in the demo checkout review.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {FIELDS.map((field) => (
              <label key={field.key} className="block">
                <span className="text-xs font-semibold text-charcoal/65">
                  {field.label}
                </span>
                <input
                  type={field.type ?? "text"}
                  value={form[field.key]}
                  onChange={(event) => update(field.key, event.target.value)}
                  className="mt-2 w-full rounded-xl border border-soft-grey bg-white px-4 py-3 text-sm text-charcoal outline-none transition-colors focus:border-lavender focus:ring-2 focus:ring-lavender/20"
                />
              </label>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={save}
              className="rounded-xl bg-deep-lavender px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-charcoal"
            >
              Save demo profile
            </button>
            {saved && (
              <span className="inline-flex items-center gap-1.5 text-sm text-deep-lavender">
                <Check className="h-4 w-4" aria-hidden="true" />
                Saved for this session
              </span>
            )}
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-lilac/40 via-cream to-blush/30">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-deep-lavender font-serif text-xl font-semibold text-white">
            {profile.name.charAt(0)}
          </div>
          <p className="mt-4 font-serif text-xl font-semibold text-charcoal">
            {profile.name}
          </p>
          <p className="mt-1 text-sm text-charcoal/55">{profile.email}</p>
          <div className="mt-6 space-y-3 border-t border-lavender/25 pt-5 text-sm">
            <p className="flex justify-between gap-3">
              <span className="text-charcoal/50">Member since</span>
              <span className="font-medium text-charcoal">{profile.memberSince}</span>
            </p>
            <p className="flex justify-between gap-3">
              <span className="text-charcoal/50">Phone</span>
              <span className="font-medium text-charcoal">{profile.phone}</span>
            </p>
            <p className="flex justify-between gap-3">
              <span className="text-charcoal/50">Favourite</span>
              <span className="font-medium text-charcoal">{profile.favoriteBase}</span>
            </p>
          </div>
          <p className="mt-5 rounded-xl border border-sand bg-sand/40 p-3 text-[0.7rem] leading-relaxed text-charcoal/55">
            No account data is sent to a server or stored permanently in this
            demo.
          </p>
        </Card>
      </div>
    </div>
  );
}

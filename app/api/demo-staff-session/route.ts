import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  DEMO_STAFF_COOKIE,
  DEMO_STAFF_VALUE,
  isDemoStaffValue,
} from "@/lib/demo-session";

export async function GET() {
  const cookieStore = await cookies();
  const active = isDemoStaffValue(cookieStore.get(DEMO_STAFF_COOKIE)?.value);
  return NextResponse.json({ active, mode: "demo", area: "staff" });
}

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.set(DEMO_STAFF_COOKIE, DEMO_STAFF_VALUE, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return NextResponse.json({ ok: true, mode: "demo", area: "staff" });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(DEMO_STAFF_COOKIE);
  return NextResponse.json({ ok: true, mode: "demo", area: "staff" });
}

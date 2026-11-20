import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  DEMO_SESSION_COOKIE,
  DEMO_SESSION_VALUE,
  isDemoSessionValue,
} from "@/lib/demo-session";

export async function GET() {
  const cookieStore = await cookies();
  const active = isDemoSessionValue(cookieStore.get(DEMO_SESSION_COOKIE)?.value);
  return NextResponse.json({ active, mode: "demo" });
}

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.set(DEMO_SESSION_COOKIE, DEMO_SESSION_VALUE, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return NextResponse.json({ ok: true, mode: "demo" });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(DEMO_SESSION_COOKIE);
  return NextResponse.json({ ok: true, mode: "demo" });
}

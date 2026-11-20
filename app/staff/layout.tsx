import type { Metadata } from "next";
import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { StaffShell } from "@/components/staff/StaffShell";
import {
  DEMO_STAFF_COOKIE,
  isDemoStaffValue,
} from "@/lib/demo-session";

export const instant = false;

export const metadata: Metadata = {
  title: "Staff Workspace — Casa Bowl",
  description: "Demo staff dashboard for orders, ingredients, and usage estimates.",
};

export default async function StaffLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const active = isDemoStaffValue(cookieStore.get(DEMO_STAFF_COOKIE)?.value);

  if (!active) redirect("/staff/login");

  return <StaffShell>{children}</StaffShell>;
}

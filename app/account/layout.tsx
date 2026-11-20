import type { Metadata } from "next";
import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { AccountShell } from "@/components/account/AccountShell";
import { DemoAccountProvider } from "@/components/providers/DemoAccountProvider";
import {
  DEMO_SESSION_COOKIE,
  isDemoSessionValue,
} from "@/lib/demo-session";

export const instant = false;

export const metadata: Metadata = {
  title: "My Account — Casa Bowl",
  description: "Your Casa Bowl orders, profile and demo ordering dashboard.",
};

export default async function AccountLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const active = isDemoSessionValue(cookieStore.get(DEMO_SESSION_COOKIE)?.value);

  if (!active) redirect("/sign-in");

  return (
    <DemoAccountProvider>
      <AccountShell>{children}</AccountShell>
    </DemoAccountProvider>
  );
}

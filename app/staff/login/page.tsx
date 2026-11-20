import type { Metadata } from "next";

import { StaffLoginPanel } from "@/components/staff/StaffLoginPanel";

export const metadata: Metadata = {
  title: "Staff Access — Casa Bowl",
  description: "Temporary demo access for the Casa Bowl staff workspace.",
};

export default function StaffLoginPage() {
  return <StaffLoginPanel />;
}

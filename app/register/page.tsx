import type { Metadata } from "next";

import { AuthPanel } from "@/components/auth/AuthPanel";

export const metadata: Metadata = {
  title: "Create Account — Casa Bowl",
  description: "Customer registration preview for Casa Bowl.",
};

export default function RegisterPage() {
  return <AuthPanel mode="register" />;
}

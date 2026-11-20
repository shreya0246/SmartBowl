import type { Metadata } from "next";

import { AuthPanel } from "@/components/auth/AuthPanel";

export const metadata: Metadata = {
  title: "Sign In — Casa Bowl",
  description: "Customer sign-in preview for Casa Bowl.",
};

export default function SignInPage() {
  return <AuthPanel mode="sign-in" />;
}

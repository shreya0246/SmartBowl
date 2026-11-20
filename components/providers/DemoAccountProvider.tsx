"use client";

import type { ReactNode } from "react";

import {
  useDemoWorkspace,
  type DemoWorkspaceContextValue,
  type PlaceDemoOrderInput,
} from "@/components/providers/DemoWorkspaceProvider";

export type { PlaceDemoOrderInput };

export function DemoAccountProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function useDemoAccount(): DemoWorkspaceContextValue {
  return useDemoWorkspace();
}

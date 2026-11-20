import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DM_Sans, Fraunces } from "next/font/google";

import { CartProvider } from "@/components/providers/CartProvider";
import { DemoWorkspaceProvider } from "@/components/providers/DemoWorkspaceProvider";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["SOFT", "WONK"],
});

export const metadata: Metadata = {
  title: "Casa Bowl — Personalized Smoothie & Açaí Bowls",
  description:
    "Personalized smoothie and açaí bowls, blended to order with fresh, seasonal ingredients.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <DemoWorkspaceProvider>
          <CartProvider>{children}</CartProvider>
        </DemoWorkspaceProvider>
      </body>
    </html>
  );
}

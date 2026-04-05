"use client";

import { PageTransition } from "@/components/animations/page-transition";

export function AnimatedWrapper({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}

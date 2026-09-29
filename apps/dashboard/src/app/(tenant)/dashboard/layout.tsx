import type { ReactNode } from "react";
import { TenantShell } from "@/components/layout/tenant-shell";

export default function TenantLayout({ children }: { children: ReactNode }) {
  return <TenantShell>{children}</TenantShell>;
}

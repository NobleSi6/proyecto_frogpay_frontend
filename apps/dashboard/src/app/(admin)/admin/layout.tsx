import type { ReactNode } from "react";
import { AdminShell } from "@/components/layout/admin-shell";
import { TenantProvider } from "@/features/tenants/components/tenant-provider";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <TenantProvider><AdminShell>{children}</AdminShell></TenantProvider>;
}

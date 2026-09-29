"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type Tenant = { id: string; company: string; email: string; status: "Invitado" | "Activo"; created: string };
const initialTenants: Tenant[] = [
  { id: "1", company: "Acme Pagos", email: "carlos@acmepagos.com", status: "Invitado", created: "24 Oct 2024" },
  { id: "2", company: "Kushki Pro", email: "kushki@kushkipro.com", status: "Invitado", created: "19 Oct 2024" },
  { id: "3", company: "FinTech Co", email: "owner@fintechco.co", status: "Activo", created: "22 Oct 2024" },
  { id: "4", company: "Yape Fast", email: "admin@yapefast.pe", status: "Activo", created: "20 Oct 2024" },
  { id: "5", company: "Platzi Pay", email: "owner@platzipay.com", status: "Activo", created: "15 Oct 2024" },
];
const TenantContext = createContext<{ tenants: Tenant[]; addTenant: (company: string, email: string) => void } | null>(null);

export function TenantProvider({ children }: { children: ReactNode }) {
  const [tenants, setTenants] = useState(initialTenants);
  function addTenant(company: string, email: string) {
    setTenants(current => [{ id: crypto.randomUUID(), company, email, status: "Invitado", created: new Intl.DateTimeFormat("es", { day: "2-digit", month: "short", year: "numeric" }).format(new Date()) }, ...current]);
  }
  return <TenantContext.Provider value={{ tenants, addTenant }}>{children}</TenantContext.Provider>;
}

export function useTenants() {
  const value = useContext(TenantContext);
  if (!value) throw new Error("TenantProvider requerido");
  return value;
}

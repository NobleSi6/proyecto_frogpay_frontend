"use client";

import "@fontsource-variable/inter";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function TenantShell({ children }: { children: ReactNode }) {
  const keys = usePathname() === "/dashboard/api-keys";
  const prefix = keys ? "keys" : "home";
  const items = [
    { label: "Inicio", icon: "MenuIcon", href: "/dashboard", active: !keys, small: false },
    { label: "Pagos", icon: "CreditCard", small: true },
    { label: "API Keys", icon: "Key", href: "/dashboard/api-keys", active: keys, small: true },
    { label: "Webhooks", icon: "Webhook", small: true },
    { label: "Configuración", icon: "MenuIcon1", small: false },
  ];
  return <div className="min-h-dvh bg-auth-background font-auth text-auth-text md:flex">
    <aside className="flex flex-col justify-between gap-8 bg-admin-sidebar p-6 md:sticky md:top-0 md:h-dvh md:w-[260px] md:shrink-0">
      <div className="flex flex-col gap-10">
        <div className="flex items-center gap-2.5 text-xl font-semibold text-auth-surface"><span className="flex size-9 items-center justify-center rounded-auth-input bg-auth-primary"><Image src={`/tenant/${prefix}-CircleX.svg`} width={22} height={22} alt="" /></span>FrogPay</div>
        <nav aria-label="Tenant Owner" className="flex flex-wrap gap-2 text-sm font-medium md:flex-col">
          {items.map(item => {
            const content = <><span className="flex size-[18px] shrink-0 items-center justify-center"><Image src={`/tenant/${prefix}-${item.icon}.svg`} alt="" width={item.small ? 13.5 : 18} height={item.small ? 14.2506 : 18} /></span>{item.label}</>;
            const styles = `flex items-center gap-3 rounded-auth-input px-4 py-3 focus-visible:outline-auth-focus ${item.active ? `${keys ? "bg-tenant-active" : "bg-admin-sidebar-border"} text-auth-surface` : item.href ? "text-auth-surface" : "cursor-not-allowed text-auth-muted"}`;
            return item.href ? <Link key={item.label} href={item.href} aria-current={item.active ? "page" : undefined} className={styles}>{content}</Link> : <button key={item.label} disabled title="No disponible en Sprint 1" className={styles}>{content}</button>;
          })}
        </nav>
      </div>
      <div className="hidden items-center gap-3 border-t border-admin-sidebar-border pt-4 md:flex"><span className="flex size-10 items-center justify-center"><Image src={`/tenant/${prefix}-UserAvatar.svg`} width={32} height={32} alt="" /></span><div><p className="text-sm font-medium text-auth-surface">Carlos Méndez</p><p className="text-xs text-auth-muted">Tenant Owner</p></div></div>
    </aside>
    <main className="flex min-w-0 flex-1 flex-col gap-8 p-4 sm:p-6 lg:p-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div><h1 className="text-[30px] leading-[38px] font-bold">{keys ? "Credenciales API" : "Inicio"}</h1><p className="mt-1 text-sm leading-5 text-auth-secondary">{keys ? "Integra FrogPay en tus flujos de cobro · " : "Resumen de tu cuenta en "}<span className="text-auth-text">Acme Pagos</span></p></div>
        <div className="flex items-center gap-3 rounded-full border border-auth-border bg-auth-surface px-4 py-2 text-sm font-medium"><span className="flex size-8 items-center justify-center"><Image src="/tenant/home-Avatar.svg" alt="" width={32} height={32} /></span>Carlos Méndez</div>
      </header>
      {children}
    </main>
  </div>;
}

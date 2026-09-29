import "@fontsource-variable/inter";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export function AdminShell({ children }: { children: ReactNode }) {
  return <div className="min-h-dvh bg-auth-background font-auth text-auth-text md:flex">
    <aside aria-label="Panel Platform Admin" className="flex flex-col justify-between gap-8 bg-admin-sidebar p-6 md:sticky md:top-0 md:h-dvh md:w-[260px] md:shrink-0">
      <div className="flex flex-col gap-10">
        <div className="flex items-center gap-2.5 text-xl font-semibold text-auth-surface">
          <span className="flex size-9 items-center justify-center rounded-auth-input bg-auth-primary"><Image src="/admin/CircleX.svg" width={22} height={22} alt="" /></span>FrogPay
        </div>
        <nav aria-label="Administración" className="flex flex-wrap gap-2 text-sm font-medium md:flex-col">
          <Link href="/admin" className="flex items-center gap-3 rounded-auth-input px-4 py-3 text-auth-surface focus-visible:outline-auth-focus"><Image src="/admin/House.svg" width={18} height={18} alt="" />Inicio</Link>
          <Link href="/admin#tenants" className="flex items-center gap-3 rounded-auth-input bg-admin-active px-4 py-3 text-auth-surface focus-visible:outline-auth-focus"><Image src="/admin/Building.svg" width={18} height={18} alt="" />Tenants</Link>
          <button disabled title="Configuración no disponible en Sprint 1" className="flex cursor-not-allowed items-center gap-3 rounded-auth-input px-4 py-3 text-auth-muted"><Image src="/admin/Cog.svg" width={18} height={18} alt="" />Configuración</button>
        </nav>
      </div>
      <div className="hidden items-center gap-3 border-t border-admin-sidebar-border pt-4 md:flex">
        <span className="flex size-10 shrink-0 items-center justify-center"><Image src="/admin/UserAvatar.svg" width={32} height={32} alt="" /></span>
        <div><p className="text-sm font-medium text-auth-surface">Alejandro Silva</p><p className="text-xs text-auth-muted">Platform Admin</p></div>
      </div>
    </aside>
    <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-10">{children}</main>
  </div>;
}

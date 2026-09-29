"use client";

import Image from "next/image";
import Link from "next/link";
import { useTenants } from "./tenant-provider";

export function TenantList() {
  const { tenants } = useTenants();
  return <section id="tenants" className="flex flex-col gap-8">
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div><h1 className="text-[30px] leading-[38px] font-bold">Tenants</h1><p className="mt-1 text-sm leading-5 text-auth-secondary">Administra los clientes multi-tenant y accesos globales</p></div>
      <Link href="/admin/tenants/nuevo" className="flex items-center gap-2 rounded-auth-input bg-admin-sidebar px-5 py-2.5 text-sm font-medium text-auth-surface focus-visible:outline-auth-primary"><Image src="/admin/Plus.svg" alt="" width={16} height={16} />Nuevo tenant</Link>
    </header>
    <div role="region" aria-label="Listado de tenants" tabIndex={0} className="overflow-x-auto rounded-auth-card border border-auth-border bg-auth-surface shadow-auth-card focus-visible:outline-auth-primary">
      <table className="w-full min-w-[850px] table-fixed text-left text-sm text-auth-secondary">
        <caption className="sr-only">Tenants de FrogPay</caption>
        <colgroup><col /><col className="w-[28%]" /><col className="w-[120px]" /><col className="w-[170px]" /><col className="w-[100px]" /></colgroup>
        <thead className="bg-auth-background text-xs"><tr>{["Empresa", "Email del owner", "Estado", "Fecha de creación", "Acciones"].map(label => <th key={label} scope="col" className="whitespace-nowrap border-b border-auth-border px-6 py-3.5 font-normal last:text-right">{label}</th>)}</tr></thead>
        <tbody>{tenants.map(tenant => <tr key={tenant.id} className="border-b border-auth-border last:border-0 even:bg-auth-background">
          <th scope="row" className="break-words px-6 py-4 font-medium text-auth-text">{tenant.company}</th>
          <td className="break-words px-6 py-4">{tenant.email}</td>
          <td className="px-6 py-4"><span className={`inline-block rounded-full px-3 py-1 text-xs ${tenant.status === "Invitado" ? "bg-admin-warning-subtle text-admin-warning" : "bg-auth-success-subtle text-auth-success"}`}>{tenant.status}</span></td>
          <td className="px-6 py-4">{tenant.created}</td>
          <td className="px-4 py-2"><div className="flex justify-end gap-1">{[["EyeOff", "Desactivar"], ["FilePen", "Editar"]].map(([icon, label]) => <button key={icon} disabled title={`${label}: no disponible en Sprint 1`} aria-label={`${label} ${tenant.company}: no disponible`} className="flex size-8 shrink-0 cursor-not-allowed items-center justify-center"><Image src={`/admin/${icon}.svg`} width={18} height={18} alt="" /></button>)}</div></td>
        </tr>)}</tbody>
      </table>
    </div>
  </section>;
}

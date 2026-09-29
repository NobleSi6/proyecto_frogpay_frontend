"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { FormField } from "@/components/ui/form-field";
import { useTenants } from "./tenant-provider";

const fields = [
  ["company", "Nombre de empresa"], ["legalName", "Razón social"],
  ["taxId", "NIT / identificación fiscal"], ["address", "Dirección fiscal"], ["email", "Email del owner"],
] as const;
type Field = typeof fields[number][0];
const empty = { company: "", legalName: "", taxId: "", address: "", email: "" };

export function NewTenantModal() {
  const router = useRouter();
  const { tenants, addTenant } = useTenants();
  const dialog = useRef<HTMLDialogElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [values, setValues] = useState(empty);
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [status, setStatus] = useState<"default" | "loading" | "error" | "success">("default");
  const loading = status === "loading";
  const incomplete = fields.some(([name]) => !values[name].trim());

  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { element?.close(); document.body.style.overflow = previous; if (timer.current) clearTimeout(timer.current); };
  }, []);
  useEffect(() => { if (status === "success") title.current?.focus(); }, [status]);

  function error(name: Field) {
    if (!values[name].trim()) return "Este campo es requerido";
    if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) return "Ingresa un email válido";
    if (name === "email" && tenants.some(t => t.email.toLowerCase() === values.email.trim().toLowerCase())) return "Este email ya está registrado como owner";
    return undefined;
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading || status === "success") return;
    setTouched(Object.fromEntries(fields.map(([name]) => [name, true])));
    if (fields.some(([name]) => error(name))) { setStatus("error"); return; }
    setStatus("loading");
    // Simulación en memoria: no envía invitaciones ni llama a una API.
    timer.current = setTimeout(() => {
      addTenant(values.company.trim(), values.email.trim());
      setStatus("success"); timer.current = null;
    }, 1200);
  }
  const close = () => router.push("/admin");
  return <dialog ref={dialog} aria-labelledby="tenant-modal-title" onCancel={event => { event.preventDefault(); if (!loading) close(); }}
    className="fixed inset-0 m-auto max-h-[calc(100dvh-32px)] w-[calc(100%-32px)] max-w-[540px] overflow-y-auto rounded-auth-card bg-auth-surface p-6 font-auth text-auth-text shadow-admin-modal backdrop:bg-admin-overlay sm:p-8">
    <header className="mb-6 flex items-center justify-between gap-4">
      <h2 id="tenant-modal-title" ref={title} tabIndex={-1} className="text-xl leading-7 font-semibold outline-none">{status === "success" ? "Invitación enviada" : "Nuevo tenant"}</h2>
      <button type="button" disabled={loading} onClick={close} aria-label="Cerrar y volver al listado" className="flex size-7 shrink-0 items-center justify-center rounded focus-visible:outline-auth-primary disabled:opacity-50"><Image src="/admin/Close.svg" width={20} height={20} alt="" /></button>
    </header>
    {status === "success" ? <>
      <div className="flex flex-col items-center gap-5 py-4 text-center">
        <span className="flex size-16 items-center justify-center rounded-full border border-auth-primary bg-auth-success-subtle"><Image src="/admin/Success.svg" width={32} height={32} alt="" /></span>
        <div className="flex flex-col gap-2"><h3 className="text-xl leading-7 font-semibold">¡Invitación enviada con éxito!</h3><p role="status" className="break-all text-sm leading-5 text-auth-secondary">Invitación enviada a {values.email.trim()}</p><p className="text-sm text-auth-secondary">Para activar su cuenta como owner de {values.company.trim()}.</p></div>
      </div>
      <button onClick={close} className="mt-6 min-h-11 w-full rounded-auth-input bg-auth-primary px-5 text-sm font-medium text-auth-surface hover:bg-auth-hover focus-visible:outline-auth-focus">Volver al listado de tenants</button>
    </> : <form noValidate onSubmit={submit} aria-busy={loading} className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">{fields.map(([name, label]) => <FormField key={name} id={`tenant-${name}`} name={name} label={label} type={name === "email" ? "email" : "text"} required maxLength={name === "address" ? 250 : 150} autoComplete={name === "email" ? "email" : name === "company" ? "organization" : "off"} disabled={loading} value={values[name]} error={touched[name] ? error(name) : undefined} onBlur={() => setTouched(t => ({ ...t, [name]: true }))} onChange={e => { setValues(v => ({ ...v, [name]: e.target.value })); setStatus("default"); }} />)}</div>
      {status === "error" && <p role="alert" className="text-sm text-auth-error">Revisa los campos indicados antes de continuar.</p>}
      <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
        <button type="button" disabled={loading} onClick={close} className="min-h-11 rounded-auth-input border border-auth-border px-5 py-2.5 text-sm font-medium text-auth-secondary disabled:opacity-50">Cancelar</button>
        <button type="submit" disabled={loading || incomplete} className="flex min-h-11 items-center justify-center gap-2 rounded-auth-input bg-admin-secondary px-5 py-2.5 text-sm font-medium text-auth-surface focus-visible:outline-auth-focus disabled:cursor-not-allowed disabled:opacity-60">
          {loading && <Image src="/auth/loader.svg" width={16} height={16} alt="" className="motion-safe:animate-spin" />}{loading ? "Creando tenant…" : "Crear tenant y enviar invitación"}
        </button>
      </div>
      <span role="status" className="sr-only">{loading ? "Creando tenant y preparando invitación" : ""}</span>
    </form>}
  </dialog>;
}

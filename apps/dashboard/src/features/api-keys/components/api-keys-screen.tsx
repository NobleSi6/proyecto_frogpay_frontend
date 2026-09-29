"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FormField } from "@/components/ui/form-field";
import { useDemoCredentials } from "../demo-credentials";

const button = "min-h-11 rounded-auth-input px-5 py-2.5 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-auth-focus disabled:cursor-not-allowed disabled:opacity-50";

export function ApiKeysScreen() {
  const { credentials, acknowledge, regenerate } = useDemoCredentials();
  const [status, setStatus] = useState<"default" | "loading" | "success" | "error">("default");
  const [message, setMessage] = useState("");
  const [copyStatus, setCopyStatus] = useState<{ error: boolean; text: string } | null>(null);
  const [copying, setCopying] = useState(false);
  const failed = useRef(false);
  const copyFailed = useRef(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loading = status === "loading";

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  async function copy(value: string, label: string) {
    if (copying) return;
    setCopying(true); setCopyStatus(null);
    try {
      if (!copyFailed.current && new URLSearchParams(window.location.search).get("simularError") === "copia") { copyFailed.current = true; throw new Error("Demo"); }
      await navigator.clipboard.writeText(value);
      setCopyStatus({ error: false, text: `${label} copiada al portapapeles.` });
    } catch { setCopyStatus({ error: true, text: "No se pudo copiar. Selecciona el valor y cópialo manualmente, o vuelve a intentarlo." }); }
    finally { setCopying(false); }
  }
  function confirmRegeneration() {
    if (loading) return;
    setStatus("loading"); setMessage(""); setCopyStatus(null);
    timer.current = setTimeout(() => {
      timer.current = null;
      if (!failed.current && new URLSearchParams(window.location.search).get("simularError") === "regeneracion") {
        failed.current = true; setStatus("error"); setMessage("No se pudieron regenerar las credenciales. Las actuales siguen disponibles. Inténtalo de nuevo."); return;
      }
      try { regenerate(); setStatus("success"); setMessage("Credenciales regeneradas correctamente."); dialog.current?.close(); }
      catch { setStatus("error"); setMessage("No se pudieron generar las credenciales. Inténtalo de nuevo."); }
    }, 1200);
  }
  function credentialField(label: string, value: string, id: string) {
    return <FormField id={id} label={label} value={value} readOnly autoComplete="off" spellCheck={false} trailing={<button type="button" aria-label={`Copiar ${label}`} disabled={copying || loading} onClick={() => void copy(value, label)} className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-auth-input focus-visible:outline-auth-focus disabled:opacity-50"><Image src="/tenant/keys-Copy.svg" alt="" width={15.0012} height={15.0012} /></button>} />;
  }
  if (!credentials) return <p role="status">Cargando credenciales…</p>;
  return <>
    <section aria-labelledby="credentials-heading" className="flex flex-col gap-6 rounded-auth-card border border-auth-border bg-auth-surface p-6 shadow-auth-card sm:p-8">
      <header className="flex flex-wrap items-center justify-between gap-3"><h2 id="credentials-heading" className="text-xl leading-7 font-semibold">{credentials.secret ? "Credenciales generadas" : "Credenciales"}</h2>{credentials.secret && <span className="rounded-full bg-auth-success-subtle px-2.5 py-1 text-xs text-auth-success">Nueva</span>}</header>
      {credentials.secret && <div className="flex items-center gap-3 rounded-auth-input border border-tenant-warning-border bg-admin-warning-subtle p-4 text-sm font-medium text-admin-warning"><span className="flex size-5 shrink-0 items-center justify-center"><Image src="/tenant/keys-AlertCircle.svg" alt="" width={16.668} height={16.668} /></span><p>Guarda este secret ahora. No podrás volver a verlo.</p></div>}
      <div className="flex flex-col gap-4">{credentialField("API Key", credentials.apiKey, "api-key")}{credentials.secret && credentialField("API Secret", credentials.secret, "api-secret")}</div>
      {copyStatus && <p role={copyStatus.error ? "alert" : "status"} className={`text-sm ${copyStatus.error ? "text-auth-error" : "text-auth-success"}`}>{copyStatus.text}</p>}
      {credentials.secret ? <div><button disabled={loading || copying} onClick={() => { acknowledge(); setCopyStatus(null); setStatus("success"); setMessage("Secret oculto. Solo podrás obtener uno nuevo regenerando las credenciales."); }} className={`${button} bg-auth-primary text-auth-surface hover:bg-auth-hover`}>He guardado mi secret</button></div> : <div className="flex flex-col items-start gap-2.5"><button disabled={loading} onClick={() => { setStatus("default"); setMessage(""); dialog.current?.showModal(); }} className={`${button} border border-auth-error-border text-auth-error`}>Regenerar credenciales</button><p className="text-xs leading-4 text-auth-error">Esto invalidará las credenciales actuales inmediatamente, afectando tus integraciones activas.</p></div>}
      {status === "success" && <p role="status" className="text-sm text-auth-success">{message}</p>}
    </section>
    <dialog ref={dialog} aria-labelledby="regenerate-title" aria-describedby="regenerate-description" onCancel={event => { if (loading) event.preventDefault(); }} className="fixed inset-0 m-auto max-h-[calc(100dvh-32px)] w-[calc(100%-32px)] max-w-[540px] overflow-y-auto rounded-auth-card bg-auth-surface p-6 font-auth text-auth-text shadow-admin-modal backdrop:bg-admin-overlay sm:p-8">
      <h2 id="regenerate-title" className="text-xl leading-7 font-semibold">¿Regenerar credenciales?</h2>
      <p id="regenerate-description" className="mt-4 text-sm leading-5 text-auth-secondary">Las credenciales actuales dejarán de funcionar. Deberás actualizar tus integraciones y guardar el nuevo secret cuando aparezca.</p>
      {status === "error" && <p role="alert" className="mt-4 text-sm text-auth-error">{message}</p>}
      <div className="mt-6 flex flex-wrap justify-end gap-3"><button disabled={loading} onClick={() => dialog.current?.close()} className={`${button} border border-auth-border text-auth-secondary`}>Cancelar</button><button disabled={loading} onClick={confirmRegeneration} className={`${button} flex items-center gap-2 bg-auth-error text-auth-surface`}>{loading && <Image src="/auth/loader.svg" width={16} height={16} alt="" className="motion-safe:animate-spin" />}{loading ? "Regenerando…" : status === "error" ? "Reintentar" : "Confirmar regeneración"}</button></div>
      <p role="status" className="sr-only">{loading ? "Regenerando credenciales" : ""}</p>
    </dialog>
  </>;
}

"use client";

import "@fontsource-variable/inter";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { PasswordField } from "./password-field";

type Status = "default" | "loading" | "success" | "invalid" | "disabled";
const actionClass = "flex min-h-12 w-full items-center justify-center rounded-auth-input bg-auth-primary px-4 text-center text-sm leading-5 font-medium text-auth-surface outline-none enabled:hover:bg-auth-hover focus-visible:ring-3 focus-visible:ring-auth-focus disabled:cursor-not-allowed disabled:bg-auth-border disabled:text-auth-muted disabled:opacity-[0.72]";

// Escenarios de demostración, no validación de tokens ni autorización real.
function demoStatus(token: string): Status {
  if (["expirado", "usado", "invalido"].includes(token)) return "invalid";
  if (token === "restringido") return "disabled";
  return "default";
}

export function ActivationScreen({ token }: { token: string }) {
  const [status, setStatus] = useState<Status>(() => demoStatus(token));
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [touched, setTouched] = useState({ password: false, confirmation: false });
  const [requestHelp, setRequestHelp] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const passwordError = touched.password && !password ? "La nueva contraseña es obligatoria." : undefined;
  const confirmationError = touched.confirmation
    ? !confirmation ? "Confirma tu contraseña." : confirmation !== password ? "Las contraseñas no coinciden." : undefined
    : undefined;
  const valid = Boolean(password && confirmation && password === confirmation);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  useEffect(() => { if (status !== "default") heading.current?.focus(); }, [status]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched({ password: true, confirmation: true });
    if (!valid || status !== "default") return;
    setStatus("loading");
    // Simulación local. Nunca envía ni persiste las contraseñas.
    timer.current = setTimeout(() => {
      setPassword(""); setConfirmation(""); setStatus("success"); timer.current = null;
    }, 1200);
  }

  const stateContent = {
    loading: { title: "Validando invitación", description: "Estamos verificando el acceso y preparando tu cuenta para activarla.", icon: "loader", background: "bg-auth-background" },
    success: { title: "Cuenta activada", description: "Tu acceso fue habilitado correctamente. Ya puedes iniciar sesión con tu nueva contraseña.", icon: "check", background: "bg-auth-success-subtle" },
    invalid: { title: "Enlace inválido", description: "Este enlace de activación ha expirado o ya fue utilizado. Contacta al administrador de FrogPay para solicitar una nueva invitación.", icon: "alert", background: "bg-auth-error-subtle" },
    disabled: { title: "Acceso restringido", description: "Solo el Tenant Owner puede activar esta cuenta. Si no eres el propietario, no podrás continuar.", icon: "lock", background: "bg-auth-background" },
  };
  const state = status === "default" ? null : stateContent[status];

  return (
    <main className="flex min-h-dvh items-start justify-center bg-auth-background px-4 py-8 font-auth text-auth-text sm:px-20 sm:py-12">
      {state ? (
        <section aria-labelledby="activation-title" aria-busy={status === "loading"} className="flex w-full max-w-[440px] flex-col gap-4 rounded-auth-invitation bg-auth-surface p-6 shadow-auth-card ring-1 ring-auth-border ring-inset">
          <div className="flex flex-col gap-3">
            <span className={`flex size-14 items-center justify-center rounded-full ${state.background}`}>
              <Image src={`/auth/activation/${state.icon}.svg`} alt="" width={status === "invalid" ? 23.3352 : 24} height={status === "invalid" ? 23.3352 : 24} className={status === "loading" ? "motion-safe:animate-spin" : ""} />
            </span>
            <div className="flex flex-col gap-1.5">
              <h1 id="activation-title" ref={heading} tabIndex={-1} className="text-xl leading-7 font-semibold outline-none">{state.title}</h1>
              <p className="text-sm leading-5 text-auth-secondary">{state.description}</p>
            </div>
          </div>
          {status === "success" && <Link href="/login" className={`${actionClass} hover:bg-auth-hover`}>Iniciar sesión</Link>}
          {status === "loading" && <p role="status" className="text-center text-sm leading-5 text-auth-secondary">No cierres esta ventana</p>}
          {(status === "invalid" || status === "disabled") && <>
            <button type="button" className={actionClass} onClick={() => setRequestHelp(true)}>
              {status === "invalid" ? "Solicitar nueva invitación" : "Contactar a soporte"}
            </button>
            {requestHelp && <p role="status" className="text-sm leading-5 text-auth-secondary">Contacta al administrador de FrogPay para recibir una nueva invitación. No se ha enviado ninguna solicitud desde esta pantalla.</p>}
          </>}
        </section>
      ) : (
        <section aria-labelledby="activation-title" className="flex w-full max-w-[440px] flex-col gap-6 rounded-auth-invitation bg-auth-surface p-6 shadow-auth-card ring-1 ring-auth-border ring-inset sm:p-8">
          <header className="flex flex-col items-start gap-4">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-auth-input bg-auth-primary"><Image src="/auth/brand-mark.svg" alt="" width={22} height={22} /></span>
              <span className="text-xl leading-7 font-semibold">FrogPay</span>
            </div>
            <div className="flex flex-col gap-2">
              <h1 id="activation-title" className="text-[30px] leading-[38px] font-bold">Activa tu cuenta</h1>
              <p className="text-sm leading-5 text-auth-secondary">Solo el Tenant Owner puede activar la cuenta desde esta invitación. Configura tu contraseña para acceder a FrogPay.</p>
            </div>
            <span className="flex items-center gap-2 rounded-full bg-auth-success-subtle px-3 py-2 text-xs leading-4 text-auth-success">
              <Image src="/auth/activation/shield.svg" alt="" width={16} height={16} />Acceso exclusivo por invitación
            </span>
          </header>
          <form noValidate onSubmit={submit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <PasswordField id="new-password" name="new-password" label="Nueva contraseña" sizeVariant="activation" autoComplete="new-password" required value={password} error={passwordError} placeholder="••••••••••••" onBlur={() => setTouched(t => ({ ...t, password: true }))} onChange={e => setPassword(e.target.value)} />
              <PasswordField id="confirm-password" name="confirm-password" label="Confirmar contraseña" sizeVariant="activation" autoComplete="new-password" required value={confirmation} error={confirmationError} placeholder="••••••••••••" onBlur={() => setTouched(t => ({ ...t, confirmation: true }))} onChange={e => { setConfirmation(e.target.value); setTouched(t => ({ ...t, confirmation: true })); }} />
              {valid && <p role="status" className="text-xs leading-4 text-auth-success">Las contraseñas coinciden.</p>}
            </div>
            <div className="flex flex-col gap-3">
              <button type="submit" disabled={!valid} className={actionClass}>Activar cuenta</button>
              <p className="text-center text-xs leading-4 text-auth-secondary">Solo el Tenant Owner puede completar esta invitación.</p>
            </div>
          </form>
        </section>
      )}
    </main>
  );
}

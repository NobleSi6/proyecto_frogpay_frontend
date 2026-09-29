"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { AuthField } from "./auth-field";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<"default" | "loading" | "error">("default");
  const [showRecovery, setShowRecovery] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loading = status === "loading";
  const incomplete = !email.trim() || !password;

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading || incomplete) return;
    setStatus("loading");
    // Solo demostración visual: no valida, guarda ni envía credenciales.
    timer.current = setTimeout(() => {
      setStatus("error");
      timer.current = null;
    }, 1200);
  }

  return (
    <form onSubmit={submit} aria-busy={loading} className="flex flex-col gap-7">
      <div className="flex flex-col gap-5">
        <AuthField
          id="email" name="email" type="email" label="Email" autoComplete="username"
          autoCapitalize="none" spellCheck={false} required disabled={loading}
          placeholder="nombre@empresa.com" value={email} reserveErrorSpace
          error={status === "error" ? "Credenciales incorrectas" : undefined}
          onChange={(event) => { setEmail(event.target.value); setStatus("default"); }}
        />
        <AuthField
          id="password" name="password" type={showPassword ? "text" : "password"}
          label="Contraseña" autoComplete="current-password" required disabled={loading}
          value={password} placeholder="••••••••••••"
          onChange={(event) => { setPassword(event.target.value); setStatus("default"); }}
          trailing={
            <button
              type="button" aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              aria-pressed={showPassword} aria-controls="password" disabled={loading}
              onClick={() => setShowPassword((visible) => !visible)}
              className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-auth-input outline-none focus-visible:ring-2 focus-visible:ring-auth-focus disabled:cursor-not-allowed"
            >
              <Image src="/auth/eye.svg" alt="" width={18} height={18} />
            </button>
          }
        />
      </div>
      <div className="flex flex-col items-center gap-4">
        <button
          type="submit" disabled={incomplete || loading}
          aria-label={loading ? "Procesando" : "Iniciar sesión"}
          className={`flex h-[46px] w-full items-center justify-center gap-2 rounded-auth-input text-sm leading-5 font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-auth-focus disabled:cursor-not-allowed motion-reduce:transition-none ${incomplete ? "bg-auth-border text-auth-muted opacity-[0.72]" : "bg-auth-primary text-auth-surface enabled:hover:bg-auth-hover"}`}
        >
          {loading && <Image src="/auth/loader.svg" alt="" width={16} height={16} className="motion-safe:animate-spin" />}
          <span role="status" aria-live="polite">{loading ? "Procesando" : "Iniciar sesión"}</span>
        </button>
        <a
          href="#recuperar-acceso" aria-expanded={showRecovery} aria-controls="recuperar-acceso"
          onClick={(event) => { event.preventDefault(); setShowRecovery((visible) => !visible); }}
          className="rounded text-center text-sm leading-5 font-medium text-auth-success outline-none hover:underline focus-visible:ring-2 focus-visible:ring-auth-focus"
        >
          ¿Olvidaste tu contraseña?
        </a>
        <p id="recuperar-acceso" hidden={!showRecovery} role="status" className="text-center text-sm leading-5 text-auth-secondary">
          La recuperación de contraseña aún no está disponible.
        </p>
      </div>
    </form>
  );
}

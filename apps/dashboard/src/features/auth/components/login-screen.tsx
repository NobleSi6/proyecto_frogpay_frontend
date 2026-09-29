import "@fontsource-variable/inter";
import Image from "next/image";
import { LoginForm } from "./login-form";

export function LoginScreen() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-auth-background px-4 py-8 font-auth text-auth-text sm:p-20">
      <section aria-labelledby="login-title" className="flex w-full max-w-[440px] flex-col gap-7 rounded-auth-card bg-auth-surface p-6 shadow-auth-card ring-1 ring-auth-border ring-inset sm:p-10">
        <header className="flex flex-col items-center gap-5 text-center">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-auth-input bg-auth-primary">
              <Image src="/auth/brand-mark.svg" alt="" width={22} height={22} />
            </span>
            <span className="text-xl leading-7 font-semibold">FrogPay</span>
          </div>
          <div className="flex w-full flex-col gap-1.5">
            <h1 id="login-title" className="text-2xl leading-8 font-semibold">Inicia sesión</h1>
            <p className="text-sm leading-5 text-auth-secondary">
              Acceso exclusivo para Platform Admin y Tenant Owner
            </p>
          </div>
        </header>
        <LoginForm />
      </section>
    </main>
  );
}

import Image from "next/image";

export function TenantHome() {
  return <section aria-labelledby="empty-payments" className="flex min-h-[420px] flex-1 flex-col items-center justify-center gap-6 rounded-auth-card border border-auth-border bg-auth-surface p-6 sm:p-20">
    <span className="flex size-20 shrink-0 items-center justify-center rounded-full bg-tenant-empty"><Image src="/tenant/home-CreditCard1.svg" alt="" width={30} height={27} /></span>
    <div className="flex w-full max-w-[480px] flex-col gap-2 text-center"><h2 id="empty-payments" className="text-xl leading-7 font-semibold">Aún no tienes pagos</h2><p className="text-sm leading-5 text-auth-secondary">Cuando tus clientes realicen pagos a través de FrogPay, aparecerán aquí de forma automática y detallada.</p></div>
    <button disabled title="Documentación API pendiente" className="mt-2 min-h-11 cursor-not-allowed rounded-auth-input border border-auth-border px-4 text-sm font-medium text-auth-secondary">Ver documentación API</button>
  </section>;
}

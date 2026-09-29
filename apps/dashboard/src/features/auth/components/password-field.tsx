"use client";

import Image from "next/image";
import { useState, type ComponentProps } from "react";
import { AuthField } from "./auth-field";

export function PasswordField(props: Omit<ComponentProps<typeof AuthField>, "type" | "trailing">) {
  const [visible, setVisible] = useState(false);
  return <AuthField {...props} type={visible ? "text" : "password"} trailing={
    <button type="button" disabled={props.disabled} aria-controls={props.id}
      aria-label={`${visible ? "Ocultar" : "Mostrar"}: ${props.label.toLowerCase()}`}
      aria-pressed={visible} onClick={() => setVisible(!visible)}
      className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-auth-input outline-none focus-visible:ring-2 focus-visible:ring-auth-focus disabled:cursor-not-allowed">
      <Image src="/auth/eye.svg" width={18} height={18} alt="" />
    </button>
  } />;
}

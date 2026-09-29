"use client";

import { useSyncExternalStore } from "react";

type Credentials = { apiKey: string; secret: string | null };
const storageKey = "frogpay.demo.public-api-key.v1";
let current: Credentials | null = null;
const listeners = new Set<() => void>();
function createCredentials(): Credentials {
  return { apiKey: `pk_demo_${crypto.randomUUID().replaceAll("-", "")}`, secret: `sk_demo_${crypto.randomUUID().replaceAll("-", "")}` };
}
function getSnapshot() {
  if (!current) {
    let saved: string | null = null;
    try { saved = sessionStorage.getItem(storageKey); } catch { /* La demo funciona en memoria si el navegador bloquea el almacenamiento. */ }
    current = saved?.startsWith("pk_demo_") ? { apiKey: saved, secret: null } : createCredentials();
  }
  return current;
}
function subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; }
function serverSnapshot() { return null; }
function update(value: Credentials) {
  current = value;
  // Persistir únicamente la clave pública ficticia. Nunca el secret.
  try { sessionStorage.setItem(storageKey, value.apiKey); } catch { /* Se conserva en memoria. */ }
  listeners.forEach(listener => listener());
}
export function useDemoCredentials() {
  const credentials = useSyncExternalStore(subscribe, getSnapshot, serverSnapshot);
  return {
    credentials,
    acknowledge: () => { const value = getSnapshot(); update({ apiKey: value.apiKey, secret: null }); },
    regenerate: () => update(createCredentials()),
  };
}

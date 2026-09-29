# FrogPay — Frontend base

## Setup disponible (Sprint 1)

La aplicación base está en `apps/dashboard`, con Next.js App Router, TypeScript
y Tailwind CSS. Requiere Node.js 22 o superior y npm.

```sh
cd apps/dashboard
npm ci
npm run dev
```

Rutas mínimas: `/login`, `/activar-cuenta/[token]` (por ejemplo,
`/activar-cuenta/demo`), `/dashboard` y `/admin`. Login, activación,
Platform Admin y Tenant Owner implementan las pantallas de Figma.
La ruta `/` todavía no tiene landing y devuelve 404. No hay autenticación,
protección por rol, registro público ni conexión con backend. No se requieren
variables de entorno para ejecutar este setup.

Validación: `npm run lint`, `npm run typecheck` y `npm run build`.
Para servir la compilación: `npm start`.

Tailwind utiliza `postcss.config.mjs` y `src/app/globals.css`.
Los tokens de `src/styles/tokens.css` se exponen a Tailwind mediante
`@theme inline`. Los tokens `auth-*` reproducen Figma y se aplican al login;
los valores base de las demás pantallas se conservan. Activación reutiliza esos
tokens y añade colores sutiles para los estados de éxito y error.
No se necesita `tailwind.config.ts` con esta configuración de Tailwind 4.
Las carpetas vacías se conservan en Git con `.gitkeep`.

TypeScript 5 y ESLint 9 se fijan por compatibilidad con los plugins de lint de Next.js.
ESLint 9 está fuera de soporte; revisar la actualización cuando los plugins admitan ESLint 10.

El README de la raíz describe la arquitectura futura. shadcn/ui, TanStack Query y NextAuth aún no están instalados.

## Login — TSK-FRONT2-201

Referencia: [login-screen en Figma](https://www.figma.com/design/idzCMl3iYVLf9dyOqw6Ywk/FrogPay?node-id=9-851).
Estados complementarios del Design System: botones `9:440` e inputs `9:479`.
Inter se sirve localmente con `@fontsource-variable/inter`. Los SVG originales
de Figma se guardan en `public/auth/` (logo, ojo y loader).

Comprobación manual:

1. Abrir `/login`: campos vacíos y botón deshabilitado.
2. Escribir un email válido y una contraseña de prueba: botón habilitado.
3. Mostrar y ocultar la contraseña con el botón del ojo (también con teclado).
4. Enviar: muestra «Procesando» y bloquea los campos durante 1,2 segundos.
5. Aparece «Credenciales incorrectas», como en el mockup. Editar un campo borra el error.
6. El enlace de recuperación muestra que la función aún no está disponible.

El envío es una **simulación visual local**, siempre termina en error y no
valida, envía ni persiste credenciales. No hay servicio de autenticación ni
sesión, y no se navega al dashboard. Sustituir esta simulación cuando se integre
el contrato real de autenticación. No existe registro público.

La tarjeta mide 440 × 534 px en escritorio (viewport de Figma: 1440 × 900).
En móvil se adapta al ancho disponible con márgenes de 16 px, padding de 24 px
y campos de 16 px para evitar zoom automático al escribir.

## Activación de cuenta — simulación local

Referencia: [activate-account en Figma](https://www.figma.com/design/idzCMl3iYVLf9dyOqw6Ywk/FrogPay?node-id=9-1237).
Se muestra un estado a la vez; la columna «Estados del flujo» es documentación
del mockup, no una segunda columna de la aplicación.

- `/activar-cuenta/demo`: formulario inicial. Los campos vacíos se señalan al
  perder el foco; confirmar una contraseña distinta muestra el error de coincidencia.
  El botón se habilita con dos contraseñas no vacías e iguales.
- Al enviar, aparece «Validando invitación» durante 1,2 segundos y después
  «Cuenta activada», con enlace a `/login`. Se borran las contraseñas del estado.
- `/activar-cuenta/expirado`, `/activar-cuenta/usado` y `/activar-cuenta/invalido`:
  enlace inválido. «Solicitar nueva invitación» muestra instrucciones para
  contactar al administrador; no envía ninguna solicitud.
- `/activar-cuenta/restringido`: variante «Acceso restringido» del mockup.
- Los demás tokens muestran el formulario de demostración; esto no valida
  tokens, permisos ni invitaciones reales. Recargar reinicia la simulación.

No se envían ni persisten contraseñas ni se crean cuentas reales. El formulario
reutiliza `AuthField` con una variante de 48 px y `PasswordField` para los dos
controles de visibilidad. La variante por defecto de `AuthField` mantiene el login.
Los iconos de estado originales están en `public/auth/activation/`.

## Platform Admin — Sprint 1

- `/admin`: tabla con cinco tenants de ejemplo y badges Invitado/Activo.
- `/admin/tenants/nuevo`: modal de alta sobre la tabla, también accesible por URL directa.
- Campos obligatorios: empresa, razón social, identificación fiscal, dirección y email.
  No se impone un formato fiscal específico de un país. El email debe tener formato válido
  y no coincidir con un owner del listado (sin distinguir mayúsculas).
- Botón deshabilitado mientras faltan campos; errores al perder foco o enviar.
  Para probar duplicado, usar `carlos@acmepagos.com` con los demás campos completos.
- Un email nuevo simula carga durante 1,2 segundos y muestra
  «Invitación enviada a [email]». El tenant se añade como Invitado con fecha local.
- Volver, Cancelar, cerrar o Escape regresan a `/admin`; el modal mantiene el foco
  dentro y bloquea acciones mientras se completa la simulación.
- El estado vive en memoria en el layout de admin. Se conserva al navegar dentro
  del panel, pero se reinicia al recargar. No hay API, persistencia, sesión real
  ni envío de emails. La confirmación es únicamente una demostración visual.
- Inicio y Tenants llevan al listado. Configuración, edición y desactivación se
  muestran deshabilitadas porque están fuera de este alcance.
- En móvil la navegación se adapta y la tabla tiene desplazamiento horizontal interno.

Mockups: `9:878` (listado), `9:981` (formulario) y `9:1118` (éxito),
en el mismo archivo de Figma. SVG originales en `public/admin/`.
`components/ui/form-field.tsx` reutiliza el campo de auth; el antiguo `AuthField`
lo reexporta para conservar login y activación sin cambios visuales.

## Tenant Owner — Sprint 1

- `/dashboard`: Acme Pagos / Carlos Méndez y empty state «Aún no tienes pagos».
  Sin métricas ni gráficos. Inicio y API Keys navegan; Pagos, Webhooks,
  Configuración y documentación API permanecen deshabilitados fuera de alcance.
- `/dashboard/api-keys`: credenciales ficticias `pk_demo_` y `sk_demo_`,
  copiables con Clipboard API. La pantalla muestra una sola variante de Figma
  a la vez: revelado inicial o clave pública después del guardado.
- «He guardado mi secret» elimina el secret del estado y del DOM. La API Key
  ficticia se conserva en `sessionStorage` para mantener el secret oculto incluso
  tras recargar. Nunca se persiste el secret. Si el navegador bloquea almacenamiento,
  la simulación funciona solo en memoria hasta recargar.
- Regenerar requiere confirmación. Cancelar conserva las credenciales; confirmar
  simula 1,2 segundos de carga y genera una pareja nueva. Tras recargar se conserva
  solo la API Key, incluso si no se había confirmado el guardado del nuevo secret.
- Error de regeneración reproducible: abrir
  `/dashboard/api-keys?simularError=regeneracion`, guardar el secret si está visible
  y confirmar una regeneración. El primer intento falla sin alterar la clave;
  «Reintentar» tiene éxito. El parámetro es solo una ayuda de QA local.
- Error de copia reproducible: `/dashboard/api-keys?simularError=copia`.
  La primera copia falla y muestra instrucciones; reintentar usa el portapapeles.
- No hay credenciales reales, API, autenticación ni invalidación de integraciones.
  Los nombres del tenant y usuario son datos del mockup.

Mockups `9:1314` y `9:1370`. El modal de regeneración utiliza los tokens y el
patrón de diálogo existente. SVG de Figma en `public/tenant/`.

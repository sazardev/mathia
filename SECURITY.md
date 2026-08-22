# Política de seguridad

## Reportar una vulnerabilidad

Reporta por el canal privado del maintainer (GitHub Security Advisories o contacto directo).
No abras issues públicas con detalles de vulnerabilidades.

Respuesta esperada: acuse de recibo en 72h, evaluación en 7 días.

## Reglas de secretos

- Cero secretos en el repositorio. Gitleaks bloquea commits y pusheos con secretos detectados.
- Configuración sensible solo vía variables de entorno o archivos `.env*` ignorados por git.
- Si un secreto se filtró al historial: rotarlo inmediatamente (el borrado del historial no revoca nada).

## Superficie de ataque de la app

- Tauri 2: revisar capabilities en `src-tauri/capabilities/` — principio de mínimo privilegio.
- CSP actualmente desactivada (`"csp": null` en `tauri.conf.json`) — pendiente de endurecer (ver `memory.md`).
- Plugin `opener`: restringir dominios permitidos si se usa para abrir URLs externas.

## Cadena de suministro

- Lockfiles (`package-lock.json`, `Cargo.lock`) versionados y protegidos.
- `npm audit` y `cargo audit` en CI.
- No aceptar upgrades de dependencias fuera de alcance sin revisión humana.

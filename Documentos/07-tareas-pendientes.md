# 1.7 — Tareas pendientes del Analytics Dashboard

> **Tipo C — Marketplace**

Priorización de tareas para completar la integración del dashboard con las apps Buyer, Seller y Payments.

---

## Prioridad crítica (bloqueante para productivo)

| # | Tarea | Archivos | ¿Por qué? | Depende de otra app? |
|---|-------|----------|-----------|---------------------|
| 1 | Arreglar `vercel.json` — tiene `ANALYTICS_API_KEY` que ya no existe | `vercel.json` | Si deployan, las env vars van a fallar | No |
| 2 | Fix tipado de Clerk metadata — `sessionClaims.metadata` no es `string[]` | `middleware.ts:16` | Rompe la validación de admin, nadie puede entrar | No |
| 3 | Unificar auth header — dashboard usa `x-api-key`, contrato dice `Authorization: Bearer` | `lib/api.ts` + coordinación equipo | Si no coinciden, las apps rechazan requests | Sí |
| 4 | Divisiones por cero — varios KPIs dividen sin checkear cero | `lib/metrics.ts`, varias pages | Muestra `NaN` si la app devuelve 0 | No |

---

## Prioridad alta (mejora UX y robustez)

| # | Tarea | Archivos | Esfuerzo | Depende de otra app? |
|---|-------|----------|----------|---------------------|
| 5 | Eliminar doble fetch — layout y pages llaman `fetchDashboardData()` por separado | `layout.tsx`, todas las pages | medio | No |
| 6 | Validación runtime con Zod — si una app devuelve JSON válido pero con campos faltantes, crashea | `lib/api.ts` + nuevo schema | medio | No |
| 7 | Indicadores visuales de datos mock vs reales en las cards | Topbar + pages | bajo | No |
| 8 | Agregar `error.tsx` — página de error amigable si `fetchDashboardData()` falla | `app/dashboard/error.tsx` | bajo | No |
| 9 | Agregar `afterSignInUrl="/dashboard/resumen"` en sign-in | `app/sign-in/page.tsx` | bajo | No |
| 10 | Skeletons / loading states con `<Suspense>` en todas las pages | Todas las pages | medio | No |
| 11 | Mensajes de error visibles por sección cuando una app offline | Todas las pages | medio | No |

---

## Prioridad media (limpieza e higiene)

| # | Tarea | Archivos | Esfuerzo | Depende de otra app? |
|---|-------|----------|----------|---------------------|
| 12 | Eliminar dead code — `EstadosPedidosChart.tsx` no se importa | `components/charts/` | bajo | No |
| 13 | Sacar comentario residual `// agregá esto` | `Topbar.tsx:72` | bajo | No |
| 14 | `FetchErrorReason` duplicado — está en `types.ts` y `api.ts` | `lib/types.ts`, `lib/api.ts` | bajo | No |
| 15 | `formatARS` duplicado — en `IngresosChart.tsx` y `metrics.ts` | `IngresosChart.tsx` | bajo | No |
| 16 | Mensaje "Datos parciales" → "Sin conexión" cuando todo offline | `Topbar.tsx` | bajo | No |
| 17 | `any` type suppression en `EstadosPedidosChart.tsx` | `EstadosPedidosChart.tsx:75` | bajo | No |
| 18 | Mapeo redundante en resumen/page.tsx (`.map()` sobre datos ya formateados) | `resumen/page.tsx:138` | bajo | No |
| 19 | Sin estado vacío en `DataTable.tsx` | `DataTable.tsx` | bajo | No |
| 20 | Fetch innecesario — catálogo y comunidad llaman `fetchDashboardData()` completo | `catalogo/page.tsx`, `comunidad/page.tsx` | bajo | No |
| 21 | Sin `not-found.tsx` | `app/dashboard/not-found.tsx` | bajo | No |
| 22 | `next.config.ts` vacío | `next.config.ts` | bajo | No |
| 23 | `globals.css` — `font-family` no usa variable CSS declarada en `@theme` | `app/globals.css` | bajo | No |
| 24 | `Promise.all` bloqueante — app lenta retrasa a las demás | `lib/api.ts:140` | medio | No |
| 25 | `revalidate: 60` sin garantía de caché en server-to-server | `lib/api.ts:71` | bajo | No |
| 26 | Matcher del middleware incluye `/api/(.*)` sin API routes | `middleware.ts:5` | bajo | No |
| 27 | Timeout hardcodeado — `FETCH_TIMEOUT_MS = 5000` podría ser env var | `lib/api.ts` | bajo | No |

---

## Prioridad baja (testing y DX)

| # | Tarea | Archivos | Esfuerzo | Depende de otra app? |
|---|-------|----------|----------|---------------------|
| 28 | Tests unitarios de `metrics.ts` — `formatARS()`, métricas son funciones puras | `lib/__tests__/metrics.test.ts` | medio | No |
| 29 | Tests de `api.ts` — mockear fetch, probar `safeGet()` en cada escenario | `lib/__tests__/api.test.ts` | medio | No |
| 30 | Preparar adapter layer para cuando las APIs reales tengan shape distinto a `types.ts` | `lib/adapters.ts` | medio | Sí |
| 31 | `url_not_configured` se trata como offline — podría tener estado "modo demo" | `lib/api.ts` | bajo | No |
| 32 | Deltas hardcodeados en KPIs (`"+18% vs mes anterior"`) — calcular con datos reales | Todas las pages | medio | No |
| 33 | Responsive mobile — sidebar sin menú hamburguesa | `Sidebar.tsx` | medio | No |
| 34 | Evaluar si `sign-up/page.tsx` es necesaria (dashboard solo-admin) | `app/sign-up/page.tsx` | bajo | No |

---

## Resumen por dependencia

| Dependencia | Cantidad de tareas |
|-------------|-------------------|
| No dependen de otras apps | **32** |
| Dependen de otras apps (coordinación equipo) | **2** (#3, #30) |

De las 34 tareas identificadas, solo **2 requieren coordinación con el equipo**. Todo lo demás se puede implementar hoy contra los mocks existentes.

[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/l2PpCgMp)
# analytics-dashboard

Aplicación **Analytics Dashboard** del [Proyecto IAW 2026](https://iaw-2026.github.io/proyecto/) — comisión `<!-- completar -->`.

Herramienta de reportes consolidados (Etapa 3): métricas del sistema completo consultando las APIs de cada webapp individual.

---

Enunciado completo: <https://iaw-2026.github.io/proyecto/>

# Brotes Analytics Dashboard

## Deploy de producción
[Link al deploy](https://etapa-3-analytics-dashboard-brotes.vercel.app/)
Pendiente — la aplicación aún no se encuentra deployada.

## Usuarios disponibles para pruebas

| Rol | Email | Contraseña |
| --- | ----- | ---------- |
| Administrador | `admin+clerk_test@iaw.com` | `iawuser#` |

El inicio de sesión se realiza mediante Clerk. Solo los usuarios con rol `admin` pueden acceder al dashboard. Al ingresar a la aplicación se redirige a la página de inicio de sesión (`/sign-in`).

## Instrucciones de uso

### Evaluación offline

Si las apps del sistema (Buyer, Seller, Payments) no están disponibles, el dashboard opera con datos mock completos para todas las secciones. Para verificar el comportamiento con datos reales, configurar las URLs y API keys correspondientes en `.env.local`.

## Descripción del proyecto

**Brotes Analytics Dashboard** es la herramienta de reportes consolidados (Etapa 3) del proyecto **Brotes**, un marketplace de plantas y productos de jardinería desarrollado en el marco del Proyecto IAW 2026. El dashboard consume las APIs de analytics de las tres aplicaciones que componen el sistema —Buyer App, Seller App y Payments App— y presenta métricas clave en un panel de administración unificado.

La aplicación está construida con **Next.js 16** (App Router), **React 19**, **TypeScript**, **Tailwind CSS v4** y **Clerk** para autenticación y autorización. Los gráficos se renderizan con **Recharts** y las respuestas de las APIs se validan en runtime con **Zod**. El diseño sigue la identidad visual de Brotes con una paleta de verdes y tonos tierra.

El dashboard cuenta con cinco secciones principales: **Resumen General** (KPIs globales y evolución de ingresos), **Ventas y Pedidos** (métricas de facturación y transacciones), **Usuarios** (actividad de compradores y vendedores), **Catálogo** (rendimiento de productos y categorías) y **Comunidad** (actividad en foros). Cada sección incluye indicadores clave, gráficos y tablas con datos actualizados.

Cuando las APIs de las aplicaciones del sistema no están disponibles, el dashboard utiliza datos mock completos que permiten evaluar toda la funcionalidad sin dependencias externas. Esta decisión de diseño asegura que la aplicación pueda ser revisada en cualquier entorno sin requerir la infraestructura completa del sistema Brotes.

## Notas para la corrección

- **Datos mock vs. reales**: El dashboard funciona con datos mock cuando las apps del sistema no están disponibles. Esto permite evaluar la interfaz completa sin necesidad de levantar los otros servicios. No hay un indicador visual de "mock" en la UI (es intencional, para que la experiencia sea idéntica).
- **Estado de conectividad**: La Topbar muestra indicadores de estado (online/offline) para cada una de las tres apps del sistema.
- **API de estado**: Existe un endpoint `/api/status` que devuelve la conectividad con cada app, útil para monitoreo.
- **Responsive**: El dashboard está optimizado para desktop. La navegación lateral y el layout pueden no comportarse correctamente en pantallas pequeñas.
- **Limitación conocida**: El campo `sessionClaims.metadata` en el middleware tiene un tipo _any_ porque el tipado de Clerk no expone correctamente la estructura de metadatos personalizados.
- **Commits de debug**: Existen algunos commits con `console.log` y logs de depuración que no fueron eliminados del historial. No afectan la funcionalidad.

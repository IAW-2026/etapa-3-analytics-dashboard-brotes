import type { BuyerStats, SellerStats, PaymentsStats, DashboardData } from "./types";
import { mockBuyerStats, mockSellerStats, mockPaymentsStats } from "./mock-data";
import { buyerStatsSchema, sellerStatsSchema, paymentsStatsSchema } from "./schemas";
import type { ZodSchema } from "zod";

const BUYER_APP_URL = process.env.BUYER_APP_URL;
const SELLER_APP_URL = process.env.SELLER_APP_URL;
const PAYMENTS_APP_URL = process.env.PAYMENTS_APP_URL;

const BUYER_APP_API_KEY = process.env.BUYER_SERVICE_API_KEY;
const SELLER_APP_API_KEY = process.env.SELLER_SERVICE_API_KEY;
const PAYMENTS_APP_API_KEY = process.env.PAYMENTS_SERVICE_API_KEY;

const FETCH_TIMEOUT_MS = 5000;

// ─── Tipos de error ───────────────────────────────────────────────────────────

export type FetchErrorReason =
  | "url_not_configured" // variable de entorno ausente
  | "timeout" // la app tardó más de FETCH_TIMEOUT_MS
  | "http_error" // respuesta HTTP no-2xx
  | "network_error" // fallo de red / DNS
  | "parse_error"; // JSON inválido en la respuesta

export interface AppStatus {
  online: boolean;
  errorReason?: FetchErrorReason;
  errorDetail?: string; // mensaje técnico para logs
  latencyMs?: number; // tiempo de respuesta cuando online
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function fetchWithTimeout(
  url: string,
  options?: RequestInit,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function safeGet<T>(
  url: string | undefined,
  apiKey: string | undefined,
  fallback: T | null,
  label: string,
  schema?: ZodSchema<T>
): Promise<{ data: T | null; status: AppStatus }>{
  // Caso 1: URL no configurada — esperado en desarrollo
  if (!url) {
    console.info(`[analytics] ${label}: URL no configurada, usando mock`);
    return {
      data: fallback,
      status: { online: false, errorReason: "url_not_configured" },
    };
  }

  const t0 = Date.now();

  const headers: Record<string, string> = {};
  if (apiKey) {
    headers["Authorization"] = `Bearer ${apiKey}`;
  }

  try {
    const res = await fetchWithTimeout(`${url}/api/analytics`, {
      headers,
      next: { revalidate: 60 },
    });

    const latencyMs = Date.now() - t0;

    // Caso 2: Respuesta HTTP no-2xx (ej: 401, 500, 503)
    if (!res.ok) {
      const detail = `HTTP ${res.status} ${res.statusText}`;
      console.warn(`[analytics] ${label}: ${detail}`);
      return {
        data: fallback,
        status: {
          online: false,
          errorReason: "http_error",
          errorDetail: detail,
        },
      };
    }

    // Caso 3: JSON inválido
    let json: T;
    try {
      json = await res.json();
    } catch (parseErr) {
      const detail = `JSON parse error: ${parseErr}`;
      console.warn(`[analytics] ${label}: ${detail}`);
      return {
        data: fallback,
        status: {
          online: false,
          errorReason: "parse_error",
          errorDetail: detail,
        },
      };
    }

    // Caso 3b: Validación Zod (si se proveyó schema)
    if (schema) {
      const result = schema.safeParse(json);
      if (!result.success) {
        const detail = `Zod validation error: ${result.error.message}`;
        console.warn(`[analytics] ${label}: ${detail}`);
        return {
          data: fallback,
          status: { online: false, errorReason: "parse_error", errorDetail: detail },
        };
      }
      json = result.data;
    }

    return {
      data: json,
      status: { online: true, latencyMs },
    };
  } catch (err) {
    const latencyMs = Date.now() - t0;

    // Caso 4: Timeout (AbortError) o fallo de red
    const isTimeout = err instanceof Error && err.name === "AbortError";

    const errorReason: FetchErrorReason = isTimeout
      ? "timeout"
      : "network_error";
    const detail = isTimeout
      ? `Timeout después de ${FETCH_TIMEOUT_MS}ms`
      : `Error de red: ${err}`;

    console.warn(`[analytics] ${label}: ${detail}`);
    return {
      data: fallback,
      status: { online: false, errorReason, errorDetail: detail, latencyMs },
    };
  }
}

// ─── Fetchers individuales ────────────────────────────────────────────────────

/*export async function fetchBuyerStats(): Promise<{ data: BuyerStats; status: AppStatus }> {
  return safeGet<BuyerStats>(BUYER_APP_URL, BUYER_APP_API_KEY, mockBuyerStats, "Buyer App", buyerStatsSchema);
}*/
export async function fetchBuyerStats(): Promise<{ data: BuyerStats; status: AppStatus }> {
  return { data: mockBuyerStats, status: { online: false, errorReason: "url_not_configured" } };
}

export async function fetchSellerStats(): Promise<{ data: SellerStats; status: AppStatus }> {
  if (!SELLER_APP_URL) {
    console.info("[analytics] Seller App: URL no configurada, usando mock");
    return { data: mockSellerStats, status: { online: false, errorReason: "url_not_configured" } };
  }

  const t0 = Date.now();

  const [sellersRes, productsRes, revenueRes] = await Promise.all([
    safeGet(`${SELLER_APP_URL}/api/analytics/sellers`, SELLER_APP_API_KEY, null, "Seller App /sellers"),
    safeGet(`${SELLER_APP_URL}/api/analytics/products`, SELLER_APP_API_KEY, null, "Seller App /products"),
    safeGet(`${SELLER_APP_URL}/api/analytics/revenue`, SELLER_APP_API_KEY, null, "Seller App /revenue"),
  ]);

  const online = sellersRes.status.online || productsRes.status.online || revenueRes.status.online;

  const s = sellersRes.data as any;
  const p = productsRes.data as any;
  const r = revenueRes.data as any;

  return {
    data: {
      totalVendedores: s?.totalVendedores ?? mockSellerStats.totalVendedores,
      vendedoresActivos: s?.vendedoresActivos ?? mockSellerStats.vendedoresActivos,
      totalProductos: p?.totalProductos ?? mockSellerStats.totalProductos,
      precioPromedio: p?.precioPromedio ?? mockSellerStats.precioPromedio,
      productoMasVendido: p?.productoMasVendido ?? mockSellerStats.productoMasVendido,
      unidadesProductoMasVendido: p?.unidadesProductoMasVendido ?? mockSellerStats.unidadesProductoMasVendido,
      productosSinStock: p?.productosSinStock ?? mockSellerStats.productosSinStock,
      ventasPorCategoria: p?.ventasPorCategoria ?? mockSellerStats.ventasPorCategoria,
      evolucionPrecios: mockSellerStats.evolucionPrecios,
      topVendedores: r?.topVendedores?.map((v: any) => ({ nombre: v.nombre, ingresos: v.ingresos })) ?? mockSellerStats.topVendedores,
      topProductos: p?.topProductos?.map((p: any) => ({ ...p, id: String(p.id) })) ?? mockSellerStats.topProductos,
      vendedores: s?.vendedores?.map((v: any) => ({
        ...v,
        id: String(v.id),
        ciudad: v.ciudad ?? "",
        estado: v.estado === "active" ? "activo" : "inactivo",
      })) ?? mockSellerStats.vendedores,
    },
    status: { online, latencyMs: Date.now() - t0 },
  };
}

/*export async function fetchPaymentsStats(): Promise<{ data: PaymentsStats; status: AppStatus }> {
  return safeGet<PaymentsStats>(PAYMENTS_APP_URL, PAYMENTS_APP_API_KEY, mockPaymentsStats, "Payments App", paymentsStatsSchema);
}*/
export async function fetchPaymentsStats(): Promise<{ data: PaymentsStats; status: AppStatus }> {
  return { data: mockPaymentsStats, status: { online: false, errorReason: "url_not_configured" } };
}

// ─── Consolidado (llama a las tres en paralelo) ───────────────────────────────

export async function fetchDashboardData(): Promise<DashboardData> {
  const [buyer, seller, payments] = await Promise.all([
    fetchBuyerStats(),
    fetchSellerStats(),
    fetchPaymentsStats(),
  ]);

  return {
    buyer: buyer.data,
    seller: seller.data,
    payments: payments.data,
    meta: {
      buyerAppOnline: buyer.status.online,
      sellerAppOnline: seller.status.online,
      paymentsAppOnline: payments.status.online,
      actualizadoEn: new Date().toISOString(),
      // Info extra disponible para el Topbar u otras vistas
      buyerError: buyer.status.errorReason,
      sellerError: seller.status.errorReason,
      paymentsError: payments.status.errorReason,
      buyerLatencyMs: buyer.status.latencyMs,
      sellerLatencyMs: seller.status.latencyMs,
      paymentsLatencyMs: payments.status.latencyMs,
    },
  };
}

import type { BuyerStats, SellerStats, PaymentsStats, DashboardData } from "./types";
import { mockBuyerStats, mockSellerStats, mockPaymentsStats } from "./mock-data";

const BUYER_APP_URL = process.env.BUYER_APP_URL;
const SELLER_APP_URL = process.env.SELLER_APP_URL;
const PAYMENTS_APP_URL = process.env.PAYMENTS_APP_URL;

const ANALYTICS_API_KEY = process.env.ANALYTICS_API_KEY ?? "dev-key";

const FETCH_TIMEOUT_MS = 5000;

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function fetchWithTimeout(url: string, options?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function safeGet<T>(url: string | undefined, fallback: T, label: string): Promise<{ data: T; online: boolean }> {
  if (!url) {
    console.info(`[analytics] ${label}: URL no configurada, usando mock`);
    return { data: fallback, online: false };
  }

  try {
    const res = await fetchWithTimeout(`${url}/api/analytics`, {
      headers: { "x-api-key": ANALYTICS_API_KEY },
      next: { revalidate: 60 }, // cache 60 segundos en Next.js
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const json = await res.json();
    return { data: json as T, online: true };
  } catch (err) {
    console.warn(`[analytics] ${label}: fallo al conectar (${err}), usando mock`);
    return { data: fallback, online: false };
  }
}

// ─── Fetchers individuales ────────────────────────────────────────────────────

export async function fetchBuyerStats(): Promise<{ data: BuyerStats; online: boolean }> {
  return safeGet<BuyerStats>(BUYER_APP_URL, mockBuyerStats, "Buyer App");
}

export async function fetchSellerStats(): Promise<{ data: SellerStats; online: boolean }> {
  return safeGet<SellerStats>(SELLER_APP_URL, mockSellerStats, "Seller App");
}

export async function fetchPaymentsStats(): Promise<{ data: PaymentsStats; online: boolean }> {
  return safeGet<PaymentsStats>(PAYMENTS_APP_URL, mockPaymentsStats, "Payments App");
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
      buyerAppOnline: buyer.online,
      sellerAppOnline: seller.online,
      paymentsAppOnline: payments.online,
      actualizadoEn: new Date().toISOString(),
    },
  };
}
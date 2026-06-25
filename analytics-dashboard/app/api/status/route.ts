import { fetchDashboardData } from "@/lib/api";

export async function GET() {
  try {
    const data = await fetchDashboardData();
    return Response.json({
      buyerAppOnline: data.meta.buyerAppOnline,
      sellerAppOnline: data.meta.sellerAppOnline,
      paymentsAppOnline: data.meta.paymentsAppOnline,
      actualizadoEn: data.meta.actualizadoEn,
      buyerError: data.meta.buyerError,
      sellerError: data.meta.sellerError,
      paymentsError: data.meta.paymentsError,
      buyerLatencyMs: data.meta.buyerLatencyMs,
      sellerLatencyMs: data.meta.sellerLatencyMs,
      paymentsLatencyMs: data.meta.paymentsLatencyMs,
    });
  } catch {
    return Response.json(
      {
        buyerAppOnline: false,
        sellerAppOnline: false,
        paymentsAppOnline: false,
        actualizadoEn: new Date().toISOString(),
      },
      { status: 200 }
    );
  }
}

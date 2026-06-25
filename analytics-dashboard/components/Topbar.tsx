"use client";

import { UserButton } from "@clerk/nextjs";
import type { FetchErrorReason } from "@/lib/types";
import Image from "next/image";
import { useEffect, useState } from "react";

const ERROR_LABELS: Record<FetchErrorReason, string> = {
  url_not_configured: "sin configurar",
  timeout:            "timeout",
  http_error:         "error HTTP",
  network_error:      "sin conexión",
  parse_error:        "respuesta inválida",
};

interface StatusInfo {
  buyerAppOnline: boolean;
  sellerAppOnline: boolean;
  paymentsAppOnline: boolean;
  actualizadoEn: string;
  buyerError?: FetchErrorReason;
  sellerError?: FetchErrorReason;
  paymentsError?: FetchErrorReason;
  buyerLatencyMs?: number;
  sellerLatencyMs?: number;
  paymentsLatencyMs?: number;
}

function StatusDot({
  online,
  label,
  errorReason,
  latencyMs,
}: {
  online: boolean;
  label: string;
  errorReason?: FetchErrorReason;
  latencyMs?: number;
}) {
  const tooltip = online
    ? latencyMs !== undefined ? `${latencyMs}ms` : undefined
    : errorReason ? ERROR_LABELS[errorReason] : "offline";

  return (
    <span
      className="flex items-center gap-1.5 text-xs"
      title={tooltip ? `${label}: ${tooltip}` : undefined}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          online ? "bg-[#7BA05D]" : "bg-[#E07A5F] animate-pulse-subtle"
        }`}
      />
      <span className={online ? "text-[#7BA05D]" : "text-[#E07A5F]"}>
        {label}
        {!online && errorReason && errorReason !== "url_not_configured" && (
          <span className="ml-1 opacity-70">· {ERROR_LABELS[errorReason]}</span>
        )}
      </span>
    </span>
  );
}

export default function Topbar() {
  const [status, setStatus] = useState<StatusInfo | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchStatus() {
      try {
        const res = await fetch("/api/status");
        const data = await res.json();
        if (!cancelled) setStatus(data);
      } catch {
        if (!cancelled) setStatus(null);
      }
    }
    fetchStatus();
    const interval = setInterval(fetchStatus, 30_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const todasOnline = status
    ? status.buyerAppOnline && status.sellerAppOnline && status.paymentsAppOnline
    : false;

  const usandoMock =
    status?.buyerError === "url_not_configured" ||
    status?.sellerError === "url_not_configured" ||
    status?.paymentsError === "url_not_configured";

  const hora = status
    ? new Date(status.actualizadoEn).toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "America/Argentina/Buenos_Aires",
      })
    : "--";

  return (
    <header className="bg-[#243B27] flex items-center justify-between px-6 h-13 flex-shrink-0">
      <div className="flex items-center gap-2">
        <Image src="/logo-icono.png" alt="Brotes" width={44} height={44} className="h-10 w-10" />
        <Image src="/logo-texto.png" alt="brötes" width={140} height={36} className="h-6 w-auto" />
        <span className="text-[#5a7350] text-sm font-bold tracking-widest uppercase border-l border-[#4C6B3D] pl-2.5 ml-1">
          analytics
        </span>
      </div>

      <div className="flex items-center gap-4">
        {usandoMock && (
          <span className="text-[10px] bg-[#4C6B3D] text-[#CDE5C1] px-2 py-0.5 rounded-full font-medium">
            Datos simulados
          </span>
        )}

        <StatusDot
          online={status?.buyerAppOnline ?? false}
          label="Buyer"
          errorReason={status?.buyerError}
          latencyMs={status?.buyerLatencyMs}
        />
        <StatusDot
          online={status?.sellerAppOnline ?? false}
          label="Seller"
          errorReason={status?.sellerError}
          latencyMs={status?.sellerLatencyMs}
        />
        <StatusDot
          online={status?.paymentsAppOnline ?? false}
          label="Payments"
          errorReason={status?.paymentsError}
          latencyMs={status?.paymentsLatencyMs}
        />

        <span className="text-[#4C6B3D] text-xs hidden sm:block">
          {status
            ? todasOnline
              ? `Actualizado ${hora}`
              : `Datos parciales · ${hora}`
            : "Conectando..."}
        </span>

        <div className="flex items-center pl-3 border-l border-[#4C6B3D]">
          <UserButton
            appearance={{
              elements: {
                avatarBox:
                  "w-8 h-8 border-2 border-[#4C6B3D] hover:border-[#7BA05D] transition-colors",
                userButtonPopoverCard:
                  "bg-[#EAF3E6] border border-[#CDE5C1] shadow-lg",
                userButtonPopoverActionButton:
                  "text-[#243B27] hover:bg-[#CDE5C1]",
                userButtonPopoverActionButtonText: "text-[#243B27]",
                userButtonPopoverFooter: "hidden",
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}

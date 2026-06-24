import type { FetchErrorReason } from "@/lib/types";

const ERROR_LABELS: Record<FetchErrorReason, string> = {
  url_not_configured: "sin configurar",
  timeout:            "timeout",
  http_error:         "error HTTP",
  network_error:      "sin conexión",
  parse_error:        "respuesta inválida",
};

interface StatusDotProps {
  online: boolean;
  label: string;
  errorReason?: FetchErrorReason;
  latencyMs?: number;
}

function StatusDot({ online, label, errorReason, latencyMs }: StatusDotProps) {
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

interface TopbarProps {
  buyerOnline: boolean;
  sellerOnline: boolean;
  paymentsOnline: boolean;
  actualizadoEn: string;
  buyerError?: FetchErrorReason;
  sellerError?: FetchErrorReason;
  paymentsError?: FetchErrorReason;
  buyerLatencyMs?: number;
  sellerLatencyMs?: number;
  paymentsLatencyMs?: number;
}

export default function Topbar({
  buyerOnline,
  sellerOnline,
  paymentsOnline,
  actualizadoEn,
  buyerError,
  sellerError,
  paymentsError,
  buyerLatencyMs,
  sellerLatencyMs,
  paymentsLatencyMs,
}: TopbarProps) {
  const hora = new Date(actualizadoEn).toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Argentina/Buenos_Aires", // agregá esto
  });

  const todasOnline = buyerOnline && sellerOnline && paymentsOnline;

  return (
    <header className="bg-[#243B27] flex items-center justify-between px-6 h-13 flex-shrink-0">
      <div className="flex items-center gap-2">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#CDE5C1"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2a9 9 0 0 1 9 9c0 4.5-3 8.5-7 10.5" />
          <path d="M12 2a9 9 0 0 0-9 9c0 4.5 3 8.5 7 10.5" />
          <path d="M12 2v20" />
          <path d="M3 9h18" />
        </svg>
        <span className="text-[#CDE5C1] text-sm font-medium tracking-wide">
          brotes
        </span>
        <span className="text-[#7BA05D] text-[10px] font-normal tracking-widest uppercase border-l border-[#4C6B3D] pl-2.5 ml-1">
          analytics
        </span>
      </div>

      <div className="flex items-center gap-4">
        <StatusDot
          online={buyerOnline}
          label="Buyer"
          errorReason={buyerError}
          latencyMs={buyerLatencyMs}
        />
        <StatusDot
          online={sellerOnline}
          label="Seller"
          errorReason={sellerError}
          latencyMs={sellerLatencyMs}
        />
        <StatusDot
          online={paymentsOnline}
          label="Payments"
          errorReason={paymentsError}
          latencyMs={paymentsLatencyMs}
        />

        <span className="text-[#4C6B3D] text-xs hidden sm:block">
          {todasOnline ? `Actualizado ${hora}` : `Datos parciales · ${hora}`}
        </span>
      </div>
    </header>
  );
}
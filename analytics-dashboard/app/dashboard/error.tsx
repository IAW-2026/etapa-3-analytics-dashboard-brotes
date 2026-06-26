"use client";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <div className="bg-white border border-[#E07A5F] rounded-xl p-8 max-w-md">
        <div className="w-12 h-12 rounded-full bg-[#E07A5F]/10 flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">!</span>
        </div>
        <h2 className="text-lg font-medium text-[#243B27] mb-2">
          No pudimos cargar el dashboard
        </h2>
        <p className="text-sm text-[#4C6B3D] mb-6">
          Ocurrió un error al obtener los datos de las aplicaciones. Puede que una o más apps estén fuera de servicio.
        </p>
        <button
          onClick={reset}
          className="bg-[#4C6B3D] text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-[#3A5A2E] transition-colors"
        >
          Intentar de nuevo
        </button>
        <p className="text-[10px] text-[#7BA05D] mt-4">
          {error.digest && `Error ID: ${error.digest}`}
        </p>
      </div>
    </div>
  );
}

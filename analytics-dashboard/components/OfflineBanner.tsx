export default function OfflineBanner({ appName }: { appName: string }) {
  return (
    <div className="bg-[#E07A5F]/10 border border-[#E07A5F]/30 rounded-lg px-4 py-2 mb-4">
      <p className="text-xs text-[#E07A5F]">
        No se pudieron obtener datos de {appName}. Se muestran datos de referencia.
      </p>
    </div>
  );
}

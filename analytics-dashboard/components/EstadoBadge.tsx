type Estado =
  | "rechazada"
  | "pendiente"
  | "confirmada"
  | "en_preparacion"
  | "listo"
  | "entregada"
  | "caducada"
  | "activo"
  | "suspendido"
  | "eliminado"
  | "nuevo"
  | "inactivo";

const ESTILOS: Record<Estado, string> = {
  rechazada: "bg-[#f5d0c8] text-[#c0402a]",
  confirmada: "bg-[#CDE5C1] text-[#243B27]",
  activo: "bg-[#CDE5C1] text-[#243B27]",
  entregada: "bg-[#d4f5d0] text-[#1a5f1a]",
  listo: "bg-[#d0e8f5] text-[#1a4f7a]",
  en_preparacion: "bg-[#e8f0d8] text-[#4C6B3D]",
  pendiente: "bg-[#E8E2D6] text-[#4C6B3D]",
  nuevo: "bg-[#E8E2D6] text-[#4C6B3D]",
  caducada: "bg-[#f5d0c8] text-[#c0402a]",
  suspendido: "bg-[#f5e8c8] text-[#8a5a00]",
  eliminado: "bg-[#D9D9D4] text-[#555]",
  inactivo: "bg-[#D9D9D4] text-[#555]",
};

export default function EstadoBadge({ estado }: { estado: Estado }) {
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${
        ESTILOS[estado] ?? "bg-[#D9D9D4] text-[#555]"
      }`}
    >
      {estado}
    </span>
  );
}

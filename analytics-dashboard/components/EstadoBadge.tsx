type Estado =
  | "pendiente"
  | "confirmado"
  | "enviado"
  | "entregado"
  | "cancelado"
  | "activo"
  | "suspendido"
  | "eliminado"
  | "nuevo"
  | "inactivo";

const ESTILOS: Record<Estado, string> = {
  confirmado:  "bg-[#CDE5C1] text-[#243B27]",
  activo:      "bg-[#CDE5C1] text-[#243B27]",
  entregado:   "bg-[#d4f5d0] text-[#1a5f1a]",
  enviado:     "bg-[#d0e8f5] text-[#1a4f7a]",
  pendiente:   "bg-[#E8E2D6] text-[#4C6B3D]",
  nuevo:       "bg-[#E8E2D6] text-[#4C6B3D]",
  cancelado:   "bg-[#f5d0c8] text-[#c0402a]",
  suspendido:  "bg-[#f5e8c8] text-[#8a5a00]",
  eliminado:   "bg-[#D9D9D4] text-[#555]",
  inactivo:    "bg-[#D9D9D4] text-[#555]",
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
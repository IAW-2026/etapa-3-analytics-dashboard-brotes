"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard/resumen",   label: "Resumen general",  icon: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" },
  { href: "/dashboard/ventas",    label: "Ventas y pedidos", icon: "M3 3v18h18M9 17V9m4 8V5m4 12v-4" },
  { href: "/dashboard/usuarios",  label: "Usuarios",         icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm8 4a3 3 0 0 1 0 6m3-6a3 3 0 1 0-6 0" },
  { href: "/dashboard/catalogo",  label: "Catálogo",         icon: "M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7zm0 4a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" },
  { href: "/dashboard/comunidad", label: "Comunidad",        icon: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav
      className="w-52 flex-shrink-0 bg-[#EAF3E6] border-r border-[#CDE5C1] py-5"
      aria-label="Navegación del dashboard"
    >
      <p className="text-[10px] font-medium tracking-widest uppercase text-[#7BA05D] px-4 mb-2">
        Vistas
      </p>

      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm border-l-[3px] transition-colors ${
              active
                ? "bg-[#CDE5C1] border-[#4C6B3D] text-[#243B27] font-medium"
                : "border-transparent text-[#4C6B3D] hover:bg-[#CDE5C1] hover:text-[#243B27]"
            }`}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d={item.icon} />
            </svg>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
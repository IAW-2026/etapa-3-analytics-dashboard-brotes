import { SignOutButton } from "@clerk/nextjs";

export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--color-arena)] px-4">
      <div className="bg-[var(--color-verde-suave)] border border-[var(--color-verde-brote)] rounded-xl p-10 max-w-md w-full text-center shadow-sm">
        <span className="text-5xl block mb-4">🔒</span>

        <h1 className="text-xl font-bold text-[var(--color-verde-profundo)] mb-2 tracking-tight">
          Acceso restringido
        </h1>

        <p className="text-sm text-[var(--color-verde-bosque)] leading-relaxed mb-4">
          Tu cuenta no tiene permisos de administrador para acceder al panel de
          analytics de Brotes.
        </p>

        <div className="bg-[var(--color-beige)] rounded-lg px-4 py-3 text-xs text-[var(--color-verde-bosque)] leading-relaxed mb-8">
          Si creés que esto es un error, pedile a un superadmin que asigne el
          rol <code className="bg-[var(--color-verde-brote)] text-[var(--color-verde-profundo)] px-1.5 py-0.5 rounded font-mono">admin</code> a
          tu cuenta en Clerk.
        </div>

        <SignOutButton>
          <button className="bg-[var(--color-verde-bosque)] hover:bg-[var(--color-verde-profundo)] text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors cursor-pointer">
            Cerrar sesión
          </button>
        </SignOutButton>
      </div>
    </main>
  );
}
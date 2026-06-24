import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 bg-[var(--color-arena)] px-4">
      <div className="text-center">
        <span className="text-5xl block mb-3">🌿</span>
        <h1 className="text-2xl font-bold text-[var(--color-verde-profundo)] tracking-tight">
          Brotes Analytics
        </h1>
        <p className="text-sm text-[var(--color-verde-bosque)] mt-1">
          Registro de administrador
        </p>
      </div>

      <SignUp />
    </main>
  );
}
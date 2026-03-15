// ============================================================
// RareSignal — Auth Layout (login, register, forgot-password)
// ============================================================
import dynamic from "next/dynamic";

const ParticlesBackground = dynamic(
  () =>
    import("@/components/particles-background").then(
      (mod) => mod.ParticlesBackground
    ),
  { ssr: false }
);

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-[#08080E]">
      <ParticlesBackground />
      <div className="relative z-10 flex min-h-screen items-center justify-center">
        {children}
      </div>
    </div>
  );
}

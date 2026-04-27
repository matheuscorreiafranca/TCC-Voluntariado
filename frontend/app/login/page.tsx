import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <section className="card card-pad" style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <Image src="/logos/voluntamais-full.svg" alt="VoluntaMais" width={260} height={150} />
          <p className="muted">Login demonstrativo do MVP</p>
        </div>

        <div className="grid">
          <label className="field"><span>E-mail</span><input className="input" defaultValue="admin@example.com" /></label>
          <label className="field"><span>Senha</span><input className="input" type="password" defaultValue="123456" /></label>
          <Link href="/dashboard" className="button">Entrar</Link>
        </div>
      </section>
    </main>
  );
}

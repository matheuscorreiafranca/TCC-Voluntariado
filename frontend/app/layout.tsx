import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VoluntaMais",
  description: "MVP de voluntariado para instituições, voluntários e oportunidades"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Instituto Vitor Gabriel",
  description: "MVP de voluntariado para eventos, projetos e campanhas do Instituto Vitor Gabriel"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}

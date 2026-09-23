import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Fatesck | Portal acadêmico",
  description:
    "Protótipo acadêmico de turmas, atividades e comunicação entre alunos e professores.",
  robots: { index: false, follow: false },
  icons: { icon: "/favicon.svg" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from '@/components/Navbar'; // Importando sua nova Navbar

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GymLog - Seu Treino Levado a Sério",
  description: "Acompanhe sua evolução, dieta e recordes pessoais.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-br"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-white">
        {/* O Menu aparece em todas as páginas aqui */}
        <Navbar />

        {/* O pt-16 serve para o conteúdo não começar "embaixo" da Navbar, 
          já que ela é 'fixed' e tem 64px (h-16) de altura.
        */}
        <main className="flex-1 pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}
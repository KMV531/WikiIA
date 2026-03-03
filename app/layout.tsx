import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WikipIA - Générateur de questions",
  description:
    "Une application pour générer des questions à partir de thèmes donnés, avec une touche d'humour et une erreur volontaire pour stimuler la réflexion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="shortcut icon" href="/logo.png" type="image/png" />
      </head>
      <body className={`${montserrat.variable} antialiased`}>
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster />
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "IvoireMap - Naviguer comme un Ivoirien | Gbaka, Wôrô-wôrô & SOTRA",
  description:
    "Application cartographique et d'itineraires intelligente pour la Cote d'Ivoire. Retrouvez vos trajets en Gbaka, Woro-woro (waren), Bus SOTRA avec les toponymes locaux et le Nouchi.",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "IvoireMap" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#e8730c",
  colorScheme: "light dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

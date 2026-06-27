import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import "./tokens.css";
import "./globals.css";
import { ToastProvider } from "@/components/Toast";
import { LocaleProvider } from "@/components/LocaleProvider";
import { normalizeLocale } from "@/lib/i18n";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "De Huyskamer — Spaarprogramma",
  description: "Spaar punten bij De Huyskamer en wissel ze in voor beloningen.",
  applicationName: "De Huyskamer",
  appleWebApp: { capable: true, title: "De Huyskamer", statusBarStyle: "black-translucent" },
  openGraph: {
    title: "De Huyskamer — Spaarprogramma",
    description: "Spaar punten bij De Huyskamer en wissel ze in voor beloningen.",
    type: "website",
    images: ["/img/storefront.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "De Huyskamer — Spaarprogramma",
    images: ["/img/storefront.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#2C2A28",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = normalizeLocale((await cookies()).get("locale")?.value);
  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Naar hoofdinhoud
        </a>
        <LocaleProvider locale={locale}>
          <ToastProvider>
            <div id="main">{children}</div>
          </ToastProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}

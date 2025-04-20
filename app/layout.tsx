import type { ReactNode } from "react"
import type { Metadata } from "next"
import "@/app/globals.css"
import { LanguageProvider } from "@/lib/i18n/language-context"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: "WorldCosts",
  description: "حساب القيم بعملات متعددة بسهولة",
  applicationName: "WorldCosts",
  appleWebApp: {
    capable: true,
    title: "WorldCosts",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  manifest: "/manifest.json",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1e22" },
  ],
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/icon-192x192.png" }, { url: "/icons/icon-512x512.png" }],
  },
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  // Determinar si estamos en un entorno de producción
  const isProduction =
    process.env.NODE_ENV === "production" &&
    typeof window !== "undefined" &&
    !window.location.hostname.includes("vusercontent.net") &&
    !window.location.hostname.includes("vercel.app")

  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#1c1e22" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="icon" href="/icons/icon-192x192.png" />

        <meta name="google-site-verification" content="googlef73da8a61c68dbf7" />

        {/* Solo cargar el script de AdSense en producción */}
        {isProduction && (
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3799584967407983"
            crossOrigin="anonymous"
            data-ad-client="ca-pub-3799584967407983"
          ></script>
        )}
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

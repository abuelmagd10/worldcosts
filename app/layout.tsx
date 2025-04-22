import type { ReactNode } from "react"
import type { Metadata } from "next"
import "@/app/globals.css"
import { LanguageProvider } from "@/lib/i18n/language-context"
import { ThemeProvider } from "@/components/theme-provider"
import { ErrorBoundary } from "@/components/error-boundary"
import Script from "next/script"

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
    userScalable: false,
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
    shortcut: [{ url: "/icons/icon-192x192.png" }],
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "mobile-web-app-capable": "yes",
  },
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#1c1e22" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="icon" href="/icons/icon-192x192.png" />
        <meta name="google-site-verification" content="googlef73da8a61c68dbf7" />
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
        <meta httpEquiv="Accept-CH" content="DPR, Viewport-Width, Width" />
        <meta httpEquiv="Permissions-Policy" content="interest-cohort=()" />
      </head>
      <body>
        <ErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <LanguageProvider>{children}</LanguageProvider>
          </ThemeProvider>
        </ErrorBoundary>

        {/* Move scripts to the end of body to avoid blocking rendering */}
        <Script id="enable-features" strategy="afterInteractive">
          {`
            // Enable DOM storage
            try {
              if (typeof localStorage !== 'undefined') {
                localStorage.setItem('dom_storage_test', 'enabled');
                localStorage.removeItem('dom_storage_test');
                console.log('DOM Storage enabled');
              }
            } catch (e) {
              console.warn('DOM Storage not available:', e);
            }
            
            // Enable cookies
            document.cookie = "cookies_enabled=true; max-age=86400; path=/; SameSite=Lax";
          `}
        </Script>

        {/* Service Worker registration */}
        <Script id="register-sw" strategy="afterInteractive">
          {`
            // Register Service Worker
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(
                  function(registration) {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                  },
                  function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                  }
                );
              });
            }
          `}
        </Script>

        {/* Only load AdSense in production */}
        {process.env.NODE_ENV === "production" && (
          <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3799584967407983"
            crossOrigin="anonymous"
            data-ad-client="ca-pub-3799584967407983"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  )
}

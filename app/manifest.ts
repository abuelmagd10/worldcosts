import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "WorldCosts",
    short_name: "WorldCosts",
    description: "حساب القيم بعملات متعددة بسهولة",
    start_url: "/",
    display: "standalone",
    background_color: "#1c1e22",
    theme_color: "#0e9bef", // تحديث لون السمة ليتطابق مع تصميم التطبيق
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "/icons/icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    id: "/",
    orientation: "portrait",
    scope: "/",
    lang: "ar",
    dir: "rtl",
    prefer_related_applications: false,
    categories: ["finance", "utilities"],
    screenshots: [
      {
        src: "/screenshots/screenshot1.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide",
      },
      {
        src: "/screenshots/screenshot2.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide",
      },
    ],
  }
}

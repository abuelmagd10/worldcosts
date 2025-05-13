import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "WorldCosts",
    short_name: "WorldCosts",
    id: "com.worldcosts.app",
    description: "احسب تكلفة منتجاتك بدقة وبعملات مختلفة مع إمكانية احتساب الشحن والضرائب والجمارك",
    start_url: "/",
    display: "standalone",
    display_override: ["window-controls-overlay"],
    background_color: "#0175C2",
    theme_color: "#0175C2",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-maskable-384x384.png",
        sizes: "384x384",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-maskable-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    orientation: "any",
    scope: "/",
    lang: "ar",
    dir: "rtl",
    prefer_related_applications: false,
    related_applications: [],
    categories: ["finance", "utilities", "productivity"],
    handle_links: "preferred",
    launch_handler: {
      client_mode: ["navigate-existing", "auto"],
    },
    scope_extensions: [
      { origin: "https://worldcosts.com" },
    ],
    file_handlers: [
      {
        action: "/open-file",
        accept: {
          "text/csv": [".csv"],
          "application/json": [".json"],
        },
      },
    ],
    screenshots: [
      {
        src: "/screenshots/screenshot1.png",
        sizes: "1280x720",
        type: "image/png",
        platform: "wide",
        label: "شاشة إدخال معلومات الشركة",
      },
      {
        src: "/screenshots/screenshot2.png",
        sizes: "1280x720",
        type: "image/png",
        platform: "wide",
        label: "صفحة المهمة والميزات",
      },
      {
        src: "/screenshots/screenshot3.png",
        sizes: "1280x720",
        type: "image/png",
        platform: "wide",
        label: "صفحة إدارة الملفات",
      },
      {
        src: "/screenshots/screenshot4.png",
        sizes: "1280x720",
        type: "image/png",
        platform: "wide",
        label: "شاشة العناصر المضافة والحسابات",
      },
      {
        src: "/screenshots/screenshot5.png",
        sizes: "1280x720",
        type: "image/png",
        platform: "wide",
        label: "الشاشة الرئيسية مع العناصر المضافة",
      },
    ],
    iarc_rating_id: "e84b072d-71b3-4d3e-86ae-31a8ce4e53b7",
  }
}

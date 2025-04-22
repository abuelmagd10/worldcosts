"use client"

import type React from "react"

import { useEffect, useRef } from "react"

interface AdBannerProps {
  adSlot: string
  adFormat?: string
  style?: React.CSSProperties
  className?: string
  minContentLength?: number // إضافة خاصية للتحكم في الحد الأدنى لطول المحتوى
  items?: any[] // إضافة خاصية لتتبع العناصر في الصفحة
}

export function AdBanner({
  adSlot,
  adFormat = "auto",
  style = {},
  className = "",
  minContentLength = 500, // الحد الأدنى الافتراضي لطول المحتوى
  items = [],
}: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null)
  const isLoaded = useRef(false)
  const adAttempts = useRef(0)

  // التحقق من وجود محتوى كافٍ في الصفحة لعرض الإعلانات
  const hasEnoughContent = useRef<boolean>(false)

  // تحسين وظيفة التحقق من كمية المحتوى
  const checkContentAmount = () => {
    if (typeof document === "undefined") return false

    // التحقق من كمية النص في الصفحة
    const textContent = document.body.innerText || ""
    const wordCount = textContent.split(/\s+/).filter(Boolean).length

    // التحقق من وجود عناصر تفاعلية (نماذج، جداول، إلخ)
    const hasInteractiveElements = document.querySelectorAll("form, table, [role='grid']").length > 0

    // التحقق من وجود عناصر محتوى مهمة
    const hasContentElements = document.querySelectorAll("article, section, main, .card-content").length > 0

    // التحقق من عدد الصور
    const hasImages = document.querySelectorAll("img").length > 0

    // التحقق من أن الصفحة ليست صفحة خطأ أو تسجيل دخول أو شكر
    const isSpecialPage =
      document.title.toLowerCase().includes("error") ||
      document.title.toLowerCase().includes("login") ||
      document.title.toLowerCase().includes("thank") ||
      document.title.toLowerCase().includes("offline") ||
      window.location.pathname.includes("offline")

    // التحقق من أن الصفحة ليست فارغة
    const isEmptyPage = document.querySelectorAll(".empty-state").length > 0

    console.log("Content check:", {
      wordCount,
      hasInteractiveElements,
      hasContentElements,
      hasImages,
      isSpecialPage,
      isEmptyPage,
    })

    // اعتبار أن هناك محتوى كافٍ إذا:
    // 1. كان عدد الكلمات أكبر من الحد الأدنى المطلوب، أو
    // 2. كان هناك عناصر تفاعلية وعناصر محتوى وصور
    // 3. وليست صفحة خاصة (خطأ، تسجيل دخول، شكر)
    // 4. وليست صفحة فارغة
    // تحسين معايير عرض الإعلانات للسماح بعرضها في المزيد من الحالات
    return (
      (wordCount > minContentLength || hasInteractiveElements || hasContentElements || items?.length > 0) &&
      !isSpecialPage &&
      !isEmptyPage
    )
  }

  // تحقق من دعم ملفات تعريف الارتباط
  const checkCookiesEnabled = () => {
    try {
      document.cookie = "cookietest=1; SameSite=Lax"
      const result = document.cookie.indexOf("cookietest=") !== -1
      document.cookie = "cookietest=1; SameSite=Lax; expires=Thu, 01-Jan-1970 00:00:01 GMT"
      return result
    } catch (e) {
      return false
    }
  }

  useEffect(() => {
    // التنفيذ مرة واحدة فقط لكل مكون
    if (isLoaded.current) return

    // التأكد من أن DOM محمل بالكامل
    if (!adRef.current || typeof window === "undefined") return

    // التحقق من وجود محتوى كافٍ قبل عرض الإعلانات
    hasEnoughContent.current = checkContentAmount()

    if (!hasEnoughContent.current) {
      console.log("لا يوجد محتوى كافٍ لعرض الإعلانات")
      return
    }

    // التحقق من دعم ملفات تعريف الارتباط
    const cookiesEnabled = checkCookiesEnabled()
    if (!cookiesEnabled) {
      console.warn("Cookies are disabled. Ads may not work properly.")
    }

    const loadAd = () => {
      try {
        // تحديد أبعاد صريحة للحاوية
        const adContainer = adRef.current
        if (!adContainer) return

        if (adContainer.offsetWidth === 0) {
          adContainer.style.width = "100%"
          adContainer.style.minHeight = "280px" // الحد الأدنى للارتفاع لضمان الرؤية
        }

        // إنشاء عنصر ins للإعلان
        const adElement = document.createElement("ins")
        adElement.className = "adsbygoogle"
        adElement.style.display = "block"
        adElement.style.width = "100%"
        adElement.style.height = "100%"
        adElement.setAttribute("data-ad-client", "ca-pub-3799584967407983")
        adElement.setAttribute("data-ad-slot", adSlot)
        adElement.setAttribute("data-ad-format", adFormat)
        adElement.setAttribute("data-full-width-responsive", "true")

        // تنظيف الحاوية وإضافة العنصر الجديد
        while (adContainer.firstChild) {
          adContainer.removeChild(adContainer.firstChild)
        }
        adContainer.appendChild(adElement)

        // تهيئة الإعلان
        try {
          ;(window.adsbygoogle = window.adsbygoogle || []).push({})
          isLoaded.current = true
          console.log("Ad initialized successfully")
        } catch (error) {
          console.error("Error initializing adsbygoogle:", error)

          // إعادة المحاولة إذا فشلت التهيئة (حتى 3 محاولات)
          if (adAttempts.current < 3) {
            adAttempts.current++
            setTimeout(loadAd, 1000)
          }
        }
      } catch (error) {
        console.error("Error setting up AdSense:", error)
      }
    }

    // الانتظار لحظة للتأكد من أن DOM مستقر
    const timer = setTimeout(loadAd, 100)

    return () => clearTimeout(timer)
  }, [adSlot, adFormat, minContentLength, items])

  // إذا لم يكن هناك محتوى كافٍ، لا تعرض الإعلان على الإطلاق
  if (typeof window !== "undefined" && !checkContentAmount()) {
    return null
  }

  return (
    <div
      ref={adRef}
      className={`ad-container ${className} transition-all duration-300 hover:shadow-xl`}
      style={{
        display: "block",
        minHeight: adFormat === "fluid" ? "100px" : "280px",
        width: "100%",
        overflow: "hidden",
        borderRadius: "0.75rem",
        ...style,
      }}
      data-ad-status="not-loaded"
    />
  )
}

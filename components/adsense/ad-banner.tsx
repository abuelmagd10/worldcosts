"use client"

import type React from "react"

import { useEffect, useRef } from "react"

interface AdBannerProps {
  adSlot: string
  adFormat?: string
  style?: React.CSSProperties
  className?: string
  minContentLength?: number // إضافة خاصية للتحكم في الحد الأدنى لطول المحتوى
}

export function AdBanner({
  adSlot,
  adFormat = "auto",
  style = {},
  className = "",
  minContentLength = 500, // الحد الأدنى الافتراضي لطول المحتوى
}: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null)
  const isLoaded = useRef(false)

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
    return (
      (wordCount > minContentLength || (hasInteractiveElements && hasContentElements && hasImages)) &&
      !isSpecialPage &&
      !isEmptyPage
    )
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

    try {
      // تحديد أبعاد صريحة للحاوية
      const adContainer = adRef.current
      if (adContainer.offsetWidth === 0) {
        adContainer.style.width = "100%"
        adContainer.style.minHeight = "280px" // الحد الأدنى للارتفاع لضمان الرؤية
      }

      // الانتظار لحظة للتأكد من أن DOM مستقر
      const timer = setTimeout(() => {
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
        } catch (error) {
          console.error("Error initializing adsbygoogle:", error)
        }
      }, 100) // تأخير صغير للتأكد من أن DOM جاهز

      return () => clearTimeout(timer)
    } catch (error) {
      console.error("Error setting up AdSense:", error)
    }
  }, [adSlot, adFormat, minContentLength])

  // إذا لم يكن هناك محتوى كافٍ، لا تعرض الإعلان على الإطلاق
  if (typeof window !== "undefined" && !checkContentAmount()) {
    return null
  }

  return (
    <div
      ref={adRef}
      className={`ad-container ${className}`}
      style={{
        display: "block",
        minHeight: "280px",
        width: "100%",
        overflow: "hidden",
        ...style,
      }}
    />
  )
}

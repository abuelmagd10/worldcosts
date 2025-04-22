"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"

interface AdBannerProps {
  adSlot: string
  adFormat?: string
  style?: React.CSSProperties
  className?: string
  minContentLength?: number
  items?: any[]
}

export function AdBanner({
  adSlot,
  adFormat = "auto",
  style = {},
  className = "",
  minContentLength = 500,
  items = [],
}: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null)
  const isLoaded = useRef(false)
  const adAttempts = useRef(0)
  const [mounted, setMounted] = useState(false)

  // Set mounted to true when component mounts
  useEffect(() => {
    setMounted(true)
  }, [])

  // Check if there's enough content
  const checkContentAmount = () => {
    if (typeof document === "undefined") return false

    // Check text content
    const textContent = document.body.innerText || ""
    const wordCount = textContent.split(/\s+/).filter(Boolean).length

    // Check for interactive elements
    const hasInteractiveElements = document.querySelectorAll("form, table, [role='grid']").length > 0

    // Check for content elements
    const hasContentElements = document.querySelectorAll("article, section, main, .card-content").length > 0

    // Check for images
    const hasImages = document.querySelectorAll("img").length > 0

    // Check if page is a special page
    const isSpecialPage =
      document.title.toLowerCase().includes("error") ||
      document.title.toLowerCase().includes("login") ||
      document.title.toLowerCase().includes("thank") ||
      document.title.toLowerCase().includes("offline") ||
      window.location.pathname.includes("offline")

    // Check if page is empty
    const isEmptyPage = document.querySelectorAll(".empty-state").length > 0

    // Consider there's enough content if:
    return (
      (wordCount > minContentLength || hasInteractiveElements || hasContentElements || items?.length > 0) &&
      !isSpecialPage &&
      !isEmptyPage
    )
  }

  useEffect(() => {
    // Only run once per component
    if (isLoaded.current || !mounted) return

    // Make sure DOM is fully loaded
    if (!adRef.current || typeof window === "undefined") return

    // Check if there's enough content before showing ads
    const hasEnoughContent = checkContentAmount()
    if (!hasEnoughContent) {
      console.log("Not enough content to display ads")
      return
    }

    const loadAd = () => {
      try {
        // Set explicit dimensions for container
        const adContainer = adRef.current
        if (!adContainer) return

        if (adContainer.offsetWidth === 0) {
          adContainer.style.width = "100%"
          adContainer.style.minHeight = "280px"
        }

        // Create ins element for ad
        const adElement = document.createElement("ins")
        adElement.className = "adsbygoogle"
        adElement.style.display = "block"
        adElement.style.width = "100%"
        adElement.style.height = "100%"
        adElement.setAttribute("data-ad-client", "ca-pub-3799584967407983")
        adElement.setAttribute("data-ad-slot", adSlot)
        adElement.setAttribute("data-ad-format", adFormat)
        adElement.setAttribute("data-full-width-responsive", "true")

        // Clean container and add new element
        while (adContainer.firstChild) {
          adContainer.removeChild(adContainer.firstChild)
        }
        adContainer.appendChild(adElement)

        // Initialize ad
        try {
          if (window.adsbygoogle) {
            ;(window.adsbygoogle = window.adsbygoogle || []).push({})
            isLoaded.current = true
            console.log("Ad initialized successfully")
          } else {
            console.warn("adsbygoogle not available yet")
            // Retry if initialization fails (up to 3 attempts)
            if (adAttempts.current < 3) {
              adAttempts.current++
              setTimeout(loadAd, 1000)
            }
          }
        } catch (error) {
          console.error("Error initializing adsbygoogle:", error)
        }
      } catch (error) {
        console.error("Error setting up AdSense:", error)
      }
    }

    // Wait a moment to ensure DOM is stable
    const timer = setTimeout(loadAd, 100)

    return () => clearTimeout(timer)
  }, [adSlot, adFormat, minContentLength, items, mounted])

  // If there's not enough content, don't render ad at all
  if (mounted && typeof window !== "undefined" && !checkContentAmount()) {
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

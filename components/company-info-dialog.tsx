"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { TeslaButton } from "@/components/ui/tesla-button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, Upload, X, Loader2 } from "lucide-react"
import Image from "next/image"
import { useLanguage } from "@/lib/i18n/language-context"
import { useToast } from "@/components/ui/use-toast"

// تعديل نوع CompanyInfo لاستخدام رابط URL بدلاً من base64
export type CompanyInfo = {
  name: string
  address: string
  phone: string
  logo?: string // URL to the logo image instead of Base64
  pdfFileName?: string
}

interface CompanyInfoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  companyInfo: CompanyInfo
  onSave: (info: CompanyInfo) => void
}

export function CompanyInfoDialog({ open, onOpenChange, companyInfo, onSave }: CompanyInfoDialogProps) {
  const { t, dir } = useLanguage()
  const [name, setName] = useState(companyInfo.name)
  const [address, setAddress] = useState(companyInfo.address)
  const [phone, setPhone] = useState(companyInfo.phone)
  const [logo, setLogo] = useState<string | undefined>(companyInfo.logo)
  const [pdfFileName, setPdfFileName] = useState(companyInfo.pdfFileName || "")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadActive, setUploadActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // تعديل وظيفة handleLogoUpload لاستخدام التخزين الجديد
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadError(null)

    try {
      // التحقق من نوع الملف
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/svg+xml"]
      if (!validTypes.includes(file.type)) {
        throw new Error("نوع الملف غير صالح. يُسمح فقط بملفات JPEG وPNG وGIF وSVG.")
      }

      // التحقق من حجم الملف (الحد الأقصى 2 ميجابايت)
      const maxSize = 2 * 1024 * 1024 // 2MB
      if (file.size > maxSize) {
        throw new Error("حجم الملف يتجاوز الحد المسموح به (2 ميجابايت).")
      }

      // تحويل الملف إلى base64 مباشرة
      const reader = new FileReader()
      reader.onload = async (event) => {
        try {
          if (!event.target || typeof event.target.result !== "string") {
            throw new Error("فشل في قراءة الملف")
          }

          const base64Data = event.target.result

          // تعيين الشعار مباشرة بدون الحاجة إلى رفعه إلى الخادم
          setLogo(base64Data)

          toast({
            title: "تم رفع الشعار بنجاح",
            description: "تم رفع شعار الشركة بنجاح",
          })

          setIsUploading(false)
        } catch (error) {
          console.error("Error processing file:", error)
          setUploadError(error instanceof Error ? error.message : "خطأ غير معروف")
          toast({
            title: "خطأ في معالجة الشعار",
            description: `حدث خطأ أثناء معالجة الشعار: ${error instanceof Error ? error.message : "خطأ غير معروف"}`,
            variant: "destructive",
          })
          setIsUploading(false)
        }
      }

      reader.onerror = () => {
        setUploadError("فشل في قراءة الملف")
        toast({
          title: "خطأ في قراءة الشعار",
          description: "فشل في قراءة ملف الشعار",
          variant: "destructive",
        })
        setIsUploading(false)
      }

      reader.readAsDataURL(file)
    } catch (error) {
      console.error("Error uploading logo:", error)
      setUploadError(error instanceof Error ? error.message : "خطأ غير معروف")
      toast({
        title: "خطأ في رفع الشعار",
        description: `حدث خطأ أثناء رفع الشعار: ${error instanceof Error ? error.message : "خطأ غير معروف"}`,
        variant: "destructive",
      })
      setIsUploading(false)
    }
  }

  // وظيفة جديدة للنقر على منطقة التحميل
  const triggerFileInput = useCallback(() => {
    if (fileInputRef.current) {
      // إضافة تأخير أطول للأجهزة المحمولة
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

      if (isMobile) {
        // تأخير أطول للأجهزة المحمولة
        setTimeout(() => {
          if (fileInputRef.current) {
            fileInputRef.current.click()
            setTimeout(() => {
              if (fileInputRef.current) {
                fileInputRef.current.focus()
              }
            }, 300)
          }
        }, 150)
      } else {
        // تأخير أقصر للأجهزة المكتبية
        fileInputRef.current.click()
      }
    }
  }, [])

  const handleRemoveLogo = () => {
    setLogo(undefined)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSave = () => {
    onSave({
      name,
      address,
      phone,
      logo,
      pdfFileName,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[425px] max-w-[85vw] bg-card text-foreground border-border p-3 sm:p-6"
        dir={dir}
      >
        <DialogHeader className="space-y-1">
          <DialogTitle className="flex items-center gap-2 text-foreground text-sm sm:text-lg">
            <Building2 className="h-3 w-3 sm:h-5 sm:w-5" />
            {t.companyInfoTitle}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs sm:text-sm">
            {t.companyInfoDescription}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 py-2 sm:py-4">
          <div className="grid gap-1 sm:gap-2">
            <Label htmlFor="company-name" className="text-muted-foreground text-xs sm:text-sm">
              {t.companyName}
            </Label>
            <div className="tesla-input p-1">
              <Input
                id="company-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.companyName}
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground text-xs sm:text-sm h-7 sm:h-10"
              />
            </div>
          </div>
          <div className="grid gap-1 sm:gap-2">
            <Label htmlFor="company-address" className="text-muted-foreground text-xs sm:text-sm">
              {t.companyAddress}
            </Label>
            <div className="tesla-input p-1">
              <Input
                id="company-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={t.companyAddress}
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground text-xs sm:text-sm h-7 sm:h-10"
              />
            </div>
          </div>
          <div className="grid gap-1 sm:gap-2">
            <Label htmlFor="company-phone" className="text-muted-foreground text-xs sm:text-sm">
              {t.companyPhone}
            </Label>
            <div className="tesla-input p-1">
              <Input
                id="company-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t.companyPhone}
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground text-xs sm:text-sm h-7 sm:h-10"
              />
            </div>
          </div>
          <div className="grid gap-1 sm:gap-2">
            <Label htmlFor="pdf-file-name" className="text-muted-foreground text-xs sm:text-sm">
              {t.pdfFileName}
            </Label>
            <div className="tesla-input p-1">
              <Input
                id="pdf-file-name"
                value={pdfFileName}
                onChange={(e) => setPdfFileName(e.target.value)}
                placeholder={t.pdfFileName}
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground text-xs sm:text-sm h-7 sm:h-10"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label className="text-muted-foreground text-xs sm:text-sm">{t.companyLogo}</Label>
            {logo ? (
              <div className="relative w-full h-20 sm:h-32 border border-[#282b2e] rounded-md overflow-hidden bg-[#1b1d1e]">
                <Image
                  src={logo || "/placeholder.svg"}
                  alt="Company Logo"
                  fill
                  style={{ objectFit: "contain" }}
                  onError={() => {
                    // إذا فشل تحميل الصورة، قم بإزالة الشعار
                    setLogo(undefined)
                    toast({
                      title: "خطأ في تحميل الشعار",
                      description: "تعذر تحميل الشعار. يرجى المحاولة مرة أخرى.",
                      variant: "destructive",
                    })
                  }}
                />
                <TeslaButton
                  variant="secondary"
                  size="icon"
                  className={`absolute top-1 ${dir === "rtl" ? "left-1" : "right-1"} h-6 w-6 sm:h-8 sm:w-8 bg-[#282b2e]`}
                  onClick={handleRemoveLogo}
                >
                  <X className="h-3 w-3 sm:h-4 sm:w-4" />
                </TeslaButton>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full">
                <TeslaButton
                  type="button"
                  variant="secondary"
                  className={`flex flex-col items-center justify-center w-full h-20 sm:h-32 border-2 border-dashed border-[#282b2e] rounded-lg cursor-pointer bg-[#1b1d1e] hover:bg-[#1f2124] transition-colors duration-200 active:bg-[#18191b] ${
                    uploadActive ? "bg-[#1f2124]" : ""
                  }`}
                  onClick={triggerFileInput}
                  onTouchStart={() => setUploadActive(true)}
                  onTouchEnd={() => {
                    setUploadActive(false)
                    triggerFileInput()
                  }}
                  onMouseDown={() => setUploadActive(true)}
                  onMouseUp={() => setUploadActive(false)}
                  onMouseLeave={() => uploadActive && setUploadActive(false)}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <Loader2 className="w-5 h-5 sm:w-8 sm:h-8 mb-1 sm:mb-2 text-muted-foreground animate-spin" />
                  ) : (
                    <Upload className="w-5 h-5 sm:w-8 sm:h-8 mb-1 sm:mb-2 text-muted-foreground" />
                  )}
                  <p className="mb-0 sm:mb-2 text-xs sm:text-sm text-muted-foreground">
                    <span className="font-semibold">{isUploading ? t.uploadingLogo : t.clickToUpload}</span>{" "}
                    {!isUploading && <span className="hidden sm:inline">{t.dragAndDrop}</span>}
                  </p>
                  <p className="text-xs text-muted-foreground hidden xs:block">{t.maxFileSize}</p>
                  <Input
                    id="logo-upload"
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/svg+xml"
                    className="hidden"
                    onChange={handleLogoUpload}
                    disabled={isUploading}
                    aria-label={t.companyLogo}
                  />
                </TeslaButton>
              </div>
            )}
            {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}
          </div>
        </div>
        <DialogFooter
          className={`flex ${dir === "rtl" ? "flex-row-reverse" : "flex-row"} sm:justify-end gap-1 sm:gap-2 mt-2`}
        >
          <TeslaButton onClick={handleSave} className="text-xs sm:text-sm py-1 px-2 sm:py-2 sm:px-4 h-8 sm:h-10">
            {t.saveInfo}
          </TeslaButton>
          <TeslaButton
            variant="secondary"
            onClick={() => onOpenChange(false)}
            className="text-xs sm:text-sm py-1 px-2 sm:py-2 sm:px-4 h-8 sm:h-10"
          >
            {t.cancel}
          </TeslaButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

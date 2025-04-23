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
import { Building2, Upload, X } from "lucide-react"
import Image from "next/image"
import { useLanguage } from "@/lib/i18n/language-context"

export type CompanyInfo = {
  name: string
  address: string
  phone: string
  logo?: string // Base64 encoded image
  pdfFileName?: string // اسم ملف PDF
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
  const [uploadActive, setUploadActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // تحسين وظيفة تحميل الشعار
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    const reader = new FileReader()
    reader.onload = (event) => {
      setLogo(event.target?.result as string)
      setIsUploading(false)
    }
    reader.onerror = () => {
      setIsUploading(false)
    }
    reader.readAsDataURL(file)
  }

  // وظيفة جديدة للنقر على منطقة التحميل
  const triggerFileInput = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click()

      // Añadir un pequeño retraso para dispositivos móviles
      setTimeout(() => {
        if (fileInputRef.current) {
          fileInputRef.current.focus()
        }
      }, 100)
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
        className="sm:max-w-[425px] max-w-[90vw] bg-card text-foreground border-border p-4 sm:p-6"
        dir={dir}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground text-base sm:text-lg">
            <Building2 className="h-4 w-4 sm:h-5 sm:w-5" />
            {t.companyInfoTitle}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs sm:text-sm">
            {t.companyInfoDescription}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-2 sm:py-4">
          <div className="grid gap-2">
            <Label htmlFor="company-name" className="text-muted-foreground text-xs sm:text-sm">
              {t.companyName}
            </Label>
            <div className="tesla-input p-1">
              <Input
                id="company-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.companyName}
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground text-sm h-8 sm:h-10"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="company-address" className="text-muted-foreground text-xs sm:text-sm">
              {t.companyAddress}
            </Label>
            <div className="tesla-input p-1">
              <Input
                id="company-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={t.companyAddress}
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground text-sm h-8 sm:h-10"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="company-phone" className="text-muted-foreground text-xs sm:text-sm">
              {t.companyPhone}
            </Label>
            <div className="tesla-input p-1">
              <Input
                id="company-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t.companyPhone}
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground text-sm h-8 sm:h-10"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="pdf-file-name" className="text-muted-foreground text-xs sm:text-sm">
              {t.pdfFileName}
            </Label>
            <div className="tesla-input p-1">
              <Input
                id="pdf-file-name"
                value={pdfFileName}
                onChange={(e) => setPdfFileName(e.target.value)}
                placeholder={t.pdfFileName}
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground text-sm h-8 sm:h-10"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label className="text-muted-foreground text-xs sm:text-sm">{t.companyLogo}</Label>
            {logo ? (
              <div className="relative w-full h-24 sm:h-32 border border-[#282b2e] rounded-md overflow-hidden bg-[#1b1d1e]">
                <Image src={logo || "/placeholder.svg"} alt="Company Logo" fill style={{ objectFit: "contain" }} />
                <TeslaButton
                  variant="secondary"
                  size="icon"
                  className={`absolute top-2 ${dir === "rtl" ? "left-2" : "right-2"} h-8 w-8 bg-[#282b2e]`}
                  onClick={handleRemoveLogo}
                >
                  <X className="h-4 w-4" />
                </TeslaButton>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full">
                {/* استخدام زر بدلاً من label لتحسين الاستجابة على الأجهزة المحمولة */}
                <TeslaButton
                  type="button"
                  variant="secondary"
                  className={`flex flex-col items-center justify-center w-full h-24 sm:h-32 border-2 border-dashed border-[#282b2e] rounded-lg cursor-pointer bg-[#1b1d1e] hover:bg-[#1f2124] transition-colors duration-200 active:bg-[#18191b] ${
                    uploadActive ? "bg-[#1f2124]" : ""
                  }`}
                  onClick={triggerFileInput}
                  onTouchStart={() => setUploadActive(true)}
                  onTouchEnd={() => {
                    setUploadActive(false)
                    triggerFileInput() // Llamar explícitamente al trigger en onTouchEnd para dispositivos móviles
                  }}
                  onMouseDown={() => setUploadActive(true)}
                  onMouseUp={() => setUploadActive(false)}
                  onMouseLeave={() => uploadActive && setUploadActive(false)}
                >
                  <Upload className="w-6 h-6 sm:w-8 sm:h-8 mb-1 sm:mb-2 text-muted-foreground" />
                  <p className="mb-1 sm:mb-2 text-xs sm:text-sm text-muted-foreground">
                    <span className="font-semibold">{t.clickToUpload}</span>{" "}
                    <span className="hidden sm:inline">{t.dragAndDrop}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{t.maxFileSize}</p>
                  <Input
                    id="logo-upload"
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                    disabled={isUploading}
                    aria-label={t.companyLogo}
                  />
                </TeslaButton>
              </div>
            )}
            {isUploading && <p className="text-sm text-center text-muted-foreground">{t.uploadingLogo}</p>}
          </div>
        </div>
        <DialogFooter className={`flex ${dir === "rtl" ? "flex-row-reverse" : "flex-row"} sm:justify-end gap-2 mt-2`}>
          <TeslaButton onClick={handleSave} className="text-xs sm:text-sm py-1.5 px-3 sm:py-2 sm:px-4">
            {t.saveInfo}
          </TeslaButton>
          <TeslaButton
            variant="secondary"
            onClick={() => onOpenChange(false)}
            className="text-xs sm:text-sm py-1.5 px-3 sm:py-2 sm:px-4"
          >
            {t.cancel}
          </TeslaButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

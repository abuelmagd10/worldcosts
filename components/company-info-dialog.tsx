"use client"

import type React from "react"

import { useState, useRef } from "react"
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
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      <DialogContent className="sm:max-w-[425px] bg-card text-foreground border-border" dir={dir}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Building2 className="h-5 w-5" />
            {t.companyInfoTitle}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">{t.companyInfoDescription}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="company-name" className="text-muted-foreground">
              {t.companyName}
            </Label>
            <div className="tesla-input p-1">
              <Input
                id="company-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.companyName}
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="company-address" className="text-muted-foreground">
              {t.companyAddress}
            </Label>
            <div className="tesla-input p-1">
              <Input
                id="company-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={t.companyAddress}
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="company-phone" className="text-muted-foreground">
              {t.companyPhone}
            </Label>
            <div className="tesla-input p-1">
              <Input
                id="company-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t.companyPhone}
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="pdf-file-name" className="text-muted-foreground">
              {t.pdfFileName}
            </Label>
            <div className="tesla-input p-1">
              <Input
                id="pdf-file-name"
                value={pdfFileName}
                onChange={(e) => setPdfFileName(e.target.value)}
                placeholder={t.pdfFileName}
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label className="text-muted-foreground">{t.companyLogo}</Label>
            {logo ? (
              <div className="relative w-full h-32 border border-[#282b2e] rounded-md overflow-hidden bg-[#1b1d1e]">
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
                <label
                  htmlFor="logo-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#282b2e] rounded-lg cursor-pointer bg-[#1b1d1e] hover:bg-[#1f2124]"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">{t.clickToUpload}</span> {t.dragAndDrop}
                    </p>
                    <p className="text-xs text-muted-foreground">{t.maxFileSize}</p>
                  </div>
                  <Input
                    id="logo-upload"
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                    disabled={isUploading}
                  />
                </label>
              </div>
            )}
            {isUploading && <p className="text-sm text-center text-muted-foreground">{t.uploadingLogo}</p>}
          </div>
        </div>
        <DialogFooter className={`flex ${dir === "rtl" ? "flex-row-reverse" : "flex-row"} sm:justify-end gap-2`}>
          <TeslaButton onClick={handleSave}>{t.saveInfo}</TeslaButton>
          <TeslaButton variant="secondary" onClick={() => onOpenChange(false)}>
            {t.cancel}
          </TeslaButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

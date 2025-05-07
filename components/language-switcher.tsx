"use client"
import { Check, Globe } from "lucide-react"
import { TeslaButton } from "@/components/ui/tesla-button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/lib/i18n/language-context"
import { languages, type LanguageCode } from "@/lib/i18n/translations"
import { useState } from "react"

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const handleLanguageChange = (lang: LanguageCode) => {
    setLanguage(lang)
    setIsOpen(false)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <TeslaButton
          variant="circle"
          size="icon"
          className="rounded-full bg-tesla-blue text-white h-8 w-8 sm:h-10 sm:w-10 min-h-[32px] min-w-[32px] sm:min-h-[40px] sm:min-w-[40px]"
          aria-label="تغيير اللغة"
          aria-expanded={isOpen}
        >
          <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="sr-only">تغيير اللغة</span>
        </TeslaButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-card border-border text-foreground w-[150px] sm:w-auto" sideOffset={8}>
        <DropdownMenuGroup>
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code as LanguageCode)}
              className="flex items-center justify-between hover:bg-secondary cursor-pointer py-2 sm:py-3 px-3 sm:px-4 min-h-[36px] sm:min-h-[44px] text-sm sm:text-base"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  handleLanguageChange(lang.code as LanguageCode)
                }
              }}
            >
              <span>{lang.name}</span>
              {language === lang.code && <Check className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2 text-tesla-blue" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

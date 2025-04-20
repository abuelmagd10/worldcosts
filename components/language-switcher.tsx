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

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <TeslaButton variant="circle" size="icon" className="rounded-full bg-tesla-blue text-white">
          <Globe className="h-5 w-5" />
          <span className="sr-only">Switch language</span>
        </TeslaButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-card border-border text-foreground">
        <DropdownMenuGroup>
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => setLanguage(lang.code as LanguageCode)}
              className="flex items-center justify-between hover:bg-secondary cursor-pointer"
            >
              <span>{lang.name}</span>
              {language === lang.code && <Check className="h-4 w-4 ml-2 text-tesla-blue" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

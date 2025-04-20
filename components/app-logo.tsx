import Image from "next/image"

interface AppLogoProps {
  className?: string
  size?: number
}

export function AppLogo({ className = "", size = 40 }: AppLogoProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <Image src="/icons/logo.png" alt="WorldCosts Logo" width={size} height={size} className="rounded-full" />
    </div>
  )
}

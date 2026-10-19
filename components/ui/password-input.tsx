"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

import { Input } from "@/components/ui/input"
import { useDictionary } from "@/lib/i18n/dictionary-provider"
import { cn } from "@/lib/utils"

type PasswordInputProps = Omit<React.ComponentProps<typeof Input>, "type">

export function PasswordInput({ className, disabled, ...props }: PasswordInputProps) {
  const dict = useDictionary()
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="relative">
      <Input
        {...props}
        type={showPassword ? "text" : "password"}
        disabled={disabled}
        className={cn("pr-9", className)}
      />
      <button
        type="button"
        onClick={() => setShowPassword((value) => !value)}
        disabled={disabled}
        className="absolute right-1.5 top-1/2 -translate-y-1/2 cursor-pointer p-1 text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
        aria-label={showPassword ? dict.common.hidePassword : dict.common.showPassword}
      >
        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  )
}

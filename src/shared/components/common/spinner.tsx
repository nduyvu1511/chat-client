import { SpinnerIcon } from "@/assets"
import React from "react"

interface SpinnerProps {
  size?: number
  className?: string
}

const Spinner = ({ className = "", size = 24 }: SpinnerProps) => {
  return (
    <div className={`flex-center py-[20px] ${className}`}>
      <SpinnerIcon size={size} className={`animate-spin text-gray-color-3`} />
    </div>
  )
}

export { Spinner }

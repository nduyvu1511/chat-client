import React from "react"

interface BadgeProps {
  count: number
  className?: string
  size?: number
}

const Badge = ({ count, className = "", size = 14 }: BadgeProps) => {
  return (
    <div
      style={{
        width: size,
        height: size,
      }}
      className={`relative rounded-[50%] text-[8px] font-normal flex-center bg-error text-white-color ${className}`}
    >
      {count > 9 ? `9+` : count}
    </div>
  )
}

export { Badge }

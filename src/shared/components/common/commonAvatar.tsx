import { blankAvatar } from "@/assets"
import Image from "next/image"

interface CommonAvatarProps {
  size: number
  className?: string
  url: string
  onClick?: Function
}

export const CommonAvatar = ({ size, className, url, onClick }: CommonAvatarProps) => {
  return (
    <span
      onClick={() => onClick?.()}
      style={{ width: size, height: size }}
      className={`rounded-[50%] relative overflow-hidden cursor-pointer ${className}`}
    >
      <Image loading="lazy" src={url || blankAvatar} alt="" objectFit="cover" layout="fill" />
    </span>
  )
}

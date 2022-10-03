import { imageBlur } from "@/assets"
import { MESSAGE_EMOTION_ICON } from "@/helper"
import { MessageReactionType } from "@/models"
import Image from "next/image"
import React from "react"

interface MessageReactionIconProps {
  emotion_type: MessageReactionType
  size?: number
  className?: string
}

export const MessageReactionIcon = ({
  emotion_type,
  size = 28,
  className = "",
}: MessageReactionIconProps) => {
  return (
    <span style={{ height: size, width: size }} className={`relative ${className}`}>
      <Image
        blurDataURL={imageBlur}
        src={MESSAGE_EMOTION_ICON[emotion_type]}
        alt=""
        layout="fill"
        objectFit="cover"
      />
    </span>
  )
}

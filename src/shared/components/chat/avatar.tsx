import { blankAvatar } from "@/assets"
import Image from "next/image"
import React from "react"

interface RoomAvatarProps {
  avatar: string
  isOnline?: boolean
}

export const Avatar = ({ avatar, isOnline }: RoomAvatarProps) => {
  return (
    <div className="w-[46px] h-[46px] rounded-[50%] relative">
      <Image
        src={avatar || blankAvatar}
        alt=""
        className="rounded-[50%]"
        layout="fill"
        objectFit="cover"
      />
      {isOnline ? (
        <span className="absolute right-0 bottom-[4px] w-[8px] h-[8px] bg-[#22DF64] shadow-shadow-1 rounded-[50%]"></span>
      ) : null}
    </div>
  )
}

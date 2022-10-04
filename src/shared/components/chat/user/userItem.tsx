import { imageBlur } from "@/assets"
import { MessageReactionType } from "@/models"
import Image from "next/image"
import React from "react"
import { MessageReactionIcon } from "../message"

interface UserItemProps {
  data: {
    user_id: string
    avatar: string
    user_name: string
    reaction?: MessageReactionType
  }
  onClick?: (id: string) => void
  className?: string
}

export const UserItem = ({ data, onClick, className = "" }: UserItemProps) => {
  return (
    <div className={`flex items-center cursor-default select-none ${className}`}>
      <div
        onClick={() => onClick?.(data.user_id)}
        className="flex items-center flex-1 cursor-pointer"
      >
        <span className="w-[40px] h-[40px] rounded-[50%] overflow-hidden mr-12 relative">
          <Image blurDataURL={imageBlur} src={data.avatar} alt="" layout="fill" objectFit="cover" />
        </span>
        <span className="text-14 font-medium text-blue-8 flex-1 line-clamp-1 word-wrap-anywhere">
          {data.user_name}
        </span>
      </div>
      {data?.reaction ? (
        <MessageReactionIcon className="ml-12" emotion_type={data.reaction} size={24} />
      ) : null}
    </div>
  )
}

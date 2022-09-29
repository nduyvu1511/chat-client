import { MESSAGE_STATUS } from "@/helper"
import { MessageResponseStatus } from "@/models"
import moment from "moment"
import React from "react"

interface MessageItemStatusProps {
  createdAt: Date
  status?: MessageResponseStatus
  showStatus: boolean
  isRead: boolean
  className?: string
}

export const MessageItemStatus = ({
  createdAt,
  status,
  showStatus,
  isRead,
  className = "",
}: MessageItemStatusProps) => {
  return (
    <div className={`flex items-center ${className}`}>
      <p className="text-xs text-[10px] mr-24">{moment(createdAt).format("HH:mm")}</p>

      {status && status !== "fulfilled" ? (
        <p className="text-xs text-[10px] ml-auto"> {MESSAGE_STATUS[status]}</p>
      ) : showStatus ? (
        <p className="text-xs text-[10px] ml-auto">{isRead ? "Đã xem" : "Đã gửi"}</p>
      ) : null}
    </div>
  )
}

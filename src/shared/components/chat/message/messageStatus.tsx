import { MESSAGE_STATUS } from "@/helper"
import { MessageResponseStatus } from "@/models"
import moment from "moment"
import { BsArrowCounterclockwise } from "react-icons/bs"

interface MessageStatusProps {
  createdAt: Date
  status?: MessageResponseStatus
  showStatus: boolean
  isRead: boolean
  className?: string
  onResendMessage?: () => void
}

const textStyle = "text-[11px] font-medium text-gray-color-3 leading-[16px]"

export const MessageStatus = ({
  createdAt,
  status,
  showStatus,
  isRead,
  className = "",
  onResendMessage,
}: MessageStatusProps) => {
  return (
    <div className={`${className}`}>
      <div className={`flex items-center`}>
        <p className={`${textStyle} mr-24`}>{moment(createdAt).format("HH:mm")}</p>

        {status && status !== "fulfilled" ? (
          <p className={`${textStyle} ml-auto ${status === "rejected" ? "text-error" : ""}`}>
            {MESSAGE_STATUS[status]}
          </p>
        ) : showStatus ? (
          <p className={`${textStyle} ml-auto`}>{isRead ? "Đã xem" : "Đã gửi"}</p>
        ) : null}
      </div>
      {status === "rejected" ? (
        <button
          onClick={() => onResendMessage?.()}
          className="flex items-center mt-8 hover:text-primary"
        >
          <BsArrowCounterclockwise className="mr-4" />
          <span className={`${textStyle} ml-auto hover:text-primary`}>Gửi lại</span>
        </button>
      ) : null}
    </div>
  )
}

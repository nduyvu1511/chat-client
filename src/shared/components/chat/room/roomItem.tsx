import { CheckIcon2, CloseThickIcon } from "@/assets"
import { Badge } from "@/components"
import { RootState } from "@/core/store"
import { getMessageDescription, toFirstUpperCase } from "@/helper"
import { RoomRes } from "@/models"
import moment from "moment"
import "moment/locale/vi"
import { useSelector } from "react-redux"
import { Avatar } from "../common/avatar"

interface RoomItemProps {
  data: RoomRes | null
  isActive?: boolean
  type?: "search" | "room" | "history"
  onSelectRoom?: (data: RoomRes) => void
  onDeleteHistory?: (data: RoomRes) => void
  className?: string
}

export const RoomItem = ({
  data,
  onSelectRoom,
  isActive,
  type = "room",
  onDeleteHistory,
  className = "",
}: RoomItemProps) => {
  const currentRoomId = useSelector((state: RootState) => state.chat.currentRoomId)
  const messageUnsend = useSelector((state: RootState) =>
    state.chat.messageFormData?.find((item) => item.room_id === data?.room_id)
  )

  if (data === null)
    return (
      <div className="flex items-center py-16">
        <div className="w-[56px] h-[56px] rounded-[50%] mr-12 skeleton"></div>
        <div className="flex-1">
          <div className="h-[14px] skeleton rounded-[4px] max-w-[120px] w-[70%] mr-24 mb-8"></div>
          <div className="h-12 w-[40%] skeleton rounded-[4px] mb-8"></div>
          <div className="h-12 w-[90%] skeleton rounded-[4px]"></div>
        </div>
      </div>
    )

  return (
    <div
      onClick={() => onSelectRoom?.(data)}
      className={`p-12 lg:p-16 flex items-center cursor-pointer rounded-[8px] select-none room-item-${
        data.room_id
      } ${isActive ? "bg-blue-10" : "hover:bg-bg"} ${className}`}
    >
      <div className="mr-12">
        <Avatar
          isGroup={data.room_type === "group"}
          avatarGroup={data.top_members?.map((item) => item.user_avatar)}
          avatar={data?.room_avatar || (data as any)?.room_avatar?.thumbnail_url || ""}
          isOnline={data.is_online}
          memberCount={data.member_count}
        />
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold leading-[20px] text-primary flex-1 line-clamp-1 mr-12 word-wrap-anywhere">
            {data.room_name}
          </p>

          {currentRoomId !== data.room_id &&
          (messageUnsend?.attachments?.length ||
            messageUnsend?.text ||
            messageUnsend?.reply_to?.message_id) ? (
            <p className="text-[10px] md:text-12 md:font-medium leading-[18px] text-error">
              Chưa gửi
            </p>
          ) : data?.last_message?.created_at && type === "room" ? (
            <p className="text-[10px] md:text-xs text-gray-color-5">
              {toFirstUpperCase(moment(data?.last_message?.created_at).fromNow())}
            </p>
          ) : null}

          {type === "history" ? (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDeleteHistory?.(data)
              }}
              className="p-2"
            >
              <CloseThickIcon className="w-10 text-gray-color-3 hover:text-primary" />
            </button>
          ) : null}
        </div>

        {data?.last_message?.message_id && type === "room" ? (
          <div className="flex items-center">
            {currentRoomId !== data.room_id && messageUnsend?.text ? (
              <p className="text-12 leading-[18px] font-medium line-clamp-1 word-wrap-anywhere flex-1 mr-12">
                {getMessageDescription({
                  message_text: messageUnsend?.text,
                  attachments: messageUnsend?.attachments as any[],
                  location: messageUnsend?.location,
                } as any)}
              </p>
            ) : (
              <div
                className={`flex-1 flex items-center mr-12 ${
                  !data?.message_unread_count ? "text-gray-color-7" : "text-blue-50"
                }`}
              >
                <span className="text-12 font-medium leading-[18px] mr-4  line-clamp-1 word-wrap-anywhere">
                  {data?.last_message?.is_author ? "Bạn" : data.last_message?.author_name}:
                </span>
                <span
                  className={`text-12 leading-[18px] font-medium line-clamp-1 word-wrap-anywhere flex-1`}
                >
                  {data?.last_message?.message_text}
                </span>
              </div>
            )}

            <div className="">
              {data?.message_unread_count ? (
                <Badge className="text-10" count={data.message_unread_count} size={16} />
              ) : (
                <CheckIcon2 className="text-gray-color-5" />
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

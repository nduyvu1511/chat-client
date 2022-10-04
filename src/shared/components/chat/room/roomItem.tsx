import { CheckIcon2, CloseThickIcon } from "@/assets"
import { Badge } from "@/components"
import { RoomRes } from "@/models"
import moment from "moment"
import { Avatar } from "../avatar"

interface RoomItemProps {
  data: RoomRes | null
  isActive?: boolean
  type?: "search" | "room" | "history"
  onSelectRoom?: (data: RoomRes) => void
  onDeleteHistory?: (data: RoomRes) => void
}

export const RoomItem = ({
  data,
  onSelectRoom,
  isActive,
  type = "room",
  onDeleteHistory,
}: RoomItemProps) => {
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
      } ${isActive ? "bg-blue-10" : "hover:bg-bg"}`}
    >
      <div className="mr-12">
        <Avatar
          isGroup={data.room_type === "group"}
          avatarGroup={data.top_members?.map((item) => item.user_avatar)}
          avatar={data?.room_avatar || ""}
          isOnline={data.is_online}
          memberCount={data.member_count}
        />
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold leading-[20px] text-primary flex-1 line-clamp-1 mr-12 word-wrap-anywhere">
            {data.room_name}
          </p>

          {data?.last_message?.created_at && type === "room" ? (
            <p className="text-[10px] text-xs text-gray-color-5">
              {moment(data?.last_message?.created_at).fromNow()}
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
            <div className="flex-1">
              <p className="text-10 text-gray-color-6 font-medium leading-[18px] mb-4">
                {data?.last_message?.is_author ? "Bạn: " : data.last_message?.author_name}
              </p>
              <p
                className={`text-xs leading-[18px] line-clamp-1 word-wrap-anywhere ${
                  !data?.message_unread_count ? "text-gray-color-7" : "text-blue-50"
                }`}
              >
                {data?.last_message?.message_text}
              </p>
            </div>
            <div className="">
              {data?.message_unread_count ? (
                <Badge className="text-10" count={data.message_unread_count} size={18} />
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

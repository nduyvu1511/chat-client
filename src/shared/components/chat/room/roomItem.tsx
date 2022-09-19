import { CheckIcon2 } from "@/assets"
import { Badge } from "@/components"
import { RoomRes } from "@/models"
import moment from "moment"
import { Avatar } from "../avatar"

interface RoomItemProps {
  data: RoomRes
  onSelectRoom?: (data: RoomRes) => void
  isActive?: boolean
}

export const RoomItem = ({ data, onSelectRoom, isActive }: RoomItemProps) => {
  return (
    <div
      onClick={() => onSelectRoom?.(data)}
      className={`p-16 flex items-center cursor-pointer rounded-[8px] ${
        isActive ? "bg-blue-10" : "hover:bg-gray-05"
      }`}
    >
      <div className="mr-12">
        <Avatar avatar={data.room_avatar?.thumbnail_url || ""} isOnline={data.is_online} />
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-primary flex-1 line-clamp-1 mr-12 word-break">
            {data.room_name}
          </p>
          {data?.last_message?.created_at ? (
            <p className="text-xs text-gray-color-5">
              {moment(data?.last_message?.created_at).fromNow()}
            </p>
          ) : null}
        </div>
        {data?.last_message ? (
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-10 text-gray-color-6 font-medium leading-[18px]">
                {data.last_message?.author?.author_name}
              </p>
              <p className={`text-xs line-clamp-1 ${true ? "text-gray-color-7" : "text-primary"}`}>
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

import { blankAvatar, ThreeDotsIcon } from "@/assets"
import { RoomDetailRes } from "@/models"
import moment from "moment"
import { Avatar } from "../avatar"

interface RoomHeaderProps {
  data: RoomDetailRes
}

export const RoomHeader = ({ data }: RoomHeaderProps) => {
  return (
    <div className="flex">
      <div className="flex items-center flex-1 mr-16">
        <div className="mr-12">
          <Avatar
            memberCount={data.member_count}
            isGroup={data.room_type === "group"}
            isOnline={data.is_online}
            avatar={data.room_avatar?.thumbnail_url || blankAvatar}
            avatarGroup={data.members?.data?.map((item) => item.avatar.thumbnail_url)}
          />
        </div>

        <div className="flex-1">
          <p className="text-sm font-semibold md:text-semibold text-primary line-clamp-1">
            {data.room_name}
          </p>
          {!data.is_online && data?.offline_at ? (
            <p className="text-xs text-gray-color-5">{moment(data?.offline_at).fromNow()}</p>
          ) : null}
        </div>
      </div>

      <div className="">
        <button className="w-[36px] h-[36px] rounded-[8px] bg-gray-05 flex-center">
          <ThreeDotsIcon className="h-[12px]" />
        </button>
      </div>
    </div>
  )
}

import { MultiUserIcon } from "@/assets"
import { RoomDetailRes } from "@/models"
import moment from "moment"
import { Avatar } from "../avatar"

interface RoomHeaderProps {
  data: RoomDetailRes
  onClick?: () => void
}

export const RoomHeader = ({ data, onClick }: RoomHeaderProps) => {
  return (
    <div className="h-full px-16 flex-center">
      <div className="flex items-center flex-1 mr-16">
        <div className="mr-12">
          <Avatar
            onClick={onClick}
            memberCount={data.member_count}
            isGroup={data.room_type === "group"}
            isOnline={data.is_online}
            avatar={data.room_avatar?.thumbnail_url || ""}
            avatarGroup={data.members?.data?.map((item) => item.avatar.thumbnail_url)}
          />
        </div>

        <div className="flex-1">
          <p className="text-base font-semibold md:text-semibold text-primary line-clamp-1 word-break mb-4">
            {data.room_name}
          </p>
          <div className="flex items-center">
            {data.room_type === "group" ? (
              <button
                onClick={onClick}
                className="text-[13px] font-medium mr-12 text-gray-color-4 flex cursor-pointer"
              >
                <MultiUserIcon className="mr-4 text-base" />
                {data.member_count} Thành viên
              </button>
            ) : null}
            {!data.is_online && data?.offline_at ? (
              <p className="text-[12px] font-medium text-gray-color-5">
                {moment(data?.offline_at).fromNow()}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="">
        {/* <button className="w-[36px] h-[36px] rounded-[8px] bg-gray-05 flex-center">
          <ThreeDotsIcon className="h-[12px]" />
        </button> */}
      </div>
    </div>
  )
}

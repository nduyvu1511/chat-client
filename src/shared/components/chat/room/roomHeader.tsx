import { ArrowLeft2Icon, MultiUserIcon } from "@/assets"
import { RoomDetailRes } from "@/models"
import { setCurrentRoomId } from "@/modules"
import moment from "moment"
import { useDispatch } from "react-redux"
import { Avatar } from "../avatar"

interface RoomHeaderProps {
  data: RoomDetailRes
  onClick?: () => void
}

export const RoomHeader = ({ data, onClick }: RoomHeaderProps) => {
  const dispatch = useDispatch()
  return (
    <div className="h-full px-16 flex-center">
      <div className="mr-12 sm:hidden">
        <button className="p-8" onClick={() => dispatch(setCurrentRoomId(undefined))}>
          <ArrowLeft2Icon className="w-[10px]" />
        </button>
      </div>

      <div className="flex items-center flex-1">
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
          <p className="text-sm leading-[20px] font-semibold text-primary line-clamp-1 word-break mb-4">
            {data.room_name}
          </p>
          <div className="flex items-center">
            {data.room_type === "group" ? (
              <button onClick={onClick} className="flex cursor-pointer">
                <MultiUserIcon className="hidden sm:block mr-4 text-base w-[14px] h-[14px]" />
                <p className="text-[10px] sm:text-[12px] mr-12 text-gray-color-4">
                  {data.member_count} Thành viên
                </p>
              </button>
            ) : null}
            {!data.is_online && data?.offline_at ? (
              <p className="text-[10px] sm:text-[12px] text-gray-color-4">
                {moment(data?.offline_at).fromNow()}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

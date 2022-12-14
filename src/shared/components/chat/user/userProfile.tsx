import { blankAvatar, imageBlur } from "@/assets"
import { useAsync } from "@/hooks"
import { ListRes, RoomRes, UserRes } from "@/models"
import {
  setcurrentDetailMessageId,
  setCurrentMessageEmotionId,
  setCurrentProfileId,
  setCurrentRoomId,
  setCurrentRoomInfo,
} from "@/modules"
import { chatApi } from "@/services"
import produce from "immer"
import moment from "moment"
import Image from "next/image"
import { useDispatch } from "react-redux"
import { useSWRConfig } from "swr"

interface UserProfileProps {
  data: UserRes
}

export const UserProfile = ({ data }: UserProfileProps) => {
  const { cache, mutate } = useSWRConfig()
  const dispatch = useDispatch()
  const { asyncHandler } = useAsync()

  const joinRoomHandler = (roomId: string) => {
    dispatch(setCurrentRoomId(roomId))
    dispatch(setCurrentProfileId(undefined))
    dispatch(setCurrentRoomInfo(undefined))
    dispatch(setcurrentDetailMessageId(undefined))
    dispatch(setCurrentMessageEmotionId(undefined))
    document.querySelector(`.room-item-${roomId}`)?.scrollIntoView()
  }

  const handleJoinRoom = async () => {
    if (data.is_yourself) return

    if (data?.room_id) {
      joinRoomHandler(data.room_id)
    } else {
      asyncHandler<RoomRes>({
        fetcher: chatApi.createSingleChat({ partner_id: data.user_id }),
        onSuccess: (data) => {
          const roomList: ListRes<RoomRes[]> = cache.get("get_room_list")

          if (!roomList?.data?.length) {
            mutate("get_room_list")
          } else {
            mutate(
              "get_room_list",
              produce(roomList, (draft) => {
                draft.total += 1
                draft.offset += 1
                draft.data.unshift(data)
              }),
              false
            )
          }

          setTimeout(() => {
            joinRoomHandler(data.room_id)
          }, 100)
        },
      })
    }
  }

  return (
    <div>
      <div className="flex-center flex-col p-16 border-b border-border-color border-solid">
        <div className="relative mb-12 w-[80px] h-[80px] rounded-[50%] overflow-hidden">
          <Image
            blurDataURL={imageBlur}
            src={data.avatar?.thumbnail_url || blankAvatar}
            layout="fill"
            alt=""
            objectFit="cover"
          />
        </div>
        <p className="text-base font-semibold line-clamp-1 word-break">{data.user_name}</p>
        {!data?.is_yourself ? (
          <button
            onClick={handleJoinRoom}
            className="bg-bg h-[32px] px-32 py-4 rounded-[5px] text-sm font-semibold mt-16"
          >
            Nh???n tin
          </button>
        ) : null}
      </div>

      <div className="p-16">
        <p className="text-sm font-semibold mb-12">Th??ng tin c?? nh??n</p>

        <ul>
          <li className="flex items-start mb-12">
            <p className="text-xs leading-[24px] w-[100px]">Bio</p>
            <p className="text-sm">{data?.bio || "Ch??a c?? th??ng tin"}</p>
          </li>
          <li className="flex items-start mb-12">
            <p className="text-xs leading-[24px] w-[100px]">??i???n tho???i</p>
            <p className="text-sm">{data?.phone || ""}</p>
          </li>
          <li className="flex items-start mb-12">
            <p className="text-xs leading-[24px] w-[100px]">Gi???i t??nh</p>
            <p className="text-sm">
              {data?.gender === "female" ? "N???" : data.gender === "male" ? "Nam" : "Kh??c"}
            </p>
          </li>
          <li className="flex items-start">
            <p className="text-xs leading-[24px] w-[100px]">Ng??y sinh</p>
            <p className="text-sm">
              {data?.date_of_birth
                ? moment(data.date_of_birth).format("DD/MM/YYYY")
                : "Ch??a c?? th??ng tin"}
            </p>
          </li>
        </ul>
      </div>
    </div>
  )
}

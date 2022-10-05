import { ChangeStatusOfRoom, MessageRes, RoomDetailRes } from "@/models"
import { chatApi } from "@/services"
import { AxiosResponse } from "axios"
import produce from "immer"
import useSWR, { mutate } from "swr"

interface Res {
  changeStatusOfRoom: (_: ChangeStatusOfRoom) => void
  data: RoomDetailRes | undefined
  isValidating: boolean
  isFirstLoading: boolean
}

interface Props {
  roomId: string
  callback?: (_: { lastMessage: MessageRes; messages: MessageRes[] }) => void
}

export const useRoomDetail = ({ roomId, callback }: Props): Res => {
  const {
    data,
    error,
    isValidating,
    mutate: mutateRoomDetail,
  } = useSWR(
    roomId ? `get_room_detail_${roomId}` : null,
    roomId
      ? () =>
          chatApi.getRoomDetail(roomId).then((res: AxiosResponse<RoomDetailRes>) => {
            const data = res?.data
            mutate(`get_messages_in_room_${roomId}`, data.messages, false)

            const lastMessage = data.messages?.data?.[(data.messages?.data?.length || 0) - 1]
            if (lastMessage?.message_id && !lastMessage.is_author && !lastMessage.is_read) {
              callback?.({ lastMessage, messages: data?.messages?.data || [] })
            }

            return data
          })
      : null
  )

  const changeStatusOfRoom = (params: ChangeStatusOfRoom) => {
    if (!data) return

    if (params.type === "logout") {
      if (data.members.data?.filter((item) => item.is_online)?.length <= 2) {
        mutateRoomDetail(
          produce(data, (draft) => {
            draft.is_online = false
            draft.offline_at = new Date()
          }),
          false
        )
      }
    } else {
      if (!data?.is_online) {
        mutateRoomDetail(
          produce(data, (draft) => {
            draft.is_online = true
          }),
          false
        )
      }
    }
  }
  return {
    data,
    isFirstLoading: data === undefined && error === undefined,
    isValidating,
    changeStatusOfRoom,
  }
}

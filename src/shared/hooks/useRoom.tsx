import { ChangeStatusOfRoom, LastMessage, ListRes, RoomRes, UseQueryListRes } from "@/models"
import { chatApi } from "@/services"
import produce from "immer"
import { useQueryList } from "./useQueryList"

type UseRoomRes = UseQueryListRes<ListRes<RoomRes[]>> & {
  messageUnreadhandler: (_: LastMessage) => void
  changeStatusOfRoom: (_: ChangeStatusOfRoom) => void
  increaseMessageUnread: (_: LastMessage) => void
  appendLastMessage: (_: LastMessage) => void
  setCurrentRoomToFirstOrder: (_: LastMessage) => void
  clearMessagesUnreadFromRoom: (room_id: string) => void
}

export const useRoom = (roomId?: string): UseRoomRes => {
  const {
    isValidating,
    mutate,
    data,
    error,
    fetchMoreItem,
    filterList,
    hasMore,
    isFetchingMore,
    isInitialLoading,
    offset,
  } = useQueryList<ListRes<RoomRes[]>>({
    fetcher: chatApi.getRoomList,
    initialData: undefined,
    key: "get_room_list",
    limit: 30,
  })

  const messageUnreadhandler = (params: LastMessage) => {
    if (!data?.data?.length) return

    const index = getRoomIndex(params.room_id)
    if (index === -1) return

    if (roomId !== params.room_id) {
      increaseMessageUnread(params, (message_unread_count) => {
        mutate(
          produce(data, (draft) => {
            const room = { ...draft.data[index], last_message: params }
            if (data.data?.[0]?.room_id === params.room_id) {
              draft.data[index] = { ...room, message_unread_count }
            } else {
              const newRooms = draft.data.filter((item) => item.room_id !== params.room_id)
              draft.data = [{ ...room, message_unread_count }, ...newRooms]
            }
          }),
          false
        )
      })
    }
  }

  const getRoomIndex = (roomId: string): number => {
    const index =
      data && data?.data?.length > 0 ? data.data.findIndex((item) => item.room_id === roomId) : -1

    if (index === -1) {
      mutate()
    }
    return index
  }

  const increaseMessageUnread = async (
    params: LastMessage,
    cb?: (_: number) => void,
    onErr?: Function
  ) => {
    try {
      const res: any = await chatApi.addMessageUnreadToRoom({ message_id: params.message_id })
      if (res?.success) {
        cb?.(res?.data?.message_unread_count || 0)
      } else {
        onErr?.()
      }
    } catch (error) {}
  }

  const clearMessagesUnreadFromRoom = async (roomId: string) => {
    if (!data?.data?.length) return
    const index = getRoomIndex(roomId)
    if (index === -1) return

    const room = { ...data.data[index] }
    // for sure cause I.D.K what server sent
    if (!room.message_unread_count || room.message_unread_count <= 0) return

    try {
      const res: any = await chatApi.clearMessageUnreadFromRoom(roomId)
      await chatApi.confirmReadAllMessageInRoom(roomId)
      if (res?.success) {
        mutate(
          produce(data, (draft) => {
            draft.data[index].message_unread_count = 0
          }),
          false
        )
      }
    } catch (error) {}
  }

  const appendLastMessage = (params: LastMessage) => {
    if (!data?.data?.length) return

    mutate(
      produce(data, (draft) => {
        const index = getRoomIndex(params.room_id)
        if (index === -1) return
        draft.data[index].last_message = params
      }),
      false
    )
  }

  const setCurrentRoomToFirstOrder = (params: LastMessage) => {
    if (!data?.data?.length) return
    if (data?.data?.[0]?.room_id === params.room_id) return
    mutate(
      produce(data, (draft) => {
        const newRooms = draft.data.filter((item) => item.room_id !== params.room_id)
        const room = draft.data.find((item) => item.room_id === params.room_id)
        if (!room) return
        draft.data = [{ ...room, last_message: params }, ...newRooms]
      }),
      false
    )
  }

  const changeStatusOfRoom = (params: ChangeStatusOfRoom) => {
    if (!data?.data?.length) return

    if (params.type === "login") {
      mutate(
        produce(data, (draft) => {
          draft.data = draft.data.map((item) => {
            return params.room_joined_ids.includes(item.room_id)
              ? { ...item, is_online: true }
              : item
          })
        }),
        false
      )
    } else {
      mutate(
        produce(data, (draft) => {
          draft.data = draft.data.map((item) => {
            if (!params.room_joined_ids.includes(item.room_id)) {
              return item
            }
            if (item.room_type === "single" || item.message_unread_count <= 2) {
              return { ...item, is_online: false }
            }
            return item
          })
        }),
        false
      )
    }
  }

  return {
    data,
    error,
    fetchMoreItem,
    filterList,
    hasMore,
    isFetchingMore,
    isInitialLoading,
    isValidating,
    mutate,
    offset,
    appendLastMessage,
    changeStatusOfRoom,
    messageUnreadhandler,
    setCurrentRoomToFirstOrder,
    increaseMessageUnread,
    clearMessagesUnreadFromRoom,
  }
}

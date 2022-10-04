import { RootState } from "@/core/store"
import {
  ChangeStatusOfRoom,
  FriendStatusRes,
  ListRes,
  MessageRes,
  RoomDetailRes,
  RoomRes,
  RoomTypingRes,
  UserRes,
} from "@/models"
import {
  checkForUserDisconnectWhenTyping,
  setChatProfile,
  setCurrentTyping,
  setSocketInstance,
} from "@/modules"
import produce from "immer"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { io, Socket } from "socket.io-client"
import { useSWRConfig } from "swr"

interface Res {
  isConnected: boolean
}

export const useChat = (): Res => {
  const dispatch = useDispatch()
  const socketIo = useRef<Socket>()
  const { cache, mutate } = useSWRConfig()
  const roomId = useSelector((state: RootState) => state.chat.currentRoomId)

  const [isConnected, setConnected] = useState<boolean>(false)

  const changeStatusOfRoomList = (params: ChangeStatusOfRoom) => {
    const data: ListRes<RoomRes[]> = cache.get("get_room_list")
    if (!data?.data?.length) return

    if (params.type === "login") {
      mutate(
        "get_room_list",
        produce(data, (draft) => {
          draft.data = draft.data.map((item) => {
            return params.room_ids.includes(item.room_id) ? { ...item, is_online: true } : item
          })
        }),
        false
      )
    } else {
      mutate(
        "get_room_list",
        produce(data, (draft) => {
          draft.data = draft.data.map((item) => {
            if (!params.room_ids.includes(item.room_id)) {
              return item
            }
            if (
              item.room_type === "single" ||
              (item?.top_members || [])?.filter((item) => item?.is_online)?.length <= 2
            ) {
              return { ...item, is_online: false }
            }
            return item
          })
        }),
        false
      )
    }
  }

  const getRoomList = (): { data: ListRes<RoomRes[]>; key: string } | undefined => {
    const key = "get_room_list"
    const data: ListRes<RoomRes[]> = cache.get(key)
    if (!data?.data?.length) return undefined

    return { data, key }
  }
  console.log(cache)

  const getRoomDetail = (id: string): { data: RoomDetailRes; key: string } | undefined => {
    console.log({ roomId })
    const key = `get_room_detail_${id}`
    const data: RoomDetailRes = cache.get(key)
    if (!data?.room_id) return undefined

    return { data, key }
  }
  console.log({ room: roomId })
  const changeStatusOfRoomDetail = (params: ChangeStatusOfRoom) => {
    console.log({ roomId })
    if (!roomId) return
    const res = getRoomDetail(roomId)
    if (!res) return
    const { data, key } = res

    console.log(params)
    if (params.type === "logout") {
      if (data.members.data?.filter((item) => item.is_online)?.length <= 2) {
        mutate(
          key,
          produce(data, (draft) => {
            draft.is_online = false
            draft.offline_at = new Date()
          }),
          false
        )
      }
    } else {
      if (!data?.is_online) {
        mutate(
          key,
          produce(data, (draft) => {
            draft.is_online = true
          }),
          false
        )
      }
    }
  }

  useEffect(() => {
    // Connect to socket
    const socket = io(process.env.NEXT_PUBLIC_CHAT_SOCKET_URL as string, {
      query: {
        access_token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzFkNTZjNTRhMjBiZWY4MmU0NzlmMGQiLCJ1c2VyX2lkIjoyLCJyb2xlIjoiY3VzdG9tZXIiLCJpYXQiOjE2NjI5MDEzNTl9.7YgTIRjbTGsmUSEfz3RwHl0UdTgv6f9loNJ4Zmz_3nQ",
      },
    })

    dispatch(setSocketInstance(socket))
    socketIo.current = socket

    socket.emit("login")

    socket.on("connect", async () => {
      setConnected(true)

      socket.on("login", (res: UserRes) => {
        dispatch(setChatProfile(res))
      })

      // Listen to status of friend
      socket.on("friend_login", (user: FriendStatusRes) => {
        const args: ChangeStatusOfRoom = { ...user, type: "login" }
        changeStatusOfRoomList(args)
        changeStatusOfRoomDetail(args)
      })

      socket.on("friend_logout", (user: FriendStatusRes) => {
        const args: ChangeStatusOfRoom = { ...user, type: "logout" }
        dispatch(checkForUserDisconnectWhenTyping(user.user_id))
        changeStatusOfRoomDetail(args)
        changeStatusOfRoomList(args)
      })

      // Message listener
      socket.on("receive_message", (data: MessageRes) => {
        ;(document?.querySelector(".message-form-input") as HTMLInputElement)?.focus()
        // roomDetailRef.current?.appendMessage(data)
        // roomRef.current?.changeOrderAndAppendLastMessage(data)

        socket.emit("read_message", data)
      })

      socket.on("confirm_read_message", (data: MessageRes) => {
        // roomDetailRef.current?.changeMesageStatus(data)
      })

      socket.on("receive_unread_message", (data: MessageRes) => {
        // roomRef.current?.messageUnreadhandler(data)
      })

      socket.on("like_message", (payload: MessageRes) => {
        // roomDetailRef.current?.mutatePartnerReactionMessage(payload)
      })

      socket.on("unlike_message", (payload: MessageRes) => {
        // roomDetailRef.current?.mutatePartnerReactionMessage(payload)
      })

      // Typing listener
      socket.on("start_typing", (payload: RoomTypingRes) => {
        dispatch(setCurrentTyping(payload))
      })

      socket.on("stop_typing", (payload: RoomTypingRes) => {
        dispatch(setCurrentTyping(undefined))
      })
    })

    return () => {
      // socket.emit("logout", "631ac1558f56544cbc01a26d")
      socket.off("connect")
      socket.off("disconnect")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    isConnected,
  }
}

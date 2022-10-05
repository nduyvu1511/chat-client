import { Spinner } from "@/components"
import { RootState } from "@/core/store"
import { useBreakpoint, useDetectWindowFocus } from "@/hooks"
import {
  FriendStatusRes,
  MessageRes,
  RoomDetailFunctionHandler,
  RoomFunctionHandler,
  RoomRes,
  RoomTypingRes,
  UserRes,
} from "@/models"
import {
  checkForUserDisconnectWhenTyping,
  setChatProfile,
  setCurrentRoomId,
  setCurrentTyping,
  setSocketInstance,
} from "@/modules"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import io, { Socket } from "socket.io-client"
import { Room, RoomDetail } from "./room"

export const Chat = () => {
  const breakpoints = useBreakpoint()
  const dispatch = useDispatch()
  const isWindowFocus = useDetectWindowFocus()
  const socketIo = useRef<Socket>()
  const roomDetailRef = useRef<RoomDetailFunctionHandler>(null)
  const roomRef = useRef<RoomFunctionHandler>(null)
  const currentRoomId = useSelector((state: RootState) => state.chat.currentRoomId)

  const [isConnected, setConnected] = useState<boolean>(false)

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
        roomDetailRef.current?.changeStatusOfRoom({ ...user, type: "login" })
        roomRef.current?.changeStatusOfRoom({ ...user, type: "login" })
      })

      socket.on("friend_logout", (user: FriendStatusRes) => {
        dispatch(checkForUserDisconnectWhenTyping(user.user_id))
        roomDetailRef.current?.changeStatusOfRoom({ ...user, type: "logout" })
        roomRef.current?.changeStatusOfRoom({ ...user, type: "logout" })
      })

      // Message listener
      socket.on("receive_message", (data: MessageRes) => {
        roomDetailRef.current?.appendMessage(data)
        roomRef.current?.changeOrderAndAppendLastMessage(data)

        socket.emit("read_message", data)
      })

      socket.on("confirm_read_message", (data: MessageRes) => {
        roomDetailRef.current?.changeMesageStatus(data)
      })

      socket.on("receive_unread_message", (data: MessageRes) => {
        roomRef.current?.messageUnreadhandler(data)
      })

      socket.on("like_message", (payload: MessageRes) => {
        roomDetailRef.current?.mutatePartnerReactionMessage(payload)
      })

      socket.on("unlike_message", (payload: MessageRes) => {
        roomDetailRef.current?.mutatePartnerReactionMessage(payload)
      })

      // Typing listener
      socket.on("start_typing", (payload: RoomTypingRes) => {
        dispatch(setCurrentTyping(payload))
      })

      socket.on("stop_typing", () => {
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

  const handleSendMessage = (params: MessageRes) => {
    roomRef.current?.changeOrderAndAppendLastMessage(params)
  }

  const handleSelectRoom = (room: RoomRes) => {
    dispatch(setCurrentRoomId(room.room_id))
  }

  if (!isConnected) return <Spinner size={36} />
  return (
    <section className="grid md:grid-cols-chat-md lg:grid-cols-chat-lg gap-12 lg:gap-24 overflow-hidden flex-1">
      {!currentRoomId || breakpoints >= 768 ? (
        <aside className="block-element py-[18px] px-12 lg:p-24 lg:pr-12 flex flex-col">
          <Room ref={roomRef} onSelectRoom={handleSelectRoom} />
        </aside>
      ) : null}

      {breakpoints >= 768 || currentRoomId ? (
        <div className="block-element flex flex-col overflow-hidden">
          <RoomDetail onSendMessage={handleSendMessage} ref={roomDetailRef} />
        </div>
      ) : null}
    </section>
  )
}

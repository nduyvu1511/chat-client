import { Spinner } from "@/components"
import { useChat, useDetectWindowFocus } from "@/hooks"
import {
  MessageRes,
  RoomDetailFunctionHandler,
  RoomFunctionHandler,
  RoomRes,
  RoomTypingRes,
  UserData,
} from "@/models"
import {
  checkForUserDisconnectWhenTyping,
  setChatProfile,
  setCurrentRoomId,
  setCurrentTyping,
  setSocketInstance,
} from "@/modules"
import { useEffect, useRef, useState } from "react"
import { useDispatch } from "react-redux"
import io, { Socket } from "socket.io-client"
import { Room, RoomDetail } from "./room"

export const Chat = () => {
  const dispatch = useDispatch()
  const { loginToSocket, confirmReadMessage } = useChat()
  const socketIo = useRef<Socket>()
  const roomDetailRef = useRef<RoomDetailFunctionHandler>(null)
  const roomRef = useRef<RoomFunctionHandler>(null)

  const [isConnected, setConnected] = useState<boolean>(false)

  window.addEventListener("visibilitychange", () => {
    document.title = document.visibilityState
  })

  const isWindowFocus = useDetectWindowFocus()

  useEffect(() => {
    // Connect to socket
    const socket = io(process.env.NEXT_PUBLIC_CHAT_SOCKET_URL as string, {
      query: { access_token: "" },
    })
    dispatch(setSocketInstance(socket))
    socketIo.current = socket

    socket.on("connect", async () => {
      if (!socket.id) return

      // User listener
      // Login to socket io to change online status
      const user = await loginToSocket({ socket_id: socket.id })
      if (!user?.user_id) return

      socket.emit("login", user)
      dispatch(setChatProfile(user))
      setConnected(true)

      // Listen to status of user who have chat chat
      socket.on("login", (user: UserData) => {
        roomDetailRef.current?.changeStatusOfRoom({ ...user, type: "login" })
        roomRef.current?.changeStatusOfRoom({ ...user, type: "login" })
      })
      socket.on("logout", (user: UserData) => {
        console.log("user logout")
        dispatch(checkForUserDisconnectWhenTyping(user.user_id))
        roomDetailRef.current?.changeStatusOfRoom({ ...user, type: "logout" })
        roomRef.current?.changeStatusOfRoom({ ...user, type: "logout" })
      })

      // Message listener
      socket.on("receive_message", (data: MessageRes) => {
        console.log({ isWindowFocus })

        ;(document?.querySelector(".message-form-input") as HTMLInputElement)?.focus()
        roomDetailRef.current?.appendMessage(data)
        roomRef.current?.changeOrderAndAppendLastMessage(data)
        socket.emit("read_message", data)
        confirmReadMessage(data.message_id)
      })
      socket.on("confirm_read_message", (data: MessageRes) => {
        roomDetailRef.current?.changeMesageStatus(data)
        console.log("confirm_read_message", data?.message_text)
      })

      // Listen to message when you are not in that room
      socket.on("receive_unread_message", (data: MessageRes) => {
        console.log("receive_unread_message")
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

  const handleSendMessage = (params: MessageRes) => {
    roomRef.current?.changeOrderAndAppendLastMessage(params)
  }

  const handleSelectRoom = (room: RoomRes) => {
    dispatch(setCurrentRoomId(room.room_id))
    ;(document?.querySelector(".message-form-input") as HTMLInputElement)?.focus()
  }

  if (!isConnected) return <Spinner size={36} />
  return (
    <section className="grid grid-cols-chat-lg gap-24 overflow-hidden flex-1">
      <aside className="block-element p-24 pr-12 flex flex-col">
        <Room ref={roomRef} onSelectRoom={handleSelectRoom} />
      </aside>
      <div className="block-element flex flex-col">
        <RoomDetail onSendMessage={handleSendMessage} ref={roomDetailRef} />
      </div>
    </section>
  )
}

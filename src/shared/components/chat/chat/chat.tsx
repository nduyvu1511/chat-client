import { Spinner } from "@/components"
import { RootState } from "@/core/store"
import { getMessageDescription } from "@/helper"
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
import { Room, RoomDetail } from "../room"

export const Chat = () => {
  const dispatch = useDispatch()
  const socketIo = useRef<Socket>()
  const roomDetailRef = useRef<RoomDetailFunctionHandler>(null)
  const roomRef = useRef<RoomFunctionHandler>(null)
  const currentRoomId = useSelector((state: RootState) => state.chat.currentRoomId)
  const [isConnected, setConnected] = useState<boolean>(false)

  const createNotification = (data: MessageRes) => {
    Notification.requestPermission().then((per) => {
      if (per === "granted") {
        new Notification("Tin nhắn mới", {
          badge: data.author?.author_avatar?.thumbnail_url,
          icon: data.author?.author_avatar?.thumbnail_url,
          body: getMessageDescription(data),
        })
      }
    })
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

        if (document.hasFocus()) {
          socket.emit("read_message", data)
        } else {
          createNotification(data)

          // self.addEventListener('notificationclick', (event) => {
          //   console.log(`On notification click: ${event.n.tag}`);
          //   event.notification.close();

          //   // This looks to see if the current is already open and
          //   // focuses if it is
          //   event.waitUntil(clients.matchAll({
          //     type: "window"
          //   }).then((clientList) => {
          //     for (const client of clientList) {
          //       if (client.url === '/' && 'focus' in client)
          //         return client.focus();
          //     }
          //     if (clients.openWindow)
          //       return clients.openWindow('/');
          //   }));
          // });
        }
      })

      socket.on("confirm_read_message", (data: MessageRes) => {
        roomDetailRef.current?.changeMesageStatus(data)
      })

      socket.on("receive_unread_message", (data: MessageRes) => {
        createNotification(data)
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
      <aside
        className={`block-element py-[18px] px-12 lg:p-24 lg:pr-12 flex-col ${
          currentRoomId ? "hidden md:flex" : "flex"
        }`}
      >
        <Room ref={roomRef} onSelectRoom={handleSelectRoom} />
      </aside>

      <div className={`block-element flex-col ${!currentRoomId ? "hidden md:flex" : "flex"}`}>
        <RoomDetail onSendMessage={handleSendMessage} ref={roomDetailRef} />
      </div>
    </section>
  )
}
// import {
//   ChangeStatusOfRoom,
//   FriendStatusRes,
//   ListRes,
//   MessageRes,
//   RoomRes,
//   RoomTypingRes,
//   UserRes,
// } from "@/models"
// import {
//   checkForUserDisconnectWhenTyping,
//   setChatProfile,
//   setCurrentTyping,
//   setSocketInstance,
// } from "@/modules"
// import { useEffect, useRef, useState } from "react"
// import { useDispatch } from "react-redux"
// import { io, Socket } from "socket.io-client"
// import { useSWRConfig } from "swr"
// import produce from "immer"

// interface Res {
//   isConnected: boolean
// }

// export const useChat = (): Res => {
//   const dispatch = useDispatch()
//   const socketIo = useRef<Socket>()
//   const { cache, mutate } = useSWRConfig()

//   const [isConnected, setConnected] = useState<boolean>(false)

//   const changeStatusOfRoom = (params: ChangeStatusOfRoom) => {
//     console.log("Yeah function is called")
//     const data: ListRes<RoomRes[]> = cache.get("get_room_list")
//     console.log(data)
//     if (!data?.data?.length) return

//     if (params.type === "login") {
//       mutate(
//         "get_room_list",
//         produce(data, (draft) => {
//           draft.data = draft.data.map((item) => {
//             return params.room_ids.includes(item.room_id) ? { ...item, is_online: true } : item
//           })
//         }),
//         false
//       )
//     } else {
//       mutate(
//         "get_room_list",
//         produce(data, (draft) => {
//           draft.data = draft.data.map((item) => {
//             if (!params.room_ids.includes(item.room_id)) {
//               return item
//             }
//             if (
//               item.room_type === "single" ||
//               (item?.top_members || [])?.filter((item) => item?.is_online)?.length <= 2
//             ) {
//               return { ...item, is_online: false }
//             }
//             return item
//           })
//         }),
//         false
//       )
//     }
//   }

//   useEffect(() => {
//     // Connect to socket
//     const socket = io(process.env.NEXT_PUBLIC_CHAT_SOCKET_URL as string, {
//       query: {
//         access_token:
//           "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzFkNTZjNTRhMjBiZWY4MmU0NzlmMGQiLCJ1c2VyX2lkIjoyLCJyb2xlIjoiY3VzdG9tZXIiLCJpYXQiOjE2NjI5MDEzNTl9.7YgTIRjbTGsmUSEfz3RwHl0UdTgv6f9loNJ4Zmz_3nQ",
//       },
//     })

//     dispatch(setSocketInstance(socket))
//     socketIo.current = socket

//     socket.emit("login")

//     socket.on("connect", async () => {
//       setConnected(true)

//       socket.on("login", (res: UserRes) => {
//         dispatch(setChatProfile(res))
//       })

//       // Listen to status of friend
//       socket.on("friend_login", (user: FriendStatusRes) => {
//         changeStatusOfRoom({ ...user, type: "login" })
//         // roomDetailRef.current?.changeStatusOfRoom({ ...user, type: "login" })
//         // roomRef.current?.changeStatusOfRoom({ ...user, type: "login" })
//       })

//       socket.on("friend_logout", (user: FriendStatusRes) => {
//         dispatch(checkForUserDisconnectWhenTyping(user.user_id))
//         changeStatusOfRoom({ ...user, type: "logout" })
//         // roomDetailRef.current?.changeStatusOfRoom({ ...user, type: "logout" })
//         // roomRef.current?.changeStatusOfRoom({ ...user, type: "logout" })
//       })

//       // Message listener
//       socket.on("receive_message", (data: MessageRes) => {
//         ;(document?.querySelector(".message-form-input") as HTMLInputElement)?.focus()
//         // roomDetailRef.current?.appendMessage(data)
//         // roomRef.current?.changeOrderAndAppendLastMessage(data)

//         socket.emit("read_message", data)
//       })

//       socket.on("confirm_read_message", (data: MessageRes) => {
//         // roomDetailRef.current?.changeMesageStatus(data)
//       })

//       socket.on("receive_unread_message", (data: MessageRes) => {
//         // roomRef.current?.messageUnreadhandler(data)
//       })

//       socket.on("like_message", (payload: MessageRes) => {
//         // roomDetailRef.current?.mutatePartnerReactionMessage(payload)
//       })

//       socket.on("unlike_message", (payload: MessageRes) => {
//         // roomDetailRef.current?.mutatePartnerReactionMessage(payload)
//       })

//       // Typing listener
//       socket.on("start_typing", (payload: RoomTypingRes) => {
//         dispatch(setCurrentTyping(payload))
//       })

//       socket.on("stop_typing", (payload: RoomTypingRes) => {
//         dispatch(setCurrentTyping(undefined))
//       })
//     })

//     return () => {
//       // socket.emit("logout", "631ac1558f56544cbc01a26d")
//       socket.off("connect")
//       socket.off("disconnect")
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [])

//   return {
//     isConnected,
//   }
// }

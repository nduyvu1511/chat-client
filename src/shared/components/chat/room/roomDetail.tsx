import { Spinner } from "@/components"
import { RootState } from "@/core/store"
import { useMessage } from "@/hooks"
import {
  LikeMessage,
  MessageRes,
  OnResetParams,
  RoomDetailFunctionHandler,
  RoomDetailRes,
  SendMessageData,
  UnlikeMessage,
} from "@/models"
import { chatApi } from "@/services"
import { AxiosResponse } from "axios"
import produce from "immer"
import { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useRef } from "react"
import { useSelector } from "react-redux"
import useSWR, { mutate } from "swr"
import { Message, MessageForm } from "../message"
import { RoomHeader } from "./roomHeader"

type OnForwaredRoomDetail = ForwardedRef<RoomDetailFunctionHandler>

interface RoomDetailProps {
  roomId: string
  onSendMessage?: (_: MessageRes) => void
}

export const RoomDetail = forwardRef(function RoomChild(
  { roomId, onSendMessage }: RoomDetailProps,
  ref: OnForwaredRoomDetail
) {
  const socket = useSelector((state: RootState) => state.chat.socket)
  const messageFormRef = useRef<OnResetParams>(null)
  const {
    data,
    isValidating,
    error,
    mutate: mutateRoomDetail,
  } = useSWR(
    roomId ? `get_room_detail_${roomId}` : null,
    roomId
      ? () =>
          chatApi.getRoomDetail(roomId).then((res: AxiosResponse<RoomDetailRes>) => {
            const data = res?.data
            mutate(`get_messages_in_room_${roomId}`, data.messages, false)
            return data
          })
      : null
  )
  const {
    appendMessage,
    sendMessage,
    confirmReadMessage,
    data: messages,
    confirmReadAllMessageInRoom,
    likeMessage,
    unlikeMessage,
    mutateMessageEmotion,
  } = useMessage({ roomId, initialData: data?.messages })

  useImperativeHandle(ref, () => ({
    appendMessage: (mes) => {
      appendMessage(mes)
    },
    changeStatusOfRoom: (params) => {
      if (!data) return
      if (params.type === "logout") {
        if (data.members.data?.length === 2) {
          mutateRoomDetail(
            produce(data, (draft) => {
              draft.is_online = false
              draft.offline_at = new Date()
            }),
            false
          )
        }
      } else {
        mutateRoomDetail(
          produce(data, (draft) => {
            draft.is_online = true
          }),
          false
        )
      }
    },
    changeMesageStatus: async (params) => {
      confirmReadMessage(params)
    },
    mutateMessageEmotion: (params) => {
      mutateMessageEmotion(params)
    },
  }))

  useEffect(() => {
    if (!socket) return
    if (!data?.messages?.data?.length) return

    const lastMessage = data?.messages?.data?.[data?.messages?.data?.length - 1]
    if (lastMessage.is_author || lastMessage.is_read) return
    socket.emit("read_message", lastMessage)
    console.log("read_message", lastMessage)

    confirmReadAllMessageInRoom(roomId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.messages?.data, roomId])

  useEffect(() => {
    ;(document?.querySelector(".message-form-input") as HTMLInputElement)?.focus()
  }, [roomId])

  const handleSendMessage = (val: SendMessageData) => {
    if (!roomId) return
    messageFormRef?.current?.onReset()

    sendMessage({
      params: { ...val, roomId: roomId },
      onSuccess: (data) => {
        onSendMessage?.(data)
        if (socket) {
          socket.emit("send_message", data)
        }
      },
    })
  }

  const handleLikeMessage = (params: LikeMessage) => {
    likeMessage(params, (data) => {
      socket && socket.emit("like_message", data)
    })
  }

  const handleUnlikeMessage = (params: UnlikeMessage) => {
    unlikeMessage(params, (data) => {
      socket && socket.emit("unlike_message", data)
    })
  }

  return (
    <div className="flex flex-col flex-1 chat-message ">
      {data === undefined && error === undefined ? (
        <Spinner />
      ) : (
        <>
          <div className="h-[60px] mb-12 px-16 py-12">
            <RoomHeader data={data as any} />
          </div>

          <div className="pl-24 pt-12 pr-12 flex-1 flex flex-col">
            <div className="flex-1 flex flex-col">
              {messages?.data?.length ? (
                <Message
                  onLikeMessage={handleLikeMessage}
                  onUnlikeMessage={handleUnlikeMessage}
                  data={messages}
                />
              ) : (
                <div className="text-sm text-gray-color-3 flex-center py-24 min-h-[300px]">
                  Chưa có tin nhắn nào
                </div>
              )}
            </div>

            <MessageForm roomId={roomId} ref={messageFormRef} onSubmit={handleSendMessage} />
          </div>
        </>
      )}
    </div>
  )
})

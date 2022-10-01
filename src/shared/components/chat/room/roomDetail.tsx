import { Spinner } from "@/components"
import { RootState } from "@/core/store"
import { useMessage } from "@/hooks"
import {
  LikeMessage,
  MessageRes,
  OnResetParams,
  RoomDetailFunctionHandler,
  RoomDetailRes,
  RoomType,
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
import { RoomDetailModals } from "./roomDetailModals"
import { RoomHeader } from "./roomHeader"

type OnForwaredRoomDetail = ForwardedRef<RoomDetailFunctionHandler>

interface RoomDetailProps {
  onSendMessage?: (_: MessageRes) => void
}

export const RoomDetail = forwardRef(function RoomChild(
  { onSendMessage }: RoomDetailProps,
  ref: OnForwaredRoomDetail
) {
  const socket = useSelector((state: RootState) => state.chat.socket)
  const roomId = useSelector((state: RootState) => state.chat.currentRoomId) as string

  const messageFormRef = useRef<OnResetParams>(null)
  const {
    data,
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
    mutateByMessageRes,
    getMoreMessages,
    isFetchingMore,
    mutatePartnerReactionMessage,
    resendMessage,
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
    mutateWithMessageRes: (params) => {
      mutateByMessageRes(params)
    },
    mutatePartnerReactionMessage: (params) => {
      mutatePartnerReactionMessage(params)
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
      params: { ...val, room_id: roomId },
      onSuccess: (data) => {
        onSendMessage?.(data)
        if (socket) {
          socket.emit("send_message", data)
        }
      },
    })
  }

  const handleReactionMessage = (params: LikeMessage) => {
    likeMessage(params, (data) => {
      socket && socket.emit("like_message", data)
    })
  }

  const handleUndoMesasgeReaction = (params: UnlikeMessage) => {
    unlikeMessage(params, (data) => {
      socket && socket.emit("unlike_message", data)
    })
  }

  if (!roomId)
    return (
      <div className="flex-1 flex-center text-sm text-gray-color-4">
        Chọn cuộc hội thoại để bắt đầu trò chuyện
      </div>
    )

  return (
    <div className="flex flex-col flex-1 chat-message bg-white-color">
      {data === undefined && error === undefined ? (
        <Spinner />
      ) : (
        <>
          <div className="h-[70px] border-b border-border-color border-solid">
            <RoomHeader data={data as any} />
          </div>

          {messages?.data?.length ? (
            <Message
              isFetchingMore={isFetchingMore}
              roomType={data?.room_type as RoomType}
              onLikeMessage={handleReactionMessage}
              onUnlikeMessage={handleUndoMesasgeReaction}
              data={messages}
              onGetMoreMessage={() => getMoreMessages()}
              onResendMessage={resendMessage}
            />
          ) : (
            <div className="text-sm text-gray-color-3 flex-center py-24 min-h-[300px] flex-1">
              Chưa có tin nhắn nào
            </div>
          )}

          <MessageForm
            className="px-24 border-t border-solid border-border-color"
            ref={messageFormRef}
            onSubmit={handleSendMessage}
          />

          <RoomDetailModals />
        </>
      )}
    </div>
  )
})

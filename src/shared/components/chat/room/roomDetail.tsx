import { Spinner } from "@/components"
import { RootState } from "@/core/store"
import { useMessage, useRoomDetail } from "@/hooks"
import {
  LikeMessage,
  MessageRes,
  OnResetParams,
  RoomDetailFunctionHandler,
  RoomType,
  SendMessageData,
  UnlikeMessage,
} from "@/models"
import { setCurrentRoomInfo } from "@/modules"
import { ForwardedRef, forwardRef, useImperativeHandle, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
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
  const messageFormRef = useRef<OnResetParams>(null)
  const dispatch = useDispatch()

  const socket = useSelector((state: RootState) => state.chat.socket)
  const roomId = useSelector((state: RootState) => state.chat.currentRoomId) as string

  const { changeStatusOfRoom, data, isFirstLoading } = useRoomDetail({
    roomId,
    callback: (res) => {
      socket?.emit("read_message", res)
    },
  })
  const {
    appendMessage,
    sendMessage,
    confirmReadMessage,
    data: messages,
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
      changeStatusOfRoom(params)
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
      {isFirstLoading ? (
        <Spinner />
      ) : (
        <>
          <div className="h-[70px] border-b border-border-color border-solid">
            <RoomHeader
              onClick={() => {
                if (data?.room_id) {
                  dispatch(
                    setCurrentRoomInfo({
                      member_count: data?.member_count,
                      members: data.members?.data?.map((item) => ({
                        user_id: item.user_id,
                        user_avatar: item.avatar.thumbnail_url,
                        user_name: item.user_name,
                        is_online: item?.is_online,
                      })),
                      room_id: data.room_id,
                      room_name: data.room_name,
                      room_type: data.room_type,
                      room_avatar: data?.room_avatar,
                    })
                  )
                }
              }}
              data={data as any}
            />
          </div>

          {messages?.data?.length ? (
            <Message
              isFetchingMore={isFetchingMore}
              roomType={data?.room_type as RoomType}
              onReactMessage={handleReactionMessage}
              onUndoReactMessage={handleUndoMesasgeReaction}
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
            className="px-16 lg:px-24 border-t border-solid border-border-color"
            ref={messageFormRef}
            onSubmit={handleSendMessage}
          />

          <RoomDetailModals />
        </>
      )}
    </div>
  )
})

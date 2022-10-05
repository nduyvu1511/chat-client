import { Spinner } from "@/components"
import { RootState } from "@/core/store"
import { useDetectWindowFocus, useMessage, useRoomDetail } from "@/hooks"
import {
  LikeMessage,
  MessageRes,
  OnResetParams,
  RoomDetailFunctionHandler,
  RoomType,
  SendMessageData,
  UnlikeMessage,
} from "@/models"
import { setCurrentProfileId, setCurrentRoomInfo } from "@/modules"
import { chatApi } from "@/services"
import { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useRef } from "react"
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
  const user = useSelector((state: RootState) => state.chat.profile)
  const messageFormRef = useRef<OnResetParams>(null)
  const dispatch = useDispatch()
  const isWindowFocus = useDetectWindowFocus()

  const socket = useSelector((state: RootState) => state.chat.socket)
  const roomId = useSelector((state: RootState) => state.chat.currentRoomId) as string

  const { changeStatusOfRoom, data, isFirstLoading } = useRoomDetail({
    roomId,
    callback: (res) => {
      console.log("lastMessage from here: ", res)
      handleReadMessage(res)
      // socket?.emit("read_message", res)
      // confirmReadAllMessage()
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
    confirmReadAllMessage,
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
        socket?.emit("send_message", data)
      },
    })
  }

  const handleReactionMessage = (params: LikeMessage) => {
    likeMessage(params, (data) => {
      socket?.emit("like_message", data)
    })
  }

  const handleUndoMesasgeReaction = (params: UnlikeMessage) => {
    unlikeMessage(params, (data) => {
      socket?.emit("unlike_message", data)
    })
  }

  // const clearMessageUnreadCountInRoomList = () => {
  //   const roomList: ListRes<RoomRes[]> = cache.get("get_room_list")
  //   if (roomList?.data?.length) {
  //     const index = roomList.data.findIndex((item) => item.room_id === roomId)
  //     if (index === -1) {
  //       mutate("get_room_list")
  //     } else {
  //       mutate(
  //         "get_room_list",
  //         produce(roomList, (draft) => {
  //           draft.data[index].message_unread_count = 0
  //         }),
  //         false
  //       )
  //     }
  //   }
  // }

  const handleReadMessage = ({
    lastMessage,
    messages,
  }: {
    lastMessage: MessageRes
    messages: MessageRes[]
  }) => {
    if (!lastMessage || lastMessage.is_author || lastMessage?.is_read) return

    socket?.emit("read_message", lastMessage)
    confirmReadMessage(lastMessage)

    // Get list message unread except the last message has sent request
    const listMessageUnread = messages
      .filter((item) => !item.is_read)
      .filter((item) => item.message_id !== lastMessage.message_id)

    if (listMessageUnread?.length) {
      confirmReadAllMessage()
      chatApi.confirmReadAllMessageInRoom(roomId)
    }
  }

  useEffect(() => {
    if (!roomId || !isWindowFocus || !messages?.data?.length) return
    const lastMessage = messages?.data?.[messages?.data?.length - 1]

    console.log({ lastMessageFromUseEffect: lastMessage })

    if (lastMessage?.message_id && !lastMessage?.is_author && !lastMessage?.is_read) {
      handleReadMessage({
        lastMessage,
        messages: messages.data,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWindowFocus])

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
                  if (data.room_type === "group") {
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
                  } else {
                    const partner = data?.members?.data?.find(
                      (item) => item.user_id !== user?.user_id
                    )
                    dispatch(setCurrentProfileId(partner?.user_id))
                  }
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
            className="border-t border-solid border-border-color bg-bg px-12 md:px-16"
            ref={messageFormRef}
            onSubmit={handleSendMessage}
          />

          <RoomDetailModals />
        </>
      )}
    </div>
  )
})

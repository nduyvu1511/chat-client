import { MESSAGES_LIMIT } from "@/helper"
import {
  LikeMessage,
  LikeMessageRes,
  ListRes,
  MessageRes,
  MutateMessageEmotion,
  SendMessage,
  UnlikeMessage,
  UnlikeMessageRes,
  UseParams,
} from "@/models"
import { chatApi } from "@/services"
import { AxiosResponse } from "axios"
import produce from "immer"
import useSWR from "swr"

interface UseMessageRes {
  data: ListRes<MessageRes[]> | undefined
  isValidating: boolean
  isFirstLoading: boolean
  getMoreMessages: Function
  sendMessage: (params: UseParams<SendMessage, MessageRes>) => void
  appendMessage: (params: MessageRes) => void
  confirmReadMessage: (params: MessageRes) => void
  confirmReadAllMessageInRoom: (params: string) => void
  likeMessage: (params: LikeMessage, cb?: (params: LikeMessageRes) => void) => void
  unlikeMessage: (params: UnlikeMessage, cb?: (params: UnlikeMessage) => void) => void
  mutateMessageEmotion: (_: MutateMessageEmotion) => void
}

interface UseMessageProps {
  roomId?: string | undefined
  initialData?: ListRes<MessageRes[]> | undefined
}

export const useMessage = ({ initialData, roomId }: UseMessageProps): UseMessageRes => {
  const { isValidating, mutate, data, error } = useSWR<ListRes<MessageRes[]>>(
    roomId ? `get_messages_in_room_${roomId}` : null,
    null,
    {
      fallbackData: initialData,
      revalidateOnMount: false,
    }
  )

  const getMoreMessages = async (roomId: string) => {
    if (!roomId) return
    try {
      const res = await chatApi.getMessagesInRoom({
        offset: 0,
        limit: MESSAGES_LIMIT,
        room_id: roomId,
      })
    } catch (error) {
      console.log(error)
    }
  }

  const appendMessage = (params: MessageRes) => {
    mutate(
      produce(data, (draft) => {
        ;(draft?.data || []).push(params)
        ;(draft as any).offset += 1
        ;(draft as any).total += 1
      }),
      false
    )
  }

  const findMessageIndex = (message_id: string): number => {
    const index =
      data && data?.data?.length > 0
        ? data?.data.findIndex((item) => item.message_id === message_id) || -1
        : -1

    if (index === -1) mutate()

    return index
  }

  const sendMessage = async (_: UseParams<SendMessage, MessageRes>) => {
    const { onSuccess, params, config, onError } = _
    try {
      const res = await chatApi.sendMessage(params)

      if (res?.success) {
        appendMessage(res.data)
        onSuccess?.(res.data)
      } else {
        onError?.()
      }
    } catch (error) {
      onError?.()
      console.log(error)
    }
  }

  const confirmReadMessage = async (params: MessageRes) => {
    if (!data?.data?.length) return

    const index = findMessageIndex(params.message_id)
    if (index === -1) return
    if (data.data[index].is_read) return

    mutate(
      produce(data, (draft) => {
        draft.data[index].is_read = true
      }),
      false
    )
  }

  const confirmReadAllMessageInRoom = async (roomId: string, cb?: Function) => {
    if (!data?.data?.length) return

    const res = await chatApi.confirmReadAllMessageInRoom(roomId)
    if (res?.success) {
      mutate(
        produce(data, (draft) => {
          draft.data[draft.data.length - 1].is_read = true
        })
      )
    }
  }

  const mutateMessageEmotion = ({
    messageId,
    status,
  }: {
    messageId: string
    status: "like" | "unlike"
  }) => {
    console.log("mutate message emotion")
    console.log(data?.data)
    if (!data?.data?.length) return
    console.log("mutate message emotion 2")
    const index = findMessageIndex(messageId)
    if (!index) return
    console.log(data.data[index])

    mutate(
      produce(data, (draft) => {
        if (status === "like") {
          draft.data[index].like_count += 1
          draft.data[index].is_liked = true
        } else {
          draft.data[index].like_count -= 1
          draft.data[index].is_liked = false
        }
      }),
      false
    )
  }

  const unlikeMessage = async (params: UnlikeMessage, cb?: (_: UnlikeMessageRes) => void) => {
    const res: AxiosResponse<UnlikeMessageRes> = await chatApi.unlikeMessage(params.message_id)

    if (res?.success) {
      cb?.(res.data)
      mutateMessageEmotion({ messageId: res.data.message_id, status: "unlike" })
    }
  }

  const likeMessage = async (params: LikeMessage, cb?: (_: LikeMessageRes) => void) => {
    const res: AxiosResponse<LikeMessageRes> = await chatApi.likeMessage(params)

    if (res?.success) {
      cb?.(res.data)
      mutateMessageEmotion({ messageId: res.data.message_id, status: "like" })
    }
  }

  return {
    data,
    getMoreMessages,
    isFirstLoading: error === undefined && data === undefined,
    isValidating,
    sendMessage,
    appendMessage,
    confirmReadMessage,
    confirmReadAllMessageInRoom,
    likeMessage,
    unlikeMessage,
    mutateMessageEmotion,
  }
}

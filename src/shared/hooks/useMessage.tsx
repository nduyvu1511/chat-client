import { v4 as uuidv4 } from "uuid"
import { MESSAGES_LIMIT } from "@/helper"
import {
  AttachmentRes,
  LikeMessage,
  LikeMessageRes,
  ListRes,
  MessageRes,
  MutateMessageEmotion,
  ResponseStatus,
  SendMessage,
  SendMessageData,
  UnlikeMessage,
  UnlikeMessageRes,
  UseParams,
} from "@/models"
import { chatApi } from "@/services"
import { AxiosResponse } from "axios"
import produce from "immer"
import useSWR from "swr"
import { useAsync } from "./useAsync"

interface UseMessageRes {
  data: ListRes<MessageRes[]> | undefined
  isValidating: boolean
  isFirstLoading: boolean
  getMoreMessages: Function
  sendMessage: (params: UseParams<SendMessageData, MessageRes>) => void
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
  const { asyncHandler } = useAsync()
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
    if (!data) return

    mutate(
      produce(data, (draft) => {
        ;(draft?.data || []).push(params)
        draft.offset += 1
        draft.total += 1
      }),
      false
    )
  }

  const findMessageIndex = (message_id: string): number => {
    const index =
      data && data?.data?.length > 0
        ? data?.data.findIndex((item) => item.message_id === message_id)
        : -1

    if (index === -1) mutate()

    return index
  }

  const createMessageRes = (data: SendMessageData): MessageRes => {
    const attachments: AttachmentRes[] = data?.attachments
      ? data?.attachments.map((item) => ({
          url: item.previewImage,
          thumbnail_url: item.previewImage,
          attachment_id: uuidv4(),
          attachment_type: "image",
        }))
      : []

    return {
      author: {
        author_avatar: {
          attachment_id: "test",
          attachment_type: "image",
          thumbnail_url: "",
          url: "",
        },
        author_id: "test",
        author_name: "later on",
      },
      attachments,
      created_at: new Date(),
      is_author: true,
      is_liked: false,
      is_read: true,
      like_count: 0,
      message_id: uuidv4(),
      message_text: data?.text || null,
      room_id: data.roomId,
      location: null,
      reply_to: null,
      tags: data?.tags || [],
      status: "pending",
    }
  }

  const getMessage = async (data: SendMessageData): Promise<SendMessage> => {
    let attachment_ids: string[] = []
    if (data.attachments?.length) {
      const formData = new FormData()
      data.attachments.forEach((item) => {
        ;(formData as FormData).append("images", item.file)
      })

      // Take attachments from server
      try {
        const res: AxiosResponse<AttachmentRes[]> = await chatApi.uploadMultipleImage(formData)
        if (res?.success) {
          attachment_ids = res?.data?.map((item) => item.attachment_id) || []
        }
      } catch (error) {
        console.log(error)
      }
    }

    return {
      room_id: data.roomId,
      attachment_ids,
      location: data?.location,
      reply_to: data?.reply_to,
      tag_ids: data?.tags?.map((item) => item.tag_id) || undefined,
      text: data?.text,
    }
  }

  const sendMessage = async (_: UseParams<SendMessageData, MessageRes>) => {
    const { onSuccess, params, onError } = _
    const messageRes = createMessageRes(params)
    appendMessage(messageRes)

    try {
      const messageParams = await getMessage(params)
      const res = await chatApi.sendMessage(messageParams)

      if (res?.success) {
        appendMessage({ ...res.data, status: "fulfilled" })
        onSuccess?.(res.data)
      } else {
        appendMessage({ ...messageRes, status: "rejected" })
        onError?.()
      }
    } catch (error) {
      appendMessage({ ...messageRes, status: "rejected" })
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

import { RootState } from "@/core/store"
import { LIMIT_MESSAGES } from "@/helper"
import {
  AttachmentRes,
  LikeMessage,
  LikeMessageRes,
  ListRes,
  MessageAttachment,
  MessageRes,
  mutateMessageReaction,
  SendMessage,
  SendMessageData,
  UnlikeMessage,
  UnlikeMessageRes,
  UseParams,
} from "@/models"
import { chatApi } from "@/services"
import { AxiosResponse } from "axios"
import produce from "immer"
import { useState } from "react"
import { useSelector } from "react-redux"
import useSWR from "swr"
import { v4 as uuidv4 } from "uuid"

interface UseMessageRes {
  data: ListRes<MessageRes[]> | undefined
  isValidating: boolean
  isFetchingMore: boolean
  isFirstLoading: boolean
  getMoreMessages: Function
  sendMessage: (params: UseParams<SendMessageData, MessageRes>) => void
  appendMessage: (params: MessageRes) => void
  confirmReadMessage: (params: MessageRes) => void
  confirmReadAllMessageInRoom: (params: string) => void
  likeMessage: (params: LikeMessage, cb?: (params: LikeMessageRes) => void) => void
  unlikeMessage: (params: UnlikeMessage, cb?: (params: UnlikeMessage) => void) => void
  mutateMessageReaction: (_: mutateMessageReaction) => void
  mutateByMessageRes: (message: MessageRes) => void
  mutatePartnerReactionMessage: (message: MessageRes) => void
  resendMessage: (message: MessageRes) => void
}

interface UseMessageProps {
  roomId?: string | undefined
  initialData?: ListRes<MessageRes[]> | undefined
}

export const useMessage = ({ initialData, roomId }: UseMessageProps): UseMessageRes => {
  const userInfo = useSelector((state: RootState) => state.chat.profile)
  const [isFetchingMore, setFetchingMore] = useState<boolean>(false)

  const { isValidating, mutate, data, error } = useSWR<ListRes<MessageRes[]>>(
    roomId ? `get_messages_in_room_${roomId}` : null,
    null,
    {
      fallbackData: initialData,
      revalidateOnMount: false,
    }
  )

  const getMoreMessages = async () => {
    if (isFetchingMore || !roomId || !data) return
    try {
      setFetchingMore(true)
      const res: AxiosResponse<ListRes<MessageRes[]>> = await chatApi.getMessagesInRoom({
        offset: (data?.offset || 0) + LIMIT_MESSAGES,
        limit: LIMIT_MESSAGES,
        room_id: roomId,
      })

      setTimeout(() => {
        setFetchingMore(false)
      }, 100)

      const messagesData = res?.data

      mutate(
        produce(data, (draft) => {
          draft.offset += LIMIT_MESSAGES
          draft.has_more = messagesData.has_more
          draft.data = [...(messagesData?.data || []), ...draft.data]
        }),
        false
      )

      const lastMessageId = messagesData?.data?.[messagesData?.data?.length - 1]?.message_id

      if (lastMessageId)
        setTimeout(() => {
          document.querySelector(`.message-item-${lastMessageId}`)?.scrollIntoView()
        }, 0)
    } catch (error) {
      console.log(error)
      setTimeout(() => {
        setFetchingMore(false)
      }, 100)
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

  const deleteMessageFromList = (id: string) => {
    if (!data?.data?.length) return
    mutate(
      produce(data, (draft) => {
        draft.data = draft.data.filter((item) => item.message_id !== id)
      }),
      false
    )
  }

  const resendMessage = (params: MessageRes) => {
    const args: SendMessageData = {
      attachments: params?.attachments || [],
      location: params?.location || undefined,
      reply_to: params?.reply_to?.message_id
        ? {
            author: params?.reply_to.author,
            message_id: params?.reply_to?.message_id,
            created_at: params.reply_to.created_at,
            message_text: params.reply_to.message_text,
            attachment: params.reply_to?.attachment,
          }
        : undefined,
      tags: params?.tags || [],
      text: params?.message_text || undefined,
      room_id: params.room_id,
    }

    deleteMessageFromList(params.message_id)

    sendMessage({ params: args })
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
    let attachments: AttachmentRes[] = []
    if (data?.attachments?.length) {
      const { attachments: attachmentData } = data
      if ((attachmentData as AttachmentRes[])?.[0]?.attachment_id) {
        attachments = attachmentData as AttachmentRes[]
      } else if ((attachmentData as MessageAttachment[])?.[0]?.file) {
        attachments = (attachmentData as MessageAttachment[]).map((item) => ({
          url: item.previewImage,
          thumbnail_url: item.previewImage,
          attachment_id: uuidv4(),
          attachment_type: "image",
        }))
      }
    }

    return {
      author: {
        author_avatar: {
          attachment_id: userInfo?.avatar?.attachment_id || "",
          attachment_type: "image",
          thumbnail_url: userInfo?.avatar?.thumbnail_url || "",
          url: userInfo?.avatar?.url || "",
        },
        author_id: userInfo?.user_id || "",
        author_name: userInfo?.user_name || "",
      },
      attachments,
      created_at: new Date(),
      is_author: true,
      is_read: false,
      reaction_count: 0,
      message_id: uuidv4(),
      message_text: data?.text || null,
      room_id: data.room_id,
      location: null,
      reply_to: data?.reply_to || null,
      tags: data?.tags || [],
      status: "pending",
      reactions: [],
      your_reaction: null,
    }
  }

  const getMessage = async (data: SendMessageData): Promise<SendMessage> => {
    let attachment_ids: string[] = []
    if (data.attachments?.length) {
      const { attachments } = data
      if ((attachments as MessageAttachment[])?.[0]?.file) {
        const formData = new FormData()

        ;(attachments as MessageAttachment[]).forEach((item) => {
          ;(formData as FormData).append("images", item.file)
        })

        // get attachments from API response
        try {
          const res: AxiosResponse<AttachmentRes[]> = await chatApi.uploadMultipleImage(formData)
          if (res?.success) {
            attachment_ids = res?.data?.map((item) => item.attachment_id) || []
          }
        } catch (error) {
          console.log(error)
        }
      } else if ((attachments as AttachmentRes[])?.[0]?.attachment_id) {
        attachment_ids = (attachments as AttachmentRes[]).map((item) => item.attachment_id)
      }
    }

    return {
      room_id: data.room_id,
      attachment_ids,
      location: data?.location,
      reply_to: data?.reply_to
        ? { message_id: data.reply_to.message_id, attachment_id: data.reply_to?.attachment?.id }
        : undefined,
      tag_ids: data?.tags?.length ? data.tags.map((item) => item.tag_id) : null,
      text: data?.text,
    }
  }

  const sendMessage = async (_: UseParams<SendMessageData, MessageRes>) => {
    const { onSuccess, params, onError } = _
    const messageRes = createMessageRes(params)
    appendMessage(messageRes)
    setTimeout(() => {
      document.querySelector(`.message-item-${messageRes.message_id}`)?.scrollIntoView()
    }, 0)

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
        }),
        false
      )
    }
  }

  const mutateByMessageRes = (message: MessageRes) => {
    if (!data?.data?.length) return
    const index = findMessageIndex(message.message_id)
    if (!index) return

    mutate(
      produce(data, (draft) => {
        draft.data[index] = { ...message, is_author: draft.data[index].is_author }
      }),
      false
    )
  }

  const mutatePartnerReactionMessage = (message: MessageRes) => {
    if (!data?.data?.length) return
    const index = findMessageIndex(message.message_id)
    if (!index) return

    mutate(
      produce(data, (draft) => {
        draft.data[index].reactions = message.reactions
        draft.data[index].reaction_count = message.reaction_count
      }),
      false
    )
  }

  const mutateMessageReaction = ({
    messageId,
    reaction,
    is_author,
    type,
  }: mutateMessageReaction) => {
    if (!data?.data?.length) return
    const index = findMessageIndex(messageId)
    if (!index) return

    const message = data.data[index]

    mutate(
      produce(data, (draft) => {
        const messageDraft = draft.data[index]

        if (type === "add") {
          if (!message.your_reaction) {
            messageDraft.reaction_count += 1
            messageDraft.reactions.push(reaction)
            messageDraft.your_reaction = reaction
          } else if (message.your_reaction && message.your_reaction !== reaction) {
            messageDraft.your_reaction = reaction

            const _index = message.reactions?.findIndex((e) => e === message.your_reaction)
            if (_index !== -1) {
              messageDraft.reactions[_index] = reaction
            }
          }
        } else {
          if (message.reaction_count > 0) {
            messageDraft.reaction_count -= 1
          }

          const _index = message.reactions?.findIndex((e) => e === reaction)
          if (_index !== -1) {
            messageDraft.reactions = messageDraft.reactions
              .slice(0, _index)
              .concat(messageDraft.reactions.slice(_index + 1))
          }

          messageDraft.reactions = messageDraft.reactions.filter((e) => e !== reaction)

          if (is_author) {
            messageDraft.your_reaction = null
          }
        }
      }),
      false
    )
  }

  const unlikeMessage = async (params: UnlikeMessage, cb?: (_: UnlikeMessageRes) => void) => {
    mutateMessageReaction({
      messageId: params.message_id,
      reaction: params.reaction,
      is_author: true,
      type: "delete",
    })

    const res: AxiosResponse<UnlikeMessageRes> = await chatApi.unlikeMessage(params.message_id)

    if (res?.success) {
      cb?.(res.data)
    }
  }

  const likeMessage = async (params: LikeMessage, cb?: (_: LikeMessageRes) => void) => {
    mutateMessageReaction({
      messageId: params.message_id,
      reaction: params.emotion,
      is_author: true,
      type: "add",
    })

    const res: AxiosResponse<LikeMessageRes> = await chatApi.likeMessage(params)

    if (res?.success) {
      cb?.(res.data)
    }
  }

  return {
    data,
    getMoreMessages,
    isFetchingMore,
    isValidating,
    sendMessage,
    appendMessage,
    confirmReadMessage,
    confirmReadAllMessageInRoom,
    likeMessage,
    unlikeMessage,
    mutateMessageReaction,
    isFirstLoading: error === undefined && data === undefined,
    mutateByMessageRes,
    mutatePartnerReactionMessage,
    resendMessage,
  }
}

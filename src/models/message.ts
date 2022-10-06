import {
  AttachmentRes,
  IAttachment,
  Lnglat,
  MessageResponseStatus,
  QueryCommonParams,
  TagRes,
} from "./common"
import { IUser, UserRes } from "./user"

export interface IMessage {
  _id: string
  user_id: string
  room_id: string
  text: string
  tag_ids: string[]
  location: Lnglat
  attachment_ids: IAttachment[]
  reply_to: {
    message_id: string
    attachment_id?: string
  }
  read_by_user_ids: string[]
  is_hidden: boolean
  is_deleted: boolean
  is_edited: boolean
  liked_by_user_ids: {
    user_id: string
    emotion: MessageReactionType
  }[]
  created_at: Date
  updated_at: Date
}

export type MessageRes = Pick<IMessage, "room_id" | "created_at"> & {
  message_id: string
  is_author: boolean
  author: AuthorMessage
  attachments: AttachmentRes[]
  reaction_count: number
  reactions: MessageReactionType[]
  your_reaction: null | MessageReactionType
  message_text: string | null
  reply_to?: MessageReply | null
  location?: Lnglat | null
  is_read: boolean
  status?: MessageResponseStatus
}

export type UserReactionRes = Omit<UserRes, "avatar"> & {
  reaction: MessageReactionType
  avatar: string
}

export type UsersLikedMessageRes = {
  [key: string]: UserReactionRes[]
}

export type AttachmentType = "image" | "video" | "voice"

export interface AuthorMessage {
  author_id: string
  author_name: string
  author_avatar: AttachmentRes
}

export interface MessageUser {
  user_id: string
  user_name: string
  user_avatar: string
}

export type MessageReply = {
  author: AuthorMessage
  message_id: string
  attachment?: {
    id: string
    url: string
  }
  message_text: string
  created_at: Date
}

export type MessageReactionType = "like" | "angry" | "sad" | "laugh" | "heart" | "wow"

export type SendMessage = {
  tag_ids?: string[] | null
  attachment_ids: string[]
  location?: Lnglat
  reply_to?: {
    message_id: string
    attachment_id?: string
  }
  text?: string
  room_id: string
}

export type SendMessageData = MessageFormData & {
  reply_to?: MessageReply
}

export type SendMessageForm = Partial<
  Pick<SendMessage, "tag_ids" | "attachment_ids" | "location" | "text">
>

export interface SendMessageServiceParams {
  room_id: string
  user: IUser
  message: SendMessage
}

export interface GetMessagesInRoom extends QueryCommonParams {
  room_id: string
}

export interface LikeMessage {
  message_id: string
  emotion: MessageReactionType
}

export interface LikeMessageRes extends LikeMessage {
  user_id: string
  room_id: string
}

export interface UnlikeMessageRes extends UnlikeMessage {
  room_id: string
  user_id: string
}

export interface UnlikeMessage {
  message_id: string
  reaction: MessageReactionType
}

export interface mutateMessageReaction {
  messageId: string
  reaction: MessageReactionType
  is_author: boolean
  type: "add" | "delete"
}

export type MessageAttachment = {
  file: File
  previewImage: string
  id: string
}

export interface MessageForm {
  attachments?: MessageAttachment[] | AttachmentRes[]
  location?: Lnglat
  text?: string | undefined
}

export type MessageFormData = MessageForm & {
  room_id: string
  reply_to?: MessageReply
}

export type UserItemRes = {
  user_id: string
  is_online: string
  user_name: string
  user_avatar: string
}

export type MessageDetailRes = MessageRes & {
  read_by: UserItemRes[]
  un_read_by: UserItemRes[]
}

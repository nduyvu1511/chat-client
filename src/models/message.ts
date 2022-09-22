import {
  AttachmentRes,
  IAttachment,
  ImageWithId,
  Lnglat,
  QueryCommonParams,
  TagRes,
} from "./common"
import { LatLng } from "./location"
import { IUser } from "./user"

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
    emotion: MessageEmotionType
  }[]
  created_at: Date
  updated_at: Date
}

export type MessageRes = Pick<IMessage, "room_id" | "created_at"> & {
  message_id: string
  is_author: boolean
  author: AuthorMessage
  is_liked: boolean
  attachments: AttachmentRes[]
  like_count: number
  message_text: string
  reply_to?: MessageReply | null
  location?: Lnglat | null
  tags?: TagRes[]
  is_read: boolean
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
  message_text: string
  created_at: Date
  attachment?: AttachmentRes | null
}

export type MessageEmotionType = "like" | "angry" | "sad" | "laugh" | "heart" | "wow"

export type SendMessage = {
  tag_ids?: string[]
  attachment_ids?: string[]
  location?: Lnglat
  reply_to?: {
    message_id: string
    attachment_id?: string
  }
  text?: string
  room_id: string
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
  emotion: MessageEmotionType
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
}

export interface MutateMessageEmotion {
  messageId: string
  status: "like" | "unlike"
}

export type MessageAttachment = {
  file: File
  previewImage: string
  id: string
}

export interface MessageForm {
  tags?: TagRes[]
  attachments?: MessageAttachment[]
  location?: LatLng
  text?: string
}

export type MessageFormData = MessageForm & { roomId: string }

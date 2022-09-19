import { AttachmentId, AttachmentRes, ListRes, QueryCommonParams } from "./common"
import { MessageRes, MutateMessageEmotion } from "./message"
import { IUser, UserData } from "./user"

export interface IRoom {
  _id: string
  room_name: string
  room_avatar_id: string
  room_type: RoomType
  member_ids: RoomMember[]
  leader_id: string
  last_message_id?: string
  pinned_message_ids: string[]
  members_leaved: MemberLeaved
  message_ids: string[]
  is_expired: boolean
  created_at: Date
  deleted_at: Date
  updated_at: Date
}

export interface RoomRes {
  room_id: string
  room_name: string | null
  room_avatar?: AttachmentRes | null
  room_type: RoomType
  member_count: number
  last_message?: LastMessage | null
  created_at: Date
  is_online: boolean
  message_unread_count: number
  offline_at: Date
}

export interface RoomDetailRes extends RoomRes {
  messages_pinned: ListRes<MessageRes[]>
  messages: ListRes<MessageRes[]>
  members: ListRes<RoomMemberRes[]>
  leader_user_info: RoomMemberRes | null
}

type RoomType = "group" | "single" | "admin"

export interface RoomMember {
  user_id: string
  joined_at: number
}

export interface MemberLeaved {
  user_id: string
  leaved_at: number
}

export interface RoomMemberWithId {
  _id: string
  member_ids: RoomMember[]
}

export type LastMessage = Pick<
  MessageRes,
  "message_id" | "message_text" | "is_author" | "author" | "created_at" | "room_id"
>

export interface CreateSingleChat {
  partner_id: number
}

export interface CreateGroupChat {
  room_name: Pick<IRoom, "room_name">
  room_avatar_id?: AttachmentId
  member_ids: number[]
}

export type CreateGroupChatServicesParams = Pick<
  CreateGroupChat,
  "room_avatar_id" | "room_name"
> & {
  member_ids: string[]
}

export type CreateSingleChatServices = {
  partner: IUser
  user: IUser
}

export interface QueryRoomParams extends QueryCommonParams {
  search_term?: string
}

export interface QueryMembersInRoomParams extends QueryCommonParams {
  search_term?: string
}

export interface QueryRoomServiceParams extends QueryRoomParams {
  room_ids: string[]
  current_user: IUser
}

export interface QueryMembersInRoomService extends QueryCommonParams {
  room_id: string
}

export type RoomMemberRes = Pick<
  IUser,
  "bio" | "gender" | "date_of_birth" | "is_online" | "user_name" | "phone"
> & {
  user_id: string
  avatar: AttachmentRes
}

export interface ClearUnreadMessage {
  room_id: string
}

export type ChangeStatusOfRoom = UserData & { type: "login" | "logout" }

export interface RoomFunctionHandler {
  messageUnreadhandler: (_: LastMessage) => void
  changeStatusOfRoom: (_: ChangeStatusOfRoom) => void
  increaseMessageUnread: (_: LastMessage) => void
  appendLastMessage: (_: LastMessage) => void
  setCurrentRoomToFirstOrder: (_: LastMessage) => void
}

export interface RoomDetailFunctionHandler {
  appendMessage: (_: MessageRes) => void
  changeStatusOfRoom: (_: ChangeStatusOfRoom) => void
  changeMesageStatus: (_: MessageRes) => void
  mutateMessageEmotion: (_: MutateMessageEmotion) => void
}

export interface AddMessageUnreadToRoomRes {
  message_unread_count: number
}

export interface ClearMessageUnread {
  room_id: string
}

export interface AddMessageUnread {
  message_id: string
}

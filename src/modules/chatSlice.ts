import {
  AttachmentRes,
  MessageAttachment,
  MessageForm,
  MessageFormData,
  MessageReply,
  PayloadType,
  RoomInfoRes,
  RoomTypingRes,
  TopMemberRes,
  UserRes,
} from "@/models"
import { createSlice } from "@reduxjs/toolkit"
import { Socket } from "socket.io-client"

interface ChatSlice {
  currentTyping: RoomTypingRes | undefined
  socket: Socket<any> | undefined
  messageFormData: MessageFormData[]
  profile: UserRes | undefined
  currentMessageEmotionId: string | undefined
  currentDetailMessageId: string | undefined
  currentProfileId: string | undefined
  currentRoomId: string | undefined
  currentPreviewImages: string[] | undefined
  currentRoomInfo: RoomInfo | undefined
}

const initialState: ChatSlice = {
  currentTyping: undefined,
  socket: undefined,
  messageFormData: [],
  profile: undefined,
  currentMessageEmotionId: undefined,
  currentDetailMessageId: undefined,
  currentProfileId: undefined,
  currentRoomId: undefined,
  currentPreviewImages: undefined,
  currentRoomInfo: undefined,
}

type RoomInfo = RoomInfoRes & {
  members: TopMemberRes[]
}

const chatSlice = createSlice({
  name: "chat_slice",
  initialState,
  reducers: {
    setCurrentTyping: (state, { payload }: PayloadType<RoomTypingRes | undefined>) => {
      state.currentTyping = payload
    },

    checkForUserDisconnectWhenTyping: (state, { payload }: PayloadType<string>) => {
      if (state.currentTyping?.user_id === payload) {
        state.currentTyping = undefined
      }
    },

    setCurrentRoomInfo: (state, { payload }: PayloadType<RoomInfo | undefined>) => {
      state.currentRoomInfo = payload
    },

    updateCurrentRoomInfo: (
      state,
      {
        payload,
      }: PayloadType<{ room_name?: string; room_avatar?: AttachmentRes | null; room_id: string }>
    ) => {
      if (payload.room_id !== state.currentRoomInfo?.room_id) return

      if (payload.room_name) {
        state.currentRoomInfo.room_name = payload.room_name
      }
      if (payload.room_avatar) {
        state.currentRoomInfo.room_avatar = payload.room_avatar
      }
    },

    setCurrentMessageEmotionId: (state, { payload }: PayloadType<string | undefined>) => {
      state.currentMessageEmotionId = payload
    },

    setCurrentPreviewImages: (state, { payload }: PayloadType<string[] | undefined>) => {
      state.currentPreviewImages = payload
    },

    setCurrentRoomId: (state, { payload }: PayloadType<string | undefined>) => {
      if (payload === state.currentRoomId) return

      if (state.currentRoomId) {
        state.socket?.emit("leave_room", state.currentRoomId)
      }
      state.socket?.emit("join_room", payload)

      state.currentRoomId = payload
    },

    setCurrentProfileId: (state, { payload }: PayloadType<string | undefined>) => {
      state.currentProfileId = payload
    },

    setcurrentDetailMessageId: (state, { payload }: PayloadType<string | undefined>) => {
      state.currentDetailMessageId = payload
    },

    setSocketInstance: (state, { payload }: PayloadType<Socket<any> | undefined>) => {
      state.socket = payload as any
    },

    setMessageDataInRoom: (state, { payload }: PayloadType<MessageForm>) => {
      if (!state.currentRoomId) return
      const index = state.messageFormData.findIndex((item) => item.room_id === state.currentRoomId)

      if (index === -1) {
        state.messageFormData.push({ ...payload, room_id: state.currentRoomId })
      } else {
        state.messageFormData[index] = { ...payload, room_id: state.currentRoomId }
      }
    },

    resetMessageDataInRoom: (state) => {
      if (!state.currentRoomId) return
      const index = state.messageFormData.findIndex((item) => item.room_id === state.currentRoomId)
      if (index === -1) return

      state.messageFormData[index] = { room_id: state.currentRoomId }
    },

    addMessageAttachment: (state, { payload }: PayloadType<MessageAttachment[]>) => {
      if (!state.currentRoomId) return
      const index = state.messageFormData.findIndex((item) => item.room_id === state.currentRoomId)
      if (index === -1) return

      if (!state?.messageFormData[index]?.attachments?.length) {
        state.messageFormData[index].attachments = payload
      } else {
        ;(state.messageFormData[index].attachments as any[]) = [
          ...(state.messageFormData[index]?.attachments || []),
          ...payload,
        ]
      }
    },

    setMessageReply: (state, { payload }: PayloadType<MessageReply | undefined>) => {
      if (!state.currentRoomId) return
      const index = state.messageFormData.findIndex((item) => item.room_id === state.currentRoomId)

      if (index === -1) {
        state.messageFormData.push({ reply_to: payload, room_id: state.currentRoomId })
      } else {
        state.messageFormData[index].reply_to = payload
      }
    },

    setMessageText: (state, { payload }: PayloadType<string>) => {
      if (!state.currentRoomId) return
      const index = state.messageFormData.findIndex((item) => item.room_id === state.currentRoomId)

      if (index === -1) {
        state.messageFormData.push({ room_id: state.currentRoomId, text: payload })
      } else {
        state.messageFormData[index].text = payload
      }
    },

    setChatProfile: (state, { payload }: PayloadType<UserRes>) => {
      state.profile = payload
    },

    deleteMessageAttachment: (state, { payload }: PayloadType<{ imageId: string }>) => {
      if (!state.currentRoomId) return
      const index = state.messageFormData.findIndex((item) => item.room_id === state.currentRoomId)
      if (index === -1) return

      state.messageFormData[index].attachments = (
        state?.messageFormData[index]?.attachments as MessageAttachment[]
      )?.filter((item) => item.id !== payload.imageId)
    },
  },
})

export default chatSlice.reducer
export const {
  setCurrentTyping,
  setSocketInstance,
  resetMessageDataInRoom,
  setMessageDataInRoom,
  addMessageAttachment,
  deleteMessageAttachment,
  setMessageText,
  setChatProfile,
  setMessageReply,
  setCurrentMessageEmotionId,
  checkForUserDisconnectWhenTyping,
  setcurrentDetailMessageId,
  setCurrentProfileId,
  setCurrentRoomId,
  setCurrentPreviewImages,
  setCurrentRoomInfo,
  updateCurrentRoomInfo,
} = chatSlice.actions

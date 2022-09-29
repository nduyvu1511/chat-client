import {
  MessageAttachment,
  MessageForm,
  MessageFormData,
  MessageReply,
  PayloadType,
  RoomTypingRes,
  UserRes,
} from "@/models"
import { createSlice } from "@reduxjs/toolkit"
import { Socket } from "socket.io-client"

interface ChatSlice {
  currentTyping: RoomTypingRes | undefined
  socket: Socket<any> | undefined
  messageFormData: MessageFormData[]
  profile: UserRes | undefined
  currentMessageEmotionModalId: string | undefined
}

const initialState: ChatSlice = {
  currentTyping: undefined,
  socket: undefined,
  messageFormData: [],
  profile: undefined,
  currentMessageEmotionModalId: undefined,
}

const chatSlice = createSlice({
  name: "chat_slice",
  initialState,
  reducers: {
    setCurrentTyping: (state, { payload }: PayloadType<RoomTypingRes | undefined>) => {
      state.currentTyping = payload
    },

    setCurrentMessageEmotionModalId: (state, { payload }: PayloadType<string | undefined>) => {
      state.currentMessageEmotionModalId = payload
    },

    setSocketInstance: (state, { payload }: PayloadType<Socket<any> | undefined>) => {
      state.socket = payload as any
    },

    setMessageDataInRoom: (
      state,
      { payload }: PayloadType<{ data: MessageForm; roomId: string }>
    ) => {
      const index = state.messageFormData.findIndex((item) => {
        return item.roomId === payload.roomId
      })

      if (index === -1) {
        state.messageFormData.push({ ...payload.data, roomId: payload.roomId })
      } else {
        state.messageFormData[index] = { ...payload.data, roomId: payload.roomId }
      }
    },

    resetMessageDataInRoom: (state, { payload }: PayloadType<string>) => {
      const index = state.messageFormData.findIndex((item) => item.roomId === payload)
      if (index === -1) return

      state.messageFormData[index] = { roomId: payload }
    },

    addMessageAttachment: (
      state,
      { payload }: PayloadType<{ data: MessageAttachment[]; roomId: string }>
    ) => {
      const index = state.messageFormData.findIndex((item) => item.roomId === payload.roomId)
      if (index === -1) return

      if (!state?.messageFormData[index]?.attachments?.length) {
        state.messageFormData[index].attachments = payload.data
      } else {
        state.messageFormData[index].attachments = [
          ...(state.messageFormData[index]?.attachments || []),
          ...payload.data,
        ]
      }
    },

    setMessageReply: (
      state,
      { payload }: PayloadType<{ data: MessageReply | undefined; roomId: string }>
    ) => {
      const index = state.messageFormData.findIndex((item) => item.roomId === payload.roomId)

      if (index === -1) {
        state.messageFormData.push({ reply_to: payload.data, roomId: payload.roomId })
      } else {
        state.messageFormData[index].reply_to = payload.data
      }
    },

    setMessageText: (state, { payload }: PayloadType<{ text: string; roomId: string }>) => {
      const index = state.messageFormData.findIndex((item) => item.roomId === payload.roomId)
      if (index === -1) {
        state.messageFormData.push({ roomId: payload.roomId, text: payload.text })
      } else {
        state.messageFormData[index].text = payload.text
      }
    },

    setChatProfile: (state, { payload }: PayloadType<UserRes>) => {
      state.profile = payload
    },

    deleteMessageAttachment: (
      state,
      { payload }: PayloadType<{ imageId: string; roomId: string }>
    ) => {
      const index = state.messageFormData.findIndex((item) => item.roomId === payload.roomId)
      if (index === -1) return

      state.messageFormData[index].attachments = state?.messageFormData[index]?.attachments?.filter(
        (item) => item.id !== payload.imageId
      )
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
  setCurrentMessageEmotionModalId,
} = chatSlice.actions

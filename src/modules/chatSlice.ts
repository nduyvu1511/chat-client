import { ImageWithId, MessageForm, MessageFormData, PayloadType } from "@/models"
import { createSlice } from "@reduxjs/toolkit"
import { Socket } from "socket.io-client"

interface ChatSlice {
  isTyping: boolean
  socket: Socket<any> | undefined
  messageFormData: MessageFormData[]
}

const initialState: ChatSlice = {
  isTyping: false,
  socket: undefined,
  messageFormData: [],
}

const chatSlice = createSlice({
  name: "chat_slice",
  initialState,
  reducers: {
    setTyping: (state, { payload }: PayloadType<boolean>) => {
      state.isTyping = payload
    },

    setSocketInstance: (state, { payload }: PayloadType<Socket<any> | undefined>) => {
      state.socket = payload as any
    },

    setMessageDataInRoom: (
      state,
      { payload }: PayloadType<{ data: MessageForm } & { roomId: string }>
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
      { payload }: PayloadType<{ previewImage: ImageWithId; file: File; roomId: string }>
    ) => {
      // const index = state.messageFormData.findIndex((item) => item.roomId === payload.roomId)
      // if (index === -1) return
      // if (!state.messageFormData[index]?.attachment?.formData) {
      //   state.messageFormData[index].attachment = {
      //     formData: new FormData(),
      //     previewImages: [],
      //   }
      // }
      // state.messageFormData[index]?.attachment?.previewImages?.push(payload.previewImage)
      // state.messageFormData[index]?.attachment?.formData.append(
      //   payload.previewImage.id,
      //   payload.file
      // )
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
  setTyping,
  setSocketInstance,
  resetMessageDataInRoom,
  setMessageDataInRoom,
  addMessageAttachment,
  deleteMessageAttachment,
} = chatSlice.actions

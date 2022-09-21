import { MessageForm, MessageFormData, PayloadType } from "@/models"
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
        state.messageFormData.push({ roomId: payload.roomId, data: payload.data })
      } else {
        state.messageFormData[index].data = payload.data
      }
    },

    resetMessageDataInRoom: (state, { payload }: PayloadType<string>) => {
      const index = state.messageFormData.findIndex((item) => item.roomId === payload) || -1
      if (index === -1) {
        state.messageFormData.push({ roomId: payload, data: undefined })
      }
    },
  },
})

export default chatSlice.reducer
export const { setTyping, setSocketInstance, resetMessageDataInRoom, setMessageDataInRoom } =
  chatSlice.actions

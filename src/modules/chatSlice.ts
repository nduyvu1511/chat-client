import { PayloadType } from "@/models"
import { createSlice } from "@reduxjs/toolkit"
import { Socket } from "socket.io-client"

interface ChatSlice {
  isTyping: boolean
  socket: Socket<any> | undefined
}

const initialState: ChatSlice = {
  isTyping: false,
  socket: undefined,
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
  },
})

export default chatSlice.reducer
export const { setTyping, setSocketInstance } = chatSlice.actions

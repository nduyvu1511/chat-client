import { PayloadType, RoomRes } from "@/models"
import { createSlice } from "@reduxjs/toolkit"

interface RoomHistorySlice {
  data: RoomRes[]
}

const initialState: RoomHistorySlice = {
  data: [],
}

const roomHistorySlice = createSlice({
  name: "room_slice",
  initialState,
  reducers: {
    addRoomHistory: (state, { payload }: PayloadType<RoomRes>) => {
      if (!state.data.some((item) => item.room_id === payload.room_id)) {
        state.data.unshift(payload)
      }
    },

    deleteRoomHistory: (state, { payload }: PayloadType<string>) => {
      state.data = state.data.filter((item) => item.room_id !== payload)
    },
  },
})

export default roomHistorySlice.reducer
export const { addRoomHistory, deleteRoomHistory } = roomHistorySlice.actions

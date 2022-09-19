import { PayloadType, UserRes } from "@/models"
import { createSlice } from "@reduxjs/toolkit"

interface ProfileSlice {
  data: UserRes | undefined
}

const initialState: ProfileSlice = {
  data: undefined,
}

const profileSlice = createSlice({
  name: "profile_slice",
  initialState,
  reducers: {
    setProfile: (state, { payload }: PayloadType<UserRes | undefined>) => {
      state.data = payload
    },
  },
})

export default profileSlice.reducer
export const { setProfile } = profileSlice.actions

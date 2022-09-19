import { combineReducers } from "@reduxjs/toolkit"
import { reducer as notificationsReducer } from "reapop"
import chatSlice from "./chatSlice"
import commonSlice from "./commonSlice"
import profileSlice from "./profileSlice"

const rootReducer = combineReducers({
  notifications: notificationsReducer(),
  chat: chatSlice,
  profile: profileSlice,
  common: commonSlice,
})

export default rootReducer
export * from "./chatSlice"
export * from "./profileSlice"
export * from "./commonSlice"

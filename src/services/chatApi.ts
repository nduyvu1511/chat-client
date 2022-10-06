import {
  AddMessageUnread,
  changeUserStatusParams,
  CreateGroupChat,
  CreateSingleChat,
  LikeMessage,
  LoginFormParams,
  QueryCommonParams,
  SendMessage,
  UpdateRoomInfo,
} from "@/models"
import { setProfile } from "@/modules"
import axios from "axios"
import mem from "mem"
import { store } from "../core"

const axiosClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api`,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
})

axiosClient.interceptors.request.use(async (config) => {
  return config
})

const memoizedRefreshToken = mem(
  async () => {
    const res = await chatApi.refreshToken()
    return res
  },
  {
    maxAge: 10000,
  }
)

axiosClient.interceptors.request.use(async (config) => {
  const accessToken = store.getState().chat.accessToken
  ;(config as any).headers.authorization = `Bearer ${accessToken}`
  return config
})

try {
  axiosClient.interceptors.response.use(
    async (response) => {
      if (response?.data?.status_code === 401 || response?.data?.status_code === 403) {
        const res = await memoizedRefreshToken()

        if (res?.success) {
          return response.data
        } else {
          store.dispatch(setProfile(undefined))
        }
      }

      if (response?.data) {
        return response.data
      }
      return response
    },
    (err) => {
      throw err
    }
  )
} catch (error) {
  console.log(error)
}

const chatApi = {
  createSingleChat: (params: CreateSingleChat) => {
    return axiosClient.post("/room/single", params)
  },

  createGroupChat: (params: CreateGroupChat) => {
    return axiosClient.post("/room/group_chat", params)
  },

  getProfile: (id?: string) => {
    return axiosClient.get(`/user/profile${id ? `?user_id=${id}` : ""}`)
  },

  getRoomList: ({
    limit = 30,
    offset = 0,
    search_term,
  }: QueryCommonParams & { search_term?: string }) => {
    return axiosClient.get(
      `/room?limit=${limit}&offset=${offset}${search_term ? `&search_term=${search_term}` : ""}`
    )
  },

  getRoomDetail: (roomId: string) => {
    return axiosClient.get(`/room/${roomId}`)
  },

  getMessagesPinnedInRoom: ({
    limit = 30,
    offset = 0,
    room_id,
  }: QueryCommonParams & { room_id: string }) => {
    return axiosClient.get(`/room/${room_id}/messages_pinned?limit=${limit}&offset=${offset}`)
  },

  getMessagesInRoom: ({
    limit = 30,
    offset = 0,
    room_id,
  }: QueryCommonParams & { room_id: string }) => {
    return axiosClient.get(`/room/${room_id}/messages?limit=${limit}&offset=${offset}`)
  },

  getMembersInRoom: ({
    limit = 30,
    offset = 0,
    room_id,
  }: QueryCommonParams & { room_id: string }) => {
    return axiosClient.get(`/room/${room_id}/members?limit=${limit}&offset=${offset}`)
  },

  sendMessage: (params: SendMessage) => {
    return axiosClient.post("/message", params)
  },

  getMessageById: (msgId: string) => {
    return axiosClient.get(`/message/${msgId}`)
  },

  getTagMessageList: ({ limit = 30, offset = 0 }: QueryCommonParams) => {
    return axiosClient.get(`/tag?limit=${limit}&offset=${offset}`)
  },

  changeUserStatus: (params: changeUserStatusParams) => {
    return axiosClient.patch("/status", params)
  },
  getUserData: () => {
    return axiosClient.get("/user")
  },

  addMessageUnreadToRoom: (params: AddMessageUnread) => {
    return axiosClient.post("/room/message_unread", params)
  },

  clearMessageUnreadFromRoom: (roomId: string) => {
    return axiosClient.delete(`/room/${roomId}/message_unread`)
  },

  confirmReadMessage: (message_id: string) => {
    return axiosClient.patch(`/message/read`, { message_id })
  },

  confirmReadAllMessageInRoom: (room_id: string) => {
    return axiosClient.patch(`/message/read_all`, { room_id })
  },

  login: (params: LoginFormParams) => {
    return axiosClient.post(`/user/login`, params)
  },

  logout: () => {
    return axiosClient.post(`/user/logout`)
  },

  refreshToken: () => {
    return axiosClient.post(`/user/refresh`)
  },

  likeMessage: (params: LikeMessage) => {
    return axiosClient.post(`/message/like`, params)
  },

  unlikeMessage: (messageId: string) => {
    return axiosClient.delete(`/message/unlike/${messageId}`)
  },

  getUsersLikedMessage: (messageId: string) => {
    return axiosClient.get(`/message/users/like/${messageId}`)
  },

  getUsersReadMessage: (messageId: string) => {
    return axiosClient.get(`/message/users/read/${messageId}`)
  },

  uploadSingleImage: (formData: FormData) => {
    return axiosClient.post(`/attachment/image/single`, formData)
  },

  uploadMultipleImage: (formData: FormData) => {
    return axiosClient.post(`/attachment/image/multiple`, formData)
  },

  uploadMultipleVideo: (formData: FormData) => {
    return axiosClient.post(`/attachment/video/multiple`, formData)
  },

  uploadSingleVideo: (formData: FormData) => {
    return axiosClient.post(`/attachment/video/single`, formData)
  },

  deleteAttachment: (id: string) => {
    return axiosClient.delete(`/attachment/${id}`)
  },

  getDetailMessage: (id: string) => {
    return axiosClient.get(`/message/detail/${id}`)
  },

  updateRoomInfo: (params: UpdateRoomInfo) => {
    const { room_id, ...rest } = params
    return axiosClient.patch(`/room/info/${room_id}`, rest)
  },
}

export { chatApi }

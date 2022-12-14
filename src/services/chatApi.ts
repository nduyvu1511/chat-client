import {
  AddMessageUnread,
  changeUserStatusParams,
  CreateGroupChat,
  CreateSingleChat,
  LikeMessage,
  LoginFormParams,
  LoginToSocket,
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
    // Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzFhYjMxZGI2MDViYjI5MDZkOWFjZWIiLCJ1c2VyX2lkIjo1LCJyb2xlIjoiY3VzdG9tZXIiLCJpYXQiOjE2NjMxMjQxODB9.62mN-CWn5EKsf3TuTJJBGAP866fmj8S0HcOqQnGTVnw`,
    // Blank user
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzFkNTZjNTRhMjBiZWY4MmU0NzlmMGQiLCJ1c2VyX2lkIjoyLCJyb2xlIjoiY3VzdG9tZXIiLCJpYXQiOjE2NjI5MDEzNTl9.7YgTIRjbTGsmUSEfz3RwHl0UdTgv6f9loNJ4Zmz_3nQ`,
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

try {
  axiosClient.interceptors.response.use(
    async (response) => {
      if (response?.data?.status_code === 401 || response?.data?.status_code === 403) {
        const res = await memoizedRefreshToken()

        console.log(res.success)

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

  getTagMessageList: ({ limit, offset }: QueryCommonParams) => {
    return axiosClient.post(`/tag?limit=${limit}&offset=${offset}`)
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

  loginToSocket: (params: LoginToSocket) => {
    return axiosClient.post("/user/login_to_socket", params)
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

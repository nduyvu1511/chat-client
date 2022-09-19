import { LoginToSocket, UserData } from "@/models"
import { chatApi } from "@/services"

interface UseChatRes {
  loginToSocket: (_: LoginToSocket) => Promise<UserData | null>
  confirmReadMessage: (messageId: string, cb?: Function) => void
}

export const useChat = (): UseChatRes => {
  const loginToSocket = async (params: LoginToSocket): Promise<UserData | null> => {
    try {
      const res = await chatApi.loginToSocket(params)
      const user: UserData = res.data
      return user
    } catch (error) {
      console.log(error)
      return null
    }
  }

  const confirmReadMessage = async (messageId: string, cb?: Function) => {
    try {
      const res: any = await chatApi.confirmReadMessage(messageId)
      if (res?.success) {
        cb?.()
      }
    } catch (error) {
      console.log(error)
    }
  }

  return {
    loginToSocket,
    confirmReadMessage,
  }
}

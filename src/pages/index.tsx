import { Chat } from "@/components"
import { AuthLayout } from "@/layout"
import { useSelector } from "react-redux"
import { RootState } from "../core"

const ChatPage = () => {
  const token = useSelector((state: RootState) => state.chat.accessToken)
  console.log({ token })

  return (
    <AuthLayout>
      <section className="bg-bg flex flex-col h-[100vh] py-24 chat-page">
        <div className="container flex-1 flex flex-col">
          <Chat />
        </div>
      </section>
    </AuthLayout>
  )
}

export default ChatPage

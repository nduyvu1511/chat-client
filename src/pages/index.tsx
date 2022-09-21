import { Chat } from "@/components"
import { AuthLayout } from "@/layout"

const ChatPage = () => {
  return (
    <section className="bg-bg flex flex-col min-h-[100vh] py-24 chat-page">
      <div className="container flex-1 flex flex-col">
        <Chat />
      </div>
    </section>
  )
}

export default ChatPage

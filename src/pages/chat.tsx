import { Chat } from "@/components"
import { AuthLayout } from "@/layout"

const ChatPage = () => {
  return (
    <AuthLayout>
      <section className="bg-bg flex flex-col min-h-[calc(100vh-80px)] py-24 chat-page">
        <div className="container flex-1 flex flex-col">
          <Chat />
        </div>
      </section>
    </AuthLayout>
  )
}

export default ChatPage

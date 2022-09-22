import { Chat } from "@/components"

const ChatPage = () => {
  return (
    <section className="bg-bg flex flex-col h-[100vh] py-24 chat-page">
      <div className="container flex-1 flex flex-col">
        <Chat />
      </div>
    </section>
  )
}

export default ChatPage

import { RootState } from "@/core/store"
import { LikeMessage, ListRes, MessageRes, UnlikeMessage } from "@/models"
import { useEffect, useRef } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { useSelector } from "react-redux"
import { MessageItem } from "./messageItem"

interface MessageProps {
  data: ListRes<MessageRes[]>
  onLikeMessage?: (_: LikeMessage) => void
  onUnlikeMessage?: (_: UnlikeMessage) => void
}

export const Message = ({ data, onLikeMessage, onUnlikeMessage }: MessageProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const isFirstMount = useRef<boolean>(true)
  const isTyping = useSelector((state: RootState) => state.chat.isTyping)

  useEffect(() => {
    let behavior: ScrollBehavior = isFirstMount.current ? "auto" : "smooth"
    ref.current?.scrollIntoView({ behavior })
    if (isFirstMount.current === true) {
      isFirstMount.current = false
    }
  }, [data?.data?.length, isTyping])

  return (
    <InfiniteScroll
      className="chat-message-list overflow-y-auto pr-12 flex-1"
      dataLength={100}
      hasMore={true}
      loader={null}
      height={window.innerHeight}
      inverse
      next={() => {
        console.log("next")
      }}
    >
      {data?.data?.length
        ? data.data.map((item) => (
            <div className="mb-10" key={item.message_id} ref={ref}>
              <MessageItem
                onLikeMessage={onLikeMessage}
                onUnlikeMessage={onUnlikeMessage}
                lastMessage={data.data?.[data?.data?.length - 1]}
                key={item.message_id}
                data={item}
              />
            </div>
          ))
        : null}

      {isTyping ? <div>typing...</div> : null}
    </InfiniteScroll>
  )
}

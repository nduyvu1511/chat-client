import { Spinner } from "@/components"
import { LikeMessage, ListRes, MessageRes, RoomType, UnlikeMessage } from "@/models"
import moment from "moment"
import InfiniteScroll from "react-infinite-scroll-component"
import { MessageItem } from "./messageItem"

interface MessageProps {
  data: ListRes<MessageRes[]>
  onLikeMessage?: (_: LikeMessage) => void
  onUnlikeMessage?: (_: UnlikeMessage) => void
  roomType: RoomType
  isFetchingMore?: boolean
  onGetMoreMessage: Function
  onResendMessage?: (_: MessageRes) => void
}

export const Message = ({
  data,
  onLikeMessage,
  onUnlikeMessage,
  roomType,
  isFetchingMore,
  onGetMoreMessage,
  onResendMessage,
}: MessageProps) => {
  const handleRedirectToReplyMessage = (id: string) => {
    document.querySelector(`.message-item-${id}`)?.scrollIntoView()
  }

  return (
    <div
      className="flex-1 mr-12 overflow-y-auto flex flex-col-reverse chat-message-list"
      id="messageScrollable"
    >
      <InfiniteScroll
        inverse
        className="p-24"
        scrollableTarget="messageScrollable"
        loader={null}
        hasMore={data.has_more}
        next={() => {
          console.log("fetch more messages")
          onGetMoreMessage()
        }}
        dataLength={data?.data?.length}
      >
        {isFetchingMore ? <Spinner size={20} className="py-0" /> : null}

        {data?.data?.length
          ? data.data.map((item, index) => {
              const messages = data?.data || []

              const prevMsg = messages[index - 1]
              const nextMsg = messages[index + 1]

              const shouldShowDate =
                !prevMsg || !moment(item?.created_at).isSame(moment(prevMsg?.created_at), "date")
              const shouldBreak =
                !prevMsg || prevMsg?.author?.author_id !== item?.author?.author_id || shouldShowDate
              const isLast =
                !nextMsg ||
                nextMsg?.author?.author_id !== item.author?.author_id ||
                !moment(item?.created_at).isSame(moment(nextMsg?.created_at), "date")

              return (
                <MessageItem
                  roomType={roomType}
                  onResendMessage={onResendMessage}
                  onClickReplyMsg={handleRedirectToReplyMessage}
                  className={`${roomType === "group" ? "flex-1" : ""}`}
                  isLast={isLast}
                  shouldBreak={shouldBreak}
                  onLikeMessage={onLikeMessage}
                  onUnlikeMessage={onUnlikeMessage}
                  lastMessage={data.data?.[data?.data?.length - 1]}
                  key={item.message_id}
                  data={item}
                  shouldShowDate={shouldShowDate}
                />
              )
            })
          : null}
      </InfiniteScroll>
    </div>
  )
}

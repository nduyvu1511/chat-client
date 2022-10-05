import { Spinner } from "@/components"
import { LikeMessage, ListRes, MessageRes, RoomType, UnlikeMessage } from "@/models"
import moment from "moment"
import InfiniteScroll from "react-infinite-scroll-component"
import { MessageItem } from "./messageItem"

interface MessageProps {
  data: ListRes<MessageRes[]>
  onReactMessage?: (_: LikeMessage) => void
  onUndoReactMessage?: (_: UnlikeMessage) => void
  roomType: RoomType
  isFetchingMore?: boolean
  onGetMoreMessage: Function
  onResendMessage?: (_: MessageRes) => void
}

export const Message = ({
  data,
  onReactMessage,
  onUndoReactMessage,
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
      className="flex-1 lg:mr-12 overflow-y-auto flex flex-col-reverse chat-message-list"
      id="messageScrollable"
    >
      <InfiniteScroll
        inverse
        className="p-12 lg :p-24 lg :pr-12"
        scrollableTarget="messageScrollable"
        loader={null}
        hasMore={data.has_more}
        next={() => {
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
                <div key={item.message_id}>
                  {shouldShowDate ? (
                    <div className="flex-center my-24 mx-24">
                      <span className="flex-1 border-b border-border-color border-solid"></span>
                      <span className="text-[10px] font-medium text-gray-color-3 leading-[16px] md:text-12 bg-bg rounded-[8px] py-2 px-8 mx-4">
                        {moment(item.created_at).format("HH:mm DD/MM/YYYY")}
                      </span>
                      <span className="flex-1 border-b border-border-color border-solid"></span>
                    </div>
                  ) : null}

                  <MessageItem
                    roomType={roomType}
                    onResendMessage={onResendMessage}
                    onClickReplyMsg={handleRedirectToReplyMessage}
                    isLast={isLast}
                    shouldBreak={shouldBreak}
                    onReactMessage={onReactMessage}
                    onUndoReactMessage={onUndoReactMessage}
                    lastMessage={data.data?.[data?.data?.length - 1]}
                    data={item}
                  />
                </div>
              )
            })
          : null}
      </InfiniteScroll>
    </div>
  )
}

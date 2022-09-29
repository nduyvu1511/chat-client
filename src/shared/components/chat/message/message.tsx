import { Spinner } from "@/components"
import { LikeMessage, ListRes, MessageRes, RoomType, UnlikeMessage } from "@/models"
import moment from "moment"
import Image from "next/image"
import { useRef } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { MessageItem } from "./messageItem"

interface MessageProps {
  data: ListRes<MessageRes[]>
  onLikeMessage?: (_: LikeMessage) => void
  onUnlikeMessage?: (_: UnlikeMessage) => void
  roomType: RoomType
  isFetchingMore?: boolean
  onGetMoreMessage: Function
}

export const Message = ({
  data,
  onLikeMessage,
  onUnlikeMessage,
  roomType,
  isFetchingMore,
  onGetMoreMessage,
}: MessageProps) => {
  const ref = useRef<HTMLDivElement>(null)

  const handleRedirectToReplyMessage = (id: string) => {
    document.querySelector(`.message-item-${id}`)?.scrollIntoView()
  }

  return (
    <div
      className="flex-1 p-24 mr-12 overflow-y-auto flex flex-col-reverse pr-12 chat-message-list"
      id="messageScrollable"
    >
      <InfiniteScroll
        inverse
        scrollableTarget="messageScrollable"
        loader={null}
        hasMore={data.has_more}
        next={() => {
          console.log("fetch more messages")
          onGetMoreMessage()
        }}
        dataLength={data?.data?.length}
      >
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
                <>
                  {/* Date breakpoints */}
                  {shouldShowDate ? (
                    <div key={item.message_id + index} className="flex-center text-xs my-24">
                      <span className="mx-8">
                        {moment(item.created_at).format("HH:mm DD/MM/YYYY")}
                      </span>
                    </div>
                  ) : null}
                  <div
                    className={`flex group ${
                      item?.attachments?.length || item?.location || item?.tags?.length
                        ? "mb-24"
                        : "mb-4"
                    }`}
                    key={item.message_id}
                    ref={ref}
                  >
                    <div
                      className={`message-item-${item.message_id} max-w-[60%] w-full flex ${
                        item.is_author ? "flex-row-reverse ml-auto" : ""
                      }`}
                    >
                      {/* Show avatar of sender if type of conversation is group  */}
                      {roomType === "group" ? (
                        <div
                          className={`relative w-[38px] h-[38px] rounded-[50%] overflow-hidden ${
                            roomType === "group" ? `${item.is_author ? "ml-12" : "mr-12"}` : "mr-12"
                          }`}
                        >
                          {shouldBreak ? (
                            <Image
                              src={item.author.author_avatar.thumbnail_url}
                              alt=""
                              layout="fill"
                              objectFit="cover"
                            />
                          ) : null}
                        </div>
                      ) : null}

                      <MessageItem
                        onClickReplyMsg={handleRedirectToReplyMessage}
                        className={`${roomType === "group" ? "flex-1" : ""}`}
                        isLast={isLast}
                        shouldBreak={shouldBreak}
                        onLikeMessage={onLikeMessage}
                        onUnlikeMessage={onUnlikeMessage}
                        lastMessage={data.data?.[data?.data?.length - 1]}
                        key={item.message_id}
                        data={item}
                      />
                    </div>
                  </div>
                </>
              )
            })
          : null}
      </InfiniteScroll>

      {isFetchingMore ? <Spinner className="py-0" /> : null}
    </div>
  )
}

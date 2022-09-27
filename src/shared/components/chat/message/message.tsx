import { RootState } from "@/core/store"
import { LikeMessage, ListRes, MessageRes, RoomType, UnlikeMessage } from "@/models"
import Image from "next/image"
import { useEffect, useRef } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { useSelector } from "react-redux"
import { MessageItem } from "./messageItem"

interface MessageProps {
  data: ListRes<MessageRes[]>
  onLikeMessage?: (_: LikeMessage) => void
  onUnlikeMessage?: (_: UnlikeMessage) => void
  roomType: RoomType
}

export const Message = ({ data, onLikeMessage, onUnlikeMessage, roomType }: MessageProps) => {
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
    <div
      className="flex-1 flex flex-col overflow-y-auto pr-12 chat-message-list"
      id="scrollableDiv"
    >
      <InfiniteScroll
        className="flex-1 "
        scrollableTarget="scrollableDiv"
        // loader={isFetchingMore ? <Spinner /> : null}
        loader={null}
        hasMore={true}
        next={() => console.log("more items")}
        dataLength={data?.data?.length}
      >
        {data?.data?.length
          ? data.data.map((item, index) => {
              const messages = data?.data || []

              const prevMsg = messages[index - 1]
              const nextMsg = messages[index + 1]

              const shouldBreak = !prevMsg || prevMsg?.author.author_id !== item.author.author_id
              const isLast = !nextMsg || nextMsg?.author.author_id !== item.author.author_id

              return (
                <div
                  className={`mb-4 flex ${item.is_author ? "flex-row-reverse" : ""}`}
                  key={item.message_id}
                  ref={ref}
                >
                  {roomType === "group" ? (
                    <div
                      className={`relative w-[46px] h-[46px] rounded-[50%] overflow-hidden ${
                        roomType === "group" ? "ml-12" : "mr-12"
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
              )
            })
          : null}

        {isTyping ? <div>typing...</div> : null}
      </InfiniteScroll>
    </div>
  )
}

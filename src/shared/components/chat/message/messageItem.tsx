import { Map } from "@/components"
import { getMessageDescription } from "@/helper"
import { LikeMessage, Lnglat, MessageReactionType, MessageRes, UnlikeMessage } from "@/models"
import { setCurrentMessageEmotionModalId, setMessageReply } from "@/modules"
import { useDispatch } from "react-redux"
import { MessageItemImage } from "./messageItemImage"
import { MessageItemOption } from "./messageItemOption"
import { MessageItemStatus } from "./messageItemStatus"
import { MessageReactionCount } from "./messageReactionCount"

interface MessageItemProps {
  className?: string
  data: MessageRes
  lastMessage: MessageRes
  onLikeMessage?: (_: LikeMessage) => void
  onUnlikeMessage?: (_: UnlikeMessage) => void
  isLast: boolean
  shouldBreak: boolean
  onClickReplyMsg?: (id: string) => void
}

export const MessageItem = ({
  className,
  data,
  lastMessage,
  onLikeMessage,
  onUnlikeMessage,
  isLast,
  shouldBreak,
  onClickReplyMsg,
}: MessageItemProps) => {
  const dispatch = useDispatch()

  const generateGoogleMapUrl = ({ lat, lng }: Lnglat) => {
    window.open(`https://www.google.com/maps/place/${lat},${lng}`, "_blank")
  }

  const handleSetMessageReply = () => {
    dispatch(
      setMessageReply({
        data: {
          message_id: data.message_id,
          message_text: getMessageDescription(data),
          attachment: {
            id: data?.attachments?.[0]?.attachment_id,
            url: data?.attachments?.[0]?.thumbnail_url,
          },
          created_at: data.created_at,
          author: {
            author_avatar: data.author.author_avatar,
            author_id: data.author.author_id,
            author_name: data.author.author_name,
          },
        },
        roomId: data.room_id,
      })
    )
  }

  const handleReactionMessage = (emotion: MessageReactionType) => {
    onLikeMessage?.({ emotion, message_id: data.message_id })
  }

  const handleUndoMesasgeReaction = (reaction: MessageReactionType) => {
    console.log({ reactionFromMessageItem: reaction })
    onUnlikeMessage?.({ message_id: data.message_id, reaction })
  }

  const handleClickReactedMessage = () => {
    dispatch(setCurrentMessageEmotionModalId(data.message_id))
  }

  return (
    <div className={`w-full ${className || ""}`}>
      {!data.attachments?.length || data.attachments?.length === 1 ? (
        <div
          className={`rounded-[8px] relative ${data?.attachments?.length ? "" : "w-fit p-16"} ${
            data.is_author ? "bg-bg-blue ml-auto" : "bg-bg"
          }`}
        >
          {!data?.status || data.status === "fulfilled" ? (
            <MessageItemOption
              value={data?.your_reaction}
              optionTop={0}
              onReaction={handleReactionMessage}
              onUndoReaction={handleUndoMesasgeReaction}
              className={` group-hover:block w-fit ${
                !data?.is_author ? "right-[calc(0%-120px)]" : "left-[calc(0%-120px)]"
              }`}
              onReply={handleSetMessageReply}
            />
          ) : null}

          {data?.attachments?.length ? (
            <MessageItemImage data={data.attachments} onClick={(url) => console.log(url)} />
          ) : null}

          {/* Reply message */}
          {data?.reply_to?.message_id ? (
            <div
              onClick={() =>
                data.reply_to?.message_id && onClickReplyMsg?.(data.reply_to?.message_id)
              }
              className={`p-12 mb-10 rounded-[8px] min-w-[140px] cursor-pointer flex items-stretch ${
                data.is_author ? "bg-[#cddef8]" : "bg-gray-05"
              }`}
            >
              <div className="">
                <p className="text-sm mb-4 line-clamp-1 word-break text-primary font-semibold">
                  @{data.reply_to.author.author_name}
                </p>
                <p className="text-xs line-clamp-1 word-break">{data.reply_to.message_text}</p>
              </div>
            </div>
          ) : null}

          {/* Message text */}
          {data?.message_text ? (
            <p
              className={`text-14 leading-20 font-medium ${
                data.is_author ? "text-primary" : "text-blue-8"
              } ${data?.attachments?.length ? "p-16" : ""}`}
            >
              {data.message_text}
            </p>
          ) : null}

          {/* Location */}
          {data?.location ? (
            <div
              onClick={() => data.location && generateGoogleMapUrl(data.location)}
              className="w-[300px] h-[150px] rounded-[8px] overflow-hidden cursor-pointer"
            >
              <Map
                // markerIcon={data.author?.author_avatar?.thumbnail_url || blankAvatar}
                viewOnly
                markerLocation={{ lat: +data.location.lat, lng: +data.location.lng }}
              />
            </div>
          ) : null}

          {isLast ? (
            <MessageItemStatus
              className={`mt-8 ${data?.attachments?.length ? "px-16 pb-16 mt-[-4px]" : ""}`}
              createdAt={data.created_at}
              isRead={data.is_read}
              showStatus={lastMessage.message_id === data.message_id && lastMessage.is_author}
              status={data?.status}
            />
          ) : null}

          {data.reaction_count ? (
            <MessageReactionCount
              onClick={handleClickReactedMessage}
              count={data.reaction_count}
              reactions={data.reactions}
            />
          ) : null}
        </div>
      ) : data?.attachments?.length ? (
        <div className="relative flex-1 w-full">
          {data?.message_text ? (
            <div
              className={`rounded-[8px] p-16 w-fit ${
                data.is_author ? "text-primary bg-bg-blue ml-auto" : "text-blue-8 bg-bg"
              }`}
            >
              <p className="text-14 leading-20 font-medium">{data.message_text}</p>

              {data.reaction_count ? (
                <MessageReactionCount
                  onClick={handleClickReactedMessage}
                  count={data.reaction_count}
                  reactions={data.reactions}
                />
              ) : null}
            </div>
          ) : null}

          <MessageItemImage
            data={data.attachments}
            className="mt-4"
            onClick={(url) => console.log(url)}
          />

          {isLast ? (
            <MessageItemStatus
              className={`mt-8 ${data?.attachments?.length ? "pb-16 mt-16" : ""}`}
              createdAt={data.created_at}
              isRead={data.is_read}
              showStatus={lastMessage.message_id === data.message_id && lastMessage.is_author}
              status={data?.status}
            />
          ) : null}

          {!data?.status || data.status === "fulfilled" ? (
            <MessageItemOption
              value={data?.your_reaction}
              onReaction={handleReactionMessage}
              onUndoReaction={handleUndoMesasgeReaction}
              className={`hidden group-hover:block ${
                !data?.is_author ? "right-[-80px]" : "left-[-100px]"
              }`}
              onReply={handleSetMessageReply}
            />
          ) : null}

          {data.reaction_count ? (
            <MessageReactionCount
              onClick={handleClickReactedMessage}
              count={data.reaction_count}
              reactions={data.reactions}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

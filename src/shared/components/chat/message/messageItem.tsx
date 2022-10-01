import { Map } from "@/components"
import { getMessageDescription } from "@/helper"
import {
  LikeMessage,
  Lnglat,
  MessageReactionType,
  MessageRes,
  RoomType,
  UnlikeMessage,
} from "@/models"
import {
  setcurrentDetailMessageId,
  setCurrentMessageEmotionId,
  setCurrentProfileId,
  setMessageReply,
} from "@/modules"
import moment from "moment"
import Image from "next/image"
import Linkify from "react-linkify"
import { useDispatch } from "react-redux"
import { MessageItemImage } from "./messageItemImage"
import { MessageItemOption } from "./messageItemOption"
import { MessageItemStatus } from "./messageItemStatus"
import { MessageReactionCount } from "./messageReactionCount"

interface MessageItemProps {
  className?: string
  data: MessageRes
  lastMessage?: MessageRes
  onLikeMessage?: (_: LikeMessage) => void
  onUnlikeMessage?: (_: UnlikeMessage) => void
  isLast?: boolean
  shouldBreak?: boolean
  onClickReplyMsg?: (id: string) => void
  onResendMessage?: (_: MessageRes) => void
  shouldShowDate?: boolean
  roomType: RoomType
}

const componentDecorator = (href: any, text: any, key: any) => (
  <a href={href} key={key} target="_blank" rel="noreferrer">
    {text}
  </a>
)

export const MessageItem = ({
  className,
  data,
  lastMessage,
  onLikeMessage,
  onUnlikeMessage,
  isLast,
  shouldBreak,
  onClickReplyMsg,
  onResendMessage,
  shouldShowDate,
  roomType,
}: MessageItemProps) => {
  const dispatch = useDispatch()

  const generateGoogleMapUrl = ({ lat, lng }: Lnglat) => {
    window.open(`https://www.google.com/maps/place/${lat},${lng}`, "_blank")
  }

  const handleSetMessageReply = () => {
    dispatch(
      setMessageReply({
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
      })
    )
    document.getElementById("message-form-input")?.focus()
  }

  const handleResendMessage = () => {
    onResendMessage?.(data)
  }

  const handleReactionMessage = (emotion: MessageReactionType) => {
    onLikeMessage?.({ emotion, message_id: data.message_id })
  }

  const handleUndoMesasgeReaction = (reaction: MessageReactionType) => {
    onUnlikeMessage?.({ message_id: data.message_id, reaction })
  }

  const handleClickReactedMessage = () => {
    dispatch(setCurrentMessageEmotionId(data.message_id))
  }

  return (
    <div className={`message-item message-item-${data.message_id}`}>
      {shouldShowDate ? (
        <div className="flex-center text-xs my-24">
          <span className="mx-8">{moment(data.created_at).format("HH:mm DD/MM/YYYY")}</span>
        </div>
      ) : null}

      <div
        className={`flex group ${
          data?.attachments?.length || data?.location || data?.tags?.length ? "mb-24" : "mb-4"
        } ${isLast ? "mb-16" : ""}`}
        key={data.message_id}
      >
        <div
          className={` max-w-[60%] w-full flex ${data.is_author ? "flex-row-reverse ml-auto" : ""}`}
        >
          {/* Show avatar of sender if type of conversation is group  */}
          {roomType === "group" ? (
            <div
              onClick={() => dispatch(setCurrentProfileId(data.author.author_id))}
              className={`relative cursor-pointer w-[38px] h-[38px] rounded-[50%] overflow-hidden ${
                roomType === "group" ? `${data.is_author ? "ml-12" : "mr-12"}` : "mr-12"
              }`}
            >
              {shouldBreak ? (
                <Image
                  src={data.author.author_avatar.thumbnail_url}
                  alt=""
                  layout="fill"
                  objectFit="cover"
                />
              ) : null}
            </div>
          ) : null}

          <div className={`flex-1 relative items-stretch ${className || ""}`}>
            {!data?.status || data.status === "fulfilled" ? (
              <MessageItemOption
                onViewDetail={() => dispatch(setcurrentDetailMessageId(data.message_id))}
                value={data?.your_reaction}
                optionTop={0}
                onReaction={handleReactionMessage}
                onUndoReaction={handleUndoMesasgeReaction}
                className={`group-hover:block w-fit ${
                  !data?.is_author ? "right-[calc(0%-120px)]" : "left-[calc(0%-120px)]"
                }`}
                onReply={handleSetMessageReply}
              />
            ) : null}

            <div className="">
              {!data.attachments?.length ? (
                <div className="relative">
                  {data?.attachments?.length ? (
                    <div
                      className={`relative aspect-[4/3] overflow-hidden ${
                        !data?.message_text && !isLast && !data.reaction_count
                          ? "rounded-[5px]"
                          : "rounded-tl-[5px] rounded-tr-[5px]"
                      }`}
                      key={data.message_id}
                    >
                      <Image layout="fill" alt="" objectFit="cover" src={data.attachments[0].url} />
                    </div>
                  ) : null}

                  <div
                    className={`min-w-[56px] ${
                      data?.attachments?.length === 1
                        ? "rounded-br-[8px] rounded-bl-[8px]"
                        : "rounded-[8px]"
                    } ${isLast || data?.message_text || data?.reaction_count ? "p-12" : ""} ${
                      data?.attachments?.length ? "" : "w-fit"
                    } ${data.is_author ? "bg-bg-blue ml-auto" : "bg-bg"}`}
                  >
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
                          <p className="text-xs line-clamp-1 word-break">
                            {data.reply_to.message_text}
                          </p>
                        </div>
                      </div>
                    ) : null}

                    {/* Message text */}
                    {data?.message_text ? (
                      <Linkify componentDecorator={componentDecorator}>
                        <p className="message-item-text text-14 leading-20 font-medium text-blue-8">
                          {data.message_text}
                        </p>
                      </Linkify>
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

                    {isLast || data.status === "rejected" ? (
                      <MessageItemStatus
                        onResendMessage={handleResendMessage}
                        className={`${data?.message_text ? "mt-12" : ""}`}
                        createdAt={data.created_at}
                        isRead={data.is_read}
                        showStatus={
                          lastMessage?.message_id === data.message_id && lastMessage?.is_author
                        }
                        status={data?.status}
                      />
                    ) : null}

                    {data.reaction_count ? (
                      <MessageReactionCount
                        className={`${
                          data?.message_text || isLast || data.location ? "mt-12" : ""
                        }`}
                        onClick={handleClickReactedMessage}
                        count={data.reaction_count}
                        reactions={data.reactions}
                      />
                    ) : null}
                  </div>
                </div>
              ) : data?.attachments?.length ? (
                <div className="relative flex-1 w-full">
                  {/* Message reaction view */}

                  {data?.message_text ? (
                    <div
                      className={`rounded-[8px] p-12 w-fit min-w-[56px] ${
                        data.is_author ? "text-primary bg-bg-blue ml-auto" : "text-blue-8 bg-bg"
                      }`}
                    >
                      <Linkify componentDecorator={componentDecorator}>
                        <p className="message-item-text text-14 leading-20 font-medium text-blue-8">
                          {data.message_text}
                        </p>
                      </Linkify>
                    </div>
                  ) : null}

                  <div className="relative">
                    <MessageItemImage
                      data={data.attachments}
                      className="mt-4"
                      onClick={(url) => console.log(url)}
                    />

                    {data.reaction_count ? (
                      <MessageReactionCount
                        className="absolute bottom-[-10px] left-[20px] shadow-md z-[100]"
                        onClick={handleClickReactedMessage}
                        count={data.reaction_count}
                        reactions={data.reactions}
                      />
                    ) : null}
                  </div>

                  {isLast || data.status === "rejected" ? (
                    <MessageItemStatus
                      onResendMessage={handleResendMessage}
                      className={`mt-12 ${data?.attachments?.length ? "pb-16 mt-24" : ""}`}
                      createdAt={data.created_at}
                      isRead={data.is_read}
                      showStatus={
                        lastMessage?.message_id === data.message_id && lastMessage?.is_author
                      }
                      status={data?.status}
                    />
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

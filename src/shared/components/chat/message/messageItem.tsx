import { imageBlur } from "@/assets"
import { Map } from "@/components"
import { getMessageDescription } from "@/helper"
import { useLongPress } from "@/hooks"
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
import Image from "next/image"
import { useRef, useState } from "react"
import Linkify from "react-linkify"
import { useDispatch } from "react-redux"
import { MessageImages } from "./messageImages"
import { MessageOption } from "./messageOption"
import { MessageOptionMenu } from "./messageOptionMenu"
import { MessageOptionModal } from "./messageOptionModal"
import { MessageReactionCount } from "./messageReactionCount"
import { MessageStatus } from "./messageStatus"

interface MessageItemProps {
  data: MessageRes
  lastMessage?: MessageRes
  onReactMessage?: (_: LikeMessage) => void
  onUndoReactMessage?: (_: UnlikeMessage) => void
  isLast?: boolean
  shouldBreak?: boolean
  onClickReplyMsg?: (id: string) => void
  onResendMessage?: (_: MessageRes) => void
  roomType: RoomType
}

const componentDecorator = (href: any, text: any, key: any) => (
  <a href={href} key={key} target="_blank" rel="noreferrer">
    {text}
  </a>
)

export const MessageItem = ({
  data,
  lastMessage,
  onReactMessage,
  onUndoReactMessage,
  isLast,
  shouldBreak,
  onClickReplyMsg,
  onResendMessage,
  roomType,
}: MessageItemProps) => {
  const dispatch = useDispatch()
  const messageOptionMenuRef = useRef<HTMLDivElement>(null)
  const [setMessageOptionMenu, setShowMessageOptionMenu] = useState<boolean>()
  const { action, handlers, setAction } = useLongPress()

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

  const handleReactOnMessage = (emotion: MessageReactionType) => {
    onReactMessage?.({ emotion, message_id: data.message_id })
  }

  const handleUndoReactOnMessage = (reaction: MessageReactionType) => {
    onUndoReactMessage?.({ message_id: data.message_id, reaction })
  }

  const handleClickMessageReaction = () => {
    dispatch(setCurrentMessageEmotionId(data.message_id))
  }

  const handleShowMessageOption = () => {
    setShowMessageOptionMenu(true)
  }

  const handleCopyText = () => {
    data?.message_text && navigator.clipboard.writeText(data.message_text)
  }

  const handleViewDetail = () => {
    dispatch(setcurrentDetailMessageId(data.message_id))
  }

  return (
    <div
      className={`message-item relative flex message-item-${data.message_id} ${
        data?.attachments?.length || data?.location ? "mb-24" : "mb-4"
      } ${isLast ? "mb-16" : ""}`}
    >
      {action === "longpress" ? (
        <MessageOptionModal
          onReaction={handleReactOnMessage}
          onReply={handleSetMessageReply}
          onCopy={handleCopyText}
          onUndoReaction={handleUndoReactOnMessage}
          onViewDetail={handleViewDetail}
          onClose={() => setAction(undefined)}
          value={data?.your_reaction}
        />
      ) : null}

      {setMessageOptionMenu ? (
        <MessageOptionMenu
          roomType={roomType}
          onClose={() => setShowMessageOptionMenu(false)}
          onViewDetail={handleViewDetail}
          className="group-hover:block w-fit"
          messageId={data.message_id}
          showOn={data.is_author ? "right" : "left"}
          onCopy={handleCopyText}
        />
      ) : null}

      <div className={`flex w-full group ${data.is_author ? "flex-row-reverse" : ""}`}>
        {/* Show avatar of sender if type of conversation is group  */}
        {roomType === "group" ? (
          <div
            onClick={() => shouldBreak && dispatch(setCurrentProfileId(data.author.author_id))}
            className={`relative w-[28px] h-[28px] md:w-[40px] md:h-[40px] rounded-[50%] overflow-hidden ${
              roomType === "group"
                ? `${data.is_author ? "ml-8 md:ml-12 hidden sm:block" : "mr-8 md:mr-12"}`
                : "mr-8 md:mr-12"
            } ${shouldBreak ? "cursor-pointer" : ""}`}
          >
            {shouldBreak ? (
              <Image
                blurDataURL={imageBlur}
                src={data.author.author_avatar.thumbnail_url}
                alt=""
                layout="fill"
                objectFit="cover"
              />
            ) : null}
          </div>
        ) : null}

        <div className={`max-w-[90%] sm:max-w-[80%] lg:max-w-[55%] xl:max-w-[60%] flex-1 relative`}>
          {!data.attachments?.length ? (
            <div
              {...(handlers as any)}
              ref={messageOptionMenuRef}
              className={`relative w-fit message-option-absolute message-item-child-${
                data.message_id
              } ${data.is_author ? "ml-auto" : ""}`}
            >
              {!data?.status || data.status === "fulfilled" ? (
                <MessageOption
                  onShowMessageOption={handleShowMessageOption}
                  value={data?.your_reaction}
                  onReaction={handleReactOnMessage}
                  onUndoReaction={handleUndoReactOnMessage}
                  className={`hidden group-hover:lg:flex w-fit ${
                    !data?.is_author ? "right-[calc(0%-120px)]" : "left-[calc(0%-120px)]"
                  }`}
                  onReply={handleSetMessageReply}
                />
              ) : null}

              <div
                className={`min-w-[56px] rounded-[8px] ${
                  isLast || data?.message_text || data?.reaction_count || data?.location
                    ? "p-12 md:p-16"
                    : ""
                } ${data?.attachments?.length ? "" : "w-fit"} ${
                  data.is_author ? "bg-bg-blue ml-auto" : "bg-bg"
                }`}
              >
                {!data.is_author && roomType === "group" && shouldBreak ? (
                  <p className="text-12 leading-[20px] text-gray-color-3 mb-8">
                    {data.author.author_name}
                  </p>
                ) : null}
                {/* Reply message */}
                {data?.reply_to?.message_id ? (
                  <div
                    onClick={() =>
                      data.reply_to?.message_id && onClickReplyMsg?.(data.reply_to?.message_id)
                    }
                    className={`p-12 md:p-16 mb-10 rounded-[8px] min-w-[140px] cursor-pointer flex items-stretch ${
                      data.is_author ? "bg-[#cddef8]" : "bg-gray-05"
                    }`}
                  >
                    <div className="">
                      <p className="text-sm mb-4 line-clamp-1 word-wrap-anywhere text-primary font-semibold">
                        @{data.reply_to.author.author_name}
                      </p>
                      <p className="text-xs line-clamp-1 word-wrap-anywhere">
                        {data.reply_to.message_text}
                      </p>
                    </div>
                  </div>
                ) : null}
                {/* Message text */}
                {data?.message_text ? (
                  <Linkify componentDecorator={componentDecorator}>
                    <p className="message-item-text word-wrap-anywhere text-14 leading-20 font-medium text-blue-8">
                      {data.message_text}
                    </p>
                  </Linkify>
                ) : null}
                {/* Location */}
                {data?.location ? (
                  <div
                    onClick={() => data.location && generateGoogleMapUrl(data.location)}
                    className="w-[150px] xs:w-[200px] lg:w-[300px] h-[150px] rounded-[8px] overflow-hidden cursor-pointer mb-12"
                  >
                    <Map
                      // markerIcon={data.author?.author_avatar?.thumbnail_url || blankAvatar}
                      viewOnly
                      markerLocation={{ lat: +data.location.lat, lng: +data.location.lng }}
                    />
                  </div>
                ) : null}
                {isLast || data.status === "rejected" ? (
                  <MessageStatus
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
                    className={`${data?.message_text || isLast || data.location ? "mt-12" : ""}`}
                    onClick={handleClickMessageReaction}
                    count={data.reaction_count}
                    reactions={data.reactions}
                  />
                ) : null}
              </div>
            </div>
          ) : data?.attachments?.length ? (
            <div
              {...(handlers as any)}
              ref={messageOptionMenuRef}
              className={`relative w-full message-item-child-${data.message_id}`}
            >
              <MessageOption
                onShowMessageOption={handleShowMessageOption}
                value={data?.your_reaction}
                onReaction={handleReactOnMessage}
                onUndoReaction={handleUndoReactOnMessage}
                className={`hidden group-hover:lg:flex w-fit ${
                  !data?.is_author ? "right-[calc(0%-120px)]" : "left-[calc(0%-120px)]"
                }`}
                onReply={handleSetMessageReply}
              />

              {data?.message_text ? (
                <div
                  className={`rounded-[8px] p-12 md:p-16 w-fit min-w-[56px] ${
                    data.is_author ? "text-primary bg-bg-blue ml-auto" : "text-blue-8 bg-bg"
                  }`}
                >
                  <Linkify componentDecorator={componentDecorator}>
                    <p className="message-item-text text-14 word-wrap-anywhere leading-20 font-medium text-blue-8">
                      {data.message_text}
                    </p>
                  </Linkify>
                </div>
              ) : null}

              <div className="relative">
                <MessageImages data={data.attachments} className="mt-4" />

                {data.reaction_count ? (
                  <MessageReactionCount
                    className="absolute bottom-[-10px] left-[20px] shadow-md z-[100]"
                    onClick={handleClickMessageReaction}
                    count={data.reaction_count}
                    reactions={data.reactions}
                  />
                ) : null}
              </div>

              {isLast || data.status === "rejected" ? (
                <MessageStatus
                  onResendMessage={handleResendMessage}
                  className={`mt-12 ${data?.attachments?.length ? `pb-16 mt-12 md:mt-24` : ""}`}
                  createdAt={data.created_at}
                  isRead={data.is_read}
                  showStatus={lastMessage?.message_id === data.message_id && lastMessage?.is_author}
                  status={data?.status}
                />
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

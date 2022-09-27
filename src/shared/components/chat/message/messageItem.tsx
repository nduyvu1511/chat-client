import { Map } from "@/components"
import { MESSAGE_STATUS } from "@/helper"
import { LikeMessage, Lnglat, MessageRes, UnlikeMessage } from "@/models"
import moment from "moment"
import Image from "next/image"
import { AiTwotoneLike } from "react-icons/ai"
import { BiLike } from "react-icons/bi"
import { MessageItemImage } from "./messageItemImage"

interface MessageItemProps {
  className?: string
  data: MessageRes
  lastMessage: MessageRes
  onLikeMessage?: (_: LikeMessage) => void
  onUnlikeMessage?: (_: UnlikeMessage) => void
  isLast: boolean
  shouldBreak: boolean
}

export const MessageItem = ({
  className,
  data,
  lastMessage,
  onLikeMessage,
  onUnlikeMessage,
  isLast,
  shouldBreak,
}: MessageItemProps) => {
  const generateGoogleMapUrl = ({ lat, lng }: Lnglat) => {
    window.open(`https://www.google.com/maps/place/${lat},${lng}`, "_blank")
  }

  return (
    <div className={`${isLast ? "mb-16" : ""} ${className || ""}`}>
      <div
        className={`max-w-[60%] relative group ${data.is_author ? "ml-auto" : ""} ${
          data.attachments?.length ? "w-full" : "w-fit"
        }`}
      >
        {/* Message or location */}
        {data?.message_text || data?.location ? (
          <div
            className={`p-16 rounded-[8px] w-fit ${
              data.is_author ? "bg-bg-blue ml-auto" : "bg-bg"
            }`}
          >
            {data?.message_text ? (
              <p
                className={`text-14 leading-20 font-medium ${
                  data.is_author ? "text-primary" : "text-blue-8"
                }`}
              >
                {data.message_text}
              </p>
            ) : null}

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

            {data?.reply_to?.message_id ? (
              <div className="p-12 bg-gray-10 mb-12 rounded-[8px] min-w-[140px] cursor-pointer flex items-stretch">
                <div className="">
                  <p className="text-sm mb-8 line-clamp-1 word-break text-gray-color-7">
                    {data.reply_to.author.author_name}
                  </p>
                  <p className="text-xs line-clamp-1 word-break">{data.reply_to.message_text}</p>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        {data?.attachments?.length ? (
          <MessageItemImage
            data={data.attachments}
            className="mt-4 mb-10"
            onClick={(url) => console.log(url)}
          />
        ) : null}

        {/* Message date time and status */}
        {isLast ? (
          <div className="flex items-center mt-8">
            <span className="text-xs text-[10px]">{moment(data.created_at).format("HH:mm")}</span>

            {data?.status && data?.status !== "fulfilled" ? (
              <span className="text-xs text-[10px] ml-auto"> {MESSAGE_STATUS[data.status]}</span>
            ) : lastMessage.message_id === data.message_id && lastMessage.is_author ? (
              <span className="text-xs text-[10px] ml-auto">
                {data.is_read ? "Đã xem" : "Đã gửi"}
              </span>
            ) : null}
          </div>
        ) : null}

        {data.like_count ? (
          <div className="px-12 py-4 bg-white-color rounded-[20px] flex items-center w-fit mt-8">
            <span className="text-xs mr-6">{data.like_count}</span>
            <AiTwotoneLike className="text-orange-50" />
          </div>
        ) : null}

        {!data?.status || data.status === "fulfilled" ? (
          <div
            className={`absolute w-[24px] h-[24px] rounded-[50%] bg-white-color shadow-sm hidden group-hover:flex ${
              !data?.is_author ? "right-[12px]" : "left-[12px]"
            } bottom-[-12px] flex-center`}
          >
            <button
              onClick={() =>
                !data?.is_liked
                  ? onLikeMessage?.({
                      emotion: "like",
                      message_id: data.message_id,
                    })
                  : onUnlikeMessage?.({
                      message_id: data.message_id,
                    })
              }
            >
              {data?.is_liked ? <AiTwotoneLike className="text-orange-50" /> : <BiLike />}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}

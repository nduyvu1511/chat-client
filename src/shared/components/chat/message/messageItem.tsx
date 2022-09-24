import { LikeMessage, MessageRes, UnlikeMessage } from "@/models"
import moment from "moment"
import Image from "next/image"
import { BiLike } from "react-icons/bi"
import { AiTwotoneLike } from "react-icons/ai"
import { MESSAGE_STATUS } from "@/helper"

interface MessageItemProps {
  className?: string
  data: MessageRes
  lastMessage: MessageRes
  onLikeMessage?: (_: LikeMessage) => void
  onUnlikeMessage?: (_: UnlikeMessage) => void
}

export const MessageItem = ({
  className,
  data,
  lastMessage,
  onLikeMessage,
  onUnlikeMessage,
}: MessageItemProps) => {
  return (
    <div
      className={`relative flex flex-col ${data?.is_author ? "items-end ml-auto" : "items-start"} ${
        data.attachments?.length ? "" : "max-w-[50%]"
      } ${className}`}
    >
      <div
        className={`relative p-16 rounded-[16px] min-w-[110px] group w-fit ${
          data.is_author && data.message_text ? "bg-bg-blue" : "bg-bg"
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

        {/* <div
          className={`absolute right-[calc(100%+20px)] w-[200px] ${
            lastMessage.room_id === data.room_id ? "" : "hidden"
          }`}
        >
          <MessageItemMenu />
        </div> */}

        {data?.reply_to?.message_id ? (
          <div className="p-12 bg-gray-10 mb-12 rounded-[8px] min-w-[140px] cursor-pointer flex items-stretch">
            {/* <div className="w-[3px] bg-gray-10 mr-8 rounded-[5px]"></div> */}
            <div className="">
              <p className="text-sm mb-8 line-clamp-1 word-break text-gray-color-7">
                {data.reply_to.author.author_name}
              </p>
              <p className="text-xs line-clamp-1 word-break">{data.reply_to.message_text}</p>
            </div>
          </div>
        ) : null}

        <div className="flex items-center justify-between mt-12">
          <span className="text-xs text-[10px] mr-12">
            {moment(data.created_at).format("HH:mm")}
          </span>

          {data?.status && data?.status !== "fulfilled" ? (
            <span className="text-xs text-[10px]"> {MESSAGE_STATUS[data.status]}</span>
          ) : lastMessage.message_id === data.message_id && lastMessage.is_author ? (
            <span className="text-xs text-[10px]"> {data.is_read ? "Đã xem" : "Đã gửi"}</span>
          ) : null}
        </div>

        {data.like_count ? (
          <div className="px-12 py-4 bg-white-color rounded-[20px] flex items-center w-fit mt-8">
            <span className="text-xs mr-6">{data.like_count}</span>
            <AiTwotoneLike className="text-orange-50" />
          </div>
        ) : null}

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
      </div>

      {data?.attachments?.length ? (
        <div className="grid grid-cols-3 gap-8 w-full max-w-[50%]">
          {data.attachments.map((item) => (
            <div
              key={item.attachment_id}
              className="relative aspect-1 rounded-[5px] overflow-hidden"
            >
              <Image layout="fill" alt="" objectFit="cover" src={item.thumbnail_url} />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

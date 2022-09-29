import { MessageReactionType } from "@/models"
import { AiTwotoneLike } from "react-icons/ai"
import { BiLike } from "react-icons/bi"

interface MessageReactionsProps {
  isAuthor: boolean
  onLikeMessage?: (emotion: MessageReactionType) => void
  onUnlikeMessage?: () => void
  isLiked: boolean
}

export const MessageReactions = ({
  isAuthor,
  onLikeMessage,
  onUnlikeMessage,
  isLiked,
}: MessageReactionsProps) => {
  return (
    <div
      className={`absolute w-[24px] h-[24px] rounded-[50%] bg-white-color shadow-sm hidden group-hover:flex ${
        !isAuthor ? "right-[12px]" : "left-[12px]"
      } bottom-[-12px] flex-center`}
    >
      <button onClick={() => (!isLiked ? onLikeMessage?.("like") : onUnlikeMessage?.())}>
        {isLiked ? <AiTwotoneLike className="text-orange-50" /> : <BiLike />}
      </button>
    </div>
  )
}

/* eslint-disable @next/next/no-img-element */
import { NoteIcon2, ReplyIcon, ThreeDotsIcon, TrashIcon } from "@/assets"
import { useClickOutside } from "@/hooks"
import { MessageReactionType } from "@/models"
import { useRef, useState } from "react"
import { HiReply } from "react-icons/hi"
import { RiEmotionHappyLine } from "react-icons/ri"
import { MessageReactionIcon } from "./messageReactionIcon"

interface MessageItemOptionProps {
  onDelete?: Function
  onSaveToNote?: Function
  onReaction?: (emotion: MessageReactionType) => void
  onUndoReaction?: (emotion: MessageReactionType) => void
  onReply?: Function
  className?: string
  optionTop?: number
  optionRight?: number
  value?: MessageReactionType | null | undefined
}

export const MessageItemOption = ({
  onReaction,
  onUndoReaction,
  onDelete,
  onReply,
  onSaveToNote,
  className = "",
  optionRight = -8,
  optionTop = -170,
  value,
}: MessageItemOptionProps) => {
  const optionRef = useRef<HTMLDivElement>(null)
  const emotionRef = useRef<HTMLDivElement>(null)

  const [showOption, setShowOption] = useState<boolean>(false)
  const [showEmotion, setShowEmotion] = useState<boolean>(false)

  useClickOutside([optionRef], () => setShowOption(false))
  useClickOutside([emotionRef], () => setShowEmotion(false))

  return (
    <div
      className={`absolute-vertical z-10 px-16 rounded-[25px] h-[32px] group-hover:flex flex-center ${className}`}
    >
      <div className="relative mr-12 flex items-center">
        <button className="" onClick={() => setShowEmotion(!showEmotion)}>
          <RiEmotionHappyLine className="text-gray-color-3 text-[18px] hover:text-primary" />
        </button>

        {showEmotion ? (
          <div
            ref={emotionRef}
            className="absolute-horizontal top-[-56px] flex items-center border border-solid border-border-color h-[46px] rounded-[25px] bg-white-color p-12 shadow-md"
          >
            {(["like", "heart", "laugh", "sad", "wow", "angry"] as MessageReactionType[]).map(
              (val, index) => (
                <button
                  onClick={() => {
                    if (val === value) {
                      onUndoReaction?.(val)
                    } else {
                      onReaction?.(val)
                    }
                    setShowEmotion(false)
                  }}
                  className={`mr-8 last:mr-0 h-full flex-center`}
                  key={index}
                >
                  <MessageReactionIcon
                    size={28}
                    emotion_type={val}
                    className="transform hover:scale-[1.2] transition-transform duration-100"
                  />

                  {value === val ? (
                    <span className="absolute bottom-[-1px] h-1 bg-primary w-[28px] rounded-[4px]"></span>
                  ) : null}
                </button>
              )
            )}
          </div>
        ) : null}
      </div>

      <button onClick={() => onReply?.()} className="mr-24">
        <HiReply className="text-base text-gray-color-3 hover:text-primary" />
      </button>

      <div className="relative mr-8">
        <button onClick={() => setShowOption(!showOption)} className="transform rotate-[90deg]">
          <ThreeDotsIcon className="text-gray-color-3 h-[18px] hover:text-primary relative left-2" />
        </button>

        {/* Options */}
        {showOption ? (
          <div
            style={{ top: optionTop, right: optionRight }}
            ref={optionRef}
            className="rounded-[8px] absolute bg-white-color shadow-md border border-solid border-border-color p-8"
          >
            <button
              onClick={() => {
                setShowOption(false)
                onReply?.()
              }}
              className="flex items-center py-[14px] w-full px-12 hover:bg-bg hover:rounded-[5px]"
            >
              <ReplyIcon className="mr-8" />
              <p className="text-sm leading-20 whitespace-nowrap">Phản hồi</p>
            </button>
            <button
              onClick={() => {
                setShowOption(false)
                onSaveToNote?.()
              }}
              className="flex items-center py-[14px] w-full px-12 hover:bg-bg hover:rounded-[5px]"
            >
              <NoteIcon2 className="mr-8" />
              <p className="text-sm leading-20 whitespace-nowrap">Lưu vào ghi chú</p>
            </button>
            <button
              onClick={() => {
                setShowOption(false)
                onDelete?.()
              }}
              className="flex items-center py-[14px] w-full px-12 hover:bg-bg hover:rounded-[5px]"
            >
              <TrashIcon className="mr-8" />
              <p className="text-sm leading-20 whitespace-nowrap">Xóa tin nhắn</p>
            </button>
          </div>
        ) : null}
      </div>

      {/* <button className="hidde">
        <ThreeDotsIcon className="text-gray-color-3 h-[24px] transform hover:text-primary rotate-[90deg]" />
      </button> */}
    </div>
  )
}

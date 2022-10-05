/* eslint-disable @next/next/no-img-element */
import { ThreeDotsIcon } from "@/assets"
import { useClickOutside } from "@/hooks"
import { MessageReactionType } from "@/models"
import { useRef, useState } from "react"
import { HiReply } from "react-icons/hi"
import { RiEmotionHappyLine } from "react-icons/ri"
import { MessageReactionIcon } from "./messageReactionIcon"

interface MessageOptionProps {
  onReaction?: (emotion: MessageReactionType) => void
  onUndoReaction?: (emotion: MessageReactionType) => void
  onReply?: Function
  className?: string
  value?: MessageReactionType | null | undefined
  onShowMessageOption?: Function
}

export const MessageOption = ({
  onReaction,
  onUndoReaction,
  onReply,
  className = "",
  value,
  onShowMessageOption,
}: MessageOptionProps) => {
  const emotionRef = useRef<HTMLDivElement>(null)
  const ref = useRef<HTMLDivElement>(null)

  const [showEmotion, setShowEmotion] = useState<boolean>()

  useClickOutside([emotionRef], () => setShowEmotion(undefined))

  return (
    <div ref={ref} className="relative">
      <div
        className={`absolute top-12 z-[101] px-12 rounded-[8px] h-[30px] flex-center bg-bg ${className}`}
      >
        <div className="mr-12 relative flex items-center">
          <button className="" onClick={() => setShowEmotion(true)}>
            <RiEmotionHappyLine className="text-gray-color-3 text-[18px] hover:text-primary" />
          </button>

          {showEmotion ? (
            <div
              ref={emotionRef}
              className="absolute-horizontal overflow-hidden top-[-58px] flex items-center border border-solid border-border-color h-[46px] rounded-[25px] bg-white-color p-12 shadow-md"
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
                      setShowEmotion(undefined)
                    }}
                    className={`p-4 last:mr-0 h-full flex-center`}
                    key={index}
                  >
                    <MessageReactionIcon
                      size={28}
                      emotion_type={val}
                      className="transform hover:scale-[1.2] transition-transform duration-100"
                    />

                    {value === val ? (
                      <span className="absolute bottom-[-1px] h-2 bg-primary w-[24px] rounded-[4px]"></span>
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

        <div className="mr-8">
          <button
            onClick={() => {
              onShowMessageOption?.()
            }}
            className="transform rotate-[90deg]"
          >
            <ThreeDotsIcon className="text-gray-color-3 h-[18px] hover:text-primary relative left-2" />
          </button>
        </div>
      </div>
    </div>
  )
}

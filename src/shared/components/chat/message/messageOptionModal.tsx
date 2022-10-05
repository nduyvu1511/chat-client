import { useClickOutside } from "@/hooks"
import { MessageReactionType } from "@/models"
import { useRef } from "react"
import { HiReply } from "react-icons/hi"
import { MdContentCopy } from "react-icons/md"
import { TbEye, TbNote } from "react-icons/tb"
import { MessageReactionIcon } from "./messageReactionIcon"

interface MessageOptionModalProps {
  onClose: Function
  onUndoReaction?: (val: MessageReactionType) => void
  onReaction?: (val: MessageReactionType) => void
  onReply?: () => void
  onViewDetail?: () => void
  onCopy?: () => void
  onSaveNote?: () => void
  value?: MessageReactionType | null
}

export const MessageOptionModal = ({
  onClose,
  onReaction,
  onUndoReaction,
  onCopy,
  onReply,
  onSaveNote,
  onViewDetail,
  value,
}: MessageOptionModalProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const emotionRef = useRef<HTMLDivElement>(null)

  useClickOutside([ref], () => {
    onClose?.()
  })

  return (
    <div className="fixed z-[3000] inset-0 flex justify-center items-end">
      <div ref={ref} className="z-10 mb-[100px]">
        <div
          ref={emotionRef}
          className="relative mb-8 flex items-center border border-solid border-border-color h-[46px] rounded-[25px] bg-white-color px-12 shadow-md"
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
                  onClose?.()
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

        <div className="grid grid-cols-3 gapx-8 gap-y-16 bg-white-color p-16 rounded-[8px] w-[242px]">
          <button
            onClick={() => {
              onReply?.()
              onClose?.()
            }}
            className="flex-center flex-col"
          >
            <HiReply className="text-xl text-gray-color-3 mb-4" />

            <p className="text-[10px] leading-[14px] font-medium text-gray-color-3">Trả lời</p>
          </button>

          <button
            onClick={() => {
              onViewDetail?.()
              onClose?.()
            }}
            className="flex-center flex-col"
          >
            <TbEye className="text-xl text-gray-color-3 mb-4" />
            <p className="text-[10px] leading-[14px] font-medium text-gray-color-3">Chi tiết</p>
          </button>

          <button
            onClick={() => {
              onCopy?.()
              onClose?.()
            }}
            className="flex-center flex-col"
          >
            <MdContentCopy className="text-xl text-gray-color-3 mb-4" />

            <p className="text-[10px] leading-[14px] font-medium text-gray-color-3">Copy</p>
          </button>

          <button
            onClick={() => {
              onSaveNote?.()
              onClose?.()
            }}
            className="flex-center flex-col"
          >
            <TbNote className="text-xl text-gray-color-3 mb-4" />

            <p className="text-[10px] leading-[14px] font-medium text-gray-color-3">
              Lưu vào ghi chú
            </p>
          </button>
        </div>
      </div>
      <div onClick={() => onClose?.()} className="absolute inset-0 bg-black-40"></div>
    </div>
  )
}

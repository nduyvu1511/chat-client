import { useClickOutside } from "@/hooks"
import React, { useRef } from "react"
import { MessageOption } from "./messageOption"

interface MessageOptionModalProps {
  onClose: Function
}

export const MessageOptionModal = ({ onClose }: MessageOptionModalProps) => {
  const ref = useRef<HTMLDivElement>(null)
  useClickOutside([ref], () => {
    onClose?.()
  })

  return (
    <div className="fixed z-[3000] inset-0">
      <div ref={ref} className="absolute-vertical z-10 bg-white-color p-24">
        <MessageOption />
      </div>
      <div onClick={() => onClose?.()} className="absolute-center inset-0 bg-black-40"></div>
    </div>
  )
}

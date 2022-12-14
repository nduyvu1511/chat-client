import { EyeShowIcon, NoteIcon2 } from "@/assets"
import { MESSAGE_OPTION_MENU_SIZE } from "@/helper"
import { useClickOutside } from "@/hooks"
import { useEffect, useRef } from "react"
import { IoCopyOutline } from "react-icons/io5"

interface MessageOptionProps {
  onSaveToNote?: Function
  className?: string
  onViewDetail?: Function
  messageId: string
  onClose?: Function
  showOn?: "left" | "right"
  onCopy?: Function
}

export const MessageOptionMenu = ({
  className = "",
  onSaveToNote,
  onViewDetail,
  messageId,
  onClose,
  showOn,
  onCopy,
}: MessageOptionProps) => {
  const menuOptionRef = useRef<HTMLDivElement>(null)
  const container = document.querySelector(".chat-message-list")?.getBoundingClientRect() as DOMRect
  const child = document.querySelector(`.message-item-child-${messageId}`) as HTMLDivElement
  const childDOMRect = child.getBoundingClientRect()
  const top =
    container.height - childDOMRect.top < MESSAGE_OPTION_MENU_SIZE.height
      ? -MESSAGE_OPTION_MENU_SIZE.height
      : 50

  useClickOutside([menuOptionRef], () => onClose?.())

  useEffect(() => {
    const container = document.querySelector(".chat-message-list")
    if (!container) return

    container?.addEventListener("scroll", (e) => {
      onClose?.()
    })

    return () => {
      container.removeEventListener("scroll", () => {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      ref={menuOptionRef}
      style={{
        ...MESSAGE_OPTION_MENU_SIZE,
        top,
        left: showOn === "left" ? child.offsetWidth - 12 : "unset",
        right: showOn === "right" ? child.offsetWidth + 64 : "unset",
      }}
      className={`rounded-[8px] z-[108] absolute bg-white-color shadow-md border border-solid border-border-color p-8 ${className}`}
    >
      <button
        onClick={() => {
          onViewDetail?.()
          onClose?.()
        }}
        className="flex items-center py-[14px] w-full px-12 hover:bg-bg hover:rounded-[5px]"
      >
        <EyeShowIcon className="mr-8 w-[22px]" />
        <p className="text-sm leading-20 whitespace-nowrap">Xem chi ti???t</p>
      </button>
      <button
        onClick={() => {
          onSaveToNote?.()
          onClose?.()
        }}
        className="flex items-center py-[14px] w-full px-12 hover:bg-bg hover:rounded-[5px]"
      >
        <NoteIcon2 className="mr-8" />
        <p className="text-sm leading-20 whitespace-nowrap">L??u v??o ghi ch??</p>
      </button>
      <button
        onClick={() => {
          onCopy?.()
          onClose?.()
        }}
        className="flex items-center py-[14px] w-full px-12 hover:bg-bg hover:rounded-[5px]"
      >
        <IoCopyOutline className="mr-8 text-lg" />
        <p className="text-sm leading-20 whitespace-nowrap">Copy tin nh???n</p>
      </button>
    </div>
  )
}

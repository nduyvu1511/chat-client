import { EyeShowIcon, NoteIcon2, TrashIcon } from "@/assets"

interface MessageOptionProps {
  onDelete?: Function
  onSaveToNote?: Function
  className?: string
  onViewDetail?: Function
  messageId: string
  position: Position
}

interface Position {
  left?: number
  right?: number
  top: number
}

export const MessageOptionMenu = ({
  className = "",
  onDelete,
  onSaveToNote,
  onViewDetail,
  messageId,
  position,
}: MessageOptionProps) => {
  return (
    <div
      style={{ top: 48, left: position?.left || "unset", right: position?.right || "unset" }}
      className={`rounded-[8px] z-[108] absolute bg-white-color shadow-md border border-solid border-border-color p-8 ${className}`}
    >
      <button
        onClick={() => {
          onViewDetail?.()
        }}
        className="flex items-center py-[14px] w-full px-12 hover:bg-bg hover:rounded-[5px]"
      >
        <EyeShowIcon className="mr-8 " />
        <p className="text-sm leading-20 whitespace-nowrap">Xem chi tiết</p>
      </button>
      <button
        onClick={() => {
          onSaveToNote?.()
        }}
        className="flex items-center py-[14px] w-full px-12 hover:bg-bg hover:rounded-[5px]"
      >
        <NoteIcon2 className="mr-8" />
        <p className="text-sm leading-20 whitespace-nowrap">Lưu vào ghi chú</p>
      </button>
      <button
        onClick={() => {
          onDelete?.()
        }}
        className="flex items-center py-[14px] w-full px-12 hover:bg-bg hover:rounded-[5px]"
      >
        <TrashIcon className="mr-8" />
        <p className="text-sm leading-20 whitespace-nowrap">Xóa tin nhắn</p>
      </button>
    </div>
  )
}

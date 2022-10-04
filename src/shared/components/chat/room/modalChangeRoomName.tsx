import { blankAvatar } from "@/assets"
import { ModalSm, CommonAvatar } from "@/components"
import { useInputText } from "@/hooks"
import Image from "next/image"
import React, { useEffect, useRef } from "react"

interface ModalChangeRoomNameProps {
  onClose: Function
  initialName: string
  avatar: string
  onSubmit?: (_: string) => void
}

export const ModalChangeRoomName = ({
  initialName,
  onClose,
  onSubmit,
  avatar,
}: ModalChangeRoomNameProps) => {
  const { onChange, value } = useInputText(initialName)
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    ref.current?.select()
  }, [])

  return (
    <div className="modal-room-info">
      <ModalSm
        onBack={onClose}
        zIndex={3000}
        className="max-w-[350px]"
        onClose={onClose}
        title="Thông tin nhóm"
      >
        <div className="p-16">
          <div className="flex-col flex-center">
            <CommonAvatar size={70} url={avatar} className="mb-16 cursor-default" />

            <p className="text-xs mb-16">
              Bạn có chắc muốn đổi tên nhóm, khí xác nhận tên nhóm mới sẽ hiển thị với tất cả thành
              viên.
            </p>

            <input
              ref={ref}
              type="text"
              value={value}
              onChange={onChange}
              onKeyPress={(e) => e.code === "Enter" && value && onSubmit?.(value)}
              placeholder="Nhập tên nhóm"
              className="form-input mb-24 text-sm h-[44px]"
            />
          </div>

          <div className="w-full flex items-center justify-end">
            <button
              onClick={() => onClose?.()}
              className="h-[40px] px-16 text-sm font-semibold mr-12 bg-bg rounded-[5px]"
            >
              Hủy
            </button>
            <button
              onClick={() => value && onSubmit?.(value)}
              className={`h-[40px] px-16 text-sm font-semibold text-white-color rounded-[5px] ${
                value ? "bg-primary" : "btn-disabled"
              }`}
            >
              Xác nhận
            </button>
          </div>
        </div>
      </ModalSm>
    </div>
  )
}

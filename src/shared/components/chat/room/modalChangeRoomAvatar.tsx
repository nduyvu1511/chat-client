import { CommonAvatar, ModalSm } from "@/components"
import { ChangeEvent, useState } from "react"

interface ModalChangeAvatar {
  onClose: Function
  avatar: string
  onSubmit?: (_: FormData) => void
}

export const ModalChangeAvatar = ({
  onClose,
  onSubmit,
  avatar: avatarProps,
}: ModalChangeAvatar) => {
  const [avatar, setAvatar] = useState<{ previewImg: string; file?: File | undefined }>({
    previewImg: avatarProps,
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setAvatar({ previewImg: URL.createObjectURL(file), file })

    console.log({ file })
  }

  const handleSubmit = () => {
    if (!avatar?.file) return

    const formData = new FormData()
    formData.append("image", avatar.file)
    onSubmit?.(formData)
  }

  return (
    <div className="modal-room-info">
      <ModalSm
        onBack={onClose}
        zIndex={3005}
        className="max-w-[350px]"
        onClose={onClose}
        title="Đổi ảnh đại diện"
      >
        <div className="p-16">
          <div className="mb-24 flex-center flex-col">
            <label className="w-[200px] h-[200px] flex" htmlFor="avatar-input">
              <CommonAvatar size={200} url={avatar.previewImg} className="" />
            </label>

            <input
              name=""
              multiple
              accept="image/*"
              hidden
              onChange={handleChange}
              type="file"
              id="avatar-input"
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
              onClick={handleSubmit}
              className={`h-[40px] px-16 text-sm font-semibold text-white-color rounded-[5px] ${
                avatar?.file ? "bg-primary" : "btn-disabled"
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

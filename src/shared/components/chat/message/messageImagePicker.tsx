import { CloseThickIcon, imageBlur, UploadIcon } from "@/assets"
import { Spinner } from "@/components"
import { MessageAttachment } from "@/models"
import Image from "next/image"
import { ChangeEvent } from "react"
import { IoMdClose } from "react-icons/io"

interface ImagePickupPreviewProps {
  data: MessageAttachment[]
  onDelete: (_: string) => void
  onAdd?: (_: ChangeEvent<HTMLInputElement>) => void
  size?: number
  showLoading?: boolean
  onClose?: Function
}

export const ImagePickupPreview = ({
  data,
  onDelete,
  size = 100,
  onAdd,
  showLoading,
  onClose,
}: ImagePickupPreviewProps) => {
  return (
    <div className={`pt-12 relative ${showLoading ? "pointer-events-none" : ""}`}>
      {showLoading ? (
        <div className="absolute inset-0 flex-center z-[100] ">
          <Spinner size={30} />
        </div>
      ) : null}

      <div className="flex items-center justify-between">
        <p className="flex items-center text-xs mb-12">
          <span className="text-primary font-semibold w-24 h-24 flex-center rounded-[6px] text-14 bg-bg-primary mr-6">
            {data.length}
          </span>
          <span className="text-blue-8">ảnh được chọn</span>
        </p>
        <button onClick={() => onClose?.()} className="relative top-[-8px]">
          <CloseThickIcon className="text-gray-color-4 w-[10px]" />
        </button>
      </div>
      <div className="flex flex-wrap overflow-y-auto h-[128px]">
        {data.map((item, index) => (
          <div
            key={index}
            style={{ height: size, width: size }}
            className="rounded-[5px] relative overflow-hidden mr-8 mb-8 md:mr-12 md:mb-12"
          >
            <button
              onClick={() => onDelete(item.id)}
              className="absolute w-16 h-16 rounded-[50%] bg-gray-color-3 right-4 top-4 z-10 flex-center hover:bg-primary"
            >
              <IoMdClose className="text-white-color text-14 fill-white-color" />
            </button>

            <Image
              blurDataURL={imageBlur}
              src={item.previewImage}
              alt=""
              objectFit="cover"
              layout="fill"
            />
          </div>
        ))}

        <label
          style={{ height: size, width: size }}
          className="rounded-[5px] relative overflow-hidden mr-8 mb-8 md:mr-12 md:mb-12 flex-center border-[2px] border-dashed border-border-color-3 cursor-pointer"
          htmlFor="image-add"
        >
          <input
            name=""
            multiple
            accept="image/*"
            hidden
            onChange={onAdd}
            type="file"
            id="image-add"
          />
          <UploadIcon className="text-border-color-3" />
        </label>
      </div>
    </div>
  )
}

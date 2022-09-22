import { MessageAttachment } from "@/models"
import Image from "next/image"
import { IoMdClose } from "react-icons/io"

interface ImagePickupPreviewProps {
  data: MessageAttachment[]
  onDelete: (_: string) => void
  size?: number
}

export const ImagePickupPreview = ({ data, onDelete, size = 100 }: ImagePickupPreviewProps) => {
  return (
    <div className="py-16">
      <p className="flex items-center text-xs mb-12">
        <span className="text-primary font-semibold w-24 h-24 flex-center rounded-[6px] text-14 bg-bg-primary mr-6">
          {data.length}
        </span>{" "}
        <span className="text-blue-8">ảnh được chọn</span>
      </p>
      <div className="flex flex-wrap overflow-y-auto h-[128px]">
        {data.map((item, index) => (
          <div
            key={index}
            style={{ height: size, width: size }}
            className="rounded-[5px] relative overflow-hidden mr-12 mb-12"
          >
            <button
              onClick={() => onDelete(item.id)}
              className="absolute w-16 h-16 rounded-[50%] bg-gray-color-3 right-4 top-4 z-10 flex-center hover:bg-primary"
            >
              <IoMdClose className="text-white-color text-14 fill-white-color" />
            </button>

            <Image src={item.previewImage} alt="" objectFit="cover" layout="fill" />
          </div>
        ))}
      </div>
    </div>
  )
}

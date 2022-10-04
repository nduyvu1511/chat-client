import { imageBlur } from "@/assets"
import { AttachmentRes } from "@/models"
import { setCurrentPreviewImages } from "@/modules"
import Image from "next/image"
import { useDispatch } from "react-redux"

interface MessageImagesProps {
  data: AttachmentRes[]
  className?: string
}

export const MessageImages = ({ data, className }: MessageImagesProps) => {
  const dispatch = useDispatch()

  return (
    <div className={`flex flex-wrap w-full ${className}`}>
      {data.map((item, index) => (
        <div
          onClick={() => dispatch(setCurrentPreviewImages([item.url]))}
          key={item.attachment_id}
          className={`relative aspect-[4/3] rounded-[5px] overflow-hidden ${
            data.length > 1 ? "border border-solid border-gray-05" : ""
          } hover:opacity-90 cursor-pointer mb-2 ${
            data.length - 1 === index
              ? `${index % 2 === 0 ? "w-full" : "w-[50%]"}`
              : `w-[calc(50%-2px)]  ${index % 2 === 0 ? "mr-2" : ""}`
          }`}
        >
          <Image blurDataURL={imageBlur} layout="fill" alt="" objectFit="cover" src={item.url} />
        </div>
      ))}
    </div>
  )
}

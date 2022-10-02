import { AttachmentRes } from "@/models"
import { setCurrentPreviewImages } from "@/modules"
import Image from "next/image"
import { useDispatch } from "react-redux"

interface MessageImagesProps {
  data: AttachmentRes[]
  className?: string
  onClick?: (url: string) => void
}

export const MessageImages = ({ data, onClick, className }: MessageImagesProps) => {
  const dispatch = useDispatch()

  return (
    <div
      onClick={() => dispatch(setCurrentPreviewImages(data.map((item) => item.url)))}
      className={`flex flex-wrap w-full ${className}`}
    >
      {data.map((item, index) => (
        <div
          key={item.attachment_id}
          className={`relative aspect-[4/3] rounded-[5px] overflow-hidden ${
            data.length > 1 ? "border border-solid border-gray-05" : ""
          } hover:opacity-90 cursor-pointer ${
            data.length - 1 === index
              ? `${index % 2 === 0 ? "w-full" : "w-[50%]"}`
              : `w-[calc(50%-2px)] mb-2 ${index % 2 === 0 ? "mr-2" : ""}`
          }`}
        >
          <Image layout="fill" alt="" objectFit="cover" src={item.url} />
        </div>
      ))}
    </div>
  )
}

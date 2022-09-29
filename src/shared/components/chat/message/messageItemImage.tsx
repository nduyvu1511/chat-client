import { AttachmentRes } from "@/models"
import Image from "next/image"

interface MessageItemImageProps {
  data: AttachmentRes[]
  className?: string
  onClick?: (url: string) => void
}

export const MessageItemImage = ({ data, onClick, className }: MessageItemImageProps) => {
  return (
    <div className={`flex flex-wrap w-full ${className}`}>
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

import { CloseThickIcon } from "@/assets"
import { Spinner } from "@/components/common"
import { ListRes, TagRes } from "@/models"
import { chatApi } from "@/services"
import useSWR from "swr"

interface QuickMessageProps {
  onChange?: (_: string) => void
  onClose?: Function
}

export const QuickMessage = ({ onChange, onClose }: QuickMessageProps) => {
  const { isValidating, data } = useSWR<ListRes<TagRes[]>>(
    "get_quick_message",
    () => chatApi.getTagMessageList({ limit: 30 }).then((res) => res.data),
    {
      dedupingInterval: 1000000000,
    }
  )

  return (
    <div className="flex flex-col flex-1 h-full">
      <div className="flex items-center justify-between px-16 py-16 border-b border-solid border-border-color">
        <p className="text-base font-semibold">Tin nhắn nhanh</p>
        <button onClick={() => onClose?.()} className="">
          <CloseThickIcon className="w-12 h-12 text-gray-color-4" />
        </button>
      </div>

      {isValidating ? (
        <Spinner className="py-24" size={24} />
      ) : (
        <div className="h-full overflow-y-auto flex-1">
          {data?.data?.map((item) => (
            <div
              onClick={() => {
                onChange?.(` ${item.text} `)
                onClose?.()
              }}
              className="py-12 px-16 hover:bg-bg cursor-pointer"
              key={item.tag_id}
            >
              <p className="text-sm leading-[20px]">{item.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

import { blankAvatar } from "@/assets"
import { ModalSm, UserItem } from "@/components"
import { MessageDetailRes } from "@/models"
import { setcurrentDetailMessageId, setCurrentProfileId } from "@/modules"
import { chatApi } from "@/services"
import moment from "moment"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import useSWR from "swr"

interface Props {
  messageId: string
}

export const ModalMessageDetail = ({ messageId }: Props) => {
  const dispatch = useDispatch()
  const { data, isValidating } = useSWR<MessageDetailRes | undefined>(
    messageId ? `get_detail_message_${messageId}` : null,
    () => chatApi.getDetailMessage(messageId).then((res) => res.data)
  )

  const closeModal = () => {
    dispatch(setcurrentDetailMessageId(undefined))
  }

  useEffect(() => {
    return () => {
      closeModal()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ModalSm showLoading={isValidating} className="" onClose={closeModal} title="Chi tiết tin nhắn">
      <>
        <div className="p-16 flex-1 flex flex-col relative bg-gray-05 border-b border-solid border-border-color">
          {/* {data?.message_id ? <MessageItem type="preview" data={data} isLast /> : null} */}
          <p className="text-sm">Ngày gửi: {moment(data?.created_at).format("HH:mm DD/MM/YYYY")}</p>
        </div>

        <div className="h-[250px] overflow-y-auto p-16">
          <div className="mb-12">
            <p className="text-sm font-semibold mb-12">Đã xem ({data?.read_by?.length})</p>
            {data?.message_id ? (
              <div className="grid grid-cols-3 gap-y-12 gap-x-8">
                {data.read_by.map((user, index) => (
                  <div key={index}>
                    <UserItem
                      onClick={(id) => dispatch(setCurrentProfileId(id))}
                      data={{
                        avatar: user.user_avatar || blankAvatar,
                        user_id: user.user_id,
                        user_name: user.user_name,
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="">
            <p className="text-sm font-semibold mb-12">Đã gửi ({data?.un_read_by?.length})</p>
            {data?.message_id ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-12">
                {data.un_read_by.map((user, index) => (
                  <div key={index}>
                    <UserItem
                      onClick={(id) => dispatch(setCurrentProfileId(id))}
                      data={{
                        avatar: user.user_avatar || blankAvatar,
                        user_id: user.user_id,
                        user_name: user.user_name,
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </>
    </ModalSm>
  )
}

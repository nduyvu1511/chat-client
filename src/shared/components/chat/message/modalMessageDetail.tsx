import { blankAvatar } from "@/assets"
import { ModalSm, UserItem } from "@/components"
import { ListRes, UserRes } from "@/models"
import { setcurrentDetailMessageId } from "@/modules"
import { chatApi } from "@/services"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import useSWR from "swr"
import { MessageItem } from "./messageItem"

interface Props {
  messageId: string
}

export const ModalMessageDetail = ({ messageId }: Props) => {
  const dispatch = useDispatch()
  const { data: msg } = useSWR(messageId ? "getsdfsdf" : null, () =>
    chatApi.getMessageById(messageId).then((res) => res.data)
  )
  const { data } = useSWR<ListRes<UserRes[]>>(
    messageId ? `get_users_read_message_${messageId}` : null,
    () => chatApi.getUsersReadMessage(messageId).then((res) => res.data)
  )

  const closeModal = () => {
    dispatch(setcurrentDetailMessageId(undefined))
  }

  useEffect(() => {
    return () => {
      dispatch(setcurrentDetailMessageId(undefined))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ModalSm onClose={closeModal} title="Chi tiết tin nhắn">
      <>
        <div className="p-24 flex-1 bg-gray-05 border-b border-solid border-border-color">
          {msg ? <MessageItem data={msg} /> : null}
        </div>

        <div className="h-[250px] overflow-y-auto p-16">
          <p className="text-sm font-semibold mb-12">Đã xem ({data?.total})</p>
          {data?.data?.length ? (
            <div className="grid grid-cols-3 gap-12">
              {data.data.map((user, index) => (
                <div key={index}>
                  <UserItem
                    data={{
                      avatar: user.avatar.thumbnail_url || blankAvatar,
                      user_id: user.user_id,
                      user_name: user.user_name,
                    }}
                  />
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </>
    </ModalSm>
  )
}

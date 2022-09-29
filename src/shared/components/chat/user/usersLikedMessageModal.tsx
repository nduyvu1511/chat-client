import { Modal, Spinner, UserProfile } from "@/components"
import { UsersLikedMessageRes } from "@/models"
import { setCurrentMessageEmotionModalId } from "@/modules"
import { chatApi } from "@/services"
import { AxiosResponse } from "axios"
import { useDispatch } from "react-redux"
import useSWR from "swr"

interface Props {
  messageId: string
}

export const UsersLikedMessageModal = ({ messageId }: Props) => {
  const dispatch = useDispatch()
  const { data, isValidating } = useSWR(messageId ? "get_users_liked_message" : null, () =>
    chatApi
      .getUsersLikedMessage(messageId)
      .then((res: AxiosResponse<UsersLikedMessageRes>) => res.data)
  )

  console.log(data?.like?.[0])

  return (
    <Modal
      className="h-auto"
      show={true}
      heading="Thông tin tài khoản"
      onClose={() => dispatch(setCurrentMessageEmotionModalId(undefined))}
    >
      {isValidating ? (
        <Spinner className="" size={28} />
      ) : data?.like?.[0] ? (
        <UserProfile data={data.like?.[0]} />
      ) : null}
    </Modal>
  )
}

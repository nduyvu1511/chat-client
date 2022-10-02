import { ModalSm, UserProfile } from "@/components"
import { UserRes } from "@/models"
import { setCurrentProfileId } from "@/modules"
import { chatApi } from "@/services"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import useSWR from "swr"

interface Props {
  userId: string
}

export const ModalProfile = ({ userId }: Props) => {
  const dispatch = useDispatch()
  const { data, isValidating } = useSWR<UserRes | undefined>(
    userId ? `get_profile_partner_${userId}` : null,
    () => chatApi.getProfile(userId).then((res) => res.data)
  )

  const closeModal = () => {
    dispatch(setCurrentProfileId(undefined))
  }

  useEffect(() => {
    return () => {
      closeModal()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="modal-profile">
      <ModalSm
        showLoading={isValidating}
        zIndex={3004}
        onClose={closeModal}
        title="Thông tin tài khoản"
      >
        <div className="max-h-[500px] overflow-y-auto">
          {data?.user_id ? <UserProfile data={data} /> : null}
        </div>
      </ModalSm>
    </div>
  )
}

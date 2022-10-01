import { UsersLikedMessageModal } from "@/components"
import { RootState } from "@/core/store"
import { useSelector } from "react-redux"
import { ModalMessageDetail } from "../message"
import { ModalProfile } from "../user/modalProfile"

export const RoomDetailModals = () => {
  const currentMessageEmotionId = useSelector(
    (state: RootState) => state.chat.currentMessageEmotionId
  )
  const currentDetailMessageId = useSelector(
    (state: RootState) => state.chat.currentDetailMessageId
  )
  const currentProfileId = useSelector((state: RootState) => state.chat.currentProfileId)

  return (
    <section>
      {currentMessageEmotionId ? (
        <UsersLikedMessageModal messageId={currentMessageEmotionId} />
      ) : null}

      {currentDetailMessageId ? <ModalMessageDetail messageId={currentDetailMessageId} /> : null}

      {currentProfileId ? <ModalProfile userId={currentProfileId} /> : null}
    </section>
  )
}

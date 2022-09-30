import { UsersLikedMessageModal } from "@/components"
import { RootState } from "@/core/store"
import { useSelector } from "react-redux"
import { ModalMessageDetail } from "../message"

export const RoomDetailModals = () => {
  const currentMessageEmotionId = useSelector(
    (state: RootState) => state.chat.currentMessageEmotionId
  )
  const currentDetailMessageId = useSelector(
    (state: RootState) => state.chat.currentDetailMessageId
  )

  return (
    <section>
      {currentMessageEmotionId ? (
        <UsersLikedMessageModal messageId={currentMessageEmotionId} />
      ) : null}

      {currentDetailMessageId ? <ModalMessageDetail messageId={currentDetailMessageId} /> : null}
    </section>
  )
}

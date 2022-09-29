import { UsersLikedMessageModal } from "@/components"
import { RootState } from "@/core/store"
import { useSelector } from "react-redux"

export const RoomDetailModals = () => {
  const currentMessageEmotionId = useSelector(
    (state: RootState) => state.chat.currentMessageEmotionModalId
  )
  return (
    <section>
      {currentMessageEmotionId ? (
        <UsersLikedMessageModal messageId={currentMessageEmotionId} />
      ) : null}
    </section>
  )
}

import { ModalImagePreview, ModalProfile, UsersLikedMessageModal } from "@/components"
import { RootState } from "@/core/store"
import { useSelector } from "react-redux"
import { ModalMessageDetail } from "../message"
import { ModalRoomInfo } from "./modalRoomInfo"

export const RoomDetailModals = () => {
  const currentMessageEmotionId = useSelector(
    (state: RootState) => state.chat.currentMessageEmotionId
  )
  const currentDetailMessageId = useSelector(
    (state: RootState) => state.chat.currentDetailMessageId
  )
  const currentProfileId = useSelector((state: RootState) => state.chat.currentProfileId)
  const imagesPreview = useSelector((state: RootState) => state.chat.currentPreviewImages)
  const roomInfo = useSelector((state: RootState) => state.chat.currentRoomInfo)

  return (
    <section>
      {currentMessageEmotionId ? (
        <UsersLikedMessageModal messageId={currentMessageEmotionId} />
      ) : null}
      {currentDetailMessageId ? <ModalMessageDetail messageId={currentDetailMessageId} /> : null}
      {currentProfileId ? <ModalProfile userId={currentProfileId} /> : null}
      {imagesPreview ? <ModalImagePreview urls={imagesPreview} /> : null}
      {roomInfo?.room_id ? <ModalRoomInfo data={roomInfo} /> : null}
    </section>
  )
}

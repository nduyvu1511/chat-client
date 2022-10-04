import { Spinner } from "@/components"
import { RootState } from "@/core/store"
import { useBreakpoint, useChat, useDetectWindowFocus } from "@/hooks"
import { MessageRes, RoomDetailFunctionHandler, RoomFunctionHandler, RoomRes } from "@/models"
import { setCurrentRoomId } from "@/modules"
import { useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Room, RoomDetail } from "./room"

export const Chat = () => {
  const breakpoints = useBreakpoint()
  const dispatch = useDispatch()
  const isWindowFocus = useDetectWindowFocus()
  const roomDetailRef = useRef<RoomDetailFunctionHandler>(null)
  const roomRef = useRef<RoomFunctionHandler>(null)
  const currentRoomId = useSelector((state: RootState) => state.chat.currentRoomId)

  const { isConnected } = useChat()

  const handleSendMessage = (params: MessageRes) => {
    roomRef.current?.changeOrderAndAppendLastMessage(params)
  }

  const handleSelectRoom = (room: RoomRes) => {
    dispatch(setCurrentRoomId(room.room_id))
    ;(document?.querySelector(".message-form-input") as HTMLInputElement)?.focus()
  }

  if (!isConnected) return <Spinner size={36} />
  return (
    <section className="grid md:grid-cols-chat-md lg:grid-cols-chat-lg gap-12 lg:gap-24 overflow-hidden flex-1">
      {!currentRoomId || breakpoints > 768 ? (
        <aside className="block-element py-[18px] px-12 lg:p-24 lg:pr-12 flex flex-col">
          <Room ref={roomRef} onSelectRoom={handleSelectRoom} />
        </aside>
      ) : null}

      {breakpoints > 768 || currentRoomId ? (
        <div className="block-element flex flex-col overflow-hidden">
          <RoomDetail onSendMessage={handleSendMessage} ref={roomDetailRef} />
        </div>
      ) : null}
    </section>
  )
}

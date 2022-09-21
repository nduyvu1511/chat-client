import { ImageIcon, SendIcon } from "@/assets"
import { RootState } from "@/core/store"
import { OnForwaredResetForm, SendMessageForm } from "@/models"
import { resetMessageDataInRoom, setMessageDataInRoom } from "@/modules"
import { ChangeEvent, forwardRef, useImperativeHandle } from "react"
import { useDispatch, useSelector } from "react-redux"

interface MessageFormProps {
  onSubmit?: (val: SendMessageForm) => void
  onstartTyping?: Function
  onStopTyping?: Function
  roomId: string
}

export const MessageForm = forwardRef(function MessageFormChild(
  { onSubmit, roomId }: MessageFormProps,
  ref: OnForwaredResetForm
) {
  const dispatch = useDispatch()
  const socket = useSelector((state: RootState) => state.chat.socket)
  const messageFormData = useSelector(
    (state: RootState) => state.chat.messageFormData?.find((item) => item.roomId === roomId)?.data
  )

  console.log(roomId)

  useImperativeHandle(ref, () => ({
    onReset() {
      dispatch(resetMessageDataInRoom(roomId))
    },
  }))

  const handleSubmit = () => {
    if (!messageFormData) return
    onSubmit?.({ text: messageFormData.text })
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setMessageDataInRoom({ data: { text: e.target.value }, roomId }))

    // if (!socket) return
    // if (!isTyping) {
    //   // socket.emit("start_typing", roomId)
    //   setTyping(true)
    // }
    // const lastTypingTime = new Date().getTime()
    // const timerLength = 3000
    // const timeout = setTimeout(() => {
    //   const timeNow = new Date().getTime()
    //   const timeDiff = timeNow - lastTypingTime
    //   if (timeDiff >= timerLength && isTyping) {
    //     // socket.emit("stop_typing", roomId)
    //     setTyping(false)
    //   }
    // }, timerLength)
  }

  return (
    <div className="h-[80px] flex-center">
      <div className="flex-1 mr-16">
        <input
          onKeyPress={(e) => e.code === "Enter" && handleSubmit()}
          onChange={handleChange}
          value={messageFormData?.text}
          type="text"
          placeholder="Nhập tin nhắn"
          className="form-input border-none bg-gray-05 h-full w-full text-sm text-gray-color-4 message-form-input"
        />
      </div>
      <div className="flex items-center">
        <button className="w-[40px] h-[40px] rounded-[8px] flex-center mr-16 bg-gray-05">
          <ImageIcon className="text-primary" />
        </button>
        <button
          onClick={handleSubmit}
          className={`w-[40px] h-[40px] rounded-[8px] flex-center ${
            !messageFormData?.text ? "btn-disabled" : "bg-primary"
          }`}
        >
          <SendIcon className="text-white-color" />
        </button>
      </div>
    </div>
  )
})

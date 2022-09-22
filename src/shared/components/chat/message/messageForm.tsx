import { ImageIcon, SendIcon } from "@/assets"
import { RootState } from "@/core/store"
import { isObjectHasValue } from "@/helper"
import { MessageAttachment, OnForwaredResetForm, SendMessageForm } from "@/models"
import { deleteMessageAttachment, resetMessageDataInRoom, setMessageDataInRoom } from "@/modules"
import { chatApi } from "@/services"
import axios from "axios"
import { ChangeEvent, forwardRef, useImperativeHandle } from "react"
import { useDispatch, useSelector } from "react-redux"
import { v4 as uuidv4 } from "uuid"
import { ImagePickupPreview } from "./messageImagePicker"

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
  const messageFormData = useSelector((state: RootState) =>
    state.chat.messageFormData?.find((item) => item.roomId === roomId)
  )

  useImperativeHandle(ref, () => ({
    onReset() {
      dispatch(resetMessageDataInRoom(roomId))
    },
  }))

  const handleSubmit = async () => {
    if (!messageFormData?.attachments?.length) return
    const formData = new FormData()
    messageFormData.attachments.forEach((item) => {
      formData.append("images", item.file)
    })

    const res = await chatApi.uploadMultipleImage(formData)

    console.log("data back: ", res)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setMessageDataInRoom({ data: { ...messageFormData, text: e.target.value }, roomId }))

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

  const handleInputFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return

    const attachments: MessageAttachment[] = Array.from(files).map((file) => ({
      id: uuidv4(),
      file,
      previewImage: URL.createObjectURL(file),
    }))

    dispatch(setMessageDataInRoom({ data: { attachments }, roomId }))
  }

  return (
    <div
      className={`flex flex-col ${messageFormData?.attachments?.length ? "h-[240px]" : "h-[78px]"}`}
    >
      <div className="flex-1 flex items-center">
        <div className="flex-1 mr-16">
          <input
            onKeyPress={(e) => e.code === "Enter" && handleSubmit()}
            onChange={handleChange}
            value={messageFormData?.text || ""}
            type="text"
            placeholder="Nhập tin nhắn"
            className="form-input border-none bg-gray-05 h-full w-full text-sm text-gray-color-4 message-form-input"
          />
        </div>
        <div className="flex items-center">
          <input
            onChange={handleInputFileChange}
            hidden
            type="file"
            name=""
            multiple
            id="message-attachment"
            accept="image/*"
          />
          <label
            className="w-[40px] h-[40px] rounded-[8px] flex-center cursor-pointer mr-16 bg-gray-05"
            htmlFor="message-attachment"
            id="message-attachment"
          >
            <ImageIcon className="text-primary pointer-events-none" />
          </label>

          <button
            className={`w-[40px] h-[40px] rounded-[8px] flex-center ${
              !isObjectHasValue(messageFormData) ? "btn-disabled" : "bg-primary"
            }`}
            onClick={handleSubmit}
          >
            <SendIcon className="text-white-color" />
          </button>
        </div>
      </div>

      {messageFormData?.attachments?.length ? (
        <div className="">
          <ImagePickupPreview
            onDelete={(imageId) => dispatch(deleteMessageAttachment({ roomId, imageId }))}
            data={messageFormData?.attachments || []}
          />
        </div>
      ) : null}
    </div>
  )
})

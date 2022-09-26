import { ImageIcon, SendIcon } from "@/assets"
import { RootState } from "@/core/store"
import { isObjectHasValue } from "@/helper"
import { useAsync } from "@/hooks"
import {
  AttachmentRes,
  MessageAttachment,
  OnForwaredResetForm,
  SendMessageData,
  SendMessageForm,
} from "@/models"
import {
  addMessageAttachment,
  deleteMessageAttachment,
  resetMessageDataInRoom,
  setMessageDataInRoom,
} from "@/modules"
import { chatApi } from "@/services"
import { ChangeEvent, forwardRef, useImperativeHandle } from "react"
import { useDispatch, useSelector } from "react-redux"
import { notify } from "reapop"
import { v4 as uuidv4 } from "uuid"
import { ImagePickupPreview } from "./messageImagePicker"

interface MessageFormProps {
  onSubmit?: (val: SendMessageData) => void
  onstartTyping?: Function
  onStopTyping?: Function
  roomId: string
}

export const MessageForm = forwardRef(function MessageFormChild(
  { onSubmit, roomId }: MessageFormProps,
  ref: OnForwaredResetForm
) {
  const { asyncHandler, isLoading: isUploading } = useAsync()
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
    if (!messageFormData) return
    const { attachments, location, tags, text } = messageFormData

    if (!attachments && !location && !tags && !text) return
    onSubmit?.(messageFormData)
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

  // const uploadSingleFile = async ({ name, file }: UploadSingleFile) => {
  //   const formData = new FormData()
  //   formData.append(name, file)

  //   asyncHandler({
  //     fetcher: (name === "image" ? chatApi.uploadSingleImage : chatApi.uploadSingleVideo)(formData),
  //     onSuccess: (data) => {
  //       console.log(data)
  //     },
  //   })
  // }

  // const uploadMultipleFile = async ({ params: { files, name }, onSuccess }: UploadMultipleFile) => {
  //   const formData = new FormData()
  //   files.forEach((item) => {
  //     formData.append(name, item)
  //   })

  //   asyncHandler({
  //     fetcher: (name === "image" ? chatApi.uploadMultipleImage : chatApi.uploadSingleVideo)(
  //       formData
  //     ),
  //     onSuccess: (data) => {
  //       console.log(data)
  //     },
  //   })
  // }

  const handleAddFile = (e: ChangeEvent<HTMLInputElement>) => {
    const attachments = toAttachments(e)
    if (!attachments) return
    if (!checkLimitFile(attachments.length)) return

    dispatch(addMessageAttachment({ data: attachments, roomId }))
  }

  const checkLimitFile = (length: number): boolean => {
    if (length + (messageFormData?.attachments?.length || 0) > 20) {
      dispatch(notify("Bạn chỉ được chọn tối đa 20 ảnh 1 lần", "warning"))
      return false
    }
    return true
  }

  const toAttachments = (e: ChangeEvent<HTMLInputElement>): MessageAttachment[] | null => {
    const files = e.target.files
    if (!files?.length) return null

    return Array.from(files).map((file) => ({
      id: uuidv4(),
      file,
      previewImage: URL.createObjectURL(file),
    }))
  }

  const handleInputFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const attachments = toAttachments(e)
    if (!attachments) return
    if (!checkLimitFile(attachments.length)) return

    dispatch(setMessageDataInRoom({ data: { attachments }, roomId }))
  }

  return (
    <div
      className={`flex flex-col relative ${
        messageFormData?.attachments?.length ? "h-[240px]" : "h-[78px]"
      }`}
    >
      {messageFormData?.attachments?.length ? (
        <div className="h-[160px]">
          <ImagePickupPreview
            showLoading={isUploading}
            onAdd={handleAddFile}
            onDelete={(imageId) => dispatch(deleteMessageAttachment({ roomId, imageId }))}
            data={messageFormData?.attachments || []}
          />
        </div>
      ) : null}

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

        <div className={`flex items-center ${isUploading ? "pointer-events-none" : ""}`}>
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
    </div>
  )
})

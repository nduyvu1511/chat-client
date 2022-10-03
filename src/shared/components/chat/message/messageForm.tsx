import { CloseThickIcon, imageBlur } from "@/assets"
import { Map, Modal } from "@/components"
import { RootState } from "@/core/store"
import { useClickOutside } from "@/hooks"
import { MessageAttachment, OnForwaredResetForm, SendMessageData } from "@/models"
import {
  addMessageAttachment,
  deleteMessageAttachment,
  resetMessageDataInRoom,
  setMessageDataInRoom,
  setMessageReply,
  setMessageText,
} from "@/modules"
import { Categories } from "emoji-picker-react"
import dynamic from "next/dynamic"
import Image from "next/image"
import { ChangeEvent, forwardRef, useImperativeHandle, useRef, useState } from "react"
import { FaRegLaugh } from "react-icons/fa"
import { MdMyLocation, MdOutlineInsertPhoto } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"
import { notify } from "reapop"
import { v4 as uuidv4 } from "uuid"
import { ImagePickupPreview } from "./messageImagePicker"

interface MessageFormProps {
  onSubmit?: (val: SendMessageData) => void
  className?: string
}

const Picker = dynamic(
  () => {
    return import("emoji-picker-react")
  },
  { ssr: false }
)

export const MessageForm = forwardRef(function MessageFormChild(
  { onSubmit, className }: MessageFormProps,
  ref: OnForwaredResetForm
) {
  const dispatch = useDispatch()
  const timeout = useRef<any>()
  const emojiRef = useRef<HTMLDivElement>(null)

  const socket = useSelector((state: RootState) => state.chat.socket)
  const user = useSelector((state: RootState) => state.chat.profile)
  const currentTyping = useSelector((state: RootState) => state.chat.currentTyping)
  const roomId = useSelector((state: RootState) => state.chat.currentRoomId) as string
  const messageFormData = useSelector((state: RootState) =>
    state.chat.messageFormData?.find((item) => item.room_id === roomId)
  )

  const [isTyping, setTyping] = useState<boolean>(false)
  const [showEmoji, setShowEmoji] = useState<boolean>(false)
  const [showMap, setShowMap] = useState<boolean>(false)

  useClickOutside([emojiRef], () => {
    setShowEmoji(false)
  })

  useImperativeHandle(ref, () => ({
    onReset() {
      dispatch(resetMessageDataInRoom())
    },
  }))

  const timeoutFunction = () => {
    setTyping(false)
    user &&
      socket?.emit("stop_typing", {
        room_id: roomId,
        user_name: user.user_name,
        user_id: user.user_id,
      })
  }

  const onKeyDownNotEnter = () => {
    if (isTyping == false) {
      setTyping(true)
      user &&
        socket?.emit("start_typing", {
          room_id: roomId,
          user_name: user.user_name,
          user_id: user.user_id,
        })
      timeout.current = setTimeout(timeoutFunction, 3000)
    } else {
      clearTimeout(timeout.current)
      timeout.current = setTimeout(timeoutFunction, 3000)
    }
  }

  const handleSubmit = async () => {
    if (!messageFormData) return

    const { attachments, location, tags, text } = messageFormData
    if (!attachments && !location && !tags && !text) return

    if (user) {
      timeoutFunction()
      clearTimeout(timeout.current)
    }
    onSubmit?.(messageFormData)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onKeyDownNotEnter()
    dispatch(setMessageText(e.target.value))
  }

  const handleAddFile = (e: ChangeEvent<HTMLInputElement>) => {
    const attachments = toAttachments(e)
    if (!attachments) return
    if (!checkLimitFile(attachments.length)) return

    dispatch(addMessageAttachment(attachments))
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
    if (!attachments || !checkLimitFile(attachments.length)) return

    dispatch(setMessageDataInRoom({ ...messageFormData, attachments }))
  }

  return (
    <>
      <div
        className={`flex flex-col bg-white-color relative ${
          messageFormData?.attachments?.length ? "h-[78px]" : "h-[78px]"
        } ${className || ""}`}
      >
        {/* Typing */}
        {currentTyping?.room_id === roomId ? (
          <div className="absolute left-0 top-[-26px] flex-center px-24 py-4 z-[100] bg-white-color">
            <p className="text-xs line-clamp-1 word-break">
              {currentTyping?.user_name} đang soạn tin nhắn...
            </p>
          </div>
        ) : null}

        {messageFormData?.attachments?.length ? (
          <div className="h-[172px] absolute top-[-172px] z-[100] left-0 right-0 bg-white-color px-24">
            <ImagePickupPreview
              onClose={() =>
                dispatch(setMessageDataInRoom({ ...messageFormData, attachments: [] }))
              }
              onAdd={handleAddFile}
              onDelete={(imageId) => dispatch(deleteMessageAttachment({ imageId }))}
              data={(messageFormData?.attachments as any[]) || []}
            />
          </div>
        ) : null}

        {messageFormData?.reply_to ? (
          <div className="px-24 pt-12 absolute top-[-76px] border-t border-border-color border-solid left-0 right-0 bg-white-color z-[200]">
            <div className="p-12 flex-1 rounded-[8px] h-[64px] relative bg-bg pt-12">
              <div className="flex items-center">
                {messageFormData?.reply_to?.attachment?.id ? (
                  <div className="mr-12 w-[36px] relative overflow-hidden h-[36px] rounded-[4px]">
                    <Image
                      blurDataURL={imageBlur}
                      src={messageFormData.reply_to.attachment.url}
                      layout="fill"
                      alt=""
                      objectFit="cover"
                    />
                  </div>
                ) : null}
                <div className="flex-1">
                  <p className="text-xs mb-8">
                    Trả lời{" "}
                    <span className="font-semibold text-primary">
                      {messageFormData.reply_to.author.author_name}
                    </span>
                  </p>
                  <p className="text-xs line-clamp-1 word-break">
                    {messageFormData.reply_to.message_text}
                  </p>
                </div>
              </div>

              <button
                onClick={() => dispatch(setMessageReply(undefined))}
                className="w-[16px] h-[16px] rounded-[50%] bg-gray-color-2 transition-colors duration-100 hover:bg-primary flex-center absolute right-12 top-12"
              >
                <CloseThickIcon className="w-8 h-8 text-white-color" />
              </button>
            </div>
          </div>
        ) : null}

        {showEmoji ? (
          <div ref={emojiRef} className="absolute top-[-390px] z-[100] left-24 w-[300px]">
            <Picker
              categories={[
                { category: Categories.SUGGESTED, name: "Gợi ý" },
                { category: Categories.SMILEYS_PEOPLE, name: "Cảm xúc" },
                { category: Categories.TRAVEL_PLACES, name: "Địa điểm" },
                { category: Categories.SYMBOLS, name: "Ký tự" },
                { category: Categories.FOOD_DRINK, name: "Ăn uống" },
                { category: Categories.OBJECTS, name: "Đối tượng" },
              ]}
              onEmojiClick={({ emoji }) => {
                const text = `${messageFormData?.text || ""} ${emoji} `
                dispatch(setMessageText(text))
              }}
              height={400}
              width={340}
            />
          </div>
        ) : null}

        <div className="flex-1 flex items-center">
          <div className="flex-1 mr- relative mr-16">
            <button
              onClick={() => setShowEmoji(true)}
              className="w-[40px] h-[40px] rounded-[5px] flex-center absolute-vertical left-4"
            >
              <FaRegLaugh className="text-lg text-gray-color-3" />
            </button>

            <input
              id="message-form-input"
              onKeyPress={(e) => e.code === "Enter" && handleSubmit()}
              onChange={handleChange}
              value={messageFormData?.text || ""}
              type="text"
              placeholder="Nhập tin nhắn"
              className="form-input border-none bg-gray-05 pl-[48px] h-full w-full text-sm text-gray-color-4 message-form-input"
            />
          </div>
          {/* <MessageFormInput /> */}

          <button
            onClick={() => setShowMap(true)}
            className="w-[40px] h-[40px] rounded-[8px] hover:bg-gray-10 duration-150 transition-colors bg-gray-05 flex-center mr-8"
          >
            <MdMyLocation />
          </button>

          <div className={`flex items-center ${false ? "pointer-events-none" : ""}`}>
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
              className="w-[40px] h-[40px] hover:bg-gray-10 mr-8 duration-150 transition-colors rounded-[8px] flex-center cursor-pointer bg-gray-05"
              htmlFor="message-attachment"
              id="message-attachment"
            >
              <MdOutlineInsertPhoto className="text-gray-color-3 pointer-events-none w-[20px] h-[20px]" />
            </label>

            <button
              className={`w-[40px] h-[40px] rounded-[8px] flex-center hover:bg-gray-10 bg-gray-05 duration-150 text-sm font-semibold transition-colors ${
                !messageFormData?.text &&
                !messageFormData?.tags?.length &&
                !messageFormData?.attachments?.length
                  ? "pointer-events-none btn-disabled opacity-30"
                  : "text-primary"
              }`}
              onClick={handleSubmit}
            >
              Gửi
              {/* <SendIcon className="text-white-color" /> */}
            </button>
          </div>
        </div>
      </div>

      {showMap ? (
        <Modal heading="Xác nhận vị trí để gửi" onClose={() => setShowMap(false)} show={true}>
          <Map
            onChooseLocation={(location) => {
              onSubmit?.({
                room_id: roomId,
                location: { lat: location.lat + "", lng: location.lng + "" },
              })
              setShowMap(false)
            }}
          />
        </Modal>
      ) : null}
    </>
  )
})

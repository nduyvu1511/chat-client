import { CloseThickIcon, imageBlur } from "@/assets"
import { RootState } from "@/core/store"
import { useClickOutside } from "@/hooks"
import { MessageAttachment, SendMessageData } from "@/models"
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
import { ChangeEvent, useEffect, useRef, useState } from "react"
import { FaRegLaugh } from "react-icons/fa"
import { MdOutlineArrowBackIosNew } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"
import { notify } from "reapop"
import { v4 as uuidv4 } from "uuid"
import { MessageFormOption } from "./messageFormOption"
import { ImagePickupPreview } from "./messageImagePicker"

const Picker = dynamic(
  () => {
    return import("emoji-picker-react")
  },
  { ssr: false }
)

interface MessageFormProps {
  onSubmit?: (val: SendMessageData) => void
  className?: string
}

export const MessageForm = ({ onSubmit, className }: MessageFormProps) => {
  const dispatch = useDispatch()
  const messageInputRef = useRef<HTMLTextAreaElement>(null)
  const emojiRef = useRef<HTMLDivElement>(null)
  const timeout = useRef<any>()

  const socket = useSelector((state: RootState) => state.chat.socket)
  const user = useSelector((state: RootState) => state.chat.profile)
  const currentTyping = useSelector((state: RootState) => state.chat.currentTyping)
  const roomId = useSelector((state: RootState) => state.chat.currentRoomId) as string
  const messageFormIndex = useSelector((state: RootState) => state.chat.currentMessageFormDataIndex)
  const messageFormData = useSelector(
    (state: RootState) => state.chat.messageFormData?.[messageFormIndex]
  )

  const [isTyping, setTyping] = useState<boolean>(false)
  const [showEmoji, setShowEmoji] = useState<boolean>(false)
  const [focus, setFocus] = useState<boolean>(false)
  const [hasText, setHasText] = useState<boolean>(!!messageFormData.text)

  const timeoutFunction = () => {
    setTyping(false)
    user &&
      socket?.emit("stop_typing", {
        room_id: roomId,
        user_name: user.user_name,
        user_id: user.user_id,
      })
  }

  useClickOutside([emojiRef], () => {
    setShowEmoji(false)
  })

  const handleChange = (text: string) => {
    if (messageInputRef?.current) {
      const value = (messageInputRef.current?.value || "").trim()
      messageInputRef.current.value = `${value ? `${value} ` : ""}${text} `
      messageInputRef.current?.focus()
    }

    if (!hasText) {
      setHasText(true)
    }

    onKeyDownNotEnter()
  }

  const onKeyDownNotEnter = () => {
    if (isTyping === false) {
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

    const text = messageInputRef.current?.value?.trim()
    const { attachments, location } = messageFormData
    if (!attachments?.length && !location && !text) return

    if (user) {
      timeoutFunction()
      clearTimeout(timeout.current)
    }

    onSubmit?.({ ...messageFormData, text })

    setHasText(false)

    dispatch(resetMessageDataInRoom())

    const input = messageInputRef?.current
    if (input) {
      input.value = ""
      input?.focus()
      input.style.height = "20px"
    }
  }

  const handleAddFile = (e: ChangeEvent<HTMLInputElement>) => {
    const attachments = toAttachments(e)
    if (!attachments) return
    if (!checkLimitFile(attachments.length)) return

    dispatch(addMessageAttachment(attachments))
  }

  useEffect(() => {
    const inputRef = messageInputRef.current
    if (inputRef) {
      messageInputRef.current.focus()
      messageInputRef.current.value = messageFormData?.text || ""
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId])

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

  const textareaGrowthUp = () => {
    const textarea = messageInputRef.current
    if (!textarea) return

    textarea.style.height = "20px"
    textarea.style.height = `${textarea.scrollHeight}px`
  }

  const storeMessageText = () => {
    const val = messageInputRef?.current?.value || ""
    if (val !== messageFormData?.text) {
      dispatch(setMessageText(val))
    }
  }

  return (
    <div className={`flex flex-col bg-gray-05 relative h-[60px] ${className || ""}`}>
      {/* Typing */}
      {currentTyping?.room_id === roomId ? (
        <div className="absolute left-0 top-[-26px] flex-center px-12 md:px-16 py-4 z-[100] bg-white-color">
          <p className="text-xs line-clamp-1 word-wrap-anywhere">
            {currentTyping?.user_name} đang soạn tin nhắn...
          </p>
        </div>
      ) : null}

      {/* Image pickup preview */}
      {messageFormData?.attachments?.length ? (
        <div className="h-[176px] absolute top-[-176px] z-[100] left-0 right-0 bg-gray-05 px-12 md:px-16">
          <ImagePickupPreview
            onClose={() => dispatch(setMessageDataInRoom({ ...messageFormData, attachments: [] }))}
            onAdd={handleAddFile}
            onDelete={(imageId) => dispatch(deleteMessageAttachment({ imageId }))}
            data={(messageFormData?.attachments as any[]) || []}
          />
        </div>
      ) : null}

      {/* Reply to */}
      {messageFormData?.reply_to ? (
        <div className="px-12 md:px-16 pt-12 absolute top-[-76px] border-t border-border-color border-solid left-0 right-0 bg-gray-05 z-[200]">
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
                <p className="text-xs line-clamp-1 word-wrap-anywhere">
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

      {/* Message input */}
      <div className="flex-1 flex items-center">
        <div className="relative">
          {showEmoji ? (
            <div
              onBlur={storeMessageText}
              ref={emojiRef}
              className="absolute h-[400px] w-[calc(100vw-40px)] xs:w-[320px] top-[-410px] z-[100] left-0 shadow-lg rounded-[8px]"
            >
              <Picker
                categories={[
                  { category: Categories.SUGGESTED, name: "Gợi ý" },
                  { category: Categories.SMILEYS_PEOPLE, name: "Cảm xúc" },
                  { category: Categories.TRAVEL_PLACES, name: "Địa điểm" },
                  { category: Categories.SYMBOLS, name: "Ký tự" },
                  { category: Categories.FOOD_DRINK, name: "Ăn uống" },
                  { category: Categories.OBJECTS, name: "Đối tượng" },
                ]}
                onEmojiClick={({ emoji }) => handleChange(emoji)}
                lazyLoadEmojis
              />
            </div>
          ) : null}

          <button
            onClick={() => setShowEmoji(true)}
            className={`w-[28px] h-[28px] md:w-[40px] md:h-[40px] rounded-[8px] duration-150 transition-colors flex-center ${
              showEmoji ? "bg-gray-10" : "bg-gray-05 hover:bg-gray-10"
            }`}
          >
            <FaRegLaugh
              style={{ color: showEmoji ? "#2E41B6" : "#595959" }}
              className="text-base md:text-lg"
            />
          </button>
        </div>

        <div className="flex-1 h-full relative flex-center">
          <textarea
            style={{ height: 20, maxHeight: 44 }}
            ref={messageInputRef}
            onBlur={() => {
              storeMessageText()

              if (focus) {
                setFocus(false)
              }
            }}
            onFocus={() => {
              if (!focus) {
                setFocus(true)
              }
            }}
            id="message-form-input"
            onKeyDown={(e) => {
              if (e.code === "Enter" && !e.shiftKey) {
                handleSubmit()
                e.preventDefault()
              }
            }}
            onChange={(e) => {
              const { value } = e.target
              textareaGrowthUp()
              if (!value && hasText) {
                setHasText(false)
              } else if (value && !hasText) {
                setHasText(true)
              }
              onKeyDownNotEnter()
            }}
            defaultValue={messageFormData.text}
            placeholder="Nhập tin nhắn"
            className="form-input border-none scrollbar-hide bg-gray-05 py-0 h-full w-full text-sm text-gray-color-4 message-form-input px-12 leading-[normal] resize-none"
          />
        </div>

        {!focus ? (
          <MessageFormOption
            onQuickMessageChange={(val) => {
              handleChange(val)
              storeMessageText()
              textareaGrowthUp()
            }}
            onSendLocation={(data) => {
              onSubmit?.({
                room_id: roomId,
                location: { lat: data.lat + "", lng: data.lng + "" },
              })
            }}
            data={messageFormData}
            onInputFileChange={handleInputFileChange}
          />
        ) : (
          <button className="mr-4">
            <MdOutlineArrowBackIosNew className="text-sm text-gray-color-3" />
          </button>
        )}

        <div className={`flex items-center ${false ? "pointer-events-none" : ""}`}>
          <button
            className={`w-[40px] h-[40px] rounded-[8px] flex-center hover:bg-gray-10 bg-gray-05 duration-150 text-sm font-semibold transition-colors ${
              !hasText && !messageFormData?.attachments?.length
                ? "pointer-events-none btn-disabled opacity-30"
                : "text-primary"
            }`}
            onClick={handleSubmit}
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  )
}

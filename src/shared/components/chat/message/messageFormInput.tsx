import { RootState } from "@/core/store"
import { useClickOutside, useDebounce, useInputText } from "@/hooks"
import { Categories } from "emoji-picker-react"
import dynamic from "next/dynamic"
import { useEffect, useRef, useState } from "react"
import { FaRegLaugh } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"

const Picker = dynamic(
  () => {
    return import("emoji-picker-react")
  },
  { ssr: false }
)

interface MessageFormInputProps {}

export const MessageFormInput = () => {
  const dispatch = useDispatch()
  const emojiRef = useRef<HTMLDivElement>(null)

  const roomId = useSelector((state: RootState) => state.chat.currentRoomId) as string
  const textValue =
    useSelector((state: RootState) =>
      state.chat.messageFormData?.find((item) => item.room_id === roomId)
    )?.text || ""

  const { clearValue, onChange, value, setValue } = useInputText(textValue)
  const [showEmoji, setShowEmoji] = useState<boolean>(false)

  const val = useDebounce(value, 1000)

  useEffect(() => {
    console.log("debounce value: ", val)
  }, [val])

  useClickOutside([emojiRef], () => {
    setShowEmoji(false)
  })

  const handleSubmit = () => {}

  const handleChange = (val: string) => {
    setValue(val)
  }

  useEffect(() => {
    return () => {
      console.log("its morphie time")
      console.log("I dont know how to handle this, Damn it")
    }
  }, [])

  return (
    <div className="flex-1 mr- relative mr-16">
      {showEmoji ? (
        <div ref={emojiRef} className="absolute top-[-400px] z-[100] left-0 w-[300px]">
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
              const text = `${value || ""} ${emoji} `
              handleChange(text)
            }}
            height={400}
            width={340}
          />
        </div>
      ) : null}
      <button
        onClick={() => setShowEmoji(true)}
        className="w-[40px] h-[40px] rounded-[5px] flex-center absolute-vertical left-4"
      >
        <FaRegLaugh className="text-lg text-gray-color-3" />
      </button>

      <input
        id="message-form-input"
        onKeyPress={(e) => e.code === "Enter" && handleSubmit()}
        onChange={(e) => handleChange(e.target.value)}
        value={value}
        type="text"
        placeholder="Nhập tin nhắn"
        className="form-input border-none bg-gray-05 pl-[48px] h-full w-full text-sm text-gray-color-4 message-form-input"
      />
    </div>
  )
}

import { ImageIcon, SendIcon } from "@/assets"
import { useInputText } from "@/hooks"
import { OnForwaredResetForm, SendMessageForm } from "@/models"
import { ChangeEvent, forwardRef, useEffect, useImperativeHandle } from "react"

interface MessageFormProps {
  onSubmit?: (val: SendMessageForm) => void
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  onstartTyping?: Function
  onStopTyping?: Function
}

export const MessageForm = forwardRef(function MessageFormChild(
  { onSubmit, onChange: onChangeProps }: MessageFormProps,
  ref: OnForwaredResetForm
) {
  const { clearValue, onChange, value } = useInputText()

  useImperativeHandle(ref, () => ({
    onReset() {
      clearValue()
    },
  }))

  const handleSubmit = () => {
    if (!value) return
    onSubmit?.({ text: value })
  }

  useEffect(() => {}, [])

  return (
    <div className="flex items-center h-[46px] flex-1">
      <div className="flex-1 mr-16">
        <input
          onKeyPress={(e) => e.code === "Enter" && handleSubmit()}
          onChange={(e) => {
            onChange(e)
            onChangeProps?.(e)
          }}
          value={value}
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
            !value ? "btn-disabled" : "bg-primary"
          }`}
        >
          <SendIcon className="text-white-color" />
        </button>
      </div>
    </div>
  )
})

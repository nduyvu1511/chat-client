import { CloseThickIcon, SearchIcon } from "@/assets"
import { useDebounce, useInputText } from "@/hooks"
import { InputHTMLAttributes } from "react"
import { useEffect, useRef } from "react"

interface RoomFormProps {
  onChange?: (val: string) => void
  className?: string
  attributes?: InputHTMLAttributes<HTMLInputElement>
  onFocus?: Function
}

export const InputSearch = ({
  onChange: onChangeProps,
  className,
  attributes,
  onFocus,
}: RoomFormProps) => {
  const secondRef = useRef<boolean>(false)
  const { clearValue, onChange, value } = useInputText()
  const searchValue = useDebounce(value, 500)

  useEffect(() => {
    if (!secondRef.current) {
      secondRef.current = true
      return
    }

    onChangeProps?.(searchValue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue])

  return (
    <div className={`w-full h-full relative flex items-center rounded-[8px] ${className}`}>
      <span className="absolute-vertical left-[14px]">
        <SearchIcon className="w-[16px] h-[16px] text-gray-color-6" />
      </span>
      <input
        onFocus={() => onFocus?.()}
        className="form-input flex-1 border-none pl-40 pr-40 bg-bg text-sm"
        onChange={onChange}
        value={value}
        type="text"
        {...attributes}
      />

      {value ? (
        <span onClick={() => clearValue()} className="absolute-vertical right-16 cursor-pointer">
          <CloseThickIcon className="w-10 text-gray-color-3" />
        </span>
      ) : null}
    </div>
  )
}

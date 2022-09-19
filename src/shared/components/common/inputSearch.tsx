import { SearchIcon } from "@/assets"
import { useDebounce, useInputText } from "@/hooks"
import { InputHTMLAttributes } from "react"
import { useEffect, useRef } from "react"

interface RoomFormProps {
  onChange?: (val: string) => void
  className?: string
  attributes?: InputHTMLAttributes<HTMLInputElement>
}

export const InputSearch = ({ onChange: onChangeProps, className, attributes }: RoomFormProps) => {
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
        <SearchIcon className="w-[16px] h-[16px]" />
      </span>
      <input
        className="form-input flex-1 border-none pl-40 bg-gray-05"
        onChange={onChange}
        value={value}
        type="text"
        {...attributes}
      />
    </div>
  )
}

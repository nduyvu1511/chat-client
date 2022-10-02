import { ArrowLeft2Icon, CloseThickIcon } from "@/assets"
import { ReactNode } from "react"
import { Spinner } from "../common"

interface ModalSmProps {
  onClose: Function
  title: string
  children: ReactNode
  className?: string
  showLoading?: boolean
  zIndex?: number
  onBack?: Function
}

export const ModalSm = ({
  children,
  title,
  className,
  onClose,
  showLoading,
  zIndex = 3000,
  onBack,
}: ModalSmProps) => {
  return (
    <>
      <div
        style={{ zIndex }}
        className={`flex flex-col w-screen rounded-[8px] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-white-color max-w-[500px] max-h-[600px] ${className} modal-sm`}
      >
        <div className="h-[56px] border-b border-solid border-gray-color-1 w-full flex px-16 md:px-16 items-center">
          <div className="flex-1 flex justify-start">
            {onBack ? (
              <button className="mr-16" onClick={() => onBack?.()}>
                <ArrowLeft2Icon className="w-[8px] h-[16px]" />
              </button>
            ) : null}
            <p className="text-16 font-semibold leading-20 text-center text-blue-8 line-clamp-1 word-break">
              {title}
            </p>
          </div>

          <span onClick={() => onClose()} className="w-[] cursor-pointer">
            <CloseThickIcon className="text-blue-8 w-[14px] h-[14px]" />
          </span>
        </div>

        <div className="flex flex-1 flex-col">
          {showLoading ? (
            <div className="h-[300px]">
              <Spinner className="my-24" />
            </div>
          ) : (
            children
          )}
        </div>
      </div>

      <div
        onClick={() => onClose()}
        style={{ zIndex: zIndex - 1 }}
        className={`fixed inset-[0] bg-black-60`}
      ></div>
    </>
  )
}

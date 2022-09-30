import { CloseThickIcon } from "@/assets"
import React, { ReactNode } from "react"

interface ModalSmProps {
  onClose: Function
  title: string
  children: ReactNode
  className?: string
}

export const ModalSm = ({ children, title, className, onClose }: ModalSmProps) => {
  return (
    <>
      <div
        className={`flex flex-col w-screen rounded-[8px] fixed z-[3000] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-white-color max-w-[500px] max-h-[600px] ${className}`}
      >
        <div className="h-[56px] border-b border-solid border-gray-color-1 w-full flex px-16 md:px-24 items-center">
          <div className="flex-1">
            <p className="text-16 font-semibold leading-20 text-center text-blue-8 line-clamp-1">
              {title}
            </p>
          </div>

          <span onClick={() => onClose()} className="w-[] cursor-pointer">
            <CloseThickIcon className="text-blue-8 w-[14px] h-[14px]" />
          </span>
        </div>

        <div className="flex flex-col">{children}</div>
      </div>

      <div onClick={() => onClose()} className={`fixed z-[2999] inset-[0] bg-black-60`}></div>
    </>
  )
}

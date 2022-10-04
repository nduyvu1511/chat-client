import { ArrowLeft2Icon, CloseThickIcon } from "@/assets"
import { TransitionDirection } from "@/models"
import { ReactNode } from "react"
import { CSSTransition } from "react-transition-group"

interface ModalProps {
  heading: string
  onClose: Function
  children: ReactNode
  className?: string
  iconType?: "close" | "back"
  overLayClose?: boolean
  show: boolean | undefined
  transitionType?: TransitionDirection
  headerNode?: ReactNode
  overFlowAuto?: boolean
  fullScreen?: boolean
  rightHeaderNode?: ReactNode
}

const Modal = ({
  heading,
  onClose,
  children,
  className = "",
  iconType = "close",
  overLayClose = false,
  show,
  transitionType = "up",
  headerNode = null,
  overFlowAuto = true,
  fullScreen = false,
  rightHeaderNode = null,
}: ModalProps) => {
  return (
    <>
      <CSSTransition classNames={`modal-${transitionType}`} unmountOnExit timeout={500} in={show}>
        <div
          className={`modal flex flex-col w-screen h-full ${
            fullScreen ? "" : "sm:max-w-[610px] sm:max-h-[650px] sm:rounded-[30px]"
          } fixed z-[3000] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-white-color ${className}`}
        >
          <div className="h-[56px] border-b border-solid border-gray-color-1 w-full flex px-16 md:px-24 items-center">
            <span onClick={() => onClose()} className="w-[30px] cursor-pointer">
              {iconType === "close" ? (
                <CloseThickIcon className="text-blue-8 w-[14px] h-[14px]" />
              ) : (
                <ArrowLeft2Icon className="text-blue-8 w-[20px] h-[16px]" />
              )}
            </span>

            <div className="flex-1">
              <p className="text-16 font-semibold leading-20 text-center text-blue-8 line-clamp-1 word-wrap-anywhere">
                {heading}
              </p>
            </div>

            {rightHeaderNode || <span className="w-[30px]"></span>}
          </div>
          {headerNode}
          <div
            className={`modal-body flex-1 flex flex-col ${overFlowAuto ? "overflow-y-auto" : ""}`}
          >
            {children}
          </div>
        </div>
      </CSSTransition>

      <CSSTransition classNames="fade" unmountOnExit timeout={500} in={show}>
        <div
          onClick={() => overLayClose && onClose()}
          className={`fixed z-[2999] inset-[0] bg-black-60 ${overLayClose ? "cursor-pointer" : ""}`}
        ></div>
      </CSSTransition>
    </>
  )
}

export { Modal }

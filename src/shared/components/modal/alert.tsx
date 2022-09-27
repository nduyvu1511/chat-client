import { CheckCircleIcon, ErrorCircleIcon, WarningIcon } from "@/assets"
import { ReactNode } from "react"
import { CSSTransition } from "react-transition-group"

interface AlertProps {
  onClose?: Function
  title: string
  desc?: string
  className?: string
  type?: "warning" | "error" | "success" | "info"
  onConfirm: Function
  leftBtnLabel?: string
  rightBtnLabel?: string
  showLeftBtn?: boolean
  children?: ReactNode
  disabledBtn?: boolean
  show: boolean | undefined
  showRightBtn?: boolean
  warningColor?: string
}

const iconClassName = "alert-icon w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] my-24 sm:my-24"

const Alert = ({
  onClose,
  desc,
  className = "",
  type = "success",
  onConfirm,
  leftBtnLabel = "Quay lại",
  rightBtnLabel = "Xác nhận",
  showLeftBtn = true,
  showRightBtn = true,
  children,
  disabledBtn = false,
  show,
  title,
  warningColor,
}: AlertProps) => {
  return (
    <>
      <CSSTransition in={show} classNames="modal-down" unmountOnExit timeout={300}>
        <div
          className={`flex flex-col max-h-[666px] max-w-[350px] sm:max-w-[448px] w-full fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[4000] overflow-hidden bg-white-color rounded-[10px] sm:rounded-[30px] px-custom ${className}`}
        >
          <div className="flex-1 flex-center flex-col mb-24 flex-center sm:mb-24">
            {type == "error" ? (
              <ErrorCircleIcon className={iconClassName} />
            ) : type === "success" ? (
              <CheckCircleIcon className={`${iconClassName} text-green`} />
            ) : type === "info" ? (
              <WarningIcon color="#007BFF" className={iconClassName} />
            ) : (
              <WarningIcon color={warningColor || "#ED9526"} className={iconClassName} />
            )}
            <p className="text-base font-semibold line-clamp-4 text-center">{title}</p>
            {desc ? (
              <p className="text-sm mt-16 leading-[20px] text-center text-gray-color-7">{desc}</p>
            ) : null}
          </div>

          {children ? <div className="mb-[24px]">{children}</div> : null}

          <div className="flex-center mb-24 sm:mb-24 alert-btns">
            {showLeftBtn ? (
              <button
                type="button"
                onClick={() => onClose?.()}
                className="btn px-[26px] py-[8px] bg-disabled alert-btns-left"
              >
                {leftBtnLabel}
              </button>
            ) : null}
            {showRightBtn ? (
              <button
                type="button"
                onClick={() => onConfirm()}
                className={`btn px-[26px] py-[8px] text-white-color ml-16 sm:ml-24 alert-btns-right ${
                  type === "success"
                    ? "bg-success"
                    : type === "warning"
                    ? "bg-warning"
                    : type === "info"
                    ? "bg-info"
                    : "bg-error"
                } ${disabledBtn ? "opacity-30 pointer-events-none" : ""}`}
              >
                {rightBtnLabel}
              </button>
            ) : null}
          </div>
        </div>
      </CSSTransition>

      <CSSTransition in={show} classNames="fade" timeout={300} unmountOnExit>
        <div className={`fixed z-[3999] inset-[0] bg-black-40`}></div>
      </CSSTransition>
    </>
  )
}

export { Alert }

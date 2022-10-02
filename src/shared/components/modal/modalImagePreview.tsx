/* eslint-disable @next/next/no-img-element */
import { setCurrentPreviewImages } from "@/modules"
import { useDispatch } from "react-redux"
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch"

interface ModalImagePreviewProps {
  urls: string[]
}

export const ModalImagePreview = ({ urls }: ModalImagePreviewProps) => {
  const dispatch = useDispatch()

  return (
    <div
      onClick={() => dispatch(setCurrentPreviewImages(undefined))}
      className="fixed z-[4000] inset-0"
    >
      <TransformWrapper>
        <TransformComponent>
          <img src={urls[0]} alt="" />
        </TransformComponent>
      </TransformWrapper>
    </div>
  )
}

/* eslint-disable @next/next/no-img-element */
import { CloseThickIcon } from "@/assets"
import { setCurrentPreviewImages } from "@/modules"
import { useDispatch } from "react-redux"
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch"

interface ModalImagePreviewProps {
  urls: string[]
}

export const ModalImagePreview = ({ urls }: ModalImagePreviewProps) => {
  const dispatch = useDispatch()

  return (
    <div className="fixed z-[4000] inset-0 flex-center">
      <button
        onClick={() => dispatch(setCurrentPreviewImages(undefined))}
        className="absolute z-10 top-24 right-24 text-sm text-white-color flex-center"
      >
        <CloseThickIcon className="text-white-color mr-8 w-[10px]" />
        Đóng
      </button>

      <div className="h-[80%] w-[70%] absolute-vertical z-10">
        <TransformWrapper centerOnInit>
          <TransformComponent>
            <img src={urls[0]} alt="" className="w-[auto] h-[auto] object-contain" />
          </TransformComponent>
        </TransformWrapper>
      </div>

      <div
        onClick={() => dispatch(setCurrentPreviewImages(undefined))}
        className="bg-[rgba(0,0,0,0.9)] absolute inset-0"
      ></div>
    </div>
  )
}

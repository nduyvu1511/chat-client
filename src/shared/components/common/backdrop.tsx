import { SpinnerIcon } from "@/assets"
import { RootState } from "@/core/store"
import { useSelector } from "react-redux"

const Backdrop = () => {
  const isScreenLoading = useSelector((state: RootState) => state.common.isScreenLoading)

  return (
    <>
      {isScreenLoading ? (
        <div className="fixed inset-[0] bg-black-60 z-[4000]">
          <div className="absolute-center z-10 bg-white-color py-[20px] px-[20px] rounded-[5px] flex-center flex-col">
            <SpinnerIcon className="animate-spin" />
          </div>
        </div>
      ) : null}
    </>
  )
}

export { Backdrop }

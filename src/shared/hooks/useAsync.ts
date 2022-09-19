import { FetcherConfig } from "@/models"
import { setScreenLoading } from "@/modules"
import { AxiosPromise, AxiosResponse } from "axios"
import { useDispatch } from "react-redux"
import { notify } from "reapop"

export interface asyncHandlerParams<T> {
  fetcher: AxiosPromise<T>
  onSuccess: (params: T) => void
  onError?: (data: any) => void
  config?: FetcherConfig
}

export interface Res {
  asyncHandler: <T>(params: asyncHandlerParams<T>) => void
}

const useAsync = () => {
  const dispatch = useDispatch()

  const asyncHandler = async <T>(params: asyncHandlerParams<T>) => {
    const { fetcher, onSuccess, onError, config } = params
    const {
      showScreenLoading = true,
      errorMsg,
      successMsg,
      showErrorMsg = true,
      toggleOverFlow = true,
    } = config || {}
    try {
      showScreenLoading && dispatch(setScreenLoading({ show: true, toggleOverFlow }))
      const res: AxiosResponse<T> = await fetcher
      showScreenLoading && dispatch(setScreenLoading({ show: false, toggleOverFlow }))
      if (!res?.success) {
        showErrorMsg &&
          setTimeout(() => {
            dispatch(
              notify(errorMsg || res?.message || "Có lỗi xảy ra vui lòng thử lại sau", "error")
            )
          }, 0)
        onError?.(res?.data)
        return
      }
      successMsg && setTimeout(() => dispatch(notify(successMsg, "success")), 0)
      onSuccess(res?.data)
      return res?.data
    } catch (error) {
      showScreenLoading && dispatch(setScreenLoading({ show: false, toggleOverFlow }))
      onError?.(undefined)
    }
  }

  return {
    asyncHandler,
  }
}

export { useAsync }

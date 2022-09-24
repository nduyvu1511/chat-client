import { FetcherConfig } from "@/models"
import { setScreenLoading } from "@/modules"
import { AxiosPromise, AxiosResponse } from "axios"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { notify } from "reapop"

export interface asyncHandlerParams<T> {
  fetcher: AxiosPromise<T>
  onSuccess?: (params: T) => void
  onError?: (data: any) => void
  config?: FetcherConfig
}

interface Res {
  asyncHandler: <T>(params: asyncHandlerParams<T>) => void
  isLoading: boolean
}

const useAsync = (): Res => {
  const dispatch = useDispatch()
  const [isLoading, setLoading] = useState<boolean>(false)

  const asyncHandler = async <T>(params: asyncHandlerParams<T>) => {
    const { fetcher, onSuccess, onError, config } = params
    const {
      showScreenLoading = false,
      errorMsg,
      successMsg,
      showErrorMsg = true,
      toggleOverFlow = false,
    } = config || {}

    try {
      setLoading(true)
      showScreenLoading && dispatch(setScreenLoading({ show: true, toggleOverFlow }))
      const res: AxiosResponse<T> = await fetcher
      setLoading(false)
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
      onSuccess?.(res?.data)
      return res?.data
    } catch (error) {
      showScreenLoading && dispatch(setScreenLoading({ show: false, toggleOverFlow }))
      setLoading(false)
      onError?.(undefined)
    }
  }

  return {
    asyncHandler,
    isLoading,
  }
}

export { useAsync }

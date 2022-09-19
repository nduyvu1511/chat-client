import { ListQuery, UseQueryListRes } from "@/models"
import { AxiosPromise, AxiosResponse } from "axios"
import { useState } from "react"
import useSWR from "swr"
import { PublicConfiguration } from "swr/dist/types"

interface Props<T> {
  limit?: number
  key: string
  initialData: T[] | undefined
  hasMore?: boolean
  fetcher?: (params?: any) => Promise<AxiosResponse<any, any>>
  params?: ListQuery & any
  config?: Partial<PublicConfiguration<any, any, (args_0: string) => any>>
}

export const useQueryList = <T,>({
  limit = 12,
  key,
  initialData,
  hasMore: hasMoreProps = true,
  fetcher,
  params,
  config,
}: Props<T>): UseQueryListRes<T> => {
  const [offset, setOffset] = useState<number>(0)
  const [hasMore, setHasMore] = useState<boolean>(hasMoreProps)
  const [isLoading, setLoading] = useState<boolean>(false)
  const [isFetchingMore, setFetchingMore] = useState<boolean>(false)
  const { isValidating, mutate, data, error } = useSWR(
    key,
    fetcher
      ? () =>
          fetcher(params)
            .then((res) => {
              const list: T[] = res?.result?.data || res?.data || []
              setHasMore(list.length >= limit)
              return list as any
            })
            .catch((err) => console.log(err))
      : null,
    {
      ...config,
      fallbackData: initialData,
    }
  )

  const filterList = async (fetcher: AxiosPromise, cb?: Function, err?: Function) => {
    try {
      setLoading(true)
      const res: AxiosResponse<T[]> = await fetcher
      setLoading(false)
      setOffset(0)
      const list = res?.result?.data || (res as any)?.data || []
      mutate(list, false)
      setHasMore(list.length >= limit)
      cb?.(list)
    } catch (error) {
      setLoading(false)
      err?.()
      console.log(error)
    }
  }

  const fetchMoreItem = async (fetcher: AxiosPromise, cb?: Function, err?: Function) => {
    try {
      setFetchingMore(true)
      const res: AxiosResponse<T[]> = await fetcher
      setFetchingMore(false)
      setOffset(offset + limit)
      const list = res?.result?.data || (res as any)?.data || []
      setHasMore(list.length >= limit)
      mutate([...(data || []), ...list], false)
      cb?.(list)
    } catch (error) {
      err?.()
      setFetchingMore(false)
      console.log(error)
    }
  }

  return {
    data,
    isValidating: isValidating || isLoading,
    hasMore,
    fetchMoreItem,
    filterList,
    isFetchingMore,
    offset,
    error,
    isInitialLoading: data === undefined && error === undefined,
    mutate,
  }
}

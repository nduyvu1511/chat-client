import { CreateUserRes, LoginParams, UseParams } from "@/models"
import { setProfile } from "@/modules"
import { chatApi } from "@/services"
import { useRouter } from "next/router"
import { useDispatch } from "react-redux"
import { useAsync } from "./useAsync"

interface UseAuthRes {
  login: (_: UseParams<LoginParams, CreateUserRes>) => void
}

export const useAuth = (): UseAuthRes => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { asyncHandler } = useAsync()

  const login = async (_: UseParams<LoginParams, CreateUserRes>) => {
    const { onSuccess, params, onError } = _
    asyncHandler({
      fetcher: chatApi.login(params),
      onSuccess: (data: CreateUserRes) => {
        const { access_token, refresh_token, ...rest } = data
        onSuccess?.(data)
        dispatch(setProfile(rest))
        setTimeout(() => {
          router.push("/")
        }, 0)
      },
      onError: onError?.(),
    })
  }

  return { login }
}

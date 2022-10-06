import { useRouter } from "next/router"
import { ReactNode, useEffect } from "react"
import { useSelector } from "react-redux"
import { RootState } from "../core"
import { App } from "./app"

interface AuthLayoutProps {
  children: ReactNode
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const router = useRouter()
  const token = useSelector((state: RootState) => state.chat.accessToken)

  useEffect(() => {
    if (!token) {
      router.push("/login")
    }
  }, [router, token])

  return <App>{children}</App>
}

export { AuthLayout }

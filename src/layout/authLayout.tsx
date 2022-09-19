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
  const user = useSelector((state: RootState) => state.profile.data)

  useEffect(() => {
    if (!user?.user_id) {
      router.push("/login")
    }
  }, [router, user])

  return <App>{children}</App>
}

export { AuthLayout }

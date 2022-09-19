import { LoginForm } from "@/components"
import { useAuth } from "@/hooks"
import { LoginFormParams } from "@/models"
import React from "react"

const Login = () => {
  const { login } = useAuth()

  const handleLogin = (data: LoginFormParams) => {
    login({
      params: data,
    })
  }

  return (
    <section className="w-full min-h-[100vh] bg-bg p-custom">
      <div className="content-container block-element p-custom">
        <h3 className="h3 mb-40">Đăng nhập</h3>
        <LoginForm onSubmit={handleLogin} />
      </div>
    </section>
  )
}

export default Login

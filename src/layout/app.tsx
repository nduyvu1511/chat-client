import { Backdrop } from "@/components"
import { LayoutProps } from "@/models"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import NotificationsSystem, { atalhoTheme, dismissNotification, setUpNotifications } from "reapop"
import { RootState } from "../core"

export const App = ({ children }: LayoutProps) => {
  const dispatch = useDispatch()
  const notifications = useSelector((state: RootState) => state.notifications)

  useEffect(() => {
    setUpNotifications({
      defaultProps: {
        position: "top-center",
        dismissible: true,
        dismissAfter: 3000,
        status: "success",
      },
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {children}
      <NotificationsSystem
        notifications={notifications}
        dismissNotification={(id) => dispatch(dismissNotification(id))}
        theme={atalhoTheme}
      />
      <Backdrop />
    </>
  )
}

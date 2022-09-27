import { UseParams } from "@/models"
import { setScreenLoading } from "@/modules"
import { useDispatch } from "react-redux"
import { notify } from "reapop"
import { LatLng } from "use-places-autocomplete"

interface Res {
  getCurrentLocation: (_params: UseParams<GetCurrentLocationParams, LatLng>) => void
}

interface GetCurrentLocationParams {
  showMsg?: boolean
  showLoading?: boolean
}

const useCurrentLocation = (): Res => {
  const dispatch = useDispatch()

  const getCurrentLocation = (_params: UseParams<GetCurrentLocationParams, LatLng>) => {
    const {
      onSuccess,
      params: { showLoading, showMsg = true },
      onError,
    } = _params
    showLoading && dispatch(setScreenLoading({ show: true }))
    if (!navigator?.geolocation) return
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        showLoading && dispatch(setScreenLoading({ show: false }))
        onSuccess?.({ lat: latitude, lng: longitude })
      },
      () => {
        onError?.()
        showLoading && dispatch(setScreenLoading({ show: false }))
        showMsg &&
          dispatch(notify("Không thể lấy vị trí hiện tại, vui lòng cấp quyền để tiếp tục", "error"))
      }
    )
  }

  return { getCurrentLocation }
}

export { useCurrentLocation }

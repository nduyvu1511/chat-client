import { useState, useEffect } from "react"
import _ from "lodash"

const useBreakpoint = () => {
  const [brkPnt, setBrkPnt] = useState(window.innerWidth)

  useEffect(() => {
    const calcInnerWidth = _.throttle(function () {
      setBrkPnt(window.innerWidth)
    }, 200)
    window.addEventListener("resize", calcInnerWidth)
    return () => window.removeEventListener("resize", calcInnerWidth)
  }, [])

  return brkPnt
}

export { useBreakpoint }

import React from "react"

const CloseIcon = ({ className = "" }) => {
  return (
    <svg
      className={className}
      width="28"
      height="28"
      viewBox="0 0 32 33"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="6.57374"
        y1="6.3667"
        x2="26.1333"
        y2="25.9263"
        stroke="currentColor"
        strokeLinecap="round"
      />
      <line
        x1="26.1334"
        y1="7.07381"
        x2="6.5738"
        y2="26.6334"
        stroke="currentColor"
        strokeLinecap="round"
      />
    </svg>
  )
}

export { CloseIcon }

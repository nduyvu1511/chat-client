import React from "react"

const WarningIcon = ({ className = "", color = "#ED9526" }) => {
  return (
    <svg
      className={className}
      width="68"
      height="68"
      viewBox="0 0 68 68"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle opacity="0.4" r="33.3333" transform="matrix(-1 0 0 1 33.9997 34.0013)" fill={color} />
      <path
        d="M37.3327 50.6667C37.3327 48.8257 35.8403 47.3333 33.9993 47.3333C32.1584 47.3333 30.666 48.8257 30.666 50.6667C30.666 52.5076 32.1584 54 33.9993 54C35.8403 54 37.3327 52.5076 37.3327 50.6667Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M34 43.168C35.3807 43.168 36.5 42.0487 36.5 40.668L36.5 17.3346C36.5 15.9539 35.3807 14.8346 34 14.8346C32.6193 14.8346 31.5 15.9539 31.5 17.3346L31.5 40.668C31.5 42.0487 32.6193 43.168 34 43.168Z"
        fill={color}
      />
    </svg>
  )
}

export { WarningIcon }

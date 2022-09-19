import React from "react"

const MinusIcon = ({ className = "" }) => {
  return (
    <svg
      className={className}
      width="7"
      height="2"
      viewBox="0 0 7 2"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.5 1.5C6.77614 1.5 7 1.27614 7 1C7 0.723858 6.77614 0.5 6.5 0.5V1.5ZM0.5 0.5C0.223858 0.5 0 0.723858 0 1C0 1.27614 0.223858 1.5 0.5 1.5L0.5 0.5ZM6.5 0.5L0.5 0.5L0.5 1.5L6.5 1.5V0.5Z"
        fill="currentColor"
      />
    </svg>
  )
}

export { MinusIcon }

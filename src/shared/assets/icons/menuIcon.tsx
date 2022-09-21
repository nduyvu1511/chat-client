import React from "react"

const MenuIcon = ({ className = "" }) => {
  return (
    <svg
      className={className}
      width="20"
      height="16"
      viewBox="0 0 20 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.416016 1.33301C0.416016 0.642652 0.97566 0.0830078 1.66602 0.0830078H18.3327C19.023 0.0830078 19.5827 0.642652 19.5827 1.33301C19.5827 2.02336 19.023 2.58301 18.3327 2.58301H1.66602C0.97566 2.58301 0.416016 2.02336 0.416016 1.33301ZM0.416016 7.99967C0.416016 7.30932 0.97566 6.74967 1.66602 6.74967H18.3327C19.023 6.74967 19.5827 7.30932 19.5827 7.99967C19.5827 8.69003 19.023 9.24967 18.3327 9.24967H1.66602C0.97566 9.24967 0.416016 8.69003 0.416016 7.99967ZM1.66602 13.4163C0.97566 13.4163 0.416016 13.976 0.416016 14.6663C0.416016 15.3567 0.97566 15.9163 1.66602 15.9163H18.3327C19.023 15.9163 19.5827 15.3567 19.5827 14.6663C19.5827 13.976 19.023 13.4163 18.3327 13.4163H1.66602Z"
        fill="currentColor"
      />
    </svg>
  )
}

export { MenuIcon }
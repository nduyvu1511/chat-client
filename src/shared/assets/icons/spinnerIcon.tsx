import React from "react"

const SpinnerIcon = ({ className = "", size = 21 }) => {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.4551 1.96715C13.5963 0.893995 11.4354 0.464161 9.30743 0.744319C7.17947 1.02448 5.20342 1.99897 3.68576 3.51665C2.16809 5.03434 1.19362 7.0104 0.913492 9.13836C0.633362 11.2663 1.06322 13.4273 2.13641 15.286C3.20959 17.1448 4.86612 18.5975 6.84907 19.4188C8.83202 20.2401 11.0306 20.3842 13.1038 19.8286C15.1769 19.2731 17.0089 18.049 18.3154 16.3462C19.622 14.6433 20.3301 12.557 20.3301 10.4107"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export { SpinnerIcon }

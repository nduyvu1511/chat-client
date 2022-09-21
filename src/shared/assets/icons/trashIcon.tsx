import React from "react"

const TrashIcon = ({ className = "" }) => {
  return (
    <svg
      className={className}
      width="20"
      height="22"
      viewBox="0 0 20 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.5 7C3.5 6.72386 3.27614 6.5 3 6.5C2.72386 6.5 2.5 6.72386 2.5 7H3.5ZM17.5 7C17.5 6.72386 17.2761 6.5 17 6.5C16.7239 6.5 16.5 6.72386 16.5 7H17.5ZM12.5 10C12.5 9.72386 12.2761 9.5 12 9.5C11.7239 9.5 11.5 9.72386 11.5 10H12.5ZM11.5 16C11.5 16.2761 11.7239 16.5 12 16.5C12.2761 16.5 12.5 16.2761 12.5 16H11.5ZM8.5 10C8.5 9.72386 8.27614 9.5 8 9.5C7.72386 9.5 7.5 9.72386 7.5 10H8.5ZM7.5 16C7.5 16.2761 7.72386 16.5 8 16.5C8.27614 16.5 8.5 16.2761 8.5 16H7.5ZM19 4.5C19.2761 4.5 19.5 4.27614 19.5 4C19.5 3.72386 19.2761 3.5 19 3.5V4.5ZM1 3.5C0.723858 3.5 0.5 3.72386 0.5 4C0.5 4.27614 0.723858 4.5 1 4.5V3.5ZM12.5937 1.8906L12.1777 2.16795V2.16795L12.5937 1.8906ZM7.40627 1.8906L6.99024 1.61325L7.40627 1.8906ZM7 21.5H13V20.5H7V21.5ZM2.5 7V17H3.5V7H2.5ZM17.5 17V7H16.5V17H17.5ZM13 21.5C15.4853 21.5 17.5 19.4853 17.5 17H16.5C16.5 18.933 14.933 20.5 13 20.5V21.5ZM7 20.5C5.067 20.5 3.5 18.933 3.5 17H2.5C2.5 19.4853 4.51472 21.5 7 21.5V20.5ZM11.5 10V16H12.5V10H11.5ZM7.5 10L7.5 16H8.5L8.5 10H7.5ZM9.07037 1.5H10.9296V0.5H9.07037V1.5ZM12.1777 2.16795L13.584 4.27735L14.416 3.72265L13.0098 1.61325L12.1777 2.16795ZM14 3.5H6V4.5H14V3.5ZM6.41603 4.27735L7.82229 2.16795L6.99024 1.61325L5.58397 3.72265L6.41603 4.27735ZM14 4.5H19V3.5H14V4.5ZM6 3.5H1V4.5H6V3.5ZM10.9296 1.5C11.4312 1.5 11.8995 1.75065 12.1777 2.16795L13.0098 1.61325C12.5461 0.917753 11.7655 0.5 10.9296 0.5V1.5ZM9.07037 0.5C8.23449 0.5 7.45391 0.917752 6.99024 1.61325L7.82229 2.16795C8.10049 1.75065 8.56884 1.5 9.07037 1.5V0.5Z"
        fill="#373737"
      />
    </svg>
  )
}

export { TrashIcon }
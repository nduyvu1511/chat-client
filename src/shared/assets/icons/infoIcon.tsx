
const InfoIcon = ({ className = "", fill = "#2F19BB" }) => {
  return (
    <svg
      className={className}
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.5005 22.7754C18.0236 22.7754 22.501 18.298 22.501 12.7749C22.501 7.25179 18.0236 2.77441 12.5005 2.77441C6.97738 2.77441 2.5 7.25179 2.5 12.7749C2.5 18.298 6.97738 22.7754 12.5005 22.7754Z"
        fill={fill}
      />
      <path
        d="M12.4961 7.27148L12.5301 15.0065"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.5117 18.2783H12.495"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export { InfoIcon }


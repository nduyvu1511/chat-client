const QuestionIcon = ({ className = "" }) => {
  return (
    <svg
      className={className}
      width="32"
      height="33"
      viewBox="0 0 32 33"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.9998 30.2341C23.3636 30.2341 29.3332 24.2645 29.3332 16.9007C29.3332 9.53692 23.3636 3.56738 15.9998 3.56738C8.63604 3.56738 2.6665 9.53692 2.6665 16.9007C2.6665 24.2645 8.63604 30.2341 15.9998 30.2341Z"
        stroke="currentColor"
      />
      <path
        d="M12.7998 11.2748C13.5998 9.69079 14.3998 8.90039 15.9998 8.90039C17.9934 8.90039 19.1998 10.4828 19.1998 12.0652C19.1998 13.6476 18.3998 14.438 15.9998 16.022V18.5004M15.9998 24.1004V24.9004"
        stroke="currentColor"
        strokeLinecap="round"
      />
    </svg>
  )
}

export { QuestionIcon }

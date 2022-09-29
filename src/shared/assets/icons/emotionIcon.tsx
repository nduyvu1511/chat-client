import React from "react"

export const EmotionIcon = ({ className = "" }) => {
  return (
    <svg className={className} width="22px" height="22px" viewBox="0 0 22 22">
      <circle cx="11" cy="11" r="7" stroke-Width="1.5px"></circle>
      <path d="M8,13Q11,16,14,13" stroke-Width="1.5px"></path>
      <circle cx="9" cy="10" r="1.2"></circle>
      <circle cx="13" cy="10" r="1.2"></circle>
    </svg>
  )
}

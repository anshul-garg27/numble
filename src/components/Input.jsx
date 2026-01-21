import { forwardRef } from 'react'

const Input = forwardRef(({ className = '', ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`
        w-full px-4 py-3.5
        bg-white/90 backdrop-blur
        border-2 border-gray-200
        rounded-xl
        font-body text-base text-gray-900
        placeholder:text-gray-400
        transition-all duration-200
        focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100
        hover:border-gray-300
        ${className}
      `}
      {...props}
    />
  )
})

Input.displayName = 'Input'

export default Input

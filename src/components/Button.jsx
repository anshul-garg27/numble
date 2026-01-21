import { motion } from 'framer-motion'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'default',
  fullWidth = false,
  disabled = false,
  onClick,
  className = '',
  icon,
  ...props 
}) => {
  const baseStyles = 'relative font-heading font-semibold rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden'
  
  const variants = {
    primary: 'btn-premium',
    secondary: `
      bg-white/80 backdrop-blur-lg text-warm-800 
      border-2 border-white/50 
      shadow-[0_4px_20px_rgba(0,0,0,0.06)]
      hover:bg-white hover:border-primary-200 hover:text-primary-600
      hover:shadow-[0_8px_30px_rgba(244,63,94,0.12)]
      hover:-translate-y-1
      active:translate-y-0
    `,
    ghost: 'bg-transparent text-warm-700 hover:bg-white/50 hover:text-primary-600',
    success: 'bg-gradient-to-r from-bulls to-green-600 text-white shadow-[0_4px_20px_rgba(34,197,94,0.3)] hover:shadow-[0_8px_32px_rgba(34,197,94,0.4)] hover:-translate-y-1',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:-translate-y-1'
  }
  
  const sizes = {
    small: 'px-5 py-3 text-sm',
    default: 'px-8 py-4 text-base',
    large: 'px-10 py-5 text-lg'
  }
  
  const disabledStyles = 'opacity-50 cursor-not-allowed hover:translate-y-0 hover:shadow-none'
  
  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.96 }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      className={`
        ${baseStyles}
        ${variant === 'primary' ? '' : variants[variant]}
        ${variant === 'primary' ? 'btn-premium' : ''}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? disabledStyles : ''}
        ${className}
      `}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {/* Shine effect for primary */}
      {variant === 'primary' && !disabled && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6 }}
        />
      )}
      
      {icon && <span className="text-xl relative z-10">{icon}</span>}
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}

export default Button

import { motion } from 'framer-motion'

const Card = ({ 
  children, 
  className = '', 
  variant = 'default',
  animate = true,
  delay = 0,
  onClick,
  hover = false,
  ...props 
}) => {
  const variants = {
    default: 'glass-card',
    strong: 'glass-card-strong',
    solid: 'bg-white shadow-[0_8px_32px_rgba(0,0,0,0.08)]'
  }
  
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.5,
        delay,
        type: 'spring',
        stiffness: 300,
        damping: 25
      }
    }
  }
  
  const hoverEffect = hover ? {
    whileHover: { 
      y: -4, 
      scale: 1.01,
      boxShadow: '0 16px 48px rgba(0,0,0,0.12)'
    },
    whileTap: { scale: 0.98 }
  } : {}
  
  if (animate) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        className={`${variants[variant]} rounded-2xl p-6 ${className}`}
        onClick={onClick}
        {...hoverEffect}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
  
  return (
    <div 
      className={`${variants[variant]} rounded-2xl p-6 ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card

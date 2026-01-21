import { motion, AnimatePresence } from 'framer-motion'

const DigitDisplay = ({ digits = '', maxLength = 4, hidden = false, size = 'default' }) => {
  const digitArray = digits.split('')
  const slots = Array(maxLength).fill(null)
  
  return (
    <div className="flex justify-center gap-2.5">
      {slots.map((_, index) => {
        const digit = digitArray[index]
        const isFilled = digit !== undefined
        const isActive = index === digitArray.length && digitArray.length < maxLength
        
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, type: 'spring', stiffness: 300 }}
            className={`
              digit-box-premium
              ${isFilled ? 'filled' : ''}
              ${isActive ? 'active' : ''}
            `}
          >
            <AnimatePresence mode="wait">
              {isFilled && (
                <motion.span
                  key={digit}
                  initial={{ scale: 0, rotate: -12 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 12 }}
                  transition={{ 
                    type: 'spring', 
                    stiffness: 500, 
                    damping: 25 
                  }}
                  className="font-heading font-bold"
                >
                  {hidden ? '•' : digit}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </div>
  )
}

export default DigitDisplay

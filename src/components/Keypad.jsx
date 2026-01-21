import { motion } from 'framer-motion'
import { Delete, Check } from 'lucide-react'
import { hapticFeedback } from '../utils/gameLogic'

const Keypad = ({ 
  onDigitPress, 
  onDelete, 
  onSubmit, 
  disabledDigits = [], 
  canSubmit = false 
}) => {
  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9']
  
  const handleDigitPress = (digit) => {
    hapticFeedback('light')
    onDigitPress(digit)
  }
  
  const handleDelete = () => {
    hapticFeedback('light')
    onDelete()
  }
  
  const handleSubmit = () => {
    if (canSubmit) {
      hapticFeedback('medium')
      onSubmit()
    }
  }
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.02,
        delayChildren: 0.05
      }
    }
  }
  
  const keyVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 15 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 25
      }
    }
  }
  
  return (
    <motion.div 
      className="w-full max-w-[260px] mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Number Grid */}
      <div className="grid grid-cols-3 gap-2.5 mb-2.5">
        {digits.map((digit) => {
          const isDisabled = disabledDigits.includes(digit)
          
          return (
            <motion.button
              key={digit}
              variants={keyVariants}
              whileTap={{ scale: isDisabled ? 1 : 0.88 }}
              className={`key-premium ${isDisabled ? 'disabled' : ''}`}
              onClick={() => !isDisabled && handleDigitPress(digit)}
              disabled={isDisabled}
            >
              {digit}
            </motion.button>
          )
        })}
      </div>
      
      {/* Bottom Row: Delete & Submit */}
      <div className="grid grid-cols-2 gap-2.5">
        <motion.button
          variants={keyVariants}
          whileTap={{ scale: 0.88 }}
          className="key-premium delete"
          onClick={handleDelete}
        >
          <Delete size={24} strokeWidth={2.5} />
        </motion.button>
        
        <motion.button
          variants={keyVariants}
          whileTap={{ scale: canSubmit ? 0.88 : 1 }}
          className={`key-premium ${canSubmit ? 'confirm' : 'disabled'}`}
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          <Check size={26} strokeWidth={3} />
        </motion.button>
      </div>
    </motion.div>
  )
}

export default Keypad

import { motion } from 'framer-motion'

const TurnIndicator = ({ isYourTurn, partnerName = 'Opponent' }) => {
  if (isYourTurn) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="turn-card your-turn flex items-center gap-3"
      >
        <motion.span 
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-2xl"
        >
          🎯
        </motion.span>
        <div className="flex-1 relative z-10">
          <h3 className="font-heading font-bold text-base text-gray-900">
            YOUR TURN
          </h3>
          <p className="text-xs text-gray-600">
            Guess {partnerName}'s number
          </p>
        </div>
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-xl"
        >
          🔢
        </motion.div>
      </motion.div>
    )
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="turn-card waiting flex items-center gap-3"
    >
      <motion.span 
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        className="text-2xl"
      >
        ⏳
      </motion.span>
      <div className="flex-1">
        <h3 className="font-heading font-bold text-base text-gray-900">
          {partnerName.toUpperCase()}'S TURN
        </h3>
        <p className="text-xs text-gray-500">
          Waiting for their guess...
        </p>
      </div>
      <div className="flex gap-1.5">
        <span className="waiting-dot"></span>
        <span className="waiting-dot"></span>
        <span className="waiting-dot"></span>
      </div>
    </motion.div>
  )
}

export default TurnIndicator

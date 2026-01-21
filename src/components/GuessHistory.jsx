import { motion } from 'framer-motion'

const GuessRow = ({ guess, index, isLatest = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.03,
        type: 'spring',
        stiffness: 300,
        damping: 25
      }}
      className={`guess-row-premium ${isLatest ? 'latest' : ''}`}
    >
      {/* Guess Number */}
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center flex-shrink-0">
        <span className="font-heading font-bold text-xs text-orange-600">
          {index + 1}
        </span>
      </div>
      
      {/* Digits */}
      <div className="flex gap-1 flex-1">
        {guess.guess.split('').map((digit, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: (index * 0.03) + (i * 0.02) }}
            className="w-9 h-10 rounded-lg bg-white/90 backdrop-blur flex items-center justify-center font-heading font-bold text-base text-gray-800 shadow-sm border border-white/50"
          >
            {digit}
          </motion.div>
        ))}
      </div>
      
      {/* Feedback Badges - Match (exists) & Position (correct place) */}
      <div className="flex gap-1.5 flex-shrink-0">
        {/* Match = digits that exist */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: (index * 0.03) + 0.15, type: 'spring' }}
          className="badge-match"
          title="Digits that exist"
        >
          <span>🎯</span>
          <span>{guess.bulls}</span>
        </motion.div>
        {/* Position = correct position */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: (index * 0.03) + 0.2, type: 'spring' }}
          className="badge-position"
          title="Correct position"
        >
          <span>📍</span>
          <span>{guess.cows}</span>
        </motion.div>
      </div>
    </motion.div>
  )
}

const GuessHistory = ({ guesses = [], playerId, title = "Your Guesses" }) => {
  const filteredGuesses = playerId 
    ? guesses.filter(g => g.playerId === playerId)
    : guesses
  
  if (filteredGuesses.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-semibold text-gray-400 text-xs uppercase tracking-wider">
            {title}
          </h3>
          <div className="flex gap-2 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <span>🎯</span>
              Match
            </span>
            <span className="flex items-center gap-1">
              <span>📍</span>
              Position
            </span>
          </div>
        </div>
        <div className="text-center py-6">
          <motion.div 
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-3xl mb-2"
          >
            🎯
          </motion.div>
          <p className="text-gray-400 text-sm">
            Make your first guess!
          </p>
        </div>
      </motion.div>
    )
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-4 max-h-64 overflow-y-auto"
    >
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="font-heading font-semibold text-gray-400 text-xs uppercase tracking-wider">
          {title}
        </h3>
        <div className="flex gap-2 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <span>🎯</span>
            Match
          </span>
          <span className="flex items-center gap-1">
            <span>📍</span>
            Position
          </span>
        </div>
      </div>
      
      <div className="space-y-1.5">
        {filteredGuesses.map((guess, index) => (
          <GuessRow 
            key={guess.id || index} 
            guess={guess} 
            index={index}
            isLatest={index === filteredGuesses.length - 1}
          />
        ))}
      </div>
    </motion.div>
  )
}

export default GuessHistory

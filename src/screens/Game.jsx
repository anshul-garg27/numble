import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Card from '../components/Card'
import DigitDisplay from '../components/DigitDisplay'
import Keypad from '../components/Keypad'
import Header from '../components/Header'
import TurnIndicator from '../components/TurnIndicator'
import GuessHistory from '../components/GuessHistory'
import { subscribeToRoom, submitGuess } from '../firebase/gameService'
import { 
  calculateBullsCows, 
  validateNumber, 
  getUsedDigits, 
  hapticFeedback 
} from '../utils/gameLogic'

const Game = () => {
  const navigate = useNavigate()
  const { roomCode } = useParams()
  
  const [digits, setDigits] = useState('')
  const [error, setError] = useState('')
  const [roomData, setRoomData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showFeedback, setShowFeedback] = useState(null)
  
  const playerId = localStorage.getItem('numble_player_id')
  
  useEffect(() => {
    const unsubscribe = subscribeToRoom(roomCode, (data) => {
      setRoomData(data)
      
      if (data.status === 'finished') {
        setTimeout(() => {
          navigate(`/win/${roomCode}`)
        }, 1000)
      }
    })
    
    return () => unsubscribe()
  }, [roomCode, navigate])
  
  const players = roomData?.players ? Object.values(roomData.players) : []
  const currentPlayer = players.find(p => p.id === playerId)
  const otherPlayer = players.find(p => p.id !== playerId)
  const isMyTurn = roomData?.currentTurn === playerId
  
  const guesses = roomData?.guesses 
    ? Object.entries(roomData.guesses).map(([id, data]) => ({ id, ...data }))
    : []
  
  const myGuesses = guesses.filter(g => g.playerId === playerId)
  
  const handleDigitPress = (digit) => {
    if (!isMyTurn) return
    
    if (digits.length < 4 && !digits.includes(digit)) {
      setDigits(prev => prev + digit)
      setError('')
    } else if (digits.includes(digit)) {
      setError('Digit already used!')
      hapticFeedback('error')
    }
  }
  
  const handleDelete = () => {
    if (!isMyTurn) return
    setDigits(prev => prev.slice(0, -1))
    setError('')
  }
  
  const handleSubmit = async () => {
    if (!isMyTurn || loading) return
    
    const validation = validateNumber(digits)
    if (!validation.valid) {
      setError(validation.error)
      hapticFeedback('error')
      return
    }
    
    setLoading(true)
    
    try {
      const opponentSecret = otherPlayer?.secret
      const { bulls, cows } = calculateBullsCows(opponentSecret, digits)
      // bulls = match (digits exist), cows = position (correct position)
      
      // Show feedback animation
      setShowFeedback({ match: bulls, position: cows })
      hapticFeedback(cows === 4 ? 'success' : 'medium')
      
      await submitGuess(roomCode, playerId, digits, bulls, cows)
      
      setTimeout(() => {
        setShowFeedback(null)
        setDigits('')
        setError('')
      }, 1200)
      
    } catch (err) {
      console.error('Submit guess error:', err)
      setError('Failed to submit. Try again.')
      setShowFeedback(null)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="game-layout px-4 py-3 safe-top">
      <Header 
        roomCode={roomCode} 
        partnerName={otherPlayer?.name}
        showBack
        onBack={() => {
          if (window.confirm('Leave game? You cannot rejoin.')) {
            navigate('/')
          }
        }}
      />
      
      {/* Scrollable content area */}
      <div className="game-content">
        {/* Turn Indicator */}
        <div className="mb-3">
          <TurnIndicator 
            isYourTurn={isMyTurn} 
            partnerName={otherPlayer?.name || 'Opponent'} 
          />
        </div>
        
        {/* Guess History */}
        <div className="mb-3">
          <GuessHistory 
            guesses={myGuesses} 
            playerId={playerId}
            title="Your Guesses"
          />
        </div>
      </div>
      
      {/* Feedback Overlay */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="glass-card-strong rounded-2xl p-6 text-center mx-6"
            >
              <div className="flex justify-center gap-8 mb-4">
                {/* Match = digits exist */}
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: 'spring' }}
                    className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center mb-2"
                  >
                    <span className="text-2xl">🎯</span>
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="font-heading font-bold text-3xl text-green-600"
                  >
                    {showFeedback.match}
                  </motion.p>
                  <p className="text-xs text-gray-500">Match</p>
                </div>
                {/* Position = correct position */}
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mb-2"
                  >
                    <span className="text-2xl">📍</span>
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="font-heading font-bold text-3xl text-blue-600"
                  >
                    {showFeedback.position}
                  </motion.p>
                  <p className="text-xs text-gray-500">Position</p>
                </div>
              </div>
              
              {showFeedback.position === 4 ? (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-heading font-bold text-lg text-green-600"
                >
                  🎉 YOU CRACKED IT!
                </motion.p>
              ) : (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-500 text-sm"
                >
                  Keep trying!
                </motion.p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Fixed input area at bottom */}
      <div className="game-input-area">
        <AnimatePresence mode="wait">
          {isMyTurn ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <Card className="mb-3 p-4" animate={false}>
                <DigitDisplay digits={digits} />
                
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xs text-center mt-2 font-medium"
                  >
                    ⚠️ {error}
                  </motion.p>
                )}
              </Card>
              
              <Keypad
                onDigitPress={handleDigitPress}
                onDelete={handleDelete}
                onSubmit={handleSubmit}
                disabledDigits={getUsedDigits(digits)}
                canSubmit={digits.length === 4 && !loading}
              />
            </motion.div>
          ) : (
            <motion.div
              key="waiting"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <Card className="text-center py-8">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-4xl mb-3"
                >
                  🤔
                </motion.div>
                <p className="text-gray-600 font-medium text-sm mb-2">
                  {otherPlayer?.name || 'Opponent'} is thinking...
                </p>
                <div className="flex justify-center gap-1.5">
                  <span className="waiting-dot"></span>
                  <span className="waiting-dot"></span>
                  <span className="waiting-dot"></span>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Game

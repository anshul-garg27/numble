import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Card from '../components/Card'
import DigitDisplay from '../components/DigitDisplay'
import Keypad from '../components/Keypad'
import Header from '../components/Header'
import { Lock, Check, Eye, EyeOff } from 'lucide-react'
import { 
  setPlayerSecret, 
  subscribeToRoom, 
  checkAndStartGame 
} from '../firebase/gameService'
import { validateNumber, getUsedDigits, hapticFeedback } from '../utils/gameLogic'

const SetSecret = () => {
  const navigate = useNavigate()
  const { roomCode } = useParams()
  
  const [digits, setDigits] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [roomData, setRoomData] = useState(null)
  const [showSecret, setShowSecret] = useState(false)
  
  const playerId = localStorage.getItem('numble_player_id')
  
  useEffect(() => {
    const unsubscribe = subscribeToRoom(roomCode, (data) => {
      setRoomData(data)
      
      const player = data.players?.[playerId]
      if (player?.ready && player?.secret) {
        setSubmitted(true)
        setDigits(player.secret)
      }
      
      if (data.status === 'playing') {
        navigate(`/game/${roomCode}`)
      }
    })
    
    return () => unsubscribe()
  }, [roomCode, playerId, navigate])
  
  const handleDigitPress = (digit) => {
    if (digits.length < 4 && !digits.includes(digit)) {
      setDigits(prev => prev + digit)
      setError('')
    } else if (digits.includes(digit)) {
      setError('Digit already used!')
      hapticFeedback('error')
    }
  }
  
  const handleDelete = () => {
    setDigits(prev => prev.slice(0, -1))
    setError('')
  }
  
  const handleSubmit = async () => {
    const validation = validateNumber(digits)
    if (!validation.valid) {
      setError(validation.error)
      hapticFeedback('error')
      return
    }
    
    try {
      await setPlayerSecret(roomCode, playerId, digits)
      setSubmitted(true)
      hapticFeedback('success')
      
      await checkAndStartGame(roomCode)
    } catch (err) {
      console.error('Set secret error:', err)
      setError('Failed to save. Try again.')
    }
  }
  
  const players = roomData?.players ? Object.values(roomData.players) : []
  const otherPlayer = players.find(p => p.id !== playerId)
  const otherPlayerReady = otherPlayer?.ready
  
  if (submitted) {
    return (
      <div className="min-h-screen min-h-[100dvh] flex flex-col px-5 py-4 page-container safe-top safe-bottom">
        <Header roomCode={roomCode} partnerName={otherPlayer?.name} />
        
        <div className="flex-1 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="relative mb-6"
          >
            <div className="text-6xl">🔒</div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-0.5"
            >
              <Check size={16} />
            </motion.div>
          </motion.div>
          
          <Card className="w-full max-w-xs text-center mb-5 p-5">
            <h2 className="font-heading font-bold text-xl text-gray-900 mb-5">
              Secret Saved! ✨
            </h2>
            
            <div className="relative mb-3">
              <DigitDisplay digits={digits} hidden={!showSecret} />
              <button
                onClick={() => setShowSecret(!showSecret)}
                className="absolute -right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              >
                {showSecret ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            
            <p className="text-gray-500 text-xs">
              Your secret number is safe
            </p>
          </Card>
          
          <Card className="w-full max-w-xs p-4">
            <div className="flex items-center gap-3">
              <motion.div
                animate={otherPlayerReady ? {} : { rotate: 360 }}
                transition={{ duration: 2, repeat: otherPlayerReady ? 0 : Infinity, ease: 'linear' }}
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center text-xl
                  ${otherPlayerReady 
                    ? 'bg-gradient-to-br from-green-400 to-green-600' 
                    : 'bg-gray-200'
                  }
                `}
              >
                {otherPlayerReady ? '✅' : '⏳'}
              </motion.div>
              <div className="flex-1">
                <p className="font-heading font-bold text-gray-900 text-sm">
                  {otherPlayer?.name || 'Opponent'}
                </p>
                <p className="text-xs text-gray-500">
                  {otherPlayerReady ? 'Ready to play!' : 'Setting their secret...'}
                </p>
              </div>
              {!otherPlayerReady && (
                <div className="flex gap-1.5">
                  <span className="waiting-dot"></span>
                  <span className="waiting-dot"></span>
                  <span className="waiting-dot"></span>
                </div>
              )}
            </div>
          </Card>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-gray-500 text-xs text-center"
          >
            {otherPlayerReady 
              ? '🎮 Starting game...' 
              : 'Waiting for opponent to set their secret...'
            }
          </motion.p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col px-5 py-4 page-container safe-top safe-bottom">
      <Header roomCode={roomCode} partnerName={otherPlayer?.name} />
      
      <div className="flex-1 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <motion.div
            animate={{ rotate: [0, -8, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-5xl mb-3"
          >
            🔐
          </motion.div>
          <h1 className="font-heading font-bold text-2xl text-gray-900 mb-1">
            Your Secret Number
          </h1>
          <p className="text-gray-600 text-sm">
            Pick 4 unique digits (1-9)
          </p>
        </motion.div>
        
        <Card className="w-full max-w-xs mb-5 p-4">
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
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-2 mt-3 text-gray-400 text-xs"
          >
            <Lock size={12} />
            <span>Don't let your opponent see!</span>
          </motion.div>
        </Card>
        
        <Keypad
          onDigitPress={handleDigitPress}
          onDelete={handleDelete}
          onSubmit={handleSubmit}
          disabledDigits={getUsedDigits(digits)}
          canSubmit={digits.length === 4}
        />
      </div>
    </div>
  )
}

export default SetSecret

import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import Button from '../components/Button'
import Card from '../components/Card'
import { getRoomData } from '../firebase/gameService'
import { hapticFeedback } from '../utils/gameLogic'

const Win = () => {
  const navigate = useNavigate()
  const { roomCode } = useParams()
  const [roomData, setRoomData] = useState(null)
  
  const playerId = localStorage.getItem('numble_player_id')
  
  useEffect(() => {
    const loadData = async () => {
      const data = await getRoomData(roomCode)
      setRoomData(data)
    }
    loadData()
  }, [roomCode])
  
  // Trigger confetti for winner
  useEffect(() => {
    if (roomData?.winner === playerId) {
      hapticFeedback('success')
      
      // Initial burst
      const burst = () => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F97316', '#22C55E', '#3B82F6', '#8B5CF6', '#EC4899']
        })
      }
      
      burst()
      
      // Continuous confetti
      const duration = 3000
      const end = Date.now() + duration
      
      const frame = () => {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#F97316', '#22C55E', '#3B82F6']
        })
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#F97316', '#22C55E', '#3B82F6']
        })
        
        if (Date.now() < end) {
          requestAnimationFrame(frame)
        }
      }
      
      setTimeout(frame, 500)
    }
  }, [roomData, playerId])
  
  if (!roomData) {
    return (
      <div className="min-h-screen min-h-[100dvh] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="text-3xl"
        >
          ⏳
        </motion.div>
      </div>
    )
  }
  
  const players = Object.values(roomData.players || {})
  const winner = players.find(p => p.id === roomData.winner)
  const loser = players.find(p => p.id !== roomData.winner)
  const isWinner = roomData.winner === playerId
  
  const guesses = roomData.guesses ? Object.values(roomData.guesses) : []
  const winnerGuesses = guesses.filter(g => g.playerId === winner?.id).length
  const loserGuesses = guesses.filter(g => g.playerId === loser?.id).length
  
  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col items-center justify-center px-5 py-10 page-container safe-top safe-bottom">
      {/* Trophy Animation */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="relative mb-6"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.08, 1],
            rotate: [0, -3, 3, 0]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-7xl"
        >
          {isWinner ? '🏆' : '💪'}
        </motion.div>
        
        {/* Glow effect */}
        {isWinner && (
          <motion.div
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.4, 0, 0.4]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-yellow-400 blur-3xl -z-10"
          />
        )}
      </motion.div>
      
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, type: 'spring' }}
        className={`font-heading text-4xl font-extrabold mb-2 ${
          isWinner ? 'gradient-text' : 'text-gray-700'
        }`}
      >
        {isWinner ? 'YOU WON!' : 'Nice Try!'}
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-gray-600 text-base mb-8 text-center"
      >
        {isWinner 
          ? `Cracked the code in ${winnerGuesses} guesses!`
          : `${winner?.name} cracked your code first`
        }
      </motion.p>
      
      {/* Score Card */}
      <Card className="w-full max-w-xs mb-6 p-5" delay={0.3}>
        <h3 className="font-heading font-bold text-gray-500 text-center mb-5 text-xs uppercase tracking-wider">
          🎮 Game Results
        </h3>
        
        <div className="space-y-3">
          {/* Winner */}
          <motion.div 
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={`
              flex items-center gap-3 p-3.5 rounded-xl
              ${isWinner 
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200' 
                : 'bg-gray-50'
              }
            `}
          >
            <div className="text-2xl">🏆</div>
            <div className="flex-1">
              <p className="font-heading font-bold text-gray-900 text-sm">
                {winner?.name} {winner?.id === playerId ? '(You)' : ''}
              </p>
              <p className="text-xs text-green-600 font-medium">Winner!</p>
            </div>
            <div className="text-right">
              <p className="font-heading font-bold text-2xl text-green-600">{winnerGuesses}</p>
              <p className="text-xs text-gray-500">guesses</p>
            </div>
          </motion.div>
          
          {/* Loser */}
          <motion.div 
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className={`
              flex items-center gap-3 p-3.5 rounded-xl
              ${!isWinner 
                ? 'bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200' 
                : 'bg-gray-50'
              }
            `}
          >
            <div className="text-2xl">💪</div>
            <div className="flex-1">
              <p className="font-heading font-bold text-gray-900 text-sm">
                {loser?.name} {loser?.id === playerId ? '(You)' : ''}
              </p>
              <p className="text-xs text-gray-500">Good game!</p>
            </div>
            <div className="text-right">
              <p className="font-heading font-bold text-2xl text-gray-600">{loserGuesses}</p>
              <p className="text-xs text-gray-500">guesses</p>
            </div>
          </motion.div>
        </div>
      </Card>
      
      {/* Secret Numbers Reveal - Enhanced */}
      <Card className="w-full max-w-xs mb-6 p-5" delay={0.5}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center justify-center gap-2 mb-5">
            <span className="text-lg">🔓</span>
            <h3 className="font-heading font-bold text-gray-700 text-xs uppercase tracking-wider">
              Secret Numbers Revealed
            </h3>
          </div>
          
          <div className="space-y-4">
            {/* Winner's Secret */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🏆</span>
                  <span className="font-heading font-bold text-gray-800 text-sm">{winner?.name}</span>
                </div>
                <span className="text-xs text-green-600 font-medium bg-green-100 px-2 py-0.5 rounded-full">Winner</span>
              </div>
              <div className="flex justify-center gap-2">
                {winner?.secret.split('').map((d, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0, rotateY: 180 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    transition={{ 
                      delay: 0.9 + (i * 0.1),
                      type: 'spring',
                      stiffness: 300
                    }}
                    className="w-12 h-14 rounded-xl bg-white flex items-center justify-center font-heading font-bold text-xl text-green-600 shadow-md border-2 border-green-200"
                  >
                    {d}
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            {/* Loser's Secret */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
              className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">💪</span>
                  <span className="font-heading font-bold text-gray-800 text-sm">{loser?.name}</span>
                </div>
                <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded-full">Good try</span>
              </div>
              <div className="flex justify-center gap-2">
                {loser?.secret.split('').map((d, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0, rotateY: 180 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    transition={{ 
                      delay: 1.1 + (i * 0.1),
                      type: 'spring',
                      stiffness: 300
                    }}
                    className="w-12 h-14 rounded-xl bg-white flex items-center justify-center font-heading font-bold text-xl text-orange-600 shadow-md border-2 border-orange-200"
                  >
                    {d}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </Card>
      
      {/* Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
        className="w-full max-w-xs space-y-2.5"
      >
        <Button fullWidth icon="🎮" onClick={() => navigate('/create')}>
          PLAY AGAIN
        </Button>
        
        <Button 
          fullWidth 
          variant="secondary" 
          icon="🏠"
          onClick={() => navigate('/')}
        >
          HOME
        </Button>
      </motion.div>
      
      {/* Fun Message */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="mt-8 text-gray-500 text-sm"
      >
        {isWinner ? '🎉 Great job, code breaker!' : '💪 You\'ll get them next time!'}
      </motion.p>
    </div>
  )
}

export default Win

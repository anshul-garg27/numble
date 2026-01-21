import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '../components/Button'
import Card from '../components/Card'
import Input from '../components/Input'
import Header from '../components/Header'
import { joinRoom } from '../firebase/gameService'
import { hapticFeedback } from '../utils/gameLogic'

const JoinRoom = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
  const [name, setName] = useState('')
  const [roomCode, setRoomCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Pre-fill room code from URL if present
  useEffect(() => {
    const codeFromUrl = searchParams.get('code')
    if (codeFromUrl) {
      setRoomCode(codeFromUrl.toUpperCase())
    }
  }, [searchParams])
  
  const handleJoin = async () => {
    if (!name.trim()) {
      setError('Please enter your name')
      hapticFeedback('error')
      return
    }
    
    if (!roomCode.trim()) {
      setError('Please enter room code')
      hapticFeedback('error')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      const { playerId } = await joinRoom(roomCode.trim().toUpperCase(), name.trim())
      localStorage.setItem('numble_player_id', playerId)
      hapticFeedback('success')
      navigate(`/secret/${roomCode.trim().toUpperCase()}`)
    } catch (err) {
      console.error('Join room error:', err)
      setError(err.message || 'Failed to join. Check the code.')
      hapticFeedback('error')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col px-5 py-4 page-container safe-top safe-bottom">
      <Header showBack title="Join Game" />
      
      <div className="flex-1 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-5xl mb-3"
          >
            🔗
          </motion.div>
          <h1 className="font-heading font-bold text-2xl text-gray-900 mb-1">
            Join a Game
          </h1>
          <p className="text-gray-500 text-sm">
            Enter the room code from your friend
          </p>
        </motion.div>
        
        <Card className="w-full max-w-xs p-5" delay={0.1}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">
                Your Name
              </label>
              <Input
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  setError('')
                }}
                placeholder="Enter your name"
                maxLength={20}
                autoFocus={!roomCode}
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">
                Room Code
              </label>
              <Input
                value={roomCode}
                onChange={(e) => {
                  setRoomCode(e.target.value.toUpperCase())
                  setError('')
                }}
                placeholder="ABCD-1234"
                maxLength={9}
                className="font-heading tracking-wider text-center"
                autoFocus={!!roomCode}
                onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
              />
            </div>
            
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-xs text-center"
              >
                ⚠️ {error}
              </motion.p>
            )}
            
            <Button 
              fullWidth 
              onClick={handleJoin}
              disabled={loading}
              icon={loading ? '⏳' : '🎯'}
            >
              {loading ? 'Joining...' : 'JOIN GAME'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default JoinRoom

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '../components/Button'
import Card from '../components/Card'
import Input from '../components/Input'
import Header from '../components/Header'
import { createRoom } from '../firebase/gameService'
import { hapticFeedback } from '../utils/gameLogic'

const CreateRoom = () => {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const handleCreate = async () => {
    if (!name.trim()) {
      setError('Please enter your name')
      hapticFeedback('error')
      return
    }
    
    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters')
      hapticFeedback('error')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      const { roomCode, playerId } = await createRoom(name.trim())
      localStorage.setItem('numble_player_id', playerId)
      hapticFeedback('success')
      navigate(`/lobby/${roomCode}`)
    } catch (err) {
      console.error('Create room error:', err)
      setError('Failed to create room. Try again.')
      hapticFeedback('error')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col px-5 py-4 page-container safe-top safe-bottom">
      <Header showBack title="Create Game" />
      
      <div className="flex-1 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-5xl mb-3"
          >
            🎮
          </motion.div>
          <h1 className="font-heading font-bold text-2xl text-gray-900 mb-1">
            Start a New Game
          </h1>
          <p className="text-gray-500 text-sm">
            Enter your name to create a room
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
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              />
              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-xs mt-2"
                >
                  ⚠️ {error}
                </motion.p>
              )}
            </div>
            
            <Button 
              fullWidth 
              onClick={handleCreate}
              disabled={loading}
              icon={loading ? '⏳' : '🚀'}
            >
              {loading ? 'Creating...' : 'CREATE ROOM'}
            </Button>
          </div>
        </Card>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-gray-400 text-xs text-center"
        >
          Share the room code with your friend
        </motion.p>
      </div>
    </div>
  )
}

export default CreateRoom

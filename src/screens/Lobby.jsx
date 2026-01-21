import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Share2, Check, Users } from 'lucide-react'
import Button from '../components/Button'
import Card from '../components/Card'
import Header from '../components/Header'
import { subscribeToRoom } from '../firebase/gameService'
import { getShareableLink, copyToClipboard, hapticFeedback } from '../utils/gameLogic'

const Lobby = () => {
  const navigate = useNavigate()
  const { roomCode } = useParams()
  const [roomData, setRoomData] = useState(null)
  const [copied, setCopied] = useState(false)
  
  const playerId = localStorage.getItem('numble_player_id')
  
  useEffect(() => {
    const unsubscribe = subscribeToRoom(roomCode, (data) => {
      setRoomData(data)
      
      if (data.status === 'ready' || data.status === 'playing') {
        navigate(`/secret/${roomCode}`)
      }
    })
    
    return () => unsubscribe()
  }, [roomCode, navigate])
  
  const handleCopyCode = async () => {
    const success = await copyToClipboard(roomCode)
    if (success) {
      setCopied(true)
      hapticFeedback('success')
      setTimeout(() => setCopied(false), 2000)
    }
  }
  
  const handleShare = async () => {
    const link = getShareableLink(roomCode)
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'NUMBLE - Crack the Code!',
          text: `Join my NUMBLE game! Room: ${roomCode}`,
          url: link
        })
        hapticFeedback('success')
      } catch (err) {
        if (err.name !== 'AbortError') {
          handleCopyCode()
        }
      }
    } else {
      const success = await copyToClipboard(link)
      if (success) {
        setCopied(true)
        hapticFeedback('success')
        setTimeout(() => setCopied(false), 2000)
      }
    }
  }
  
  const players = roomData?.players ? Object.values(roomData.players) : []
  const currentPlayer = players.find(p => p.id === playerId)
  const otherPlayer = players.find(p => p.id !== playerId)
  
  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col px-5 py-4 page-container safe-top safe-bottom">
      <Header showBack title="Waiting Room" />
      
      <div className="flex-1 flex flex-col items-center justify-center py-6">
        {/* Room Code Display */}
        <Card className="w-full max-w-xs text-center mb-5 p-5" delay={0.1}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="text-4xl mb-3"
          >
            🏠
          </motion.div>
          
          <p className="text-gray-500 text-xs font-medium mb-3 uppercase tracking-wider">
            Room Code
          </p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center gap-1 mb-5"
          >
            {roomCode.split('').map((char, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20, rotateX: -90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: 0.3 + (i * 0.04), type: 'spring' }}
                className={`room-code-box ${
                  char === '-' ? 'dash' : 
                  /[A-Z]/.test(char) ? 'letter' : 'number'
                }`}
              >
                {char}
              </motion.div>
            ))}
          </motion.div>
          
          <div className="flex gap-2.5">
            <Button
              variant="secondary"
              size="small"
              className="flex-1"
              onClick={handleCopyCode}
              icon={copied ? <Check size={16} /> : <Copy size={16} />}
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
            
            <Button
              variant="primary"
              size="small"
              className="flex-1"
              onClick={handleShare}
              icon={<Share2 size={16} />}
            >
              Share
            </Button>
          </div>
        </Card>
        
        {/* Players List */}
        <Card className="w-full max-w-xs p-4" delay={0.2}>
          <div className="flex items-center gap-2 mb-3">
            <Users size={16} className="text-orange-500" />
            <h3 className="font-heading font-bold text-gray-800 text-sm">Players</h3>
          </div>
          
          <div className="space-y-2.5">
            {/* Current Player */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200"
            >
              <motion.div 
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-xl shadow-md"
              >
                😊
              </motion.div>
              <div className="flex-1">
                <p className="font-heading font-bold text-gray-900 text-sm">
                  {currentPlayer?.name || 'You'}
                </p>
                <p className="text-xs text-gray-500">You • Host</p>
              </div>
              <div className="flex items-center gap-1 text-green-600 font-bold text-xs bg-green-100 px-2.5 py-1 rounded-full">
                <Check size={12} />
                Ready
              </div>
            </motion.div>
            
            {/* Other Player / Waiting */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className={`
                flex items-center gap-3 p-3 rounded-xl border transition-all duration-500
                ${otherPlayer 
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
                  : 'bg-gray-50 border-gray-200 border-dashed'
                }
              `}
            >
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center text-xl
                ${otherPlayer 
                  ? 'bg-gradient-to-br from-green-400 to-green-600 shadow-md' 
                  : 'bg-gray-200'
                }
              `}>
                {otherPlayer ? '😊' : '👤'}
              </div>
              <div className="flex-1">
                <p className="font-heading font-bold text-gray-900 text-sm">
                  {otherPlayer?.name || 'Waiting for player...'}
                </p>
                <p className="text-xs text-gray-500">
                  {otherPlayer ? 'Player 2' : 'Share the code!'}
                </p>
              </div>
              
              <AnimatePresence mode="wait">
                {!otherPlayer ? (
                  <motion.div 
                    key="waiting"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex gap-1.5"
                  >
                    <span className="waiting-dot"></span>
                    <span className="waiting-dot"></span>
                    <span className="waiting-dot"></span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="joined"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-1 text-green-600 font-bold text-xs bg-green-100 px-2.5 py-1 rounded-full"
                  >
                    <Check size={12} />
                    Joined
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </Card>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-gray-500 text-xs text-center flex items-center gap-2"
        >
          <span>Share the room code with your friend!</span>
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            🎮
          </motion.span>
        </motion.p>
      </div>
    </div>
  )
}

export default Lobby

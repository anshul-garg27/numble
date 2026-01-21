import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '../components/Button'
import Card from '../components/Card'

const Home = () => {
  const navigate = useNavigate()
  
  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col items-center justify-center px-5 py-10 page-container safe-top safe-bottom">
      {/* Floating decorations */}
      <motion.div 
        className="absolute top-20 left-8 text-3xl opacity-15 float-animation"
        style={{ animationDelay: '0s' }}
      >
        🎯
      </motion.div>
      <motion.div 
        className="absolute top-36 right-6 text-2xl opacity-15 float-animation"
        style={{ animationDelay: '1s' }}
      >
        🔢
      </motion.div>
      <motion.div 
        className="absolute bottom-28 left-10 text-2xl opacity-15 float-animation"
        style={{ animationDelay: '2s' }}
      >
        🧠
      </motion.div>
      
      {/* Logo & Title */}
      <motion.div
        initial={{ opacity: 0, y: -30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
        className="text-center mb-10"
      >
        <motion.div 
          className="text-6xl mb-5"
          animate={{ 
            rotate: [0, -3, 3, -3, 0],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          🔢
        </motion.div>
        
        <h1 className="font-heading text-5xl font-extrabold gradient-text tracking-tight mb-2">
          NUMBLE
        </h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-600 font-medium text-base"
        >
          Crack the secret code
        </motion.p>
      </motion.div>
      
      {/* Action Cards */}
      <div className="w-full max-w-xs space-y-3">
        <Card delay={0.15} hover className="p-4">
          <Button 
            fullWidth 
            icon="🎮"
            onClick={() => navigate('/create')}
          >
            CREATE GAME
          </Button>
          <p className="text-center text-xs text-gray-500 mt-2.5">
            Start a new room & invite a friend
          </p>
        </Card>
        
        <Card delay={0.25} hover className="p-4">
          <Button 
            fullWidth 
            variant="secondary"
            icon="🔗"
            onClick={() => navigate('/join')}
          >
            JOIN GAME
          </Button>
          <p className="text-center text-xs text-gray-500 mt-2.5">
            Enter room code to join
          </p>
        </Card>
      </div>
      
      {/* How to Play */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        onClick={() => navigate('/how-to-play')}
        className="mt-8 px-5 py-2.5 rounded-full bg-white/60 backdrop-blur text-gray-600 font-medium text-sm hover:bg-white/90 hover:text-orange-600 transition-all duration-300 flex items-center gap-2"
      >
        <span>❓</span>
        <span>How to Play</span>
      </motion.button>
      
      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-auto pt-10 text-center"
      >
        <p className="text-gray-400 text-xs">
          Challenge your friends 🎯
        </p>
      </motion.div>
    </div>
  )
}

export default Home

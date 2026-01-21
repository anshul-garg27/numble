import { motion } from 'framer-motion'
import { ArrowLeft, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Header = ({ 
  showBack = false, 
  onBack,
  title,
  roomCode, 
  partnerName 
}) => {
  const navigate = useNavigate()
  
  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      navigate(-1)
    }
  }
  
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between py-2 mb-2"
    >
      {/* Left Side */}
      <div className="flex items-center gap-2">
        {showBack && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleBack}
            className="p-2 -ml-2 rounded-full hover:bg-white/50 transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </motion.button>
        )}
        
        {roomCode && (
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/60 backdrop-blur rounded-lg">
            <span className="text-xs">🏠</span>
            <span className="font-heading font-bold text-xs text-gray-700">
              {roomCode}
            </span>
          </div>
        )}
        
        {title && !roomCode && (
          <h1 className="font-heading font-bold text-lg text-gray-900">
            {title}
          </h1>
        )}
      </div>
      
      {/* Right Side */}
      {partnerName && (
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/60 backdrop-blur rounded-lg">
          <User size={14} className="text-gray-500" />
          <span className="font-medium text-xs text-gray-700">
            {partnerName}
          </span>
        </div>
      )}
    </motion.header>
  )
}

export default Header

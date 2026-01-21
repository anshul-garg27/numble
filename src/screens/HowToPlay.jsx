import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Card from '../components/Card'
import Button from '../components/Button'

const HowToPlay = () => {
  const navigate = useNavigate()
  
  const steps = [
    {
      icon: '🔢',
      title: 'Pick Your Secret',
      description: 'Choose a 4-digit number using digits 1-9. Each digit must be unique!'
    },
    {
      icon: '🤔',
      title: 'Take Turns Guessing',
      description: 'Try to guess your opponent\'s secret number. They\'ll do the same to yours.'
    },
    {
      icon: '🎯',
      title: 'Match = Digit Exists',
      description: 'Match shows how many of your guessed digits exist in the secret (any position).',
      highlight: 'green'
    },
    {
      icon: '📍',
      title: 'Position = Correct Place',
      description: 'Position shows how many digits are in the exact correct position.',
      highlight: 'blue'
    },
    {
      icon: '🏆',
      title: 'Get 4 Positions to Win!',
      description: 'The first player to get 4 Positions (all correct places) wins!'
    }
  ]
  
  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col px-5 py-4 page-container safe-top safe-bottom">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className="p-2 rounded-full bg-white/60 backdrop-blur hover:bg-white/90 transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-700" />
        </motion.button>
        <h1 className="font-heading font-bold text-xl text-gray-900">
          How to Play
        </h1>
      </div>
      
      {/* Steps */}
      <div className="flex-1 space-y-3 mb-6">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className={`p-4 ${
                step.highlight === 'green' ? 'border-l-4 border-l-green-500' :
                step.highlight === 'blue' ? 'border-l-4 border-l-blue-500' : ''
              }`}
              animate={false}
            >
              <div className="flex gap-3">
                <div className="text-3xl flex-shrink-0">{step.icon}</div>
                <div className="flex-1">
                  <h3 className="font-heading font-bold text-gray-900 text-sm mb-1">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {/* Example */}
      <Card className="mb-6 p-4" delay={0.5}>
        <h3 className="font-heading font-bold text-gray-700 text-xs uppercase tracking-wider mb-3">
          Example
        </h3>
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs text-gray-500">Secret:</span>
              <div className="flex gap-1 mt-1">
                {['1', '2', '3', '4'].map((d, i) => (
                  <span key={i} className="w-7 h-8 rounded bg-gray-200 flex items-center justify-center font-heading font-bold text-sm text-gray-700">
                    {d}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-xs text-gray-500">Guess:</span>
              <div className="flex gap-1 mt-1">
                {['1', '2', '4', '3'].map((d, i) => (
                  <span key={i} className="w-7 h-8 rounded bg-orange-100 flex items-center justify-center font-heading font-bold text-sm text-orange-700">
                    {d}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-center gap-6 mb-2">
              <div className="text-center">
                <div className="badge-match mb-1">
                  <span>🎯</span>
                  <span>4</span>
                </div>
                <p className="text-xs text-gray-500">Match</p>
                <p className="text-xs text-gray-400">All 4 exist</p>
              </div>
              <div className="text-center">
                <div className="badge-position mb-1">
                  <span>📍</span>
                  <span>2</span>
                </div>
                <p className="text-xs text-gray-500">Position</p>
                <p className="text-xs text-gray-400">1,2 correct</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 text-center">
              1,2,3,4 all exist → 4 Match | 1,2 in right place → 2 Position
            </p>
          </div>
        </div>
      </Card>
      
      {/* Play Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Button fullWidth icon="🎮" onClick={() => navigate('/')}>
          GOT IT!
        </Button>
      </motion.div>
    </div>
  )
}

export default HowToPlay

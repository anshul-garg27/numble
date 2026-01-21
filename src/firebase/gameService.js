import { database } from './config'
import { 
  ref, 
  set, 
  get, 
  push, 
  update, 
  onValue, 
  off,
  serverTimestamp,
  remove
} from 'firebase/database'

// Generate random room code (e.g., "ABCD-1234")
export const generateRoomCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const nums = '0123456789'
  let code = ''
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  code += '-'
  for (let i = 0; i < 4; i++) {
    code += nums.charAt(Math.floor(Math.random() * nums.length))
  }
  return code
}

// Generate player ID
export const generatePlayerId = () => {
  return 'player_' + Math.random().toString(36).substr(2, 9)
}

// Create a new game room
export const createRoom = async (playerName) => {
  const roomCode = generateRoomCode()
  const playerId = generatePlayerId()
  const roomRef = ref(database, `rooms/${roomCode}`)
  
  await set(roomRef, {
    code: roomCode,
    status: 'waiting', // waiting, ready, playing, finished
    createdAt: serverTimestamp(),
    currentTurn: null,
    winner: null,
    players: {
      [playerId]: {
        id: playerId,
        name: playerName,
        isHost: true,
        secret: null,
        ready: false,
        guessCount: 0
      }
    },
    guesses: {}
  })
  
  return { roomCode, playerId }
}

// Join an existing room
export const joinRoom = async (roomCode, playerName) => {
  const roomRef = ref(database, `rooms/${roomCode}`)
  const snapshot = await get(roomRef)
  
  if (!snapshot.exists()) {
    throw new Error('Room not found')
  }
  
  const roomData = snapshot.val()
  
  if (roomData.status !== 'waiting') {
    throw new Error('Game already started')
  }
  
  const playerCount = Object.keys(roomData.players || {}).length
  if (playerCount >= 2) {
    throw new Error('Room is full')
  }
  
  const playerId = generatePlayerId()
  
  // Add player to room
  const playerRef = ref(database, `rooms/${roomCode}/players/${playerId}`)
  await set(playerRef, {
    id: playerId,
    name: playerName,
    isHost: false,
    secret: null,
    ready: false,
    guessCount: 0
  })
  
  // Update room status to ready
  await update(ref(database, `rooms/${roomCode}`), {
    status: 'ready'
  })
  
  return { playerId, roomData }
}

// Set player's secret number
export const setPlayerSecret = async (roomCode, playerId, secret) => {
  const playerRef = ref(database, `rooms/${roomCode}/players/${playerId}`)
  await update(playerRef, {
    secret: secret,
    ready: true
  })
}

// Check if both players are ready and start game
export const checkAndStartGame = async (roomCode) => {
  const roomRef = ref(database, `rooms/${roomCode}`)
  const snapshot = await get(roomRef)
  
  if (!snapshot.exists()) return false
  
  const roomData = snapshot.val()
  const players = Object.values(roomData.players || {})
  
  if (players.length === 2 && players.every(p => p.ready)) {
    // Both ready, start game
    const hostPlayer = players.find(p => p.isHost)
    await update(roomRef, {
      status: 'playing',
      currentTurn: hostPlayer.id
    })
    return true
  }
  
  return false
}

// Submit a guess
// bulls = match (digits that exist), cows = position (correct position)
export const submitGuess = async (roomCode, playerId, guess, bulls, cows) => {
  const roomRef = ref(database, `rooms/${roomCode}`)
  const snapshot = await get(roomRef)
  
  if (!snapshot.exists()) throw new Error('Room not found')
  
  const roomData = snapshot.val()
  
  // Add guess to history
  const guessRef = push(ref(database, `rooms/${roomCode}/guesses`))
  await set(guessRef, {
    playerId,
    guess,
    bulls,  // match (digits exist)
    cows,   // position (correct position)
    timestamp: serverTimestamp()
  })
  
  // Update guess count
  const players = Object.values(roomData.players || {})
  const currentPlayer = players.find(p => p.id === playerId)
  await update(ref(database, `rooms/${roomCode}/players/${playerId}`), {
    guessCount: (currentPlayer?.guessCount || 0) + 1
  })
  
  // Check for win (cows = 4 means all 4 positions correct)
  if (cows === 4) {
    await update(roomRef, {
      status: 'finished',
      winner: playerId
    })
    return { won: true }
  }
  
  // Switch turn to other player
  const otherPlayer = players.find(p => p.id !== playerId)
  await update(roomRef, {
    currentTurn: otherPlayer.id
  })
  
  return { won: false }
}

// Subscribe to room updates
export const subscribeToRoom = (roomCode, callback) => {
  const roomRef = ref(database, `rooms/${roomCode}`)
  onValue(roomRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val())
    }
  })
  
  // Return unsubscribe function
  return () => off(roomRef)
}

// Get room data once
export const getRoomData = async (roomCode) => {
  const roomRef = ref(database, `rooms/${roomCode}`)
  const snapshot = await get(roomRef)
  
  if (!snapshot.exists()) {
    return null
  }
  
  return snapshot.val()
}

// Leave room / cleanup
export const leaveRoom = async (roomCode, playerId) => {
  try {
    const roomRef = ref(database, `rooms/${roomCode}`)
    const snapshot = await get(roomRef)
    
    if (!snapshot.exists()) return
    
    const roomData = snapshot.val()
    const players = Object.keys(roomData.players || {})
    
    if (players.length <= 1) {
      // Last player, delete room
      await remove(roomRef)
    } else {
      // Remove player
      await remove(ref(database, `rooms/${roomCode}/players/${playerId}`))
    }
  } catch (error) {
    console.error('Error leaving room:', error)
  }
}

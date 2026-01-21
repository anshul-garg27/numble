/**
 * Calculate Match and Position for a guess
 * 
 * Match = digit exists in secret (position doesn't matter)
 * Position = digit exists AND is in correct position
 * 
 * @param {string} secret - The secret number (e.g., "1234")
 * @param {string} guess - The guessed number (e.g., "1235")
 * @returns {{ bulls: number, cows: number }}
 */
export const calculateBullsCows = (secret, guess) => {
  let match = 0      // Digits that exist in secret (regardless of position)
  let position = 0   // Digits in correct position
  
  const secretArr = secret.split('')
  const guessArr = guess.split('')
  const secretSet = new Set(secretArr)
  
  for (let i = 0; i < 4; i++) {
    // Check if digit exists in secret (Match)
    if (secretSet.has(guessArr[i])) {
      match++
    }
    
    // Check if digit is in correct position (Position)
    if (guessArr[i] === secretArr[i]) {
      position++
    }
  }
  
  // Return: bulls = match (digits exist), cows = position (correct position)
  return { 
    bulls: match,     // How many digits exist in secret
    cows: position    // How many are in correct position
  }
}

/**
 * Validate a 4-digit number
 * - Must be exactly 4 digits
 * - Digits must be 1-9 (no zeros)
 * - All digits must be unique
 * 
 * @param {string} number - The number to validate
 * @returns {{ valid: boolean, error?: string }}
 */
export const validateNumber = (number) => {
  if (!number || number.length !== 4) {
    return { valid: false, error: 'Must be 4 digits' }
  }
  
  const digits = number.split('')
  
  // Check for zeros
  if (digits.includes('0')) {
    return { valid: false, error: 'Digits must be 1-9' }
  }
  
  // Check for non-digits
  if (!/^[1-9]{4}$/.test(number)) {
    return { valid: false, error: 'Only digits 1-9 allowed' }
  }
  
  // Check for duplicates
  const uniqueDigits = new Set(digits)
  if (uniqueDigits.size !== 4) {
    return { valid: false, error: 'All digits must be different' }
  }
  
  return { valid: true }
}

/**
 * Get list of used digits from a number
 * @param {string} number 
 * @returns {string[]}
 */
export const getUsedDigits = (number) => {
  return number.split('')
}

/**
 * Check if a digit is already used
 * @param {string} digit 
 * @param {string} currentNumber 
 * @returns {boolean}
 */
export const isDigitUsed = (digit, currentNumber) => {
  return currentNumber.includes(digit)
}

/**
 * Format room code for display
 * @param {string} code 
 * @returns {string}
 */
export const formatRoomCode = (code) => {
  return code.toUpperCase()
}

/**
 * Generate shareable link
 * @param {string} roomCode 
 * @returns {string}
 */
export const getShareableLink = (roomCode) => {
  const baseUrl = window.location.origin
  return `${baseUrl}/join?code=${roomCode}`
}

/**
 * Copy text to clipboard
 * @param {string} text 
 * @returns {Promise<boolean>}
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    // Fallback for older browsers
    try {
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      return true
    } catch (e) {
      console.error('Copy failed:', e)
      return false
    }
  }
}

/**
 * Trigger haptic feedback (for supported devices)
 * @param {string} type - 'light', 'medium', 'heavy'
 */
export const hapticFeedback = (type = 'light') => {
  if ('vibrate' in navigator) {
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30],
      success: [50, 50, 50],
      error: [100, 50, 100]
    }
    navigator.vibrate(patterns[type] || patterns.light)
  }
}

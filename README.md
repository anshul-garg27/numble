# 🔢 NUMBLE - Crack the Code

A fun multiplayer number guessing game built with React + Firebase!

## 🎮 How to Play

1. **Pick Your Secret**: Choose a 4-digit number (1-9, all unique)
2. **Take Turns**: Guess your opponent's number
3. **Get Feedback**:
   - 🎯 **Bulls** = Correct digit in correct position
   - ⭕ **Cows** = Correct digit in wrong position
4. **Win**: First to get 4 Bulls wins!

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd numble
npm install
```

### 2. Setup Firebase

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project (or use existing)
3. Enable **Realtime Database**:
   - Go to Build → Realtime Database → Create Database
   - Start in **test mode** (for development)
4. Get your config:
   - Go to Project Settings → General → Your apps → Web app (</> icon)
   - Copy the config object

5. Update `src/firebase/config.js` with your credentials:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
}
```

### 3. Set Database Rules

In Firebase Console → Realtime Database → Rules, paste:

```json
{
  "rules": {
    "rooms": {
      "$roomId": {
        ".read": true,
        ".write": true
      }
    }
  }
}
```

> ⚠️ These are development rules. For production, add proper security!

### 4. Run the App

```bash
npm run dev
```

Open `http://localhost:5173` on your phone/browser!

## 📱 Playing on Mobile

1. Run the dev server: `npm run dev`
2. Find your computer's IP address
3. On your phone, open: `http://YOUR_IP:5173`
4. Both players can now play! 🎉

## 🏗️ Project Structure

```
numble/
├── src/
│   ├── components/     # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── DigitDisplay.jsx
│   │   ├── Keypad.jsx
│   │   ├── GuessHistory.jsx
│   │   ├── TurnIndicator.jsx
│   │   └── ...
│   │
│   ├── screens/        # Page components
│   │   ├── Home.jsx
│   │   ├── CreateRoom.jsx
│   │   ├── JoinRoom.jsx
│   │   ├── Lobby.jsx
│   │   ├── SetSecret.jsx
│   │   ├── Game.jsx
│   │   ├── Win.jsx
│   │   └── HowToPlay.jsx
│   │
│   ├── firebase/       # Firebase config & services
│   │   ├── config.js
│   │   └── gameService.js
│   │
│   ├── utils/          # Utility functions
│   │   └── gameLogic.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── public/
│   ├── manifest.json
│   └── numble-icon.svg
│
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## 🎨 Features

- ✅ Real-time multiplayer with Firebase
- ✅ Beautiful Sunset Romance theme
- ✅ Mobile-first responsive design
- ✅ Animated UI with Framer Motion
- ✅ Haptic feedback on supported devices
- ✅ Confetti on win! 🎊
- ✅ Easy room sharing via link
- ✅ PWA-ready (installable on phones)

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Backend**: Firebase Realtime Database
- **Icons**: Lucide React

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
npm run build
# Then deploy dist/ folder to Vercel
```

Or use Vercel CLI:
```bash
npm i -g vercel
vercel
```

### Deploy to Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

## 📝 License

MIT - Feel free to use and modify!

---

Made with 💕 for fun game nights!

import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Screens
import Home from './screens/Home'
import CreateRoom from './screens/CreateRoom'
import JoinRoom from './screens/JoinRoom'
import Lobby from './screens/Lobby'
import SetSecret from './screens/SetSecret'
import Game from './screens/Game'
import Win from './screens/Win'
import HowToPlay from './screens/HowToPlay'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen min-h-[100dvh] safe-top safe-bottom">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateRoom />} />
          <Route path="/join" element={<JoinRoom />} />
          <Route path="/join/:roomCode" element={<JoinRoom />} />
          <Route path="/lobby/:roomCode" element={<Lobby />} />
          <Route path="/secret/:roomCode" element={<SetSecret />} />
          <Route path="/game/:roomCode" element={<Game />} />
          <Route path="/win/:roomCode" element={<Win />} />
          <Route path="/how-to-play" element={<HowToPlay />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App

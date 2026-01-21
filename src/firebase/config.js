import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

// Firebase configuration
// IMPORTANT: Replace these with your own Firebase project credentials
// Go to: https://console.firebase.google.com
// 1. Create new project
// 2. Go to Project Settings > General > Your apps > Web app
// 3. Copy the config and paste here

const firebaseConfig = {
    apiKey: "AIzaSyAdXCkXmC0YXkv2FcY71zuOKkHUqevd7So",
    authDomain: "numble-a2eff.firebaseapp.com",
    databaseURL: "https://numble-a2eff-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "numble-a2eff",
    storageBucket: "numble-a2eff.firebasestorage.app",
    messagingSenderId: "644340055785",
    appId: "1:644340055785:web:c9d73909cc90a3eefc3a78",
    measurementId: "G-PKSD3Z0DF7"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Realtime Database
export const database = getDatabase(app)

export default app

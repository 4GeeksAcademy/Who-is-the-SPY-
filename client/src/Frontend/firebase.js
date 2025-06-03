// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database"; // 👈 Importar Realtime Database

// Configuración con la URL corregida de Realtime Database
const firebaseConfig = {
  apiKey: "AIzaSyAvv8lfGGA2baD7nj_sJ5jp2iDNkOxIWjA",
  authDomain: "whos-the-spy-20fb8.firebaseapp.com",
  databaseURL: "https://whos-the-spy-20fb8-default-rtdb.europe-west1.firebasedatabase.app", // ✅ Cambiado
  projectId: "whos-the-spy-20fb8",
  storageBucket: "whos-the-spy-20fb8.appspot.com", // ✅ corregido también aquí (era .app)
  messagingSenderId: "992034501675",
  appId: "1:992034501675:web:c7605ed78c37670bf3e66e",
  measurementId: "G-2XKF398F2W"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Obtener servicios
const auth = getAuth(app);
const db = getFirestore(app);
const rtdb = getDatabase(app); // 👈 Este es el que usas en tu lógica de juego

// Exportar servicios
export { auth, db, rtdb };
// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Tu configuración personalizada
const firebaseConfig = {
  apiKey: "AIzaSyAvv8lfGGA2baD7nj_sJ5jp2iDNkOxIWjA",
  authDomain: "whos-the-spy-20fb8.firebaseapp.com",
  projectId: "whos-the-spy-20fb8",
  storageBucket: "whos-the-spy-20fb8.firebasestorage.app",
  messagingSenderId: "992034501675",
  appId: "1:992034501675:web:c7605ed78c37670bf3e66e",
  measurementId: "G-2XKF398F2W"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Obtener los servicios que necesitas
const auth = getAuth(app);       // Para autenticación
const db = getFirestore(app);    // Para base de datos

// Exportarlos para usarlos en otros archivos
export { auth, db };
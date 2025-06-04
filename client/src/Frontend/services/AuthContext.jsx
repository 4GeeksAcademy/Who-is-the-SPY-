import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase"; // Ajusta la ruta según dónde tengas tu firebase.js

const AuthContext = createContext();

// Proveedor de autenticación que envuelve toda la app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listener para detectar cambios en el estado de autenticación
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup del listener cuando el componente se desmonta
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {!loading ? children : <p>Cargando...</p>}
    </AuthContext.Provider>
  );
};

// Hook para usar el contexto de auth fácilmente en cualquier componente
export const useAuth = () => useContext(AuthContext);
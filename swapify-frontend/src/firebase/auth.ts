// Funciones de Autenticación

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebaseConfig";

// Proveedor de autenticación con Google
const googleProvider = new GoogleAuthProvider();

/**
 * Función para iniciar sesión con Google
 * Retorna el token de autenticación si el login es exitoso
 */
export const loginWithGoogle = async (): Promise<string | null> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Obtener el token de autenticación
    const idToken = await user.getIdToken();

    console.log("Usuario autenticado:", user);
    console.log("Token de autenticación:", idToken);

    return idToken;
  } catch (error: any) {
    if (error.code === "auth/popup-closed-by-user") {
      console.warn("El usuario cerró el popup de autenticación.");
    } else {
      console.error("Error en la autenticación con Google:", error);
    }
  }  
};

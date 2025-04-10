/* Este archivo permite: Centralizar la lógica de autenticación, proveer un estado global que es accesible desde cualquier componente,
y manejar el inicio y cierre de sesión de manera uniforme.*/
"use client"

import type React from "react"
import { createContext, useState, useEffect, useContext } from "react"
import { UserService } from "../services/userService"
import {
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  type User as FirebaseUser,
} from "firebase/auth"
import { auth, googleProvider } from "../services/firebase"

interface User {
  id: number
  name: string
  email: string
  imageUrl?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const userService = new UserService()

  // Verificar si hay un token guardado al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      const userStr = localStorage.getItem("user")
      if (userStr) {
        try {
          const userData = JSON.parse(userStr)
          setUser(userData)
        } catch (err) {
          localStorage.removeItem("user")
          console.error("Error al verificar autenticación:", err)
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  // Función para procesar la información del usuario tras autenticar con proveedores sociales
  const processUserAfterSocialAuth = async (firebaseUser: FirebaseUser, token?: string) => {
    try {
      // Verificar si el usuario ya existe en nuestro sistema o registrarlo
      const { uid, displayName, email, photoURL } = firebaseUser

      if (!email) {
        throw new Error("No se pudo obtener el email del usuario")
      }

      // Verificar si el usuario existe en nuestra base de datos
      // O registrarlo si no existe
      const response = await userService.loginWithSocialProvider({
        socialId: uid,
        name: displayName || email.split("@")[0],
        email: email,
        imageUrl: photoURL || undefined,
        token: token, // Enviamos el token al backend
      })

      if (response && response.data) {
        localStorage.setItem("user", JSON.stringify(response.data))
        setUser(response.data)
      }
    } catch (err) {
      console.error("Error al procesar el usuario social:", err)
      throw err
    }
  }

  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await userService.login(email, password)
      if (response && response.data) {
        localStorage.setItem("user", JSON.stringify(response.data))
        setUser(response.data)
      }
    } catch (err) {
      setError("Credenciales inválidas. Por favor, verifica tu email y contraseña.")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const loginWithGoogle = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await signInWithPopup(auth, googleProvider)
      // Acceder al token que enviaremos al backend
      const credential = GoogleAuthProvider.credentialFromResult(result)
      const token = credential?.accessToken
      // El usuario de Firebase
      const firebaseUser = result.user

      await processUserAfterSocialAuth(firebaseUser, token)
    } catch (err: any) {
      setError("Error al iniciar sesión con Google. Por favor intenta nuevamente.")
      console.error("Google auth error:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    // Cerrar sesión en Firebase
    signOut(auth).catch((error) => {
      console.error("Error al cerrar sesión en Firebase:", error)
    })

    // Cerrar sesión en nuestro sistema
    localStorage.removeItem("user")
    setUser(null)
  }

  // Para verificar si hay algún usuario autenticado. Para ello ejecutar window.swapifyAuth en la consola.
  useEffect(() => {
    if (typeof window !== "undefined") {
      // @ts-ignore
      window.swapifyAuth = { isAuthenticated: !!user, user }
    }
  }, [user])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        loginWithGoogle,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}

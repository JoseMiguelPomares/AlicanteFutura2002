/* Este archivo permite: Centralizar la lógica de autenticación, proveer un estado global que es accesible desde cualquier componente,
y manejar el inicio y cierre de sesión de manera uniforme.*/
"use client"

import type React from "react"
import { createContext, useState, useEffect, useContext } from "react"
import { UserService } from "../services/userService"

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

    const logout = () => {
        localStorage.removeItem("user")
        setUser(null)
    }
    // Para verificar si hay algún usuario autenticado. Para ello ejecutar window.swapifyAuth en la consola.
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // @ts-ignore
            window.swapifyAuth = { isAuthenticated: !!user, user };
        }
    }, [user]);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                error,
                login,
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


"use client"

import type React from "react"
import { createContext, useState, useEffect, useContext } from "react"
import { useAuth } from "./AuthContext"
import { ChatService } from "../services/chatService"
import { TransactionService } from "../services/transactionService"

interface ChatNotification {
  id: number
  chatId: number
  senderId: number
  senderName: string
  senderImage?: string
  message: string
  timestamp: string
  read: boolean
  unreadCount: number
}

interface NotificationContextType {
  notifications: ChatNotification[]
  unreadCount: number
  markAsRead: (notificationId: number) => void
  markAllAsRead: () => void
  refreshNotifications: () => Promise<void>
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<ChatNotification[]>([])
  const [unreadCount, setUnreadCount] = useState<number>(0)
  const { user, isAuthenticated } = useAuth()
  const chatService = new ChatService()
  const transactionService = new TransactionService()

  // Función para cargar las notificaciones
  const loadNotifications = async () => {
    if (!isAuthenticated || !user) {
      setNotifications([])
      setUnreadCount(0)
      return
    }

    try {
      // Obtener todas las transacciones del usuario
      const transactions = await transactionService.getByUserId(user.id)

      // Map para agrupar notificaciones por chatId
      const chatNotificationsMap = new Map<number, ChatNotification>()
      let totalUnreadCount = 0

      // Para cada transacción, obtener los mensajes no leídos
      for (const transaction of transactions) {
        try {
          // Determinar si el usuario es el requester o el owner
          const isRequester = transaction.requester.id === user.id
          const otherUserId = isRequester ? transaction.owner.id : transaction.requester.id

          // Obtener o crear el chat para esta transacción
          const chat = await chatService.getOrCreateChat(transaction.id, transaction.requester.id, transaction.owner.id)

          if (chat) {
            // Obtener los mensajes del chat
            const messages = await chatService.getMessages(chat.id)

            // Filtrar los mensajes no leídos enviados por el otro usuario
            const unreadMessages = messages.filter((msg: any) => msg.sender.id === otherUserId && !msg.read)
            
            // Si hay mensajes no leídos en este chat
            if (unreadMessages.length > 0) {
              // Ordenar los mensajes no leídos por fecha (más recientes primero)
              unreadMessages.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              
              // Tomar el mensaje más reciente para la notificación
              const latestMessage = unreadMessages[0]
              
              // Crear o actualizar la notificación para este chat
              chatNotificationsMap.set(chat.id, {
                id: latestMessage.id,
                chatId: chat.id,
                senderId: latestMessage.sender.id,
                senderName: latestMessage.sender.name,
                senderImage: latestMessage.sender.imageUrl,
                message: latestMessage.content,
                timestamp: latestMessage.createdAt,
                read: false,
                unreadCount: unreadMessages.length // Número de mensajes no leídos en este chat
              })
              
              // Incrementar el contador total de mensajes no leídos
              totalUnreadCount += unreadMessages.length
            }
          }
        } catch (error) {
          console.error(`Error al procesar la transacción ${transaction.id}:`, error)
        }
      }

      // Convertir el Map a un array de notificaciones
      const groupedNotifications = Array.from(chatNotificationsMap.values())
      
      // Ordenar las notificaciones por fecha (más recientes primero)
      groupedNotifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

      setNotifications(groupedNotifications)
      setUnreadCount(totalUnreadCount)
    } catch (error) {
      console.error("Error al cargar notificaciones:", error)
    }
  }

  // Cargar notificaciones al iniciar y cuando cambia el usuario
  useEffect(() => {
    loadNotifications()

    // Configurar un intervalo para actualizar las notificaciones cada minuto
    const intervalId = setInterval(loadNotifications, 60000)

    return () => clearInterval(intervalId)
  }, [user, isAuthenticated])

  // Marcar una notificación como leída
  const markAsRead = async (notificationId: number) => {
    try {
      // Aquí iría la llamada a la API para marcar el mensaje como leído
      // Por ahora, solo actualizamos el estado local
      setNotifications((prevNotifications) => {
        // Encontrar la notificación que se va a marcar como leída
        const notification = prevNotifications.find(n => n.id === notificationId)
        
        if (!notification) return prevNotifications
        
        // Decrementar el contador de mensajes no leídos para este chat
        const updatedUnreadCount = Math.max(0, notification.unreadCount - 1)
        
        // Si ya no hay mensajes no leídos en este chat, eliminar la notificación
        if (updatedUnreadCount === 0) {
          return prevNotifications.filter(n => n.id !== notificationId)
        }
        
        // De lo contrario, actualizar el contador de mensajes no leídos
        return prevNotifications.map(n =>
          n.id === notificationId ? { ...n, unreadCount: updatedUnreadCount } : n
        )
      })

      // Actualizar el contador total de no leídos
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error("Error al marcar notificación como leída:", error)
    }
  }

  // Marcar todas las notificaciones como leídas
  const markAllAsRead = async () => {
    try {
      // Aquí iría la llamada a la API para marcar todos los mensajes como leídos
      // Por ahora, simplemente limpiamos todas las notificaciones ya que representan chats
      setNotifications([])
      setUnreadCount(0)
    } catch (error) {
      console.error("Error al marcar todas las notificaciones como leídas:", error)
    }
  }

  // Función para refrescar manualmente las notificaciones
  const refreshNotifications = async () => {
    await loadNotifications()
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        refreshNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications debe ser usado dentro de un NotificationProvider")
  }
  return context
}

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
  addNotification: (notification: Omit<ChatNotification, "id" | "timestamp" | "read">) => void
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

            // Filtrar los mensajes enviados por el otro usuario
            const receivedMessages = messages.filter((msg: any) => msg.sender.id === otherUserId)

            // Obtener el estado de leído desde localStorage
            const readMessages = JSON.parse(localStorage.getItem(`readMessages_${user.id}`) || '{}');

            // Filtrar los mensajes no leídos
            const unreadMessages = receivedMessages.filter((msg: any) => !readMessages[msg.id]);

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
                read: false, // En el contexto de notificación, siempre es no leído hasta que se marca
                unreadCount: unreadMessages.length // Número de mensajes no leídos en este chat
              })

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
      setUnreadCount(groupedNotifications.length)
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

  // Marcar un chat como leído
  const markAsRead = async (chatId: number) => {
    if (!user) return // Asegurarse de que el usuario esté autenticado

    try {
      // Obtener el estado actual de localStorage
      const readMessages = JSON.parse(localStorage.getItem(`readMessages_${user.id}`) || '{}');

      // Obtener todos los mensajes de este chat
      const messages = await chatService.getMessages(chatId);

      // Marcar cada mensaje como leído en localStorage
      messages.forEach((msg: any) => {
        readMessages[msg.id] = true;
      });

      // Guardar el estado actualizado en localStorage
      localStorage.setItem(`readMessages_${user.id}`, JSON.stringify(readMessages));

      // Opcional: Llama a la API para marcar todos los mensajes de este chat como leídos para el usuario actual (para sincronización futura si se desea)
      // await chatService.markAllMessagesAsRead(chatId, user.id);

      // Después de marcar todos en el frontend, eliminar la notificación correspondiente a este chat
      setNotifications((prevNotifications) => prevNotifications.filter(n => n.chatId !== chatId));

      // Recalcular el contador total de no leídos
      loadNotifications();

    } catch (error) {
      console.error("Error al marcar chat como leído:", error)
    }
  }

  // Marcar todas las notificaciones como leídas
  const markAllAsRead = async () => {
    if (!user) return // Asegurarse de que el usuario esté autenticado

    try {
      // Obtener el estado actual de localStorage
      const readMessages = JSON.parse(localStorage.getItem(`readMessages_${user.id}`) || '{}');

      // Marcar todos los mensajes de las notificaciones actuales como leídos en localStorage
      for (const notification of notifications) {
        // Obtener todos los mensajes de este chat
        const messages = await chatService.getMessages(notification.chatId);

        // Marcar cada mensaje como leído en localStorage
        messages.forEach((msg: any) => {
          readMessages[msg.id] = true;
        });
      }

      // Guardar el estado actualizado en localStorage
      localStorage.setItem(`readMessages_${user.id}`, JSON.stringify(readMessages));

      // Opcional: Llama a la API para marcar todos los mensajes de este chat como leídos para el usuario actual (para sincronización futura si se desea)
      // for (const notification of notifications) {
      //   await chatService.markAllMessagesAsRead(notification.chatId, user.id);
      // }

      // Después de marcar todos en el frontend, limpiar el estado local
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

  // Función para añadir una nueva notificación manualmente
  const addNotification = (notification: Omit<ChatNotification, "id" | "timestamp" | "read">) => {
    const newNotification: ChatNotification = {
      ...notification,
      id: Date.now(), // Generamos un ID temporal basado en timestamp
      timestamp: new Date().toISOString(),
      read: false,
    }

    setNotifications((prevNotifications) => [newNotification, ...prevNotifications])
    setUnreadCount((prev) => prev + 1)
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        refreshNotifications,
        addNotification,
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

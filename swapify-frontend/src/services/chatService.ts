import axios from "axios"

export class ChatService {
  baseUrl = "http://localhost:8080/swapify/chat/"

  async getMessages(chatId: number) {
    try {
      const response = await axios.get(`${this.baseUrl}${chatId}/messages`)
      return response.data.map((msg: any) => ({
        ...msg,
        sender: msg.sender || { id: 0, name: 'Usuario desconocido' }
      }))
    } catch (error) {
      console.error("Error al obtener mensajes:", error)
      throw error
    }
  }

  async postMessage(chatId: number, senderId: number, content: string) {
    try {
      const response = await axios.post(`${this.baseUrl}${chatId}/messages`, {
        senderId,
        content,
      })
      return response.data
    } catch (error) {
      console.error("Error al enviar mensaje:", error)
      throw error
    }
  }

  async getOrCreateChat(transactionId: number, buyerId: number, sellerId: number) {
    try {
      const response = await axios.get(`${this.baseUrl}${transactionId}/${buyerId}/${sellerId}`)
      return response.data
    } catch (error) {
      console.error("Error al obtener o crear chat:", error)
      throw error
    }
  }

  async markMessageAsRead(messageId: number) {
    try {
      const response = await axios.put(`${this.baseUrl}messages/${messageId}/read`)
      return response.data
    } catch (error) {
      console.error("Error al marcar mensaje como leído:", error)
      throw error
    }
  }

  async markAllMessagesAsRead(chatId: number, userId: number) {
    try {
      const response = await axios.put(`${this.baseUrl}${chatId}/messages/read-all/${userId}`)
      return response.data
    } catch (error) {
      console.error("Error al marcar todos los mensajes como leídos:", error)
      throw error
    }
  }
}

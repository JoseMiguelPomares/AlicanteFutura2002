import axios from "axios"

export class ChatService {
  baseUrl = "http://localhost:8080/swapify/chats/"

  async getMessages(chatId: number) {
    try {
      const response = await axios.get(`${this.baseUrl}${chatId}`)
      return response.data
    } catch (error) {
      console.error("Error al obtener chat:", error)
      throw error
    }
  }

  async postMessage(chatId: number, senderId: number, content: string) {
    try {
      const response = await axios.post(`${this.baseUrl}${chatId}`, {
        senderId,
        content,
      })
      return response.data
    } catch (error) {
      console.error("Error al enviar mensaje:", error)
      throw error
    }
  }

  async getOrCreateChat(transactionId: number, requesterId: number, ownerId: number) {
    try {
      const response = await axios.get(`${this.baseUrl}${transactionId}/${requesterId}/${ownerId}`, )
      return response.data
    } catch (error) {
      console.error("Error al obtener o crear chat:", error)
      throw error
    }
  }
  /*
  async getChats(userId: number) {
    try {
      const response = await axios.get(`${this.baseUrl}user/${userId}`)
      return response.data
    } catch (error) {
      console.error("Error al obtener chats:", error)
      throw error
    }
  }

  async getMessages(chatId: number) {
    try {
      const response = await axios.get(`${this.baseUrl}${chatId}/messages`)
      return response.data
    } catch (error) {
      console.error("Error al obtener mensajes:", error)
      throw error
    }
  }

  async sendMessage(chatId: number, senderId: number, content: string) {
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

  async markAsRead(chatId: number) {
    try {
      await axios.put(`${this.baseUrl}${chatId}/read`)
    } catch (error) {
      console.error("Error al marcar como leído:", error)
      throw error
    }
  }

  async createChat(requesterId: number, ownerId: number, itemId: number) {
    try {
      const response = await axios.post(`${this.baseUrl}create`, {
        requesterId,
        ownerId,
        itemId,
      })
      return response.data
    } catch (error) {
      console.error("Error al crear chat:", error)
      throw error
    }
  }*/
}

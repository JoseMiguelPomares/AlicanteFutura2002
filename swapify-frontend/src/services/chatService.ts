import axios from "axios"
const BASE = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${BASE}/chat/`;

axios.defaults.headers.common['ngrok-skip-browser-warning'] = '69420'

export class ChatService {
  //baseUrl = "http://localhost:8080/swapify/chat/"

  async getMessages(chatId: number) {
    try {
      // const response = await axios.get(`${this.baseUrl}${chatId}/messages`)
      const response = await axios.get(`${API_URL}/chat${chatId}/messages`, {
        headers: { 'Ngrok-Skip-Browser-Warning': 'true' }
      })
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
      /*const response = await axios.post(`${this.baseUrl}${chatId}/messages`, {
        senderId,
        content,
      })*/
      const response = await axios.post(`${API_URL}${chatId}/messages`, {
        senderId,
        content,
        headers: { 'Ngrok-Skip-Browser-Warning': 'true' }
      })
      return response.data
    } catch (error) {
      console.error("Error al enviar mensaje:", error)
      throw error
    }
  }

  async getOrCreateChat(transactionId: number, buyerId: number, sellerId: number) {
    try {
      //const response = await axios.get(`${this.baseUrl}${transactionId}/${buyerId}/${sellerId}`)
      const response = await axios.get(`${API_URL}${transactionId}/${buyerId}/${sellerId}`, {
        headers: { 'Ngrok-Skip-Browser-Warning': 'true' }
      })
      return response.data
    } catch (error) {
      console.error("Error al obtener o crear chat:", error)
      throw error
    }
  }

  async markMessageAsRead(messageId: number) {
    try {
      //const response = await axios.put(`${this.baseUrl}messages/${messageId}/read`)
      const response = await axios.put(`${API_URL}messages/${messageId}/read`, {
        headers: { 'Ngrok-Skip-Browser-Warning': 'true' }
      })
      return response.data
    } catch (error) {
      console.error("Error al marcar mensaje como leído:", error)
      throw error
    }
  }

  async markAllMessagesAsRead(chatId: number, userId: number) {
    try {
      //const response = await axios.put(`${this.baseUrl}${chatId}/messages/read-all/${userId}`)
      const response = await axios.put(`${API_URL}${chatId}/messages/read-all/${userId}`, {
        headers: { 'Ngrok-Skip-Browser-Warning': 'true' }
      })
      return response.data
    } catch (error) {
      console.error("Error al marcar todos los mensajes como leídos:", error)
      throw error
    }
  }
}

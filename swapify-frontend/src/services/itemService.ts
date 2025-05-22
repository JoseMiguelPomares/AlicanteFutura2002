import axios from "axios"
const BASE = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${BASE}/items`;

axios.defaults.headers.common['ngrok-skip-browser-warning'] = '69420'

export class ItemService {
  //baseUrl = "http://localhost:8080/swapify/items/"
// 
  private _cachedItems: any[] | null = null

  // Método para obtener todos los items y actualizar la caché
  async getAll() {
    try {
      const response = await axios.get(API_URL + "/getAll", {
        headers: { 'Ngrok-Skip-Browser-Warning': 'true' }
      })
      console.log("📦 Productos recibidos:", response.data)
      this._cachedItems = response.data
      return response.data
    } catch (error) {
      console.error("Error al obtener todos los items:", error)
      throw error
    }
  }

  // Método para asegurar que la caché está cargada
  private async ensureCacheLoaded() {
    if (!this._cachedItems) {
      console.log("Cargando todos los items...")
      await this.getAll()
    }
    return this._cachedItems
  }

  getByUserId(userId: number) {
    return axios.get(API_URL + `/userItems/${userId}`, {
      headers: { 'Ngrok-Skip-Browser-Warning': 'true' }
    }).then((res) => res.data)
  }

  getAllDTO(itemDTO: any) {
    return axios.post(API_URL + "/getAllDTO", itemDTO, {
      headers: { 'Ngrok-Skip-Browser-Warning': 'true' }
    })
  }

  getByCategory(category: string) {
    return axios.get(API_URL + `/getByCategory/${category}`, {
      headers: { 'Ngrok-Skip-Browser-Warning': 'true' }
    })
  }

  getByCategoryAndId(category: string, userId: number) {
    return axios.get(API_URL + `/getByCategoryAndId/${category}/${userId}`,{
      headers: { 'Ngrok-Skip-Browser-Warning': 'true' }
    })
  }

  getByTitle(title: string) {
    return axios.get(API_URL + `/getByTitle/${title}`, {
      headers: { 'Ngrok-Skip-Browser-Warning': 'true' }
    })
  }

  addItem(item: any) {
    return axios.post(API_URL + "/addItem", item, {
      headers: { 'Ngrok-Skip-Browser-Warning': 'true' }
    })
  }

  // Método simplificado para obtener un item por ID
  async getItemById(itemId: number) {
    try {
      await this.ensureCacheLoaded()
      const completeItem = this._cachedItems?.find((i: any) => i.id === itemId)
      
      if (completeItem) {
        return { data: completeItem }
      }
      
      // Si no lo encontramos en la caché, intentamos obtenerlo directamente
      const response = await axios.get(API_URL + `/getItemById/${itemId}`, {
        headers: { 'Ngrok-Skip-Browser-Warning': 'true' }
      })
      return response.data
    } catch (error) {
      console.error("Error al obtener el item:", error)
      throw error
    }
  }

  // Método simplificado para obtener productos relacionados
  async getRelatedProducts(itemId: number, categoryId: number, limit = 4) {
    try {
      await this.ensureCacheLoaded()
      
      // Filtrar productos de la misma categoría, excluyendo el producto actual
      return (this._cachedItems || [])
        .filter((p: any) => p.category?.id === categoryId && p.id !== itemId)
        .slice(0, limit)
    } catch (error) {
      console.error("Error al obtener productos relacionados:", error)
      return []
    }
  }

  getItemByLowerPrice() {
    return axios.get(API_URL + `/getByLowerPrice`, {
      headers: { 'Ngrok-Skip-Browser-Warning': 'true' }
    })
  }

  getItemByHigherPrice() {
    return axios.get(API_URL + `/getByHigherPrice`, {
      headers: { 'Ngrok-Skip-Browser-Warning': 'true' }
    })
  }

  getItemByPriceRange(min: number, max: number) {
    return axios.get(API_URL + `/getByPriceRange/${min}/${max}`, {
      headers: { 'Ngrok-Skip-Browser-Warning': 'true' }
    })
  }

  deleteItem(itemId: number) {
    return axios.delete(API_URL + `/deleteItem/${itemId}`, {
      headers: { 'Ngrok-Skip-Browser-Warning': 'true' }
    })
  }

  modifyItem(itemId: number, itemData: any) {
    return axios.put(API_URL + `/modifyItem/${itemId}`, itemData, {
      headers: { 'Ngrok-Skip-Browser-Warning': 'true' }
    })
  }

  getRecentItems() {
      return axios.get(API_URL + "/getRecentlyAdded", {
        headers: { 'Ngrok-Skip-Browser-Warning': 'true' }
      })
  }

  getItemByRadius(latitude: number, longitude: number) {
    return axios.get(API_URL + `/getByLocation/${latitude}/${longitude}`, {
      headers: { 'Ngrok-Skip-Browser-Warning': 'true' }
    })
  }
}
